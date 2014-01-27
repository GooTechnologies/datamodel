#!/usr/bin/env python

import glob
import json
import os
import logging
import shutil
import version1_to_version2 as v1_to_v2

logger = logging.getLogger(__name__)

# logging configuration
log_level = logging.DEBUG

log_handler = logging.StreamHandler()
logger.setLevel(log_level)
log_handler.setLevel(log_level)
log_handler.setFormatter(logging.Formatter(logging.BASIC_FORMAT))
logger.addHandler(log_handler)

SOURCE_DIR = 'testdata/1.0'
OUTPUT_DIR = 'testdata/2.0'
PROJECT_FILE = 'project.project'


# TODO: import lots of stuff from common instead
BINARY_TYPES = ['png', 'jpg', 'jpeg', 'tga', 'dds', 'crn', 'wav', 'mp3', 'bin']

from hashlib import sha1
from array import array


def get_hash(file_handle, user_id):
	bytes = array('B', file_handle.read())
	bytes.extend(array('B', str(user_id)))
	return sha1(bytes).hexdigest()


class GooDataModel:
	"""Used for reading in a Goo scene and exporting it to desired data model version."""

	DATA_MODEL_VERSION_1 = 0
	DATA_MODEL_VERSION_2 = 1

	VERSION_1_ROOT_ENTITY_KEY = 'entityRefs'
	VERSION_1_GROUP_KEY = 'groupRefs'
	VERSION_1_LIBRARY_KEY = 'libraryRefs'
	VERSION_1_COMPONENT_TYPES = [
		'animation',
		'camera',
		'light',
		'meshData',
		'meshRenderer',
		'script',
		'stateMachine',
		'sound',
		'transform'
	]
	VERSION_1_ENGINE_SHADER_PREFIX = 'GOO_ENGINE_SHADERS'
	VERSION_1_ASSET_LIBRARY_PREFIX = 'GOO_ASSET_LIBRARY'

	def __init__(self):

		self._current_root_path = ''

		# Store ref -> dict
		# for binary refs , store ref -> abspath
		self._references = dict()

		self._missing_files = set()  # Store references to missing files

		self._reading_from_bundle = False

		self._project_dict = None

		self._asset_references = dict()

	def read_directory(self, dir_path, model_version):

		path_match = os.path.join(os.path.curdir, dir_path, '**/', PROJECT_FILE)
		logger.info('Searching for %s', path_match)
		project_dicts = list()
		for project_file_path in glob.iglob(path_match):
			# Read the project file as json
			logger.info('Found %s', project_file_path)
			with open(project_file_path, 'r') as proj_file:
				project_dicts.append(json.loads(proj_file.read()))

		raise NotImplementedError()

	def read_file(self, project_file_path, model_version):
		"""Read in a project from the file system."""

		self._update_root_path(project_file_path)

		with open(project_file_path, 'r') as project_file:
			self._project_dict = json.loads(project_file.read())

		self._find_references_in_scene(model_version)

		self._find_asset_references(self._project_dict['groupRefs'])

		logger.warn('Missing files: %s', self._missing_files)

	def _write_new_file(self, base_args, old_ref_to_new_id, output_path, pretty_print, ref, ref_dict):
		if self._is_ref_binary(ref):
			# Copy the old file to the new place.
			file_path = ref_dict
			ref_id = old_ref_to_new_id[ref]
			extension = os.path.splitext(ref)[1]
			out_file_path = os.path.join(output_path, ref_id + extension)
			shutil.copyfile(src=file_path, dst=out_file_path)
			logger.info('Wrote %s', out_file_path)
		else:
			file_name, json_dict = v1_to_v2.convert(ref, ref_dict, base_args, old_ref_to_new_id)
			self._write_json(file_name, json_dict, output_path, pretty_print)

	def _pregenerate_new_ids(self, old_ref_to_new_id, owner_id, ref):
		assert ref not in old_ref_to_new_id
		if self._is_ref_binary(ref):
			old_ref_to_new_id[ref] = self._generate_binary_id(ref, owner_id)
		else:
			old_ref_to_new_id[ref] = v1_to_v2.generate_random_string()

	def write(self, output_dir, output_data_model_version, pretty_print=False):
		"""Writes the read data into the desired"""

		output_path = os.path.abspath(output_dir)
		output_path = os.path.join(output_path, 'testfolder')
		if os.path.exists(output_path):
			shutil.rmtree(output_path)
		os.makedirs(output_path)

		if output_data_model_version is GooDataModel.DATA_MODEL_VERSION_1:
			pass
		elif output_data_model_version is GooDataModel.DATA_MODEL_VERSION_2:

			base_args = v1_to_v2.create_project_wide_base_args(self._project_dict)

			owner_id = base_args['owner']

			old_ref_to_new_id = dict()

			for ref in self._references.iterkeys():
				self._pregenerate_new_ids(old_ref_to_new_id, owner_id, ref)
			for ref in self._asset_references.iterkeys():
				self._pregenerate_new_ids(old_ref_to_new_id, owner_id, ref)

			for ref in self._missing_files:
				# TODO: Come up with a solution for missing files.
				# Adding the reference to not break when needing a version 2 of this
				# reference.
				old_ref_to_new_id[ref] = None

			# Write and convert the new files.
			for ref, ref_dict in self._references.iteritems():
				self._write_new_file(base_args, old_ref_to_new_id, output_path, pretty_print, ref, ref_dict)
			for ref, ref_dict in self._asset_references.iteritems():
				self._write_new_file(base_args, old_ref_to_new_id, output_path, pretty_print, ref, ref_dict)

			# Store all post effect objects into a list , sent to create the new posteffects object
			# which contain all of them.
			post_effect_refs = self._project_dict.get('posteffectRefs')
			if post_effect_refs:
				post_effect_list = list()
				for ref in post_effect_refs:
					post_dict = self._get_reference_dict(ref)
					post_effect_list.append(post_dict)
			else:
				post_effect_list = None

			asset_references = self._asset_references.keys()
			write_dict = v1_to_v2.convert_project_file(self._project_dict, base_args, old_ref_to_new_id, post_effect_list, asset_references)
			for ref, ref_dict in write_dict.iteritems():
				self._write_json(ref, ref_dict, output_path, pretty_print)

		else:
			raise AssertionError('Non-existing data model version number used')

	def clear(self):
		self._references.clear()
		self._missing_files.clear()
		self._asset_references.clear()

	def _write_json(self, file_name, json_dict, output_path, pretty_print):
		out_file_path = os.path.join(output_path, file_name)
		with open(out_file_path, 'w') as new_json_file:
			if pretty_print:
				new_json_file.write(json.dumps(json_dict, sort_keys=True, indent=4, separators=(',', ':')))
			else:
				new_json_file.write(json.dumps(json_dict))

		logger.debug('wrote %s', out_file_path)

	def _generate_binary_id(self, ref, owner_id):
		"""Returns a string id for the binary resource"""
		ref_path = os.path.join(self._current_root_path, ref)
		try:
			with open(ref_path, 'rb') as bin_file:
				return get_hash(bin_file, owner_id)
		except IOError:
			raise

	def _find_references_in_scene(self, model_version):

		if model_version is GooDataModel.DATA_MODEL_VERSION_1:

			assert GooDataModel.VERSION_1_ROOT_ENTITY_KEY in self._project_dict
			assert GooDataModel.VERSION_1_GROUP_KEY in self._project_dict

			entity_refs = list()

			# Find entities from the entityRefs in the project.project file
			entity_refs.extend(self._project_dict[GooDataModel.VERSION_1_ROOT_ENTITY_KEY])
			entity_refs.sort()

			# Open and write all the entities into memory
			for ref in entity_refs:
				entity_dict = self._get_reference_dict(ref)
				if entity_dict:
					self._add_reference(ref, entity_dict)

			self._find_parent_refs()

			logger.info('Found %d entities in %s:', len(entity_refs), self._project_dict['ref'])
			for r in entity_refs:
				print r
			logger.debug('Found %d dependency references:', len(self._references) - len(entity_refs))
			for r in self._references.iterkeys():
				if r not in entity_refs:
					print r

			# Add the screenshot
			screenshot = self._project_dict.get('screenshot')
			if screenshot:
				logger.debug('Found a screenshot of the project!')
				screen_path = self._get_reference_dict(screenshot)
				if screen_path:
					self._add_reference(screenshot, screen_path)

			skybox = self._project_dict.get('skybox')
			if skybox:
				logger.debug('Has skybox, adding image urls...')
				img_urls = skybox['imageUrls']
				for url in img_urls:
					img_path = self._get_reference_dict(url)
					if img_path:
						self._add_reference(url, img_path)

		elif model_version is GooDataModel.DATA_MODEL_VERSION_2:
			raise NotImplementedError()
		else:
			raise AssertionError()

	def _add_reference(self, ref, entity_dict):

		added_reference = False

		if ref in self._references:
			logger.debug('Reference already exist: %s', ref)
		else:

			self._references[ref] = entity_dict
			added_reference = True
			logger.debug('Added reference: %s', ref)
			if not self._is_ref_binary(ref):
				self._traverse_dict(entity_dict)

		return added_reference

	def _get_reference_dict(self, reference):
		"""If the reference is of a JSON type, the returned value is the dict of the object.
		If the reference is of a binary type , the full path to the file is returned.
		"""

		ref_path = os.path.join(self._current_root_path, reference)
		if not self._reading_from_bundle:
			try:
				if self._is_ref_binary(reference):
					if os.path.isfile(ref_path):
						return ref_path
					else:
						raise IOError
				else:
					with open(ref_path, 'r') as ref_file:
						return json.loads(ref_file.read())
			except IOError:
				logger.error('Found non-existing file : %s', ref_path)
				self._missing_files.add(reference)
				return None
		else:
			raise NotImplementedError()

	def _traverse_dict(self, object_dict):
		"""
		@type object_dict: dict
		"""
		for key, value in object_dict.iteritems():
			contains_refs = key.endswith('Ref') or key.endswith('Refs') or key == 'url' or key == 'urls'
			if contains_refs:
				logger.debug('Contains refs -- %s : %s', key, str(value))
				if type(value) == list:
					for ref in value:
						ref_dict = self._get_reference_dict(ref)
						if ref_dict:
							self._add_reference(ref, ref_dict)
				elif type(value) == str or type(value) == unicode:
					if value.startswith(GooDataModel.VERSION_1_ENGINE_SHADER_PREFIX):
						logger.debug('Found engine shader : %s', value)
					elif value.startswith(GooDataModel.VERSION_1_ASSET_LIBRARY_PREFIX):
						logger.debug('Found asset library item: %s', value)
					else:
						ref = str(value)
						ref_dict = self._get_reference_dict(ref)
						if ref_dict:
							self._add_reference(ref, ref_dict)
			elif type(value) == list:
				for v in value:
					if type(v) == dict:
						self._traverse_dict(v)
					else:
						logger.debug('Nothing to see here --  %s : %s', key, str(value))
						break
			elif type(value) == dict:
				logger.debug('... Going deeper into: %s = %s', key, json.dumps(value, sort_keys=True, indent=4, separators=(',', ':')))
				self._traverse_dict(value)

	def _add_child_to_entity(self, entity_ref, child_ref):

		assert entity_ref != child_ref
		assert entity_ref.endswith('.entity') and child_ref.endswith('.entity')

		entity_dict = self._references[entity_ref]

		if 'children' in entity_dict and child_ref not in entity_dict['children']:
			entity_dict['children'].append(child_ref)
		else:
			entity_dict['children'] = [child_ref]

		logger.debug('%s has children : %s', entity_ref, entity_dict['children'])

		assert 'children' in self._references[entity_ref]
		assert child_ref in self._references[entity_ref]['children']
		assert self._references[child_ref]['components']['transform']['parentRef'] == entity_ref

	def _update_root_path(self, project_file_path):
		self._current_root_path = os.path.dirname(os.path.abspath(project_file_path))
		logger.debug('Current root path set to: %s', self._current_root_path)

	def _find_parent_refs(self):
		"""Scan all collected references for entities, and add child references to parents"""

		logger.info('Scanning for parents...')
		for ref, ref_dict in self._references.iteritems():
			if ref.endswith('.entity'):
				# Find parent ref in the transform component
				if 'components' in ref_dict:
					if 'transform' in ref_dict['components']:
						if 'parentRef' in ref_dict['components']['transform']:
							parent_ref = ref_dict['components']['transform']['parentRef']
							self._add_child_to_entity(parent_ref, ref)

	def _is_ref_binary(self, reference):
		extension = os.path.splitext(reference)[1][1:]
		return extension in BINARY_TYPES

	def _find_asset_references(self, library_refs):
		"""Traverses the library refs. Recursive call when finding a .group reference.
		Adding references into the _asset_references dict.
		"""
		for ref in library_refs:
			if ref.endswith('group'):
				# Add the refs in the group object's to the lib_refs
				# in traversal at the moment.
				group_dict = self._get_reference_dict(ref)
				self._find_asset_references(group_dict['libraryRefs'])
			else:
				if ref.endswith('posteffect'):
					# Skip posteffects. These are taken care of when converting
					# the project.project.
					continue
				if ref not in self._references and ref not in self._missing_files and ref not in self._asset_references:
					asset_dict = self._get_reference_dict(ref)
					if asset_dict is not None:
						self._asset_references[ref] = asset_dict
						logger.debug('Added %s to asset refs', ref)


def migrate_projects(src_dir=None, out_dir=None):
	goo_model = GooDataModel()
	#goo_model.read_directory(SOURCE_DIR, GooDataModel.VERSION_1)
	#goo_model.read_file('testdata/1.0/8NHeIkgPQkex31c5ZLjOlA/project.project', GooDataModel.DATA_MODEL_VERSION_1)
	#goo_model.read_file('testdata/1.0/template_creating_a_goon/project.project', GooDataModel.DATA_MODEL_VERSION_1)
	goo_model.read_file('testdata/1.0/q12pYis6QtG1XNKRnHe2tA/project.project', GooDataModel.DATA_MODEL_VERSION_1)
	goo_model.write(OUTPUT_DIR, GooDataModel.DATA_MODEL_VERSION_2, pretty_print=True)

if __name__ == '__main__':
	migrate_projects()
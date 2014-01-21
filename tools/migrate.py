#!/usr/bin/env python

import glob
import json
import os
import logging
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

		self._references = dict()  # Store ref -> dict

		self._missing_files = set()  # Store references to missing files

		self._reading_from_bundle = False

		self._project_dict = None

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

		# TODO : Find asset items. Stuff which is in the libraryRefs and not in the entityRefs.

	def write(self, output_dir, output_data_model_version):
		"""Writes the read data into the desired"""

		output_path = os.path.abspath(os.path.abspath(output_dir))

		if output_data_model_version is GooDataModel.DATA_MODEL_VERSION_1:
			pass
		elif output_data_model_version is GooDataModel.DATA_MODEL_VERSION_2:

			# TODO: Create folders needed

			for ref, ref_dict in self._references.iteritems():
				v1_to_v2.convert(ref, ref_dict)

		else:
			raise AssertionError('Non-existing data model version number used')

	def clear(self):
		self._references.clear()
		self._missing_files.clear()

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

			# Add potential post effect references
			if 'posteffectRefs' in self._project_dict:
				for ref in self._project_dict['posteffectRefs']:
					ref_dict = self._get_reference_dict(ref)
					if ref_dict:
						self._add_reference(ref, ref_dict)


			logger.info('Found %d entities in %s:', len(entity_refs), self._project_dict['ref'])
			for r in entity_refs:
				print r
			logger.debug('Found %d dependency references:', len(self._references) - len(entity_refs))
			for r in self._references.iterkeys():
				if r not in entity_refs:
					print r

			logger.warn('Missing files: %s', self._missing_files)

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
			logger.debug('Added %s... traversing...', ref)
			self._traverse_dict(entity_dict)

		return added_reference

	def _get_reference_dict(self, reference):
		ref_path = os.path.join(self._current_root_path, reference)
		if not self._reading_from_bundle:
			try:
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
			contains_refs = key.endswith('Ref') or key.endswith('Refs') or key == 'url'
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

		"""
		# Maybe too specific , gonna start with just going for anything that ends with *Refs
		for component_type, obj_dict in component_dict.iteritems():
			if component_type == 'animation':
				# TODO :  poseRef and layerRef, .skeleton and .animation
				pass
			elif component_type == 'camera':
				# Do nothing with the camera component. The data exists in the entity
				pass
			elif component_type == 'light':
				# TODO : Can contain lightCookie, which contains a textureRef, which can contain an image ref
				pass
			elif component_type == 'meshData':
				# TODO: Contains meshRefs and poseRefs, .mesh and .skeleton
				pass
			elif component_type == 'meshRenderer':
				# Contains material refs, which can contain textureRefs and shaderRefs.
				# And then the textureRefs can contain imageRef to the binary.
				assert 'materialRefs' in obj_dict
				for mat_ref in obj_dict['materialRefs']:
					print mat_ref
			elif component_type == 'script':
				# TODO: Contains scriptRefs
				pass
			elif component_type == 'stateMachine':
				# TODO: Contain machineRefs, which contain more machineRefs
				pass
			elif component_type == 'sound':
				# TODO : Contain soundRefs, which contain {url: AudioRef}, references to sound binaries.
				pass
			elif component_type == 'transform':
				# TODO: Convert rotation into euler x, y, z if its not in it already
				pass
			else:
				raise AssertionError('Corrupt project? - %s is not a recognized component', component_type)
		"""

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


def migrate_projects(src_dir=None, out_dir=None):
	goo_model = GooDataModel()
	#goo_model.read_directory(SOURCE_DIR, GooDataModel.VERSION_1)
	#goo_model.read_file('testdata/1.0/8NHeIkgPQkex31c5ZLjOlA/project.project', GooDataModel.DATA_MODEL_VERSION_1)
	goo_model.read_file('testdata/1.0/template_creating_a_goon/project.project', GooDataModel.DATA_MODEL_VERSION_1)

	# VxdSOc06RB-PIBvDxL1s1A - HerrPotemkin user ID
	goo_model.write(OUTPUT_DIR, GooDataModel.DATA_MODEL_VERSION_2)

if __name__ == '__main__':
	migrate_projects()
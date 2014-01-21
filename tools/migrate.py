#!/usr/bin/env python
from __future__ import absolute_import

import glob
import json
import os
import logging
logger = logging.getLogger(__name__)

# logging configuration
log_handler = logging.StreamHandler()
logger.setLevel(logging.DEBUG)
log_handler.setLevel(logging.DEBUG)
log_handler.setFormatter(logging.Formatter(logging.BASIC_FORMAT))
logger.addHandler(log_handler)

SOURCE_DIR = 'testdata/1.0'
OUTPUT_DIR = 'testdata/2.0'
PROJECT_FILE = 'project.project'


class GooDataModel:
	"""Used for reading in a Goo scene and exporting it to desired data model version."""

	class GooTree:

		class TreeEntity:

			def __init__(self, is_root=False):
				self.children = list()
				self.parent = None
				self.is_root = is_root

			def add_child(self, c):
				raise NotImplementedError()

		def __init__(self):
			self._root = self.TreeEntity(is_root=True)

		def add_root_entities(self, root_entities):
			for ent in root_entities:
				self._root.add_child(ent)

	DATA_MODEL_VERSION_1 = 0
	DATA_MODEL_VERSION_2 = 1

	VERSION_1_ROOT_ENTITY_KEY = 'entityRefs'
	VERSION_1_GROUP_KEY = 'groupRefs'
	VERSION_1_LIBRARY_KEY = 'libraryRefs'

	def __init__(self):

		self._tree = self.GooTree()

		self._data_sets = list()
		self._current_root_path = ''

		self._entities = dict()  # Store ref -> dict

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
			project_dict = json.loads(project_file.read())

		self._find_all_entities(project_dict, model_version)

	def write_projects(self, model_version):
		if model_version is GooDataModel.DATA_MODEL_VERSION_1:
			pass
		elif model_version is GooDataModel.DATA_MODEL_VERSION_2:
			pass
		else:
			raise AssertionError('Non-existing data model version number used')

	def _find_all_entities(self, root_dict, model_version):
		"""Finds all the entities, adding them to the private class variable, _entities"""

		if model_version is GooDataModel.DATA_MODEL_VERSION_1:
			assert GooDataModel.VERSION_1_ROOT_ENTITY_KEY in root_dict
			assert GooDataModel.VERSION_1_GROUP_KEY in root_dict

			entity_refs = list()

			# Find entities from the entityRefs in the project.project file
			entity_refs.extend(root_dict[GooDataModel.VERSION_1_ROOT_ENTITY_KEY])
			logger.info('Found %d entities in %s', len(entity_refs), GooDataModel.VERSION_1_ROOT_ENTITY_KEY)

			# Open and write all the entities into memory
			for ref in entity_refs:
				entity_file_path = os.path.join(self._current_root_path, ref)
				with open(entity_file_path, 'r') as entity_file:
					entity_dict = json.loads(entity_file.read())
					if self._add_entity(ref, entity_dict):
						self._traverse_entity(ref, entity_dict)

		elif model_version is GooDataModel.DATA_MODEL_VERSION_2:
			raise NotImplementedError()
		else:
			raise AssertionError()

	def _add_entity(self, ref, entity_dict, parent_ref=None, child_ref=None):

		if ref in self._entities:
			logger.debug('Re-occurring entity reference: %s', ref)
			# assert entity_dict == self._entities[ref]
			if child_ref:
				if 'children' in self._entities[ref]:
					self._entities[ref]['children'].append(child_ref)
				else:
					self._entities[ref]['children'] = [child_ref]

				logger.debug('Added %s as a child of %s', child_ref, ref)
			return False
		else:
			self._entities[ref] = entity_dict
			logger.debug('Added %s', ref)
			return True

	def _update_root_path(self, project_file_path):
		self._current_root_path = os.path.dirname(os.path.abspath(project_file_path))
		logger.debug('Current root path set to: %s', self._current_root_path)

	def _traverse_entity(self, reference, entity_dict):
		"""Recursively find all entities through possible parents."""

		# Find parent ref in the transform component
		if 'components' in entity_dict:
			if 'transform' in entity_dict['components']:
				if 'parentRef' in entity_dict['components']['transform']:
					parent_ref = entity_dict['components']['transform']['parentRef']
					parent_path = os.path.join(self._current_root_path, parent_ref)
					logger.debug('Found parent: %s', parent_ref)
					with open(parent_path, 'r') as parent_file:
						parent_dict = json.loads(parent_file.read())
						if self._add_entity(parent_ref, parent_dict, child_ref=reference):
							self._traverse_entity(parent_ref, parent_dict)


def migrate_projects(src_dir=None, out_dir=None):
	goo_model = GooDataModel()
	#goo_model.read_directory(SOURCE_DIR, GooDataModel.VERSION_1)
	#goo_model.read_file('testdata/1.0/8NHeIkgPQkex31c5ZLjOlA/project.project', GooDataModel.DATA_MODEL_VERSION_1)
	goo_model.read_file('testdata/1.0/template_creating_a_goon/project.project', GooDataModel.DATA_MODEL_VERSION_1)

if __name__ == '__main__':
	migrate_projects()
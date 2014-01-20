#!/usr/bin/env python
from __future__ import absolute_import

import glob
import json
import os
import logging
logger = logging.getLogger(__name__)

SOURCE_DIR = 'testdata/1.0'
OUTPUT_DIR = 'testdata/2.0'
PROJECT_FILE = 'project.project'


class GooDataModel:
	"""Used for reading in a Goo scene and exporting it to desired datamodel version."""

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

		print project_dicts


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
		"""Returns a list of entity dictionaries from the root dictionary.
		- The starting point for traversing the scene tree.
		"""

		if model_version is GooDataModel.DATA_MODEL_VERSION_1:
			assert GooDataModel.VERSION_1_ROOT_ENTITY_KEY in root_dict
			entity_refs = root_dict[GooDataModel.VERSION_1_ROOT_ENTITY_KEY]
			for ref in entity_refs:
				file_path = os.path.join(self._current_root_path, ref)
				with open(file_path, 'r') as file:
					entity_dict = json.loads(file.read())
					self._add_entity(ref, entity_dict)
		else:
			raise AssertionError()

	def _add_entity(self, ref, dict):

		if ref in self._entities:
			assert dict == self._entities[ref]

		self._entities.update(ref, dict)

	def _update_root_path(self, project_file_path):
		self._current_root_path = os.path.dirname(os.path.abspath(project_file_path))
		print "new path : " + self._current_root_path

	def _traverse_entity(self, model_version):
		if model_version is GooDataModel.DATA_MODEL_VERSION_1:
			pass
		else:
			raise AssertionError()


def migrate_projects(src_dir=None, out_dir=None):
	goo_model = GooDataModel()
	#goo_model.read_directory(SOURCE_DIR, GooDataModel.VERSION_1)
	goo_model.read_file('testdata/1.0/8NHeIkgPQkex31c5ZLjOlA/project.project', GooDataModel.DATA_MODEL_VERSION_1)

if __name__ == '__main__':
	migrate_projects()
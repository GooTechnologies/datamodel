#!/usr/bin/env python
import os
import random
import string

# TODO: import from common
BINARY_TYPES = ['png', 'jpg', 'jpeg', 'tga', 'dds', 'crn', 'wav', 'mp3', 'bin']
LICENSE_TYPES = ['CC0', 'CC BY', 'CC BY-SA', 'CC BY-NC', 'CC BY-NC-SA', 'PRIVATE']

GENERATION_CHARS = string.ascii_letters + string.digits


def create_random_string(string_length=10):
	# TODO : Move function into common .
	# http://stackoverflow.com/questions/2257441/python-random-string-generation-with-upper-case-letters-and-digits
	return ''.join(random.choice(GENERATION_CHARS) for i in xrange(string_length))


def convert(ref, ref_dict):
	"""
	@type ref: str
	@type ref_dict: dict
	"""
	if ref.endswith('animation'):
		pass
	elif ref.endswith('animstate'):
		pass
	elif ref.endswith('clip'):
		pass
	elif ref.endswith('entity'):
		pass
	elif ref.endswith('group'):
		# Nothing should happen here.
		pass
	elif ref.endswith('machine'):
		pass
	elif ref.endswith('material'):
		pass
	elif ref.endswith('mesh'):
		pass
	elif ref.endswith('posteffect'):
		pass
	elif ref.endswith('project'):
		raise AssertionError('Do *.project conversion separately')
	elif ref.endswith('script'):
		pass
	elif ref.endswith('shader'):
		pass
	elif ref.endswith('skeleton'):
		pass
	elif ref.endswith('sound'):
		pass
	elif ref.endswith('texture'):
		pass
	elif os.path.splitext(ref)[1] in BINARY_TYPES:
		print ref + ' is binary ?!?'
	else:
		raise AssertionError('Non-matching reference, corruption? : %s', ref)


def create_base_goo_object_dict(name, proj_license, owner_user_id, proj_original_license=LICENSE_TYPES[0],
								public=True, editors=list(), viewers=list(), description='', thumbnail='', deleted=False,
								created_date=None, modified_date=None):
	"""
	enum LicenseType {
	'CC0',
	'CC BY',
	'CC BY-SA',
	'CC BY-NC',
	'CC BY-NC-SA',
	'PRIVATE'
}

interface GooObject {
	id: string;
	name: string;
	license: LicenseType;
	originalLicense: LicenseType;

	created: DateTime;
	modified: DateTime;

	public: boolean;
	owner: string;
	editors?: {
		[listId: string]: string;
	}

	/**
	 * Ignored if public is true
	 */
	viewers?: {
		[listId: string]: string;
	}

	description: string;
	thumbnail: ImageRef;

	deleted: boolean;

	/**
	 * @default 2
	 */
	dataModelVersion: number;
}

	"""

	if not created_date:
		# TODO: Create new date type from current time. Use for both created and modified
		pass
	elif not modified_date:
		# Copy created_date into modified
		pass

	base_dict = {
		'id': create_random_string(),
		'name': name,
		'license': proj_license,
		'dataModelVersion': 2
	}

	return base_dict


def convert_project_file(project_dict, asset_references=None, posteffect_references=None):
	"""

	@type project_dict: dict
	"""

	new_proj_dict = create_base_goo_object_dict()

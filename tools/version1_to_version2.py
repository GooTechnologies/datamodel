#!/usr/bin/env python
import os
import random
import string
import json

import dateutil.parser
from datetime import datetime, tzinfo, timedelta
import time as _time

import logging
logger = logging.getLogger(__name__)

# TODO: import from common
BINARY_TYPES = ['png', 'jpg', 'jpeg', 'tga', 'dds', 'crn', 'wav', 'mp3', 'bin']
LICENSE_TYPES = ['CC0', 'CC BY', 'CC BY-SA', 'CC BY-NC', 'CC BY-NC-SA', 'PRIVATE']

GENERATION_CHARS = string.ascii_letters + string.digits


def generate_random_string(string_length=10):
	# TODO : Move function into common .
	# http://stackoverflow.com/questions/2257441/python-random-string-generation-with-upper-case-letters-and-digits
	return ''.join(random.choice(GENERATION_CHARS) for i in xrange(string_length))



STDOFFSET = timedelta(seconds=-_time.timezone)
if _time.daylight:
	DSTOFFSET = timedelta(seconds=-_time.altzone)
else:
	DSTOFFSET = STDOFFSET

ZERO = timedelta(0)

DSTDIFF = DSTOFFSET - STDOFFSET
# TODO : Move into common .


class LocalTimezone(tzinfo):
	"""http://docs.python.org/2/library/datetime.html#datetime.tzinfo"""

	def utcoffset(self, dt):
		if self._isdst(dt):
			return DSTOFFSET
		else:
			return STDOFFSET

	def dst(self, dt):
		if self._isdst(dt):
			return DSTDIFF
		else:
			return ZERO

	def tzname(self, dt):
		return _time.tzname[self._isdst(dt)]

	def _isdst(self, dt):
		tt = (dt.year, dt.month, dt.day,
			  dt.hour, dt.minute, dt.second,
			  dt.weekday(), 0, 0)
		stamp = _time.mktime(tt)
		tt = _time.localtime(stamp)
		return tt.tm_isdst > 0


def create_date_time_string():
	"""Returns a string of the current date,
	formatted according to RFC3339, e.g. 2014-01-11T13:29:12+00:00"""
	# TODO: Use this or the one already existing in the common/util/misc.py ?
	d = datetime.now(LocalTimezone())
	d = d.replace(microsecond=0)  # Don't use microseconds
	return d.isoformat()


def convert(ref, ref_dict, base_args, old_ref_to_new_id):
	"""
	@type ref: str
	@type ref_dict: dict
	@type base_args: dict
	@type old_ref_to_new_id: dict
	"""

	# Create a base goo object
	ref_id = old_ref_to_new_id[ref]
	v2_dict = new_goo_object(base_args, ref_id, name=ref_dict.get('name'))

	# Write object specific data into the new goo object dict.
	if ref.endswith('animation'):

		layers = ref_dict['layers']
		layer_dict = dict()
		for index, anim_layer in enumerate(layers):

			ref_modded_states = dict(anim_layer['states'])
			for anim_state in ref_modded_states.itervalues():
				anim_state['stateRef'] = get_new_ref(anim_state['stateRef'], old_ref_to_new_id)

			print ref_modded_states

			layer_id = generate_random_string()
			layer_dict.update({
				layer_id: {
					'sortValue': index,
					'blendWeight': anim_layer['blendWeight'],
					'defaultState': anim_layer['defaultState'],
					'states': ref_modded_states,
					'transitions': anim_layer['transitions']
				}
			})

		v2_dict.update({
			'layers': layer_dict
		})

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

	return v2_dict


def get_new_ref(old_ref, old_to_id_dict):
	"""
	@type old_ref: str
	@type old_to_id_dict: dict
	"""

	object_id = old_to_id_dict[old_ref]
	ref_type = os.path.splitext(old_ref)[1]
	return object_id + ref_type


def new_goo_object(base_args, object_id, name=None):

	# Copy and modify the base args into a new dict, used to return the created goo object.
	args = dict(base_args)

	args.update({'id': object_id})
	if not name:
		name = object_id
	args.update({'name': name})

	return create_base_goo_object_dict(**args)


def create_base_goo_object_dict(id, name, owners, project_license, project_original_license=None,
								is_public=True, editors=list(), viewers=list(), description=None, thumbnail_ref=None, is_deleted=False,
								created_date=None, modified_date=None):
	"""
	@type id: str
	@type name: str
	@type owners: list
	@type project_license: str
	@type project_original_license: str
	@type is_public: bool
	@type editors: list
	@type viewers: list
	@type description: str
	@type thumbnail_ref: str
	@type is_deleted: bool
	@type created_date: str
	@type modified_date: str
	"""

	if not project_original_license:
		project_original_license = project_license
	assert project_license in LICENSE_TYPES and project_original_license in LICENSE_TYPES

	if not created_date:
		created_date = create_date_time_string()
		modified_date = created_date
	elif not modified_date:
		modified_date = created_date

	c_date = dateutil.parser.parse(created_date)
	m_date = dateutil.parser.parse(modified_date)
	assert c_date >= m_date

	num_of_owners = len(owners)
	assert num_of_owners > 0

	if num_of_owners > 1:
		logger.warn('Multiple owners, setting the owner to the first in the list. : %s', owners)

	# Required attributes
	base_dict = {
		'id': id,
		'name': name,
		'license': project_license,
		'originalLicense': project_original_license,
		'created': created_date,
		'modified': modified_date,
		'public': is_public,
		'owner': owners[0],
		'deleted': is_deleted,
		'dataModelVersion': 2
	}

	# Optional attributes
	if len(editors) > 0:
		editor_dict = dict()
		for user_id in editors:
			if user_id not in editor_dict:
				editor_dict[generate_random_string()] = user_id

		# Add the other owners from the owner list to be editors , if there were more than one.
		if num_of_owners > 1:
			for user_id in owners[1:]:
				if user_id not in editor_dict:
					editor_dict[generate_random_string()] = user_id

		base_dict['editors'] = editor_dict

	if len(viewers) > 0:
		viewer_dict = dict()
		for user_id in viewers:
			if user_id not in viewer_dict:
				viewer_dict[generate_random_string()] = user_id
		base_dict['viewers'] = viewer_dict

	if thumbnail_ref:
		# TODO: Assert that this ref exists
		base_dict['thumbnailRef'] = thumbnail_ref

	if description:
		base_dict['description'] = description

	return base_dict


def create_project_wide_base_args(project_dict):
	"""Creates a dict serving as a set of base keyword-arguments for creating the gooobject, the superclass for all objects.


	"""

	base_args = {
		'owners': project_dict['own'],
		'is_public': project_dict['public'],
		'is_deleted': project_dict['deleted'],
		'project_license': project_dict['licenseType']
	}

	editors = project_dict.get('edit')
	if editors:
		base_args.update({'editors': editors})

	viewers = project_dict.get('view')
	if viewers:
		base_args.update({'viewers': viewers})

	original_license = project_dict.get('originalLicenseType')
	if original_license:
		base_args.update({'project_original_license': original_license})

	return base_args


def convert_project_file(project_dict, project_base_args, entity_references, asset_references=list(), posteffect_references=list()):
	"""

	@type project_dict: dict
	@type entity_references: list
	"""

	# Required attributes
	base_args = {
		'id': generate_random_string(),
		'name': project_dict['name'],
		'owners': project_dict['own'],
		'is_public': project_dict['public'],
		'is_deleted': project_dict['deleted'],
		'project_license': project_dict['licenseType'],
		'created_date': project_dict['created'],
		'modified_date': project_dict['modified']
	}

	# Optional attributes
	editors = project_dict.get('edit')
	if editors:
		base_args.update({'editors': editors})

	viewers = project_dict.get('view')
	if viewers:
		base_args.update({'viewers': viewers})

	original_license = project_dict.get('originalLicenseType')
	if original_license:
		base_args.update({'project_original_license': original_license})

	description = project_dict.get('description')
	if description:
		base_args.update({'description': description})

	v2_project_dict = create_base_goo_object_dict(**base_args)

	# Add the non-base attributes
	scene_dict = create_scene_object(project_dict, project_base_args, posteffect_references=posteffect_references)

	scene_reference = scene_dict['id'] + '.scene'
	v2_project_dict.update({'mainScene': scene_reference})

	asset_dict = dict()
	for index, ref in enumerate(asset_references):
		asset_dict[generate_random_string()] = {
			'sortValue': index,
			'assetRef': ref
		}

	v2_project_dict.update({
		'scenes': {
			generate_random_string(): {
				'sortValue': 1,
				'sceneRef': scene_reference
			}
		},
		'assets': asset_dict
	})

	published_url = project_dict.get('publishedURL')
	if published_url:
		v2_project_dict.update({'publishedURL': published_url})

	#print json.dumps(v2_project_dict, sort_keys=True, indent=4, separators=(',', ':'))

	return v2_project_dict, scene_dict


def create_scene_object(project_dict, base_args, posteffect_references=list()):

	scene_dict = new_goo_object(base_args,
								object_id=generate_random_string(),
								name=project_dict.get('name') + ' default scene')

	return scene_dict

if __name__ == '__main__':
	pass

#!/usr/bin/env python
import os
import random
import string

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


def create_base_goo_object_dict(name, owner_list, proj_license, proj_original_license=LICENSE_TYPES[0],
								public_project=True, editors=list(), viewers=list(), description='', thumbnail_ref=None, deleted=False,
								created_date=None, modified_date=None):
	"""

	@type name: str
	@type owner_list: list
	@type proj_license: str
	@type proj_original_license: str
	@type public_project: bool
	@type editors: list
	@type viewers: list
	@type description: str
	@type thumbnail_ref: str
	@type deleted: bool
	@type created_date: str
	@type modified_date: str
	"""

	assert proj_license in LICENSE_TYPES and proj_original_license in LICENSE_TYPES

	if not created_date:
		created_date = create_date_time_string()
		modified_date = created_date
	elif not modified_date:
		modified_date = created_date

	c_date = dateutil.parser.parse(created_date)
	m_date = dateutil.parser.parse(modified_date)
	assert c_date > m_date

	num_of_owners = len(owner_list)
	if num_of_owners > 1:
		logger.warn('Multiple owners, setting the owner to the first in the list. : %s', owner_list)

	# Required attributes
	base_dict = {
		'id': generate_random_string(),
		'name': name,
		'license': proj_license,
		'originalLicense': proj_original_license,
		'created': created_date,
		'modified': modified_date,
		'public': public_project,
		'owner': owner_list[0],
		'deleted': deleted,
		'description': description,
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
			for user_id in owner_list[1:]:
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

	return base_dict


def convert_project_file(project_dict, asset_references=None, posteffect_references=None):
	"""

	@type project_dict: dict
	"""

	new_proj_dict = create_base_goo_object_dict()

	return new_proj_dict

if __name__ == '__main__':
	pass

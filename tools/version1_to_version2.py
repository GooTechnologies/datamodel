#!/usr/bin/env python
import os
import random
import string
import json
import math

import dateutil.parser
from datetime import datetime, tzinfo, timedelta
import time as _time

from fbx import FbxAMatrix, FbxVector4, FbxQuaternion

import logging
logger = logging.getLogger(__name__)
log_level = logging.DEBUG
log_handler = logging.StreamHandler()
logger.setLevel(log_level)
log_handler.setLevel(log_level)
log_handler.setFormatter(logging.Formatter(logging.BASIC_FORMAT))
logger.addHandler(log_handler)

# TODO: import lots of stuff from common instead
LICENSE_TYPES = ['CC0', 'CC BY', 'CC BY-SA', 'CC BY-NC', 'CC BY-NC-SA', 'PRIVATE']

VERSION_1_ENGINE_SHADER_PREFIX = 'GOO_ENGINE_SHADERS'
VERSION_1_ASSET_LIBRARY_PREFIX = 'GOO_ASSET_LIBRARY'

GENERATION_CHARS = string.ascii_letters + string.digits

_accepted_sound_formats = [
	'.ogg',
	'.mp3',
	'.webm',
	'.wave',
	'.wav'
]

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


def pretty_string_dict(dictionary):
	return json.dumps(dictionary, sort_keys=True, indent=4, separators=(',', ':'))


def convert_animation(old_ref_to_new_id, ref, ref_dict):

	def state_ref_fix(old_ref_to_new_id, root_ref, state_key):
		old_ref = root_ref + '/' + state_key + '.animstate'
		new_key = old_ref_to_new_id[old_ref]
		return new_key

	def transition_ref_fix(old_transition_dict, old_ref_to_new_id, root_ref):
		fixed_transitions = dict()
		for state_key, anim_transition in old_transition_dict.iteritems():
			if state_key != '*':  # Special case for transitions, star is catch all.
				# State keys are names of the states,
				# so the ref is root_ref + state_key + .animstate
				new_key = state_ref_fix(old_ref_to_new_id, root_ref, state_key)
				fixed_transitions[new_key] = anim_transition
			elif state_key == '*':
				fixed_transitions[state_key] = anim_transition
			else:
				raise AssertionError('Unexpected state key:  "%s"' % state_key)

			# Convert possible strings to be a number.
			anim_transition['fadeTime'] = float(anim_transition['fadeTime'])
		return fixed_transitions

	root_ref = os.path.dirname(ref)
	layers = ref_dict['layers']
	layer_dict = dict()
	for index, anim_layer in enumerate(layers):

		# LAYER STATES
		ref_modded_states = dict()
		for old_key, anim_state in anim_layer['states'].iteritems():
			old_ref = anim_state['stateRef']
			new_key = old_ref_to_new_id[old_ref]
			new_state = dict(anim_state)
			# Overwrite the ref with the new id
			new_state['stateRef'] = get_new_ref(old_ref, old_ref_to_new_id)

			# OPTIONAL STATE TRANSITIONS
			transition_dict = new_state.get('transitions')
			if transition_dict:
				new_transitions = transition_ref_fix(transition_dict, old_ref_to_new_id, root_ref)
				new_state['transitions'] = new_transitions

			ref_modded_states.update({new_key: new_state})

		# LAYER TRANSITIONS
		layer_transition_dict = anim_layer['transitions']
		ref_modded_layer_transitions = transition_ref_fix(layer_transition_dict, old_ref_to_new_id, root_ref)# TODO : DRY UP STATE KEY STUUFF

		default_state_id = state_ref_fix(old_ref_to_new_id, root_ref, anim_layer['defaultState'])

		layer_id = generate_random_string()
		layer_dict.update({
			layer_id: {
				'sortValue': index,
				'blendWeight': anim_layer['blendWeight'],
				'defaultState': default_state_id,
				'states': ref_modded_states,
				'transitions': ref_modded_layer_transitions
			}
		})

	return {'layers': layer_dict}


def convert_animstate(old_ref_to_new_id, ref_dict):

	def handle_clip_source(clip_dict):
		"""Recurisive clip source conversion."""
		new_clip_ref = get_new_ref(clip_dict['clipRef'], old_ref_to_new_id)
		clip_dict['clipRef'] = new_clip_ref

		clip_source = clip_dict.get('clipSource')
		if clip_source:
			handle_clip_source(clip_source)

		clip_source_a = clip_dict.get('clipSourceA')
		if clip_source_a:
			handle_clip_source(clip_source_a)

			# Has to have clipsourceB if there is A.
			clip_source_b = clip_dict['clipSourceB']
			if clip_source_b:
				handle_clip_source(clip_source_b)

	clip_dict = ref_dict['clipSource']
	handle_clip_source(clip_dict)

	return {'clipSource': clip_dict}


def convert_clip(old_ref_to_new_id, ref_dict):

	new_binary_ref = get_new_ref(ref_dict['binaryRef'], old_ref_to_new_id)

	channel_dict = dict()
	for clip_channel in ref_dict['channels']:
		channel_id = generate_random_string()

		clip_channel['name'] = clip_channel['jointName']
		del clip_channel['jointName']

		keys = clip_channel.get('keys')
		if keys:
			clip_channel['triggerSamples'] = keys
			del clip_channel['keys']

		channel_dict[channel_id] = clip_channel

	clip_dict = {
		'binaryRef': new_binary_ref,
		'channels': channel_dict
	}

	return clip_dict


def convert_entity(old_ref_to_new_id, ref_dict):

	DEFAULT_CAMERA_ASPECT = 1
	DEFAULT_PROJECTION_MODE = 0

	DEFAULT_TRANSLATION = [0,0,0]
	DEFAULT_SCALE = [1,1,1]
	DEFAULT_ROTATION = DEFAULT_TRANSLATION

	def ref_list_to_dict(ref_list, old_ref_to_new_id, add_sort_value=False):
		"""
		Returns a dict with keys as the new id to the references.

		@type ref_list: list
		@type old_ref_to_new_id: dict
		"""
		ref_dict = dict()
		for index, ref in enumerate(ref_list):
			ref_id = old_ref_to_new_id[ref]
			ref_dict[ref_id] = get_new_ref(ref, old_ref_to_new_id)
			if add_sort_value:
				ref_dict['sortValue'] = index
		return ref_dict

	def convert_rot_matrix_to_angles(matrix_list):
		"""Copy paste from GooJS Matrix3x3.prototype.toAngles, transcribed into python."""

		assert(len(matrix_list) == 9)

		euler_angles = [0] * 3
		epsilon = 0.0000001

		if matrix_list[3] > (1 - epsilon):  # singularity at north pole
			euler_angles[1] = math.atan2(matrix_list[2], matrix_list[8])
			euler_angles[2] = math.pi / 2
			euler_angles[0] = 0

		elif matrix_list[3] < (-1 + epsilon):  # singularity at south pole
			euler_angles[1] = math.atan2(matrix_list[2], matrix_list[8])
			euler_angles[2] = -math.pi / 2
			euler_angles[0] = 0

		else:
			euler_angles[1] = math.atan2(-matrix_list[2], matrix_list[0])
			euler_angles[0] = math.atan2(-matrix_list[7], matrix_list[4])
			euler_angles[2] = math.asin(matrix_list[1])

		return euler_angles

	entity_dict = dict()
	is_hidden = ref_dict.get('hidden')
	if is_hidden:
		entity_dict['hidden'] = is_hidden

	# Go through the possible components of the entity and
	# handle their conversions.
	components = ref_dict['components']
	for comp_type, comp_dict in components.iteritems():
		if comp_type == 'animation':
			comp_dict['layersRef'] = get_new_ref(comp_dict['layersRef'], old_ref_to_new_id)
			comp_dict['poseRef'] = get_new_ref(comp_dict['poseRef'], old_ref_to_new_id)

		elif comp_type == 'camera':
			aspect = comp_dict.get('aspect')
			if aspect is None:
				comp_dict['aspect'] = DEFAULT_CAMERA_ASPECT

			# New stuff
			comp_dict['lockedRatio'] = False
			comp_dict['projectionMode'] = DEFAULT_PROJECTION_MODE

		elif comp_type == 'light':
			comp_dict.pop('attenuate', None)
			# TODO : Check if these attributes really should be removed..
			comp_dict.pop('direction', None)
			comp_dict.pop('exponent', None)

			light_cookie = comp_dict.get('lightCookie')
			if light_cookie:
				light_cookie['textureRef'] = get_new_ref(light_cookie['textureRef'], old_ref_to_new_id)

			shadow_settings = comp_dict.get('shadowSettings')
			if shadow_settings:
				del shadow_settings['fov']
				del shadow_settings['type']
				del shadow_settings['projection']
				del shadow_settings['upVector']

		elif comp_type == 'meshData':
			mesh_ref = comp_dict.get('meshRef')
			if mesh_ref:
				comp_dict['meshRef'] = get_new_ref(mesh_ref, old_ref_to_new_id)

			pose_ref = comp_dict.get('poseRef')
			if pose_ref:
				comp_dict['poseRef'] = get_new_ref(pose_ref, old_ref_to_new_id)

		elif comp_type == 'meshRenderer':
			ref_list = comp_dict.get('materialRefs')
			if ref_list:
				ref_dict = ref_list_to_dict(ref_list, old_ref_to_new_id, add_sort_value=True)
				comp_dict['materials'] = ref_dict
				comp_dict.pop('materialRefs', None)

			comp_dict.pop('hidden', None)

		elif comp_type == 'script':
			ref_list = comp_dict['scriptRefs']
			ref_dict = ref_list_to_dict(ref_list, old_ref_to_new_id)
			comp_dict['scriptRefs'] = ref_dict

		elif comp_type == 'stateMachine':
			ref_list = comp_dict['machineRefs']
			ref_dict = ref_list_to_dict(ref_list, old_ref_to_new_id)
			comp_dict['machineRefs'] = ref_dict

		elif comp_type == 'sound':
			ref_list = comp_dict['soundRefs']
			ref_dict = ref_list_to_dict(ref_list, old_ref_to_new_id)
			comp_dict['soundRefs'] = ref_dict

		elif comp_type == 'transform':
			parent_ref = comp_dict.get('parentRef')
			if parent_ref:
				del comp_dict['parentRef']

			rotation = comp_dict['rotation']
			if len(rotation) > 3:
				comp_dict['rotation'] = convert_rot_matrix_to_angles(rotation)

			# Adding the key children on entities earlier during the first traversal
			# It is a list of v1-references to child entities.
			children = ref_dict.get('children')
			if children:
				child_dict = ref_list_to_dict(children, old_ref_to_new_id)
				comp_dict['childRefs'] = child_dict

			if not 'rotation' in comp_dict:
				comp_dict['rotation'] = DEFAULT_ROTATION
			if not 'scale' in comp_dict:
				comp_dict['scale'] = DEFAULT_SCALE
			if not 'translation' in comp_dict:
				comp_dict['translation'] = DEFAULT_TRANSLATION
		else:
			raise AssertionError('Non-standard component found: %s!' % comp_type)

	entity_dict['components'] = components
	return entity_dict


def convert_machine(old_ref_to_new_id, ref_dict):

	def list_to_sort_value_id_dict(dict_list):
		out_dict = dict()
		for i, obj in enumerate(dict_list):
			obj['sortValue'] = i
			out_dict[obj['id']] = obj
		return out_dict

	state_dict = dict()
	for index, state in enumerate(ref_dict['states']):
		state['sortValue'] = index

		actions_dict = list_to_sort_value_id_dict(state['actions'])
		state['actions'] = actions_dict

		transitions_dict = list_to_sort_value_id_dict(state['transitions'])
		state['transitions'] = transitions_dict

		child_dict = dict()
		for i, machine_ref in state['machineRefs']:
			machine_id = old_ref_to_new_id[machine_ref]
			new_machine_ref = get_new_ref(machine_ref, old_ref_to_new_id)
			child_dict[machine_id] = new_machine_ref
			child_dict['sortValue'] = i
		state['childMachines'] = child_dict
		del state['machineRefs']

		state_dict[state['id']] = state

	machine_dict = {
		'initialState': ref_dict['initialState'],
		'states': state_dict
	}

	return machine_dict


def convert_skeleton(ref_dict):

	def convert_tqs_to_matrix(translation, rotation, scale):

		t = FbxVector4(translation[0], translation[1], translation[2])
		q = FbxQuaternion(rotation[0], rotation[1], rotation[2], rotation[3])
		s = FbxVector4(scale[0], scale[1], scale[2])

		matrix = FbxAMatrix()
		matrix.SetIdentity()
		matrix.SetTQS(t, q, s)

		mat_list = [0] * 16
		for col_index in xrange(4):
			col_vec = matrix.GetColumn(col_index)
			start_index = col_index * 4
			end_index = start_index + 5
			mat_list[start_index:end_index] = [col_vec[0], col_vec[1], col_vec[2], col_vec[3]]

		return mat_list

	skeleton_dict = ref_dict
	skeleton_dict.pop('ref', None)
	skeleton_dict.pop('name', None)

	joint_dict = dict()
	for joint in skeleton_dict['joints']:
		joint_id = generate_random_string()

		inv_bind_pose = joint['inverseBindPose']
		matrix = inv_bind_pose.get('matrix')
		if matrix is None:
			translation = inv_bind_pose['translation']
			rotation = inv_bind_pose['rotation']
			scale = inv_bind_pose['scale']
			matrix = convert_tqs_to_matrix(translation, rotation, scale)

		joint['inverseBindPose'] = matrix
		joint_dict[joint_id] = joint

	skeleton_dict['joints'] = joint_dict

	return skeleton_dict


def convert(ref, ref_dict, base_args, old_ref_to_new_id):
	"""Returns a ref and dict to be written.

	@type ref: str
	@type ref_dict: dict
	@type base_args: dict
	@type old_ref_to_new_id: dict
	"""

	# Create a base goo object
	ref_id = old_ref_to_new_id[ref]
	v2_dict = new_goo_object(base_args, ref_id, name=ref_dict.get('name'))
	spec_data_dict = dict()
	# Write object specific data into the new goo object dict.
	if ref.endswith('animation'):
		spec_data_dict = convert_animation(old_ref_to_new_id, ref, ref_dict)
	elif ref.endswith('animstate'):
		spec_data_dict = convert_animstate(old_ref_to_new_id, ref_dict)
	elif ref.endswith('clip'):
		spec_data_dict = convert_clip(old_ref_to_new_id, ref_dict)
	elif ref.endswith('entity'):
		spec_data_dict = convert_entity(old_ref_to_new_id, ref_dict)
	elif ref.endswith('group'):
		# Nothing should happen here. The libraryRefs in the groups should be added at some point
		# to the projects assets
		return None
	elif ref.endswith('machine'):
		spec_data_dict = convert_machine(old_ref_to_new_id, ref_dict)
	elif ref.endswith('material'):
		spec_data_dict = ref_dict
		spec_data_dict.pop('ref', None)
		spec_data_dict.pop('name', None)
		spec_data_dict.pop('type', None)
		DEFAULT_DUAL_TRANSPARENCY = False
		spec_data_dict['dualTransparency'] = DEFAULT_DUAL_TRANSPARENCY
	elif ref.endswith('mesh'):
		spec_data_dict = ref_dict
		spec_data_dict.pop('ref', None)
		spec_data_dict.pop('name', None)
		spec_data_dict['binaryRef'] = get_new_ref(spec_data_dict['binaryRef'], old_ref_to_new_id)

		attr_dict = dict()
		colors = spec_data_dict.pop('colors', None)
		if colors:
			attr_dict['COLOR'] = colors
		indices = spec_data_dict.pop('indices', None)
		if indices:
			attr_dict['INDEX'] = indices
		normals = spec_data_dict.pop('normals', None)
		if normals:
			attr_dict['NORMAL'] = normals
		tangents = spec_data_dict.pop('tangents', None)
		if tangents:
			attr_dict['TANGENT'] = tangents
		texcoords_list = spec_data_dict.pop('textureCoords', None)
		if texcoords_list:
			for texture_unit, texcoords in enumerate(texcoords_list):
				attr_dict['TEXCOORD' + str(texture_unit)] = texcoords
		positions = spec_data_dict.pop('vertices', None)
		if positions:
			attr_dict['POSITION'] = positions
		joints = spec_data_dict.pop('joints', None)
		if joints:
			attr_dict['JOINTIDS'] = joints
		weights = spec_data_dict.pop('weights', None)
		if weights:
			attr_dict['WEIGHTS'] = weights

		spec_data_dict['attributes'] = attr_dict

	elif ref.endswith('posteffect'):
		# Do posteffect conversion when converting the project file.
		# posteffects go into the scene object now.
		raise AssertionError('Should not send any of these here')
	elif ref.endswith('project'):
		raise AssertionError('Do *.project conversion separately')
	elif ref.endswith('script'):
		spec_data_dict = ref_dict
		spec_data_dict.pop('ref', None)
		spec_data_dict.pop('name', None)
	elif ref.endswith('shader'):
		spec_data_dict = ref_dict
		# Adding empty dict for defines to please the datamodel specification.
		spec_data_dict['defines'] = dict()
	elif ref.endswith('skeleton'):
		spec_data_dict = convert_skeleton(ref_dict)
	elif ref.endswith('sound'):
		spec_data_dict = ref_dict
		spec_data_dict.pop('ref', None)
		spec_data_dict.pop('name', None)

		audio_ref_dict = dict()
		for ref in spec_data_dict['urls']:
			extension = os.path.splitext(ref)[1].lower()
			assert extension[1:] in _accepted_sound_formats
			new_ref = get_new_ref(ref, old_ref_to_new_id)
			audio_ref_dict[extension] = new_ref

		spec_data_dict['audioRefs'] = audio_ref_dict
		del spec_data_dict['urls']

	elif ref.endswith('texture'):
		spec_data_dict = ref_dict

		spec_data_dict['wrapS'] = spec_data_dict['wrapU']
		spec_data_dict['wrapT'] = spec_data_dict['wrapV']

		file_name = spec_data_dict.get('fileName')
		if file_name is not None:
			spec_data_dict['matchFileName'] = file_name

		new_ref = get_new_ref(spec_data_dict['url'], old_ref_to_new_id)
		spec_data_dict['imageRef'] = new_ref

		# Removal of unwanted attributes.
		spec_data_dict.pop('ref', None)
		spec_data_dict.pop('name', None)
		spec_data_dict.pop('wrapU', None)
		spec_data_dict.pop('wrapV', None)
		spec_data_dict.pop('url', None)
		spec_data_dict.pop('realUrl', None)
		spec_data_dict.pop('fileName', None)
	else:
		raise AssertionError('Non-matching reference, corruption? : %s', ref)

	v2_dict.update(spec_data_dict)
	extension = os.path.splitext(ref)[1]
	return v2_dict['id'] + extension, v2_dict


def get_new_ref(old_ref, old_to_id_dict):
	"""
	@type old_ref: str
	@type old_to_id_dict: dict
	"""

	if old_ref.startswith(VERSION_1_ASSET_LIBRARY_PREFIX):
		# TODO : RETURN REF FROM THE CONVERTED ASSET LIBRARY
		logger.error('Asset library references not fixed yet: %s -> ?', old_ref)
		return old_ref
	elif old_ref.startswith(VERSION_1_ENGINE_SHADER_PREFIX):
		logger.debug('Engine shader reference, no modifications')
		return old_ref

	object_id = old_to_id_dict[old_ref]
	if object_id:
		ref_type = os.path.splitext(old_ref)[1]
		assert len(ref_type) > 0
		return object_id + ref_type
	else:
		return None


def new_goo_object(base_args, object_id, name=None):

	# Copy and modify the base args into a new dict, used to return the created goo object.
	args = dict(base_args)

	args.update({'id': object_id})
	# Defaulting name to be the id if there is no set name.
	if not name:
		name = object_id
	args.update({'name': name})

	return create_base_goo_object_dict(**args)


def create_base_goo_object_dict(id, name, owner, project_license, extra_owners=list(), project_original_license=None,
								is_public=True, editors=list(), viewers=list(), description=None, thumbnail_ref=None, is_deleted=False,
								created_date=None, modified_date=None):
	"""
	@type id: str
	@type name: str
	@type owner: str
	@type extra_owners: list
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

	# Required attributes
	base_dict = {
		'id': id,
		'name': name,
		'license': project_license,
		'originalLicense': project_original_license,
		'created': created_date,
		'modified': modified_date,
		'public': is_public,
		'owner': owner,
		'deleted': is_deleted,
		'dataModelVersion': 2
	}

	# Optional attributes

	# TODO: VALIDATE USER IDS EXISTANCE IN RIAK

	editors_set = set(editors)
	editor_dict = dict()
	for user_id in editors_set:
		if user_id not in editor_dict:
			editor_dict[user_id] = user_id

	# Add the other owners from the owner list to be editors , if there were more than one.
	for user_id in extra_owners:
		if user_id not in editor_dict:
			editor_dict[user_id] = user_id

	base_dict['editors'] = editor_dict

	viewers_set = set(viewers)
	viewer_dict = dict()
	for user_id in viewers_set:
		if user_id not in viewer_dict:
			viewer_dict[user_id] = user_id
	base_dict['viewers'] = viewer_dict

	if thumbnail_ref:
		base_dict['thumbnailRef'] = thumbnail_ref

	if description:
		base_dict['description'] = description

	return base_dict


def create_project_wide_base_args(project_dict):
	"""Creates a dict serving as a set of base keyword-arguments for creating the gooobject,
	the superclass for all objects.
	"""

	owner_list = project_dict['own']
	owner_set = set(owner_list)
	if len(owner_set) > 1:
		# If there are more owners, something is probably wrong, and
		# there is now a problem of deciding which user who actually is the
		# real owner. Will for now crash the migration.
		raise NotImplementedError()

	owner = owner_set.pop()
	extra_owners = list()
	for user_id in owner_set:
		extra_owners.append(user_id)

	base_args = {
		'owner': owner,
		'extra_owners': extra_owners,
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


def convert_project_file(project_dict, base_args, old_to_new_id, posteffect_list):
	"""
	Returns a dict containing ref -> json_object , to be written
	@type project_dict: dict
	"""

	write_dict = dict()

	args = dict(base_args)

	args.update({
		'id': generate_random_string(),
		'name': project_dict['name'],
		'created_date': project_dict['created'],
		'modified_date': project_dict['modified']
	})

	args.update(base_args)

	description = project_dict.get('description')
	if description:
		args.update({'description': description})

	thumbnail = project_dict.get('screenshot')
	if thumbnail:
		new_ref = old_to_new_id[thumbnail]
		args.update({'thumbnail_ref': new_ref})

	v2_project_dict = create_base_goo_object_dict(**args)

	entity_references = set(project_dict['entityRefs'])

	asset_dict = dict()
	asset_sort_value = 0
	for ref, new_id in old_to_new_id.iteritems():
		if ref not in entity_references:
			new_ref = get_new_ref(ref, old_to_new_id)
			asset_dict[new_id] = {
				'sortValue': asset_sort_value,
				'assetRef': new_ref
			}
			asset_sort_value += 1

	v2_project_dict.update({
		'assets': asset_dict
	})

	published_url = project_dict.get('publishedURL')
	if published_url:
		v2_project_dict.update({'publishedURL': published_url})

	# POSTEFFECTS CREATION
	if posteffect_list:
		posteffect_dict = create_posteffects_object(posteffect_list, base_args)
		posteffect_reference = posteffect_dict['id'] + '.posteffects'
		write_dict[posteffect_reference] = posteffect_dict
	else:
		posteffect_reference = None

	# SKYBOX CREATION
	skybox = project_dict.get('skybox')
	if skybox:
		skybox_reference, sky_write_dict = create_skybox_object(skybox, base_args)
		write_dict.update(sky_write_dict)
	else:
		skybox_reference = None

	# ENVIRONMENT CREATION
	environment_dict = create_environment_object(project_dict, base_args, skybox_reference)
	environment_reference = environment_dict['id'] + '.environment'

	# SCENE CREATION
	scene_dict = create_scene_object(project_dict, entity_references, base_args, old_to_new_id, posteffect_reference, environment_reference)

	scene_id = scene_dict['id']
	scene_reference = scene_id + '.scene'
	v2_project_dict.update({'mainScene': scene_reference})
	v2_project_dict.update({
		'scenes': {
			scene_id: {
				'sortValue': 0,
				'sceneRef': scene_reference
			}
		}
	})

	project_reference = v2_project_dict['id'] + '.project'
	write_dict[project_reference] = v2_project_dict
	write_dict[scene_reference] = scene_dict

	return write_dict


def create_skybox_object(skybox, base_args):
	"""Returns sky_ref , stuff_to_be_written_dict (containing ref -> dict"""

	skybox_obj = new_goo_object(base_args, object_id=generate_random_string())

	skybox_reference = skybox_obj['id'] + '.skybox'

	write_dict = dict()

	rotation = skybox.get('rotation')
	if rotation:
		skybox_obj['rotation'] = rotation

	sky_shape = skybox['shape']
	if sky_shape == 'Box':

		box_images = skybox['imageUrls']
		assert len(box_images) == 6
		texture_refs = list()
		for img_ref in box_images:
			tex_ref, tex_dict = create_texture_obj(img_ref, base_args)
			texture_refs.append(tex_ref)
			write_dict[tex_ref] = tex_dict

		# order of images, from goojs TextureCreator.prototype.loadTextureCube
		# [left, right, bottom, top, back, front]
		# This is not true for this array for some reason.
		skybox_obj['box'] = {
			'enabled': True,
			'rightRef': texture_refs[0],
			'leftRef': texture_refs[1],
			'topRef': texture_refs[2],
			'bottomRef': texture_refs[3],
			'frontRef': texture_refs[4],
			'backRef': texture_refs[5]
		}
	elif sky_shape == 'Sphere':
		assert len(skybox['imageUrls']) == 1
		tex_ref, tex_dict = create_texture_obj(skybox['imageUrls'][0], base_args)
		write_dict[tex_ref] = tex_dict
		skybox_obj['sphere'] = {
			'enabled': True,
			'sphereRef': tex_ref
		}
	else:
		raise AssertionError('Non-standard skybox shape %s', sky_shape)

	write_dict[skybox_reference] = skybox_obj

	return skybox_reference, write_dict


def create_texture_obj(image_reference, base_args):

	MAG_FILTERS = ['NearestNeighbor', 'Bilinear']

	MIN_FILTERS = ['NearestNeighborNoMipMaps',
				   'NearestNeighborNearestMipMap',
				   'NearestNeighborLinearMipMap',
				   'BiliniearNoMipMaps',
				   'BiliniearNearestMipMap',
				   'Trilinear']

	WRAP_MODES = [
		'Repeat',
		'MirroredRepeat',
		'EdgeClamp'
	]

	tex_id = generate_random_string()
	texture_ref = tex_id + '.texture'
	tex_obj = new_goo_object(base_args, object_id=tex_id)
	tex_obj['magFilter'] = MAG_FILTERS[1]
	tex_obj['minFilter'] = MIN_FILTERS[3]
	tex_obj['offset'] = [0, 0]
	tex_obj['repeat'] = [0, 0]
	tex_obj['imageRef'] = image_reference
	tex_obj['wrapS'] = WRAP_MODES[0]
	tex_obj['wrapT'] = WRAP_MODES[0]
	tex_obj['anisotropy'] = 1
	tex_obj['flipY'] = False
	return texture_ref, tex_obj


def create_environment_object(project_dict, base_args, skybox_ref):

	env_obj = new_goo_object(base_args, object_id=generate_random_string())

	env_obj['backgroundColor'] = project_dict['backgroundColor']
	env_obj['globalAmbient'] = project_dict['globalAmbient']
	env_obj['fog'] = {
		'enabled': project_dict['useFog'],
		'color': project_dict['fogColor'],
		'near': project_dict['fogNear'],
		'far': project_dict['fogFar']
	}

	if skybox_ref:
		env_obj['skyboxRef'] = skybox_ref

	weather = project_dict.get('weather')
	if weather:
		env_obj['weather'] = weather

	return env_obj


def create_posteffects_object(posteffect_list, base_args):
	"""posteffect_list contains all the dicts of the posteffect objects which existed."""

	post_effect_object = new_goo_object(base_args, object_id=generate_random_string())
	posteffects = dict()
	for i, post_dict in enumerate(posteffect_list):
		post_dict.pop('ref', None)
		post_dict['sortValue'] = i
		posteffects[generate_random_string()] = post_dict

	post_effect_object['posteffects'] = posteffects

	return post_effect_object


def create_scene_object(project_dict, entities, base_args, old_to_new_id, posteffects_ref, environment_ref):
	"""Creates the scene dictionary"""

	scene_dict = new_goo_object(base_args,
								object_id=generate_random_string(),
								name=project_dict.get('name') + ' default scene')
	entity_dict = dict()
	for entity_ref in entities:
		new_ref = get_new_ref(entity_ref, old_to_new_id)
		ent_id = old_to_new_id[entity_ref]
		entity_dict[ent_id] = new_ref

	scene_dict.update({'entityRefs': entity_dict})
	if posteffects_ref:
		scene_dict['posteffectsRef'] = posteffects_ref
	scene_dict['environmentRef'] = environment_ref

	return scene_dict

if __name__ == '__main__':
	pass

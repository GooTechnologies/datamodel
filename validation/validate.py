import json
import rfc3987
import os
import sys
import pdb
from glob import glob

# Install strict_rfc3339 if we want to use strict rfc3339 timestamp. 
# Pros: much tighter Validation
# Cons: requires offset (non naive, e.g. +00:00)
#
# If it's not to be used, make sure it's not installed
# import strict_rfc3339

from jsonschema import Draft4Validator, RefResolver, FormatChecker
from jsonschema.exceptions import RefResolutionError, ValidationError, FormatError

SCHEMA_DIR = "schema_json/1.0"
DATA_DIR = "testdata"
BINARY_TYPES = ['png', 'jpg', 'jpeg', 'tga', 'dds', 'crn', 'wav', 'mp3', 'bin']


def validate_all(datatype=None):
	succeeded = 0
	failed = 0
	for root, path, files in os.walk(DATA_DIR):
		for filename in files:
			filetype = os.path.splitext(filename)[1]
			try:
				filetype = filetype[1:]
			except Exception:
				pass

			if datatype and filetype != datatype: 
				continue

			if filetype and filetype not in BINARY_TYPES: 
				print "Validating %s of type %s"%(filename, filetype)
				try:
					validate_file(os.path.join(root, filename))
					succeeded += 1
				except ValidationError as e:
					failed += 1
				except IOError as e:
					failed += 1

	if succeeded + failed == 0: 
		print "No files found"
	else:
		print "Validation done, %d succeded, %d failed"%(succeeded, failed)



def validate_file(filepath):
	"""
	Raises a ValidationError if it fails, otherwise shuts up	
	"""
	datatype = filepath.split('.')[-1]

	with open(filepath) as f: 
		jsondata = json.load(f)

	clear_null_properties(jsondata)
	validator = validator_for_type(datatype)
	try: 
		validator.validate(jsondata)
	except ValidationError as e:
		print "Validation of %s failed: %s"%(filepath, e.message)
		raise e


def validator_for_type(datatype):
	"""
	Could cache, but meh
	"""
	try: 
		with open(os.path.join(SCHEMA_DIR, '%s.json'%datatype)) as f:
			schema = json.load(f)
	except IOError as e:
		print "No validator for %s"%datatype
		raise e

	
	return Draft4Validator(schema[datatype],
		resolver=MyResolver.from_schema(schema),
		format_checker=FormatChecker()
	)


class MyResolver(RefResolver):
	"""
	Hacks the resolver to check the schema root and resolve any flat refs to 
	the types defined there.
	"""
	def resolve_remote(self, uri):
		if uri in self.store[""]:
			return self.store[""][uri]
		else:
			raise RefResolutionError("Unable to find type %s"%uri)


def clear_null_properties(obj):
	"""
	Remove all properties from an object that have null values. 
	Null is equal to not even there in our world, but null values
	mess up validation. Ideally no null values should ever be saved.
	"""
	keys_to_delete = []
	for key, value in obj.iteritems():
		if value is None or value == []:
			keys_to_delete.append(key)
		elif type(value) == dict:
			clear_null_properties(value)
	for key in keys_to_delete:
		del obj[key]


if __name__ == '__main__':
	if len(sys.argv) > 1: 
		arg = sys.argv[1]
		if '.' in arg:
			validate_file(arg)
		else: 
			validate_all(arg)
	else:
		validate_all()


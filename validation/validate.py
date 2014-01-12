import json
import rfc3987


# Install this if we want to use strict rfc3339 timestamp. 
# Pros: much tighter Validation
# Cons: requires offset (non naive, e.g. +00:00)
#
# If it's not to be used, make sure it's not installed
# import strict_rfc3339

from jsonschema import Draft4Validator, RefResolver, FormatChecker
from jsonschema.exceptions import RefResolutionError, ValidationError, FormatError



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

with open('project.project') as f: 
	jsondata = json.load(f)

with open('project-schema.json') as f:
	schema = json.load(f)

def clear_null_properties(obj):
	keys_to_delete = []
	for key, value in obj.iteritems():
		if value is None:
			keys_to_delete.append(key)
		elif type(value) == dict:
			clear_null_properties(value)
	for key in keys_to_delete:
		del obj[key]

clear_null_properties(jsondata)
validator = Draft4Validator(schema['Project'],
		resolver=MyResolver.from_schema(schema),
		format_checker=FormatChecker()
	)
try: 
	validator.validate(jsondata)
except ValidationError as ve:
	print "Validation Failed: %s"%ve.message
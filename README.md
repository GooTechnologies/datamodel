# Goo Data Model
The Goo Data Model is a data representation designed to contain all the data needed for a game or an app running on the Goo Engine. The data format is used internally in Goo Create, but is intended to work just as well in published apps or apps developed outside Goo Create. 

## Data Objects
An object is defined as the smallest potentially reusable piece of information. Each object has a globally unique key on the format "keystring.objectType". Both 
keystring and objectType can contain alphanumeric letters and dashes (-).

There are currently two data types, JSON and Binary.

### JSON Objects
JSON objects are used for storing mutable data. The keystring for a JSON object is a [RFC4122](http://www.ietf.org/rfc/rfc4122.txt) version 4 compliant guid string (coffeescript implementation uses section 4.4 with pseudo-random numbers) and and the objectType is goo-specific (entity, material, texture, etc). 

#### Dependencies
A JSON object holds references to all its dependencies, both JSON and Binary. A dependency is an object that is needed for the parent object to be useful in its own right. E.g. a material needs its textures, which need their image files, otherwise the material cannot be displayed. An entity needs its child entities (a house is not a house without its roof) but it does not necessarily need its parent node. 

All dependencies are referenced by JSON keys ending in "ref" or "refs" (case insensitive). In the singular case, the value is simply the key of the dependency. In the plural case, the value is a Set, looking like this: 
  
    soundRefs: {
      listId: dependencyId
    } 

where listId is any locally unique string.

##### Refs that are not dependencies
Parameters to scripts and state machine actions are not considered dependencies, even though they are references to other objects. If a house has a script that has a light as a parameter, that particular relationship does not make the light a dependency of the house. The way to denote this type of 'independent' relationships is to call the parent object ```options```:

	scripts: {
		"scriptid.script": {
			scriptRef: "scriptid.script",  // Dependency
			sortValue: 0,
			name: "My Script",
			options: {
				entity: {
					entityRef: "theentity.entity" // Not a dependency, because options
				}
			}
		}
	}

For future similar parametric data type, use the key ```options``` to have references that are not considered dependencies.
 


#### Access Control
A JSON object contains its own access control list: 

    owner: "[userId]",
    public: true/false,
    editors: {
      "[listId]": "[userId]",
      "[listId]": "[userId]"
    },
    viewers: {
      "[listId]": "[userId]",
      "[listId]": "[userId]"
    }

determining who can view and edit the object. This information is only used inside create, and could potentially be stripped on export to save size.  

### Binary objects

Binary objects are immutable, they can only be created and deleted. To e.g. change the image file for a texture, you create a new binary image resource and redirect the dependency reference in the texture JSON file to point to the new image. 

The object key for a binary file is a SHA1 hash of the file content concatenated with the user id. The hashing enables caching content (since it's immutable, we can cache forever), while the user-unique salt prevents intentional cache collisions. Implementation is easy and fast enough in both python: 

    from hashlib import sha1
    from array import array

    def get_hash(file_handle, user_id):
      bytes = array('B', file_handle.read())
      bytes.extend(array('B', user_id))
      return sha1(bytes).hexdigest()

and CoffeeScript (using [CryptoJS] https://code.google.com/p/crypto-js/)

    # Make sure to include both the bundled sha1.js and lib-typedarrays.js

    getHash = (arrayBuffer, userId)->
      userIdBytes = new Uint8Array(userId.charCodeAt(idx) for char,idx in userId)
      wordArray = CryptoJS.lib.WordArray.create(arrayBuffer)
      wordArray.concat(CryptoJS.lib.WordArray.create(userIdBytes)) 
      CryptoJS.SHA1(wordArray).toString()


#### Binary Buffers (.bin files)

Mesh data, rigs and animations data are partly stored in binary buffers with the file extension .bin. These are just simple byte buffers, and the JSON objects refer to them using triplets: 

    [byteOffset, length, format]

- `byteOffset`: offset where in the file to start reading
- `length`: the number of values of the given type that should be read (i.e. NOT the number of bytes)
- `format`: one of 'uint8', 'uint16', 'uint32', 'float32'

The `offset` value must be a multiple of 4, so if the byte length of a data array is not a multiple of 4, the data is padded with zeros. E.g. storing 3 uint16, you'd add another 00 00 and start the next buffer on the position after.  

#### Access Control

Binary objects have a simpler access control list, since they cannot be edited:  

    public: true/false,
    viewers: {
      "[listId]": "[userId]",
      "[listId]": "[userId]"
    }

In Create, this data is stored in Riak's userMeta object for the binary. Outside Create this information is useless, so it will not be exported. 


### Future Proof
There's a couple of things that we know we want to implement further down the roadmap, and while they're not needed now, we must make sure the data model can support them when we get around to it. 

#### Merge-safe
To prepare for real-time collaboration the data model format needs to be mergeable, i.e. changes from several people can be applied to an original without causing unnecessary conflicts. A lengthy discussion on the subject can be found here: http://bitsquid.se/presentations/collaboration.pdf.

In short there are two main things that are needed for mergeability: 

- Unique Id for every object
- Using sets and sorted sets instead of arrays

That's the reason why what was previously arrays sometimes look a bit cumbersome, e.g.

    posteffects: {
      [key: string]: {
        sortValue: number;

        type: string;
        options: {
          [optname: string]: any;
        }
        enabled: boolean;
      }
    }



#### Sharing and Selective Override

Say Oskar makes a nice house in Create, and I want to use it in my scene. I insert the house, move it and rotate it a bit. Then Oskar fixes the material on the tiled roof a bit. Then I want his changes to automatically update in my scene, but I don't want to revert to the original translation and rotation, which I change. We call this *selective override*.

##### Solution
When I insert Oskar's house into my scene, it's not duplicated. Instead a linked entity is created: 

      {
        "id": "myHouse.entity",
        "sourceRef": "oskarsHouse.entity"
      }

Oskar's house is a dependency, hence the key name sourceRef. 

I then move and rotate the house, and myHouse is updated:

    {
      "id": "myHouse.entity",
      "sourceRef": "oskarsHouse.entity"
      "components": {
        "transform": {
          "translation": [1,1,0],
          "rotation": [1,2,0]
        }
      }
    }

When the entity is loaded into the engine, the loaders will merge myHouse with oskarsHouse to get the desired outcome. 

The UI can also highlight which properties I have set and which are inherited from Oskar's original house. I can also easily revert to the original by erasing all my changes. 

I can server the link to Oskars house in Create, e.g. by clicking a button. The editor will then merge oskarsHouse and myHouse, save the merged version in myHouse and remove the sourceRef. Now future changes that Oskar makes will not be visible in myHouse. 

Links can be done in several steps. If Rikard wants to use myHouse (because I made some kickass changes to the curtains) rickardsHouse will be linked to myHouse, which is still linked to oskarsHouse. 


#### Global Asset library/Asset Market

We want users to be able to upload assets to a global asset market. This should work like publishing, in that you upload a snapshot of your assets to the market. Subsequent changes to the asset will not be available to people using the asset until you upload a new version. 

That way, assets in the asset library are "immutable". Publishing local assets to an asset library copies the local asset, with dependencies, severs all the links and creates a version of the asset in the asset library. If it's published anew, a new version of the same asset is created. Users can potentially subscribe to new versions of oskarsHous, and get notifications or similar. 

#### The Updated FBX-file

A common and desired workflow is

1. Create a model in Maya (or any other format)
2. Drop it into create
3. Modify the scene, tune the materials, etc. 
4. Update the model in Maya
5. Drop the new version into Create
6. All the updates from Maya are intelligently merged with the modifications done in Create

This is a complicated problem, but a first step is to use the Selective Override pattern on converted models. In short, the result of a converted model is stored in some library. Then linked entities are created and added to the scene. When the updated fbx is converted, the result is stored as completely new objects. Merging logic then redirects links from the linked entities to the new result as needed. If the result of the old conversion is no longer referenced, it will be deleted. 

There is a lot more to this, call it a work in progress. 


### Migration

The data model change contains a bunch of minor updates, that will require updates in specific places. Specific migration notes can be found in the .ts file for the different data types. The best way to find a migration strategy is to just take the 1.0 schema and the 2.0 schema and compare them. 

#### GUIDs instead of Refs

The ref-idea, an id that looks like a file path, is abandoned. The name `ref` is also abandoned, which will have to be changed in a gazillion places. Namespaces are a thing of the past. There's just the id, and the type.

#### No more .group objects

The group object is abandoned. It was designed to keep track of dependencies, but now every object is responsible for keeping track of its own dependencies. 

#### No more arrays

All arrays are changed to sets or unsorted sets. See the .ts schemas for examples. 

## The Data Model Spec

The data model schema is done in [typescript](http://www.typescriptlang.org/) and stored in this repo under schema/2.0/. We then use a fork of [typson](https://github.com/lbovet/typson) to convert the typescript to [json schema](http://json-schema.org/), which can then be used for documentation and validation.

### Creating a schema

A data type is defined as a typescript interface, and should extend the GooObject interface. Properties are declared like so:

    propName: type;

Where type can be a primitive type (number, string, boolean, any) or a user defined type (check common.ts for examples).

Properties can also be annotated i jsdoc-like comments. For instance, most properties should have a default value: 

    /**
     * @default 2
     */
    dataModelVersion: number;

The available annotation keywords are 

General: 

    type
    default

For numbers: 

    minimum 
    exclusiveMinimum 
    maximum
    exclusiveMaximum
    multipleOf

For strings: 

    minLength
    maxLength 
    format  (see json schema for available options)
    pattern (regex)

For arrays:

    minItems 
    maxItems 
    uniqueItems


### Install

```sh
npm install && pip install -r requirements.txt
```

### Validating

Run 

    grunt
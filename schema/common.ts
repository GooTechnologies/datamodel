/**
 * Matches an ISO8601 datetime, e.g. 2014-01-11T13:29:12.42423
 * @type string
 * @format date-time
 */
interface DateTime {}

/**
 * Matches an array of 3-4 numeric elements between [0,1]
 *
 * @type array
 * @items.type number
 * @items.maximum 1
 * @items.minimum 0
 * @minItems 3
 * @maxItems 4
 */
interface Color {}

/**
 * Matches an array of 3 values
 *
 * @type array
 * @items.type number
 * @minItems 3
 * @maxItems 3
 */
interface Vector3 {}


/**
 * Matches an array of 2 values
 *
 * @type array
 * @items.type number
 * @minItems 2
 * @maxItems 2
 */
interface Vector2 {}

/**
 * Matches rfc3987 URI
 *
 * @type string
 * @format uri
 */
interface URI {}

/**
 * Matches id ending with .entity
 *
 * @type string
 * @pattern \.entity$
 */
interface EntityRef {}

/**
 * Matches id ending with .group
 *
 * @type string
 * @pattern \.group$
 */
interface GroupRef {}

/**
 * Matches id ending with one of .jpg, .jpeg, .gif, .png, .tga, .dds, .crn
 * (case sensitive, must be lowercase)
 *
 * @type string
 * @pattern \.(jpe?g|png|gif|tga|dds|crn)$
 * pattern \.([jJ][pP][eE]?[gG]|[gG][iI][fF]|[pP][nN][gG]|[tT][gG][aA]|[dD][dD][sS]|[cC][rR][nN])$
 */
interface ImageRef {}

/**
 * Matches id ending with .posteffect
 *
 * @type string
 * @pattern \.posteffect$
 */
interface PosteffectRef {}

/**
 * Matches id ending with .animation
 *
 * @type string
 * @pattern \.animation$
 */
interface LayersRef {}

/**
 * Matches id ending with .skeleton
 *
 * @type string
 * @pattern \.skeleton$
 */
interface PoseRef {}

/**
 * Matches id ending with .material
 *
 * @type string
 * @pattern \.material$
 */
interface MaterialRef {}


/**
 * Matches id ending with .script
 *
 * @type string
 * @pattern \.script$
 */
interface ScriptRef {}

/**
 * Matches id ending with .mesh
 *
 * @type string
 * @pattern \.mesh$
 */
interface MeshRef {}


/**
 * Matches id ending with .machine
 *
 * @type string
 * @pattern \.machine$
 */
interface MachineRef {}

/**
 * Matches id ending with .sound
 *
 * @type string
 * @pattern \.sound$
 */
interface SoundRef {}

/**
 * Matches id ending with .sound
 *
 * @type string
 * @pattern \.texture$
 */
interface TextureRef {}

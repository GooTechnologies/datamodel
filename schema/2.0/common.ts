
/**
 * Integer
 * @type number
 * @multipleOf 1
 */
interface int {}


/**
 * RFC3339 datetime, e.g. 2014-01-11T13:29:12+00:00
 * @type string
 * @format date-time
 */
interface DateTime {}

/**
 * Array of r,g,b[,a] values in the range [0,1]
 *
 * @type array
 * @items.type number
 * @minItems 3
 * @maxItems 4
 */
interface Color {}


/**
 * @type array
 * @items.type number
 * @minItems 2
 * @maxItems 2
 */
interface Vector2 {}

/**
 * @type array
 * @items.type number
 * @minItems 3
 * @maxItems 3
 */
interface Vector3 {}

/**
 * @type array
 * @items.type number
 * @minItems 4
 * @maxItems 4
 */
interface Vector4 {}


/**
 * Represented as an array of 16 numbers
 *
 * @type array
 * @items.type number
 * @minItems 16
 * @maxItems 16
 */
interface Matrix4x4 {}


/**
 * rfc3987 URI
 *
 * @type string
 * @format uri
 */
interface URI {}

/**
 * Vector [byteOffset, wordLength, type]
 *
 * @type array
 * @minItems 3
 * @maxItems 3
 */
interface BinaryPointer {}


/**
 * Matches id ending with .entity
 *
 * @type string
 * @pattern \.entity$
 */
interface EntityRef {}

/**
 * Matches id ending with one of .mp3, .wav
 * (case sensitive, must be lowercase)
 *
 * @type string
 * @pattern \.(mp3|wav|ogg)$
 */
interface AudioRef {}


// REVIEW This indicates that images can be svg, which we don't support in the handlers yet
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
 * Matches id ending with .posteffects
 *
 * @type string
 * @pattern \.posteffects$
 */
interface PosteffectsRef {}

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
 * @pattern (\.script|GOO_ENGINE_SCRIPTS/\w+)$
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

/**
 * Matches id ending with .animstate
 *
 * @type string
 * @pattern \.animstate$
 */
interface AnimationStateRef {}

/**
 * Matches id ending with .clip
 *
 * @type string
 * @pattern \.clip$
 */
interface ClipRef {}

/**
 * Matches id ending with .bin
 *
 * @type string
 * @pattern \.bin$
 */
interface BinaryRef {}

/**
 * Matches id ending with .shader
 *
 * @type string
 * @pattern (\.shader|GOO_ENGINE_SHADERS/\w+)$
 */
interface ShaderRef {}

/**
 * Matches id ending with .environment
 *
 * @type string
 * @pattern \.environment$
 */
interface EnvironmentRef {}

/**
 * Matches id ending with .skybox
 *
 * @type string
 * @pattern \.skybox$
 */
interface SkyboxRef {}

/**
 * Matches id ending with .scene
 *
 * @type string
 * @pattern \.scene$
 */
interface SceneRef {}


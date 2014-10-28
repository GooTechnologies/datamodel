/// <reference path="gooobject.ts"/>

enum Blending {
	NoBlending, 
	AdditiveBlending,
	SubtractiveBlending,
	MultiplyBlending, 
	CustomBlending,
	TransparencyBlending
}

enum BlendEquation {
	AddEquation,
	SubtractEquation,
	ReverseSubtractEquation
}

enum BlendSrc {
	ZeroFactor,
	OneFactor,
	SrcAlphaFactor,
	OneMinusSrcAlphaFactor,
	DstAlphaFactor,
	OneMinusDstAlphaFactor,
	SrcColorFactor,
	OneMinusSrcColorFactor,
	DstColorFactor,
	OneMinusDstColorFactor
}

enum BlendDst {
	ZeroFactor,
	OneFactor,
	SrcAlphaFactor,
	OneMinusSrcAlphaFactor,
	DstAlphaFactor,
	OneMinusDstAlphaFactor,
	SrcColorFactor,
	OneMinusSrcColorFactor,
	DstColorFactor,
	OneMinusDstColorFactor
}


interface BlendState {
	blending: Blending;
	blendEquation: BlendEquation;
	blendSrc: BlendSrc;
	blendDst: BlendDst;
}

enum CullFace {
	Front,
	Back,
	FrontAndBack
}

enum Orientation {
	CW,
	CCW
}

interface CullState {
	enabled: boolean;
	cullFace: CullFace;
	frontFace: Orientation;
}

interface DepthState {
	enabled: boolean;
	write: boolean;
}

interface ColorUniform {
	enabled: boolean;
	value: Color;
}

interface NumberUniform {
	enabled: boolean;
	value: number;
}


interface material extends GooObject {

	shaderRef: ShaderRef;

	wireframe?: boolean;
	flat?: boolean;

	texturesMapping: {
		[textureSlot: string]: {
			enabled: boolean;
			textureRef: TextureRef;
		}
	}	

	// TODO: How hard/easy should it be to add new uniforms? We could just leave it unvalidated
	/**
	 * @additionalProperties true
	 */
	uniforms: {
		materialAmbient?: ColorUniform;
		materialDiffuse?: ColorUniform;
		materialEmissive?: {
			enabled: boolean;
			value: Color;
		};
		materialSpecular?: ColorUniform;
		materialSpecularPower?: NumberUniform;
		fresnel?: NumberUniform;
		reflectivity?: NumberUniform;
		discardThreshold?: NumberUniform;
		normalMultiplier?: NumberUniform;

		opacity?: {
			enabled: boolean;
			/**
			 * @minValue: 0
			 * @maxValue: 1
			 */
			value: number;
		}

	}

	blendState: BlendState;
	cullState: CullState;
	depthState: DepthState;
	dualTransparency: boolean;
	/**
	 * default makes shader responsible for renderqueue
	 * @default -1
	 */
	renderQueue: int;
}
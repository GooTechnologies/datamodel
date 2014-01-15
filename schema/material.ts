/// <reference path="common.ts"/>

enum Blending {
	NoBlending, 
	AdditiveBlending,
	SubtractiveBlending,
	MultiplyBlending, 
	CustomBlending
}

enum BlendEquation {
	AddEquation,
	SubtractEquation,
	ReverseSubtractEquation
}

enum BlendSrc {
	SrcAlphaFactor,
	ZeroFactor, 
	OneFactor,
	SrcColorFactor
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


interface material {
	name: string;
	ref?: string;
	type?: string; // Not used

	shaderRef: ShaderRef;

	wireframe?: boolean;

	texturesMapping: {
		[textureSlot: string]: {
			enabled: boolean;
			textureRef: TextureRef;
		}
	}	

	uniforms: {
		materialAmbient?: ColorUniform;
		materialDiffuse?: ColorUniform;
		materialEmissive?: ColorUniform;
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
	renderQueue: int;

}
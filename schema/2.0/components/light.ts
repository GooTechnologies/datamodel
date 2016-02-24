/// <reference path="../common.ts"/>

enum LightType {
	PointLight,
	DirectionalLight,
	SpotLight
}

enum ShadowType {
	Basic,
	PCF,
	VSM
}

/**
 * Migration notes:
 * attenuate is never used, just remove
 * same with fov, type and projection from shadowSettings
 */
interface LightComponent {
	type: LightType;
	/**
	 * Mandatory if LightType is SpotLight
	 */
	angle?: number;
	/**
	 * @default [1,1,1]
	 */
	color?: Color;

	/**
	 * @default 1
	 */
	intensity: number;

	/**
	 * @default 0.2
	 */
	specularIntensity: number;

	lightCookie?: {
		enabled: boolean;
		textureRef: TextureRef;
	};

	penumbra?: number;

	/**
	 * Mandatory if LightType is other than DirectionalLight
	 */
	range?: number;

	/**
	 * @default true
	 */
	shadowCaster: boolean;

	/**
	* Direction and exponent is used by a SpotLight
	*/
	direction?: Vector3;
	exponent?: number;

	shadowSettings?: {
		darkness: number;
		/**
		 * Shadow acne offset
		 */
		offset?: number;
		far: number;
		/**
		 * Mandatory if LightType is other than DirectionalLight
		 */
		fov?: number;
		near: number;
		/**
		 * Mandatory if LightType is DirectionalLight
		 */
		size?: number;
		resolution: Vector2;
		shadowType: ShadowType;
	}
}
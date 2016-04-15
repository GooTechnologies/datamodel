/// <reference path="../common.ts"/>

enum EasingFunction {
	'Linear.None',
	'Quadratic.In',
	'Quadratic.Out',
	'Quadratic.InOut',
	'Cubic.In',
	'Cubic.Out',
	'Cubic.InOut',
	'Exponential.In',
	'Exponential.Out',
	'Exponential.InOut',
	'Elastic.In',
	'Elastic.Out',
	'Elastic.InOut',
	'Circular.In',
	'Circular.Out',
	'Circular.InOut',
	'Back.In',
	'Back.Out',
	'Back.InOut',
	'Bounce.In',
	'Bounce.Out',
	'Bounce.InOut'
}

interface TimelineComponent {
	/**
	 * Duration in seconds
	 */
	duration: number;
	/**
	 * Whether the timeline starts playing right after the scene is loaded.
	 * @default true
	 */
	autoStart?: boolean;
	loop: {
		/**
		 * If true, loop entire timeline. Additional properties to be added in
		 * the future.
		 */
		enabled: boolean;
	}
	channels: {
		[channelId: string]: {
			id: string;
			sortValue: number;

			entityId?: EntityRef;

			/**
			 * Available values are set by the handler. Example: translationX, diffuseR, animationLayer_<id>
			 * Invalid values will fail silently (no animation)
			 */
			propertyKey?: string;

			/**
			 * Name of event to fire. Only one of eventName and propertyKey should be defined.
			 * If both are defined, propertyKey will override.
			 */
			eventName?: string;

			/**
			 * Whether the channel is enabled. When the channel is disabled, the
			 * animation specified in its keyframes will not be performed by the
			 * engine.
			 */
			enabled?: boolean;

			keyframes: {
				[keyFrameId: string]: {
					id: string;

					/**
					 * Position in the timeline, in seconds counted from the start.
					 */
					time: number;

					/**
					 * Value of the channel property in this particular point in time
					 * Not required for pure event channels.
					 */
					value?: any;

					/**
					 * Easing function covering the interval between this keyframe and the next.
					 * Only for property channels
					 */
					easing?: EasingFunction;
				}
			}
		}
	}
}

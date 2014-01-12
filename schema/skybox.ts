interface SkyBox {
	ref?: string;
	attribution: {
		name: string;
	};
	refList: { [ref : string]: number };
	// environmentType: number;
	// //shape: SkyboxShape;
	// rotation: number;
}

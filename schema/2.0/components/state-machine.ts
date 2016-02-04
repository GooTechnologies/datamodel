/// <reference path="../machine.ts"/>

interface StateMachineComponent {
	machines: {
		[listId: string]: {
			machineRef: MachineRef;
			sortValue: number;
		}
	}
}
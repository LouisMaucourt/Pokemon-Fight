import type data from '$lib/file.json';

export type Fighter = (typeof data)[number];

export type Fighters = {
	id: number;
	uuid: string;
	name: string;
	sprites: {
		front_default: string;
		back_default: string;
	};
	hp: number;
	attack: number;
	points: number;
	battleResult: string[];
};

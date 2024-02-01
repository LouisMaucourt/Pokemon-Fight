// src/lib/server.js

import { readArena } from '$lib/server';
import { randomUUID } from 'crypto';
import { addFighterToArena } from '$lib/server';
import fighters from '$lib/file.json';
import { getRandomNumber } from '$lib/server';

export function load({ depends }) {
	depends('arena:all');
	const arena = readArena();
	return {
		arena
	};
}

export const actions = {
	default: async (e) => {
		const formData = await e.request.formData();
		const id = parseInt(formData.get('pokemonid'));
		const randomHP = getRandomNumber(50, 200);
		const randomAttack = getRandomNumber(20, 50);
		const customName = formData.get('customName') || fighters[id - 1].name;

		const newArena = addFighterToArena({
			id: id,
			uuid: randomUUID(),
			name: customName,
			sprites: {
				front_default: fighters[id - 1].sprites.front_default,
				back_default: fighters[id - 1].sprites.back_default
			},
			hp: randomHP,
			attack: randomAttack,
			points: 0,
			battleResult: []
		});

		return {};
	}
};

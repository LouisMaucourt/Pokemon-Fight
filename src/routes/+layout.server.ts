import pokemon from '$lib/file.json';
import { readArena } from '$lib/server';

export function load({ depends }) {
	const pokemonData = {
		pokemon
	};
	depends('arena:all');
	const arenaData = {
		arena: readArena()
	};

	const combinedData = { ...pokemonData, ...arenaData };
	return combinedData;
}

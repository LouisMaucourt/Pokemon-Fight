// server/index.ts
import type { Fighters } from '$lib/types';
import { writeFileSync, readFileSync } from 'fs';

let arena: Fighters[] = readArena();

export function getRandomNumber(min: number, max: number) {
	return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function addFighterToArena(fighters: Fighters) {
	arena = [...arena, fighters];
	saveArena();
	return arena;
}
export function updatePoints(uuid: string, pointsEarned: number) {
	arena = readArena();
	const index = arena.findIndex((fighter) => fighter.uuid === uuid);

	if (index !== -1) {
		arena[index].points = (arena[index].points || 0) + pointsEarned;
		saveArena(arena);
	} else {
		console.log('Fighter not found');
	}
}

export function updateHistory(uuid: string, battleResultJson: string) {
	const index = arena.findIndex((fighter) => fighter.uuid === uuid);

	if (index !== -1) {
		try {
			const parsedBattleResults = JSON.parse(`[${battleResultJson}]`);
			Array.isArray(parsedBattleResults);
			arena[index].battleResult = [...arena[index].battleResult, ...parsedBattleResults];

			saveArena();
		} catch (error) {
			console.error(error);
		}
	} else {
		console.log('Fighter not found');
	}
}

export function readArena() {
	try {
		const data = readFileSync('generated/arena.json', 'utf-8');
		return JSON.parse(data) as Fighters[];
	} catch (e) {
		return [];
	}
}

export function saveArena() {
	writeFileSync('generated/arena.json', JSON.stringify(arena));
}

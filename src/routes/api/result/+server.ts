import { json } from '@sveltejs/kit';
import { updateHistory, updatePoints } from '$lib/server/index.js';

export async function POST({ request }) {
	try {
		const result = await request.json();
		const { uuid1, uuid2, battleResult, pointsEarnedF1, pointsEarnedF2 } = result;

		updatePoints(uuid1, pointsEarnedF1);
		updatePoints(uuid2, pointsEarnedF2);
		updateHistory(uuid1, battleResult);
		updateHistory(uuid2, battleResult);

		return json(result);
	} catch (error) {
		return json({ error: 'Request' });
	}
}

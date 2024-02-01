<script lang="ts">
	export let data;
	let arena = data.arena;
	import type { Fighter } from '$lib/types.js';

	console.log(arena);

	const urlParams = new URLSearchParams(window.location.search);
	const uuid = urlParams.get('uuid');
	const fighterStat = uuid ? arena.find((fighter: Fighter) => fighter.uuid === uuid) : null;

	interface result {
		participants: string[];
		winner: string;
	}

	function convertUuidToName(battleResult: result[], fighters: Fighter[]) {
		return battleResult.map((result) => {
			const participantsNames = result.participants.map((participantUuid: string) => {
				const fighter = fighters.find((fighter) => fighter.uuid === participantUuid);
				return fighter ? fighter.name : participantUuid;
			});

			const winnerName =
				fighters.find((fighter) => fighter.uuid === result.winner)?.name || result.winner;

			return {
				participants: participantsNames,
				winner: winnerName
			};
		});
	}

	if (fighterStat) {
		fighterStat.battleResult = convertUuidToName(fighterStat.battleResult || [], arena);
	}
</script>

{#if fighterStat}
	<img src={fighterStat.sprites.front_default} alt={fighterStat.name} />
	<p>{fighterStat.name}</p>
	<p>{fighterStat.points}</p>
	{#each fighterStat.battleResult as result}
		<p>Combat: {result.participants.join(' VS ')}</p>
		<span>Résultat: {result.winner}</span>
	{/each}
{:else}
	<p>Fighter not found</p>
{/if}

<script lang="ts">
	import { goto } from '$app/navigation';
	import type { Fighters } from '$lib/types.js';

	export let data;
	let fighter: Fighters;
	let dataArena = data.arena.sort((a, b) => b.points - a.points);

	let selectedFighters: string[] = [];

	function selectFighter(fighter) {
		if (!selectedFighters.includes(fighter)) {
			selectedFighters = [fighter];
			const url = `/fighters/stat?uuid=${selectedFighters[0].uuid}`;
			goto(url);
		}
	}
</script>

<h1>UFC - Fighters</h1>
{#each dataArena as fighter}
	<button on:click={() => selectFighter(fighter)}>
		<img src={fighter.sprites.front_default} alt={fighter.name} />
		<p>{fighter.name}</p>
		<p>{fighter.points}</p>
	</button>
{/each}

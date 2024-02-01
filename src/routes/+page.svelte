<script lang="ts">
	import { goto } from '$app/navigation';
	export let data;

	let selectedFighters: string[] = [];
	function selectFighter(fighter: string) {
		const alreadySelected = selectedFighters.find((selFighter) => selFighter.uuid === fighter.uuid);

		if (!alreadySelected && selectedFighters.length < 2) {
			selectedFighters = [...selectedFighters, fighter];

			if (selectedFighters.length === 2) {
				const combatLink = document.getElementById('combatLink');
				if (combatLink) {
					combatLink.classList.remove('inactive');
				}
			}
		}
	}
	function startFight() {
		if (selectedFighters.length === 2) {
			const url = `/fight?uuid1=${selectedFighters[0].uuid}&uuid2=${selectedFighters[1].uuid}`;
			goto(url);
		}
	}
</script>

<h1>UFC - POKEMONS</h1>
{#each data.arena as fighter}
	<button on:click={() => selectFighter(fighter)}>
		<img src={fighter.sprites.front_default} alt={fighter.name} />
		<p>{fighter.name}</p>
	</button>
{/each}

{#if selectedFighters.length === 2}
	<button on:click={() => startFight()} id="combatLink" class="inactive">Combat</button>
{:else}
	<p>Sélectionne 2 Fighters</p>
{/if}

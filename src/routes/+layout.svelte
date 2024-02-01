<script lang="ts">
	export let data;
	import '../styles.css';
	import type { Fighter } from '$lib/types';

	function fighterWithMostPoints(arenaData) {
		if (arenaData && arenaData.arena && arenaData.arena.length > 0) {
			return arenaData.arena.reduce((maxPointsFighter: number, fighter: Fighter) => {
				return fighter.points > maxPointsFighter.points ? fighter : maxPointsFighter;
			}, arenaData.arena[0]);
		} else {
			return null;
		}
	}

	$: mostPointsFighter = fighterWithMostPoints(data);
</script>

<nav>
	<a href="/">Accueil</a>
	<a href="/fighters">Fighters</a>
	<a href="/createpokemon">createpokemon</a>
</nav>

{#if mostPointsFighter}
	<img src={mostPointsFighter.sprites.front_default} alt={mostPointsFighter.name} />
	<p>{mostPointsFighter.name}</p>
{:else}
	<p>Aucun combattant dans l'arène</p>
{/if}

<slot />

<script lang="ts">
	import { enhance } from '$app/forms';

	export let data = { customName: '', selectedPokemon: null, pokemon: [] };
	$: arena = data.pokemon;

	type PreyType = {
		id: number;
		key: number;
	};
	let preys: PreyType[] = [];
</script>

<h1>Création de Fighter</h1>

<form method="POST" use:enhance>
	<label for="pokemonId">Choisir un Pokémon</label>
	<select name="pokemonid" id="pokemonId" bind:value={data.selectedPokemon}>
		{#each arena as pokemon}
			<option value={pokemon.id}>
				{pokemon.name}
			</option>
		{/each}
	</select>

	<label for="customName">Nom :</label>
	<input type="text" id="customName" name="customName" bind:value={data.customName} />
	<button type="submit">Envoyer</button>
</form>

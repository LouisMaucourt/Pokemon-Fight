<script lang="ts">
	import type { Fighters } from '$lib/types.js';
	import { onMount } from 'svelte';
	import { writable, type Writable } from 'svelte/store';
	import { invalidate } from '$app/navigation';

	export let data;
	$: arena = data.arena;

	let fighter1: Fighters;
	let fighter2: Fighters;

	// Creation du store
	let fighter1HP = writable(0);
	let fighter2HP = writable(0);

	export let winner: string | null = null;
	let winnerMessage: string | null = null;

	function startNewCombat() {
		window.location.href = '/';
	}
	onMount(() => {
		const urlParams = new URLSearchParams(window.location.search);
		const uuid1 = urlParams.get('uuid1');
		const uuid2 = urlParams.get('uuid2');

		fighter1 = arena.find((fighter) => fighter.uuid === uuid1);
		fighter2 = arena.find((fighter) => fighter.uuid === uuid2);

		fighter1.points = fighter1.points || 0;
		fighter2.points = fighter2.points || 0;

		fighter1HP.set(fighter1.hp);
		fighter2HP.set(fighter2.hp);

		function randomAttack(attacker: Fighters, target: Fighters) {
			return Math.floor(Math.random() * attacker.attack);
		}

		function remainingLife(attacker: Fighters, target: Fighters, targetHPStore: Writable<number>) {
			const attackPower = randomAttack(attacker, target);
			target.hp -= attackPower;

			let fighterNoHp = Math.min(0, target.hp);
			targetHPStore.set(target.hp);

			console.log(
				`${attacker.name} attaque de ${attackPower} : ${target.name} n'a plus que ${target.hp} HP`
			);

			return fighterNoHp;
		}

		let fightInArena = setInterval(() => {
			remainingLife(fighter1, fighter2, fighter2HP);
			remainingLife(fighter2, fighter1, fighter1HP);

			if (fighter1.hp <= 0 || fighter2.hp <= 0) {
				clearInterval(fightInArena);

				let participants = [fighter1.uuid, fighter2.uuid];
				let battleResult: string;
				let pointsEarned1: number = 0;
				let pointsEarned2: number = 0;

				if (fighter1.hp <= 0 && fighter2.hp <= 0) {
					battleResult = `${fighter2.uuid} et ${fighter1.uuid} se sont mis KO en même temps (cheh).`;
					winnerMessage = 'Match nul';
					pointsEarned1 = 1;
					pointsEarned2 = 1;
				} else if (fighter1.hp <= 0) {
					battleResult = `${fighter2.uuid} remporte le combat contre ${fighter1.uuid} !!!`;
					winnerMessage = `${fighter2.name} remporte le combat !!!`;
					winner = fighter2.uuid;
					pointsEarned1 = 1;
					pointsEarned2 = 3;
				} else {
					battleResult = `${fighter1.name} remporte le combat contre ${fighter2.name} !!!`;
					winnerMessage = `${fighter1.name} remporte le combat !!!`;
					winner = fighter1.uuid;
					pointsEarned1 = 3;
					pointsEarned2 = 1;
				}
				let battleResultJson = JSON.stringify({ participants, winner });
				SendResult(fighter1, fighter2, battleResultJson, pointsEarned1, pointsEarned2);
			}
		}, 2000);

		async function SendResult(
			fighter1: Fighters,
			fighter2: Fighters,
			battleResultJson: string,
			pointsEarned1: number,
			pointsEarned2: number
		) {
			const result = {
				uuid1: fighter1.uuid,
				uuid2: fighter2.uuid,
				battleResult: battleResultJson,
				pointsEarnedF1: pointsEarned1,
				pointsEarnedF2: pointsEarned2
			};

			try {
				if (fighter1 && fighter2 && fighter1.uuid && fighter2.uuid) {
					const response = await fetch('/api/result', {
						method: 'POST',
						body: JSON.stringify(result)
					});

					let responseBody = await response.json();

					if (responseBody.ok) {
						invalidate();
					}
				} else {
					console.error('Missing required parameters. Cannot send result.');
				}
			} catch (error) {
				console.error('Error sending result:', error);
			}
		}
	});
</script>

<h1>Combat</h1>

{#if fighter1 && fighter2}
	<div>
		<img src={fighter1.sprites.front_default} alt={fighter1.name} />
		<p>{fighter1.name}</p>
		<span>Hp : {$fighter1HP}</span>
		<span>Attack : {fighter1.attack}</span>
	</div>

	<div>
		<img src={fighter2.sprites.front_default} alt={fighter2.name} />
		<p>{fighter2.name}</p>
		<span>Hp : {$fighter2HP}</span>
		<span>Attack : {fighter2.attack}</span>
	</div>
{/if}

{#if winnerMessage}
	<p>{winnerMessage}</p>
	<button on:click={startNewCombat}>Nouveau combat</button>
{/if}

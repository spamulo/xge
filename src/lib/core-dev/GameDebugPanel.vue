<template>
	<div class="debug-expander" @click="toggle" title="toggle debug panel">
		{{ expanded ? '▲' : '▼' }}
	</div>
	<div class="dev game-debug-panel" v-if="expanded">
		<div class="button-container">
			<button title="Start" @click="gameState.jumpStart">⏮</button>
			<button title="Prev" @click="gameState.jumpPrev">⏴</button>
			<button title="Next" @click="gameState.jumpNext()">⏵</button>
			<button title="End" @click="gameState.jumpEnd">⏭</button>
		</div>
		<!-- <div>
			CurrentPage: {{ gameState.currentPage }}
		</div>
		<div>
			jumpingToPage: {{ JSON.stringify(gameState.jumpingToPage.value) }}
		</div> -->
		<table>
			<tbody>

				<tr v-for="(pageState, i) of gameState.pageStates"
					:class="{ active: i == gameState.currentPage.value, 'jumping-to': i == gameState.jumpingToPage.value }"
					@click="jump(i)">
					<td>
						{{ i }}
					</td>
					<td>
						<Pip :color="pageState.vIf.value ? '#ff6' : '#222'" tooltip="vIf"></Pip>
						<Pip :color="pageState.enterTransition.value ? '#ddd' : '#222'" tooltip="enterTransition"></Pip>
						<Pip :color="pageState.enterAnim.value ? '#ddd' : '#222'" tooltip="enterAnim"></Pip>
						<Pip :color="pageState.exitAnim.value ? '#ddd' : '#222'" tooltip="exitAnim"></Pip>
						<Pip :color="pageState.exitTransition.value ? '#ddd' : '#222'" tooltip="exitTransition"></Pip>

						<span class="link" style="padding-left: 6px;">
							{{ gameState.pages[i].name }}
						</span>
						<div style="font-size: 50%">{{ pageState.klass }}</div>
					</td>
				</tr>


			</tbody>
		</table>
		<!-- <div>
			<h2>Jump queue</h2>
			<div v-for="(item, i) of gameState.jumpQueue.value">{{ item }}</div>
		</div> -->
		<div>
			<!-- <h3>Game switcher</h3> -->
			<button :class="{ selected: appTools.gameName.value == gameName }" @click="appTools.switchGame(gameName)"
				v-for="gameName of appTools.gameNames.value">{{ gameName
				}}</button>
		</div>
	</div>
</template>

<script setup lang="ts">
import Pip from './Pip.vue';
import { useAppTools } from './useAppTools';
import { useGameState } from './useGameState';

const gameState = useGameState()
const appTools = useAppTools()
function jump(i: number) {
	gameState.jumpTo(i)
}

const expanded = ref(true)
function toggle() {
	expanded.value = !expanded.value
}
</script>

<style scoped>
button {
	cursor: pointer;
}

.game-debug-panel {
	position: fixed;
	top: 0;
	right: 0;
	width: 270px;
	height: 100vh;
	font-family: sans-serif;
	z-index: 100;
	padding: 13px;
	backdrop-filter: blur(5px);
	background: rgba(0, 0, 0, 0.9);
	border-left: 1px solid black;
	box-shadow: 0px 0px 5px rgba(0, 0, 0, 0.7);
}

.link {
	color: #5577ff;
	text-decoration: underline;
	cursor: pointer;
}

tr {
	cursor: pointer;
	height: 28px;
}

tr:hover .link {
	color: #99bbff;
	text-decoration: underline;
	cursor: pointer;
}

.active {
	background: #222;
}

.jumping-to {
	background: #114;
}


table {
	width: 100%;
	border-collapse: collapse;
	border: none;
	padding: 0;
	margin: 0;
}

td {
	padding: 0;
	margin: 0;
	border: none;
}

.debug-expander {
	position: fixed;
	top: 2px;
	right: 2px;
	--c: 32px;
	width: var(--c);
	font-size: var(--c);
	line-height: var(--c);
	height: var(--c);
	z-index: 101;
	cursor: pointer;
	border: 1px dashed rgba(255, 255, 255, 0.2);
}
</style>
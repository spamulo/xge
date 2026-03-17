// type GameTools = {

import { GameState } from "./GameViewer.vue";

// }

export function useGameState() {
	return inject("gameState") as GameState
}
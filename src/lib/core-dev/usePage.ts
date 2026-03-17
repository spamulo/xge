import { PageViewerTools } from "./PageViewer.vue";
import { useGameState } from "./useGameState";

function _usePage() {
	const pvt = inject("pageViewerTools") as PageViewerTools
	const gameState = useGameState()
	const pageState = gameState.pageStates[pvt.pageIndex]!
	const teardownDelay = ref(0)
	pageState.teardownDelay = teardownDelay
	return {
		// teardownDelay,
		pageIndex: pvt.pageIndex,
		name: pvt.name,
		setTeardownDelay(ms: number) {
			teardownDelay.value = ms
		},
		...pageState
	}
}

function injectOrProvide<T>(name: string, f: () => T): T {
	let x = inject(name, null) as any
	if (!x) {
		x = f()
		provide(name, x)
	}
	return x
}

export function usePage() {
	return injectOrProvide("usePage", _usePage)
}

export type UsePage = ReturnType<typeof _usePage>
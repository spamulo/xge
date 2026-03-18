<template>
	<GameDebugPanel></GameDebugPanel>
	<div class="game-viewer">
		<template v-for="({ path: name, page }, pageIndex) in gameState.pages">
			<PageViewer v-if="pageStates[pageIndex].vIf.value" :name="name" :pageIndex="pageIndex" :page="page"
				:class="pageStates[pageIndex].klass.value" class="page-viewer">
				<component :is="page.default" class="viewed-page"></component>
			</PageViewer>
		</template>
	</div>
</template>

<style scoped>
.game-viewer {
	position: absolute;
	left: 0px;
	top: 0px;
	width: 100%;
	height: 100%;
	container-type: size;
	container-name: minigame;
	font-size: 2cqh;
	line-height: 2.5cqh;
	overflow: hidden;
}

.page-viewer {
	position: absolute;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
}

.viewed-page {
	position: absolute;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
}
</style>

<script setup lang="ts">
import { ref, type Ref, provide } from 'vue'
import PageViewer from './PageViewer.vue';
import { notifier } from './notifier';
import { useBridge } from './useBridge';
import type { HostApi, ChildApi } from './bridgeTypes';
import GameDebugPanel from './GameDebugPanel.vue';
import { sleep } from '../misc-dev/util';

const transitions: Record<string, { enterClass: string, exitClass: string, duration: number }> = {
	'default': { enterClass: 'default-enter', exitClass: 'default-exit', duration: 0.5 },
	'zoom': { enterClass: 'zoom-enter', exitClass: 'zoom-exit', duration: 0.7 },
	'spin': { enterClass: 'spin-enter', exitClass: 'spin-exit', duration: 1 }
}

// this comes from a
// const pages = import.meta.glob('./pages/*.vue')
// in the using file
// or
// const pages = import.meta.glob('./pages/*.vue', { eager: true })
// to load pages up front
const props = defineProps<{
	pages: Record<string, (() => Promise<unknown>) | unknown>
}>()

// load the pages by awaiting them if necessary
const loadedPages = ref({} as Record<string, any>)
// onMounted(async () => {
// 	for (const [k, v] of Object.entries(props.pages)) {
// 		if (typeof v == 'function') {
// 			// if { eager: false }, this can load fat pages async
// 			loadedPages.value[k] = await v()
// 		} else {
// 			loadedPages.value[k] = v
// 		}
// 	}
// })

for (const [k, v] of Object.entries(props.pages)) {
	if (typeof v == 'function') {
		// if { eager: false }, this can load fat pages async
		// loadedPages.value[k] = await v()
	} else {
		loadedPages.value[k] = v
	}
}

const pageNames = Object.keys(loadedPages.value).toSorted()
const pageArray = pageNames.map(k => loadedPages.value[k])
const pages = pageNames.map((n, i) => {
	return {
		path: n,
		name: (n.split('/').pop() || '').split('.')[0] || '',
		page: pageArray[i]
	}
})
console.log(loadedPages.value)

const pageStates = pages.map(({ path: name, page }, i) => {
	return {
		// loaded: ref(false),
		vIf: ref(i == 0),
		enterTransition: ref(false),
		exitTransition: ref(false),
		enterAnim: ref(false),
		exitAnim: ref(false),
		teardownDelay: null as null | Ref<number>,
		onDispose: notifier(),
		klass: ref('')
	}
})

export type PageState = typeof pageStates[number]

export type JumpTarget = number | 'back' | 'next' | 'prev' | string

const currentPage = ref(0)
const jumpingToPage = ref(null as (null | number))
const jumpQueue = ref([] as JumpTarget[])
const history = ref([0] as number[])

const gameState = {
	// pageNames,
	// pageArray,
	pages,
	pageStates,
	currentPage,
	jumpingToPage,
	jumpQueue,
	history,
	jumpStart() {
		this.jumpTo(1)
	},
	jumpTo(target: JumpTarget) {
		jumpQueue.value.push(target)
	},
	jumpPrev() {
		this.jumpTo('prev')
	},
	jumpNext() {
		this.jumpTo('next')
	},
	jumpEnd() {
		this.jumpTo(this.pages.length - 1)
	}
}

export type GameState = typeof gameState

watch(jumpQueue, newJumpQueue => {
	// console.log('w')
	processJumpQueue()
}, { deep: true })

function resolveTarget(jt: JumpTarget): number | null {

	if (jt == 'back') {
		return history.value.pop() || null
	} else if (jt == 'next') {
		jt = currentPage.value + 1
	} else if (jt == 'prev') {
		jt = currentPage.value - 1
	}

	if (typeof jt == 'number') {
		if (jt >= 0 && jt < pages.length) {
			return jt
		} else {
			return null
		}
	} else {
		throw new Error(`bad target ${jt}`)
	}
}

// ===================================================== TRANSITION LOGIC

async function processJumpQueue() {
	if (jumpQueue.value.length == 0) {
		return
	}
	if (jumpingToPage.value != null) {
		return
	}
	// note where we're jumping to
	const i = currentPage.value
	const j = resolveTarget(jumpQueue.value.shift()!)
	if (j == null || i == j) {
		return
	}
	const transition = transitions['default']
	// 
	jumpingToPage.value = j
	pageStates[i].enterAnim.value = false
	pageStates[j].klass.value = 'opacity-zero under before-enter'
	pageStates[j].enterTransition.value = false
	pageStates[j].exitTransition.value = false
	pageStates[j].enterAnim.value = false
	pageStates[j].vIf.value = true

	// close and dispose the current page
	if (pageStates[i].teardownDelay && pageStates[i].teardownDelay.value) {
		console.log('found close anim duration')
		pageStates[i].klass.value = 'opacity-full over'
		await sleep(10)
		pageStates[i].klass.value = 'opacity-full over exit-anim'
		pageStates[i].exitAnim.value = true
		await sleep(pageStates[i].teardownDelay.value)
		pageStates[i].exitAnim.value = false
	}
	pageStates[i].klass.value = transition.exitClass + ' exit-anim'
	pageStates[i].exitTransition.value = true
	pageStates[j].klass.value = 'under before-enter ' + transition.enterClass
	pageStates[j].enterTransition.value = true

	await sleep(transition.duration * 1000)

	pageStates[i].exitTransition.value = false
	pageStates[j].enterTransition.value = false

	pageStates[i].onDispose.trigger(undefined)
	// await sleep(2000)

	pageStates[i].klass.value = transition.exitClass + ' opacity-zero under'
	pageStates[j].klass.value = 'opacity-full over enter-anim'

	pageStates[i].vIf.value = false
	pageStates[j].enterAnim.value = true

	currentPage.value = j
	jumpingToPage.value = null
	processJumpQueue()
}

provide('gameState', gameState)

// iframe connectivity
const localApi: ChildApi = {
	async updateStatus(msg: string) {
		console.log('lets go child updateStatus', msg)
	}
	// refreshData: async() => { console.log('Refreshing...'); }
};

const { remote } = useBridge<ChildApi, HostApi>(
	localApi,
	window.parent
);

// Call parent function
const pingParent = async () => {
	// const success = await remote.showAlert("Hello Parent!");
	// console.log('Parent received?', success);
};

// Listen to parent notifier
// remote.onUserLogout(() => {
// console.log("Parent logged us out!");
// });

</script>
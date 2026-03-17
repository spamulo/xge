<template>
	<Background :bg="bg">
		<Hero :x="50" :y="18" :w="50" :h="43" :bg="header" :middle="true"
			class="enter-fade enter-slow enter-delay-2 exit-fade"></Hero>

		<Hero :x="50" :y="50" :w="50" :h="43" :bg="hero" :middle="true"
			class="enter-fade enter-slow enter-delay-2 exit-fade"></Hero>

		<Button :x="50" :y="91" :w="20" :h="8" :bg="skip" :middle="true" @tap="skipOnce"
			class="enter-fade exit-fade enter-delay-20 enter-slow"></Button>


		<Hero :x="50" :y="60" :w="50" :h="50" :middle="true">
			<div class="slab full" ref="gameArea">
				<div ref="draggable" class="slab middle enter-fade-pop enter-delay-5" v-if="showDraggable"
					style="width: 30cqh; height: 20cqh;left: 50%; top: 78%;">
					<Hero class="slab full" :bg="item">
					</Hero>
				</div>
			</div>
		</Hero>
		<transition name="fade">
			<div v-if="showBlanker" class="slab full"
				style="background: rgba(0,0,0,0.8); backdrop-filter: blur(calc(var(--h) * 0.0034)); width: 5000px; left: 50%; transform: translate(-50%);">

				<Hero :x="50" :y="40" :w="50" :h="50" :bg="result" :middle="true"></Hero>
				<Button :x="50" :y="91" :w="20" :h="8" :bg="next" :middle="true" @tap="skipOnce"
					class="enter-fade exit-fade enter-delay-12 enter-slow"></Button>
			</div>
		</transition>

	</Background>
</template>

<script setup lang="ts">
import { useGameState } from '@/lib/core-dev/useGameState'
// import bg from '../assets/IWD_Game_March_Game1_2_GamePlay_Background.webp'
// import hero from '../assets/IWD_Game_March_Game1_2_GamePlay_Image.webp'
// import skip from '../assets/IWD_Game_March_Game1_2_GamePlay_Skip.webp'
// import next from '../assets/IWD_Game_March_Game1_2_GamePlay_Result_Next.webp'
import Background from '@/lib/ui-dev/Background.vue'
import Hero from '@/lib/ui-dev/Hero.vue'
import Button from '@/lib/ui-dev/Button.vue'
import { V2 } from '@/lib/misc-dev/v2'
import { Finger, getRelativeToPercent, relativeToPercent, useToucher3 } from '@/lib/core-dev/toucher3'
const props = defineProps<{ header: string, item: string, result: string, bg: string, hero: string, skip: string, next: string }>()
const gameState = useGameState()
function skipOnce() {
	gameState.jumpNext()
}
const showBlanker = ref(false)
const gameArea = ref()
const showDraggable = ref(true)

function setPercentagePosition(element: HTMLElement, pp: V2): void {
	// Set the position style to absolute to ensure top and left properties work as expected
	element.style.position = 'absolute';
	// Set the top and left properties as percentages
	element.style.top = `${pp[1]}%`;
	element.style.left = `${pp[0]}%`;
}
function dnd(options: { parent: Ref<HTMLElement>, element: Ref<HTMLElement>, onDrop: (put: (dest: Ref<HTMLElement>) => void, restore: () => void) => void, onStart?: () => boolean, onMove?: () => void }) {
	const originpp = getRelativeToPercent(options.element.value!, gameArea.value)
	function put(dest: Ref<HTMLElement>) {
		const pp = getRelativeToPercent(dest.value, gameArea.value)
		if (pp) {
			setPercentagePosition(options.element.value, pp)
		}
	}
	function restore() {
		if (originpp)      // const put = (dest: Ref<HTMLElement>) => {
			console.log(originpp)
		setPercentagePosition(options.element.value, originpp)
	}
	const t = useToucher3(options.element)
	t.onStart((f: Finger) => {
		if (options.onStart) {
			if (!options.onStart()) {
				return
			}
		}

		f.onMove(() => {
			const rp = relativeToPercent(f.pos, options.parent)
			if (rp.value) {
				setPercentagePosition(options.element.value, rp.value)
			}
			if (options.onMove) {
				options.onMove()
			}
		})
		f.onEnd(() => {
			options.onDrop(put, restore)
		})
	})
}
const completed = ref(0)
const draggable = ref()
onMounted(() => {
	if (completed.value) {
		showBlanker.value = true
	}
	dnd(
		{
			parent: gameArea,
			element: draggable,
			onStart() {
				return true
			},
			onMove() {

			},
			onDrop(put, restore) {
				// restore()
				showDraggable.value = false
				showBlanker.value = true
				completed.value = 1
			}
		}

	)
})

</script>

<style scoped></style>
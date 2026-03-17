<template>
	<Background :bg="bg">
		<Hero :x="50" :y="15" :w="50" :h="23" :bg="title" :middle="true" class="enter-fade exit-fade"></Hero>

		<Hero :x="40" :y="34" :w="40" :h="13" :middle="true"
			class="slab enter-fade-pop enter-delay-2 enter-fast exit-fade-pop exit-delay-0 exit-fast">
			<Button v-if="i == 0" :bg="active0" @tap="tap" class="slab full"></Button>
			<Hero v-if="i != 0" :bg="inactive0" class="slab full"></Hero>
		</Hero>
		<Hero :x="57" :y="46" :w="40" :h="13" :middle="true"
			class="slab enter-fade-pop enter-delay-3 enter-fast exit-fade-pop exit-delay-1 exit-fast">
			<Button v-if="i == 1" :bg="active1" @tap="tap" class="slab full"></Button>
			<Hero v-if="i != 1" :bg="inactive1" class="slab full"></Hero>
		</Hero>
		<Hero :x="41" :y="58" :w="40" :h="13" :middle="true"
			class="slab enter-fade-pop enter-delay-4 enter-fast exit-fade-pop exit-delay-2 exit-fast">
			<Button v-if="i == 2" :bg="active2" @tap="tap" class="slab full"></Button>
			<Hero v-if="i != 2" :bg="inactive2" class="slab full"></Hero>
		</Hero>
		<Hero :x="62" :y="71" :w="40" :h="13" :middle="true"
			class="slab enter-fade-pop enter-delay-5 enter-fast exit-fade-pop exit-delay-3 exit-fast">
			<Button v-if="i == 3" :bg="active3" @tap="tap" class="slab full"></Button>
			<Hero v-if="i != 3" :bg="inactive3" class="slab full"></Hero>
		</Hero>
	</Background>
</template>

<script setup lang="ts">
import { useGameState } from '@/lib/core-dev/useGameState'
import Background from '@/lib/ui-dev/Background.vue'
import Hero from '@/lib/ui-dev/Hero.vue'
import Button from '@/lib/ui-dev/Button.vue'
import { usePage } from '@/lib/core-dev/usePage'
const props = defineProps<{ i: number, bg: string, title: string, active0: string, inactive0: string, active1: string, inactive1: string, active2: string, inactive2: string, active3: string, inactive3: string }>()
const gameState = useGameState()
function tap() {
	gameState.jumpNext()
}
usePage().setTeardownDelay(500)
</script>

<style scoped></style>
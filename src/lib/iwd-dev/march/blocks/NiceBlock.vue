<template>
	<Background :bg="bg">
		<Hero :x="50" :y="35" :w="40" :h="43" :bg="milestone" :middle="true"
			class="enter-fade enter-slow enter-delay-2 exit-fade"></Hero>
		<Button :x="50" :y="85" :w="20" :h="8" :bg="button" :middle="true" @tap="tap"
			class="enter-fade exit-fade enter-delay-20 enter-slow"></Button>
	</Background>
</template>

<script setup lang="ts">
import { useGameState } from '@/lib/core-dev/useGameState'

import Background from '@/lib/ui-dev/Background.vue'
import Hero from '@/lib/ui-dev/Hero.vue'
import Button from '@/lib/ui-dev/Button.vue'
const props = defineProps<{ milestone: string, button: string, bg: string }>()
const gameState = useGameState()
function tap() {
	gameState.jumpNext()
}
</script>

<style scoped></style>
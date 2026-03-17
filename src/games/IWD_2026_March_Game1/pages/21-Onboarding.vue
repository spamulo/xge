<script setup lang="ts">
import Hero from '@/lib/ui-dev/Hero.vue';
import { usePage } from '@/lib/core-dev/usePage';
import { useGameState } from '@/lib/core-dev/useGameState';
import PageStatusTest from '@/lib/core-dev/PageStatusTest.vue';

const page = usePage()
const gameState = useGameState()
page.setTeardownDelay(350)

import bg from '../assets/IWD_Game_March_Game1_2_GamePlay_Background.webp'
import text from '../assets/IWD_Game_March_Game1_2_OnboardingPage_Text.webp'
import hero from '../assets/IWD_Game_March_Game1_2_OnboardingPage_Image.webp'
import button from '../assets/IWD_Game_March_Game1_2_OnboardingPage_Play.webp'
import Background from '@/lib/ui-dev/Background.vue';
import Button from '@/lib/ui-dev/Button.vue';
</script>

<template>
	<Background :bg="bg">
		<Hero :bg="text" class="slab enter-fade-pop enter-delay-2 enter-fast exit-fade exit-delay-2 exit-fast" :y="42"
			:x="50" :w="45" :h="65" :middle="true"></Hero>
		<!-- <Hero :bg="hero" class="slab middle mid enter-fade-pop enter-delay-2 enter-fast exit-fade exit-delay-2 exit-fast"
			:y="62" :x="50" :w="35" :h="25"></Hero> -->
		<Button :bg="button" class="slab enter-fade enter-delay-6 enter-slow exit-fade exit-delay-4 exit-fast" :x="50"
			:y="85" :w="15" :h="8" :middle="true" @tap="gameState.jumpNext()"></Button>
		<!-- <PageStatusTest>
		</PageStatusTest> -->
	</Background>
</template>

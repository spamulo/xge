<script setup lang="ts">
import Hero from '@/lib/ui-dev/Hero.vue';
import test from '../assets/test.webp'
import { useGameState } from '@/lib/core-dev/useGameState';

useGameState().jumpNext()
</script>

<template>
	<div style="background: #333">
		01-Preloader
		<Hero :bg="test"></Hero>
	</div>
</template>

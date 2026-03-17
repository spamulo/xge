<template>
	<GameViewer :pages="pages"></GameViewer>
</template>

<script setup lang="ts">
import GameViewer from '@/lib/core-dev/GameViewer.vue'
const pages = import.meta.glob('./pages/*.vue', { eager: true })
</script>
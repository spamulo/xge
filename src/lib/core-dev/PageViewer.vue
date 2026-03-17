<template>
	<div class="viewed-page slab full">
		<!-- PageViewer: {{ pageIndex }} {{ name }} -->
		<slot></slot>
	</div>
</template>

<script setup lang="ts">
// import { useGameState } from './useGameState';

const props = defineProps<{ pageIndex: number, page: any, name: string }>()

function pvt() {
	return {
		pageIndex: props.pageIndex,
		name: props.name
	}
}
provide("pageViewerTools", pvt())
export type PageViewerTools = ReturnType<typeof pvt>
</script>

<style scoped>
/* .viewed-page {
	
} */
</style>
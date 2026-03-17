<template>
	<div class="pip" :style="style" :title="tooltip"></div>
</template>

<script setup lang="ts">
const props = withDefaults(defineProps<{ color?: string, tooltip?: string }>(), { color: 'black', tooltip: '' })
const style = computed(() => {
	return { backgroundColor: props.color }
})
</script>

<style scoped>
.pip {
	display: inline-block;
	width: 9px;
	height: 9px;
	border-radius: 2px;
	border: 1px solid rgba(255, 255, 255, 0.2);
}
</style>
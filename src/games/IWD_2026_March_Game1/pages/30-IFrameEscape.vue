<template>
	<div>

	</div>
</template>

<script setup lang="ts">
onMounted(() => {
	window.parent.postMessage('escape', '*');
	window.parent.postMessage('exit', '*')
})
</script>

<style scoped></style>
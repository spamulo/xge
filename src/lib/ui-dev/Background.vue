<template>
	<div class="slab full"
		:style="{ backgroundImage: `url(${props.bg})`, backgroundSize: 'cover', backgroundPosition: 'center' }">
		<slot></slot>
	</div>
</template>

<script setup lang="ts">
const props = defineProps<{ bg: string }>()
</script>

<style scoped></style>
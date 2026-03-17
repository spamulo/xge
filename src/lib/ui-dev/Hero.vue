<template>
	<div class="hero bg" :style="{ ...style }" :class="props.middle ? 'middle-xform' : ''">
		<slot></slot>
	</div>
</template>

<style scoped>
.hero {
	position: absolute;
}
</style>

<script setup lang="ts">

const props = withDefaults(defineProps<{ bg?: string, x?: number, y?: number, w?: number, h?: number, middle?: boolean }>(), { middle: false })

const style = computed(() => {
	return {
		backgroundImage: props.bg ? `url(${props.bg})` : undefined,
		left: props.x ? `calc(50% - 50cqh + ${props.x}cqh)` : undefined,
		top: props.y ? `${props.y}cqh` : undefined,
		width: props.w ? `${props.w}cqh` : undefined,
		height: props.h ? `${props.h}cqh` : undefined,
	}
})
</script>
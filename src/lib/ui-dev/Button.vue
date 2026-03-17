<template>
	<div @click="click" class="button bg" :class="props.middle ? 'middle-xform' : ''" :style="{ ...style }"></div>
</template>

<style scoped>
.button {
	transition: transform 0.16s ease;
	position: absolute;
	cursor: pointer;
}

.button:hover {
	transform: scale(1.05);
}

.middle-xform.button:hover,
.middle.button:hover {
	transform: translate(-50%, -50%) scale(1.05);
}

.middle-xform.button:active,
.middle.button:active {
	transform: translate(-50%, -50%) scale(0.9);
}

.button:active {
	transform: scale(0.9);
}
</style>

<script setup lang="ts">
// const props = withDefaults(defineProps<{ bg?: string }>(), { bg: '' })
const emits = defineEmits(["tap", "tapmulti"])
let clicked = false
function click() {
	if (!clicked) {
		emits("tap")
	}
	emits("tapmulti")
	clicked = true
}

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
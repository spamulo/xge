<template>
	<div>hello world this is great it doesn't reload my dev tools</div>

</template>
<script setup lang="ts">
import { getResources } from '@/resources';
onMounted(async () => {
	const r = await getResources()
	console.log(JSON.stringify(r, null, 2))
	console.log(r.lib['test-dev'].moo)
	r.lib['test-dev'].moo()
})

</script>
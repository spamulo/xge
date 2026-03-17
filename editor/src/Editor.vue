<template>
	<div>
		<iframe ref="iframeRef" src="http://localhost:41201/" class="iframe"></iframe>
		<div class="sidebar">
			sidebar123 {{ t }}.
			<br />
			<h1>Host Page (Ready: {{ isReady }})</h1>
			<button @click="updateStatus()">Update Status</button>
		</div>
	</div>
</template>
<script setup lang="ts">
import testEdit from './testEdit'
import { ref } from 'vue';
import { notifier } from '../../src/lib/core-dev/notifier';
import { useBridge } from '../../src/lib/core-dev/useBridge';
import type { HostApi, ChildApi } from '../../src/lib/core-dev/bridgeTypes';


const t = ref(0)
onMounted(async () => {
	console.log('mounteds')
	t.value = 0
	testEdit()
	while (true) {
		await new Promise(resolve => setTimeout(resolve, 1000))
		t.value += 1
	}
})


const iframeRef = ref<HTMLIFrameElement | null>(null);

const localApi: HostApi = {
	async saveData(data: any) {
		return true
	}
};

const { remote, isReady } = useBridge<HostApi, ChildApi>(
	localApi,
	() => iframeRef.value?.contentWindow || null
);

const updateStatus = () => remote.updateStatus("booo");
</script>
<style lang="css" scoped>
.iframe {
	position: absolute;
	top: 0;
	left: 0;
	width: calc(100vw - 400px);
	height: 100vh;
	border: none;
}

.sidebar {
	position: absolute;
	top: 0;
	left: calc(100vw - 400px);
	height: 100vh;
	width: 400px;
	background: #999;
}
</style>

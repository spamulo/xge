<template>
	<div>
		<table>
			<tr>
				<th>Property</th>
				<th>Value</th>
			</tr>
			<tr v-for="(value, key) in page" :key="key">
				<td>{{ key }}</td>
				<td>{{ value }}</td>
			</tr>
		</table>
	</div>
</template>

<script setup lang="ts">
import { usePage } from './usePage';

// page is like:
// const page: {
//     loaded: globalThis.Ref<boolean, boolean>;
//     openAnim: globalThis.Ref<boolean, boolean>;
//     closeAnim: globalThis.Ref<boolean, boolean>;
//     onDispose: Notifier<unknown>;
//     teardownDelay: globalThis.Ref<number, number>;
//     pageIndex: number;
//     name: string;
// }

const page = usePage()
</script>

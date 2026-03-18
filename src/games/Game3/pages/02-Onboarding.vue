<script setup lang="ts">
import Hero from '@/lib/ui-dev/Hero.vue';
import test from '../assets/test.webp'
import PageStatusTest from '@/lib/core-dev/PageStatusTest.vue';
</script>

<template>
	<div style="background: #363">
		02-Onboarding
		<PageStatusTest></PageStatusTest>
		<Hero :bg="test"></Hero>
	</div>
</template>

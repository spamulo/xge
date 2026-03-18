<script setup lang="ts">
import Hero from '@/lib/ui-dev/Hero.vue';
import test from '../assets/test.webp'
import { usePage } from '@/lib/core-dev/usePage';
import PageStatusTest from '@/lib/core-dev/PageStatusTest.vue';

const page = usePage()
page.setTeardownDelay(1000)
</script>

<template>
	<div style="background: #636">
		01-Landing - game 3
		<PageStatusTest></PageStatusTest>
		<Hero :bg="test"></Hero>
	</div>
</template>

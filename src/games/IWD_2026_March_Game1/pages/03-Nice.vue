<script setup lang="ts">
import milestone from '../assets/IWD_Game_March_Game1_Milestone1.webp'
import bg from '../assets/IWD_Game_March_Game1_Milestone_Background.webp'
import button from '../assets/IWD_Game_March_Game1_Milestone-Back.webp'
import NiceBlock from '@/lib/iwd-dev/march/blocks/NiceBlock.vue';
</script>

<template>
	<NiceBlock :i="0" :milestone="milestone" :bg="bg" :button="button">
	</NiceBlock>
</template>

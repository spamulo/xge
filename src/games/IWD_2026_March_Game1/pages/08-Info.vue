<script setup lang="ts">
import bg from '../assets/IWD_Game_March_Game1_MainPage_Background.webp'
import title from '../assets/IWD_Game_March_Game1_MainPage_Text.webp'
import active0 from '../assets/IWD_Game_March_Game1_MainPage_Milestone1_Active.webp'
import inactive0 from '../assets/IWD_Game_March_Game1_MainPage_Milestone1_Inactive.webp'
import active1 from '../assets/IWD_Game_March_Game1_MainPage_Milestone2_Active.webp'
import inactive1 from '../assets/IWD_Game_March_Game1_MainPage_Milestone2_Inactive.webp'
import active2 from '../assets/IWD_Game_March_Game1_MainPage_Milestone3_Active.webp'
import inactive2 from '../assets/IWD_Game_March_Game1_MainPage_Milestone3_Inactive.webp'
import active3 from '../assets/IWD_Game_March_Game1_MainPage_Milestone4_Active.webp'
import inactive3 from '../assets/IWD_Game_March_Game1_MainPage_Milestone4_Inactive.webp'
import InfoBlock from '@/lib/iwd-dev/march/blocks/InfoBlock.vue';
</script>


<template>
	<InfoBlock :i="3" :bg="bg" :title="title" :active0="active0" :inactive0="inactive0" :active1="active1"
		:inactive1="inactive1" :active2="active2" :inactive2="inactive2" :active3="active3" :inactive3="inactive3">
	</InfoBlock>
</template>

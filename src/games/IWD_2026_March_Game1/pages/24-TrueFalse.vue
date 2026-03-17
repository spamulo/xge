<script setup lang="ts">
import header from '../assets/IWD_Game_March_Game1_2_GamePlay_Header3.webp'
import item from '../assets/IWD_Game_March_Game1_2_GamePlay_Option3.webp'
import result from '../assets/IWD_Game_March_Game1_2_GamePlay_Result3.webp'
import TrueFalseBlock from '@/lib/iwd-dev/march/blocks/TrueFalseBlock.vue';
import bg from '../assets/IWD_Game_March_Game1_2_GamePlay_Background.webp'
import hero from '../assets/IWD_Game_March_Game1_2_GamePlay_Image.webp'
import skip from '../assets/IWD_Game_March_Game1_2_GamePlay_Skip.webp'
import next from '../assets/IWD_Game_March_Game1_2_GamePlay_Result_Next.webp'
</script>

<template>
	<TrueFalseBlock :header="header" :item="item" :result="result" :bg="bg" :hero="hero" :skip="skip" :next="next">
	</TrueFalseBlock>
</template>

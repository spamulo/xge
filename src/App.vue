<script setup lang="ts">
const isDev = import.meta.env.DEV
const envGameName = import.meta.env.VITE_GAME_NAME
// const devGames = isDev
//   ? import.meta.glob('./games/**/*.vue', { eager: true })
//   : {}

const ProdGame = defineAsyncComponent(() => import('@active-game'))

console.log('envGameName', envGameName)
const gameName = ref(envGameName || 'Game1')
const gameNames = ref([gameName.value])
// const gameNames = ref(Object.keys(devGames).filter(gn => {
//   return gn.split('/').length == 4
// }).map(gn => gn.split('/')[2]))

console.log(gameNames.value)

const appTools = {
  gameName,
  gameNames,
  switchGame(newGameName: string) {
    if (gameNames.value.includes(newGameName)) {
      gameName.value = newGameName
    } else {
      throw new Error(`bad game name ${newGameName}`)
    }
  }
}
export type AppTools = typeof appTools
provide('appTools', appTools)

// import ActiveGame from '@active-game'
const CurrentGame = computed(() => {
  // if (isDev) {
  //   const path = `./games/${gameName.value}/${gameName.value}.vue`
  //   const devGame = devGames[path]
  //   console.log('devGame')
  //   console.log(devGame)
  //   return ((devGame || {}) as any).default || null
  // }
  return ProdGame
})


</script>

<template>
  <!-- <GameViewer></GameViewer> -->
  <!-- <Game1></Game1> -->
  <!-- <component :is="game.default"></component> -->
  <CurrentGame></CurrentGame>
  <!-- <IWD_2026_March_Game1></IWD_2026_March_Game1> -->
</template>

<style scoped></style>

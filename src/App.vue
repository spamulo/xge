<template>
  <CurrentGame></CurrentGame>
</template>

<script setup lang="ts">
const isDev = import.meta.env.DEV
const envGameName = import.meta.env.VITE_GAME_NAME
const envExtraGameNames = import.meta.env.VITE_EXTRA_GAMES

// in production we statically import the game using an alias, see vite.config.js
const ProdGame = defineAsyncComponent(() => import('@active-game'))

const ExtraGame0 = defineAsyncComponent(() => import('@game-0'))
const ExtraGame1 = defineAsyncComponent(() => import('@game-1'))

// build tool sets the game name
const gameName = ref(envGameName || 'Game1')
let gameNames = ref([gameName.value])

let games: Record<string, unknown>
if (isDev) {
  // in dev mode, load all games
  games = import.meta.glob('./games/**/*.vue', { eager: true })
  gameNames.value = Object.keys(games).filter(gn => {
    return gn.split('/').length == 4
  }).map(gn => gn.split('/')[2])
}

const CurrentGame = computed(() => {
  if (isDev) {
    const path = `./games/${gameName.value}/${gameName.value}.vue`
    const devGame = games[path]
    return ((devGame || {}) as any).default || null
  }
  return ProdGame
})


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
</script>

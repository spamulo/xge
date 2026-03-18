<template>
  <CurrentGame></CurrentGame>
</template>

<script setup lang="ts">
const isDev = import.meta.env.DEV
const envGameName = import.meta.env.VITE_GAME_NAME
const envExtraGameNames = import.meta.env.VITE_EXTRA_GAMES

if (!isDev) {
  console.log('prod mode')
  console.log('envGameName', envGameName)
  console.log('envExtraGameNames', envExtraGameNames)
}
// in production we statically import the game using an alias, see vite.config.js
const ProdGame = defineAsyncComponent(() => import('@active-game'))
// this is actually necessary.
const ExtraGames = [
  defineAsyncComponent(() => import('@game-0')),
  defineAsyncComponent(() => import('@game-1')),
  defineAsyncComponent(() => import('@game-2')),
  defineAsyncComponent(() => import('@game-3')),
  defineAsyncComponent(() => import('@game-4')),
  defineAsyncComponent(() => import('@game-5')),
  defineAsyncComponent(() => import('@game-6')),
  defineAsyncComponent(() => import('@game-7')),
  defineAsyncComponent(() => import('@game-8')),
  defineAsyncComponent(() => import('@game-9')),
  defineAsyncComponent(() => import('@game-10')),
  defineAsyncComponent(() => import('@game-11')),
  defineAsyncComponent(() => import('@game-12')),
  defineAsyncComponent(() => import('@game-13')),
  defineAsyncComponent(() => import('@game-14')),
  defineAsyncComponent(() => import('@game-15')),
  defineAsyncComponent(() => import('@game-16')),
  defineAsyncComponent(() => import('@game-17')),
  defineAsyncComponent(() => import('@game-18')),
  defineAsyncComponent(() => import('@game-19')),
  defineAsyncComponent(() => import('@game-20')),
  defineAsyncComponent(() => import('@game-21')),
  defineAsyncComponent(() => import('@game-22')),
  defineAsyncComponent(() => import('@game-23')),
  defineAsyncComponent(() => import('@game-24')),
  defineAsyncComponent(() => import('@game-25')),
  defineAsyncComponent(() => import('@game-26')),
  defineAsyncComponent(() => import('@game-27')),
  defineAsyncComponent(() => import('@game-28')),
  defineAsyncComponent(() => import('@game-29')),
  defineAsyncComponent(() => import('@game-30')),
  defineAsyncComponent(() => import('@game-31')),
]

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

const prodGame = computed(() => {
  if (envGameName == gameName.value) {
    return ProdGame
  }
  const gameIndex = envExtraGameNames.split(',').indexOf(gameName)
  if (gameIndex == -1) {
    return null
  }
  return ExtraGames[gameIndex]
})

const CurrentGame = computed(() => {
  if (isDev) {
    // dev mode - the current game is taken from the dynamically imported 'games'
    const path = `./games/${gameName.value}/${gameName.value}.vue`
    const devGame = games[path]
    return ((devGame || {}) as any).default || null
  } else {
    // prod mode - we look up the game in the static list
    return prodGame.value
  }
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

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
// import { ViteImageOptimizer } from 'vite-plugin-image-optimizer';
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { imagetools } from 'vite-imagetools'
import path from 'path'
import { fileURLToPath, URL } from 'node:url'
import vueDevTools from 'vite-plugin-vue-devtools'
import fs from 'vite-plugin-fs'
import { loadEnv } from 'vite'

const appTarget = process.env.VITE_APP_TARGET || ''; // 'editor' or ''


// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd())
  const gameName = env.VITE_GAME_NAME || 'Game1'
  const extraGames = (env.VITE_EXTRA_GAMES || '').split(',').map(x => x.trim())
  const extraGamesAlias = {}
  for (let i = 0; i < 32; i++) {
    const eg = extraGames[i]
    const s = `@game-${i}`
    const d = eg ? path.resolve(__dirname, `./src/games/${gameName}/${gameName}.vue`) : path.resolve(__dirname, './src/Dummy.vue')
    extraGamesAlias[s] = d
  }
  console.log(JSON.stringify(extraGamesAlias, null, 2))
  return {
    resolve: {
      alias: {
        "@": fileURLToPath(new URL('./src', import.meta.url)),
        '@active-game': path.resolve(__dirname, `./src/games/${gameName}/${gameName}.vue`),
        ...extraGamesAlias
        // '@game-0': path.resolve(__dirname, `./src/games/${gameName}/${gameName}.vue`)
      },
    },
    plugins: [
      fs(),
      vue(),
      vueDevTools(),
      Components({

      }),
      AutoImport({
        include: [
          /\.[tj]sx?$/, // .ts, .tsx, .js, .jsx
          /\.vue$/,
          /\.vue\?vue/, // .vue
          /\.vue\.[tj]sx?\?vue/, // .vue (vue-loader with experimentalInlineMatchResource enabled)
          /\.md$/, // .md
        ],
        imports: [
          // presets
          'vue',
          'vue-router',
        ],
        dts: './auto-imports.d.ts',
        vueTemplate: true,
        eslintrc: {
          enabled: true, // <-- this
        },
        dirsScanOptions: {
          filePatterns: ['*.ts', '*.vue'], // Glob patterns for matching files
          // fileFilter: file => file.endsWith('.ts'), // Filter files
          types: true // Enable auto import the types under the directories
        },
        dirs: [
          './src/composables/**',
          './src/components/controls/**',
          './src/stores/**',
        ]
      }),
      imagetools()
    ],
    base: './',
    root: path.resolve(__dirname, appTarget == 'editor' ? 'editor' : '.'),
    build: {
      rollupOptions: {
        // input: {
        //   main: path.resolve(__dirname, appTarget === 'editor' ? 'editor.html' : 'index.html'),
        // },
        output: {
          // Change from object {} to a function (id) => {}
          manualChunks(id) {
            if (id.includes('node_modules/three')) {
              return 'three-vendor';
            }
          },
        },
      },
    },
    server: {
      port: appTarget === 'editor' ? 41200 : 41201,
      // CRITICAL: Stop Vite from even watching the other app's files
      watch: {
        ignored: appTarget === 'editor' ? ['**/src/games/**', '**/src/lib/**'] : []
      }
    },
  }
})

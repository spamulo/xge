import { createApp } from 'vue'
import { createPinia } from 'pinia'

import Editor from './Editor.vue'

createApp(Editor).use(createPinia()).mount('#app')

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import './reset.css'
import './volk.css'
import './style.css'
import './fonts.css'
import './anim.css'
import './transition.css'
import App from './App.vue'

createApp(App).use(createPinia()).mount('#app')

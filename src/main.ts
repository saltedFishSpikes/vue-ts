import { createApp } from 'vue'
import App from './App.vue'
import './assets/css/reset.css'
import './assets/less/global.less'
import { getScrollWidth } from '@/common/util'
getScrollWidth()
createApp(App).mount('#app')

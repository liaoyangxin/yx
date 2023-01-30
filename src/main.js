import { createApp } from 'vue'
import App from './App.vue'
import serves from './http/axios'
import VueAxios from 'vue-axios'
import store from './vuex/index.js'
import '@/assets/css/pulic.css'
import ElementPlus from 'element-plus'
import 'element-plus/lib/theme-chalk/index.css'
import * as ElIcons from '@element-plus/icons'
import local from 'element-plus/lib/locale/lang/zh-cn'
import VueClipboard from 'vue-clipboard2'
import VuePlayerPlugin from 'vue-youtube-iframe-api'

import router from './routes/index'
let app = createApp(App)
for (const name in ElIcons){
	app.component(name,ElIcons[name])
}
app.use(VueAxios, serves)
app.use(ElementPlus,{local})
app.use(store)
app.use(VueClipboard)
app.use(VuePlayerPlugin)
app.use(router)
app.mount('#app')
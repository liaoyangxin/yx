import { createRouter, createWebHistory } from 'vue-router'
import routes from './routes.js'
const whiteListName = ['openViewPreview']
const router = createRouter({
    history: createWebHistory(),
    routes: routes
})
router.beforeEach((to, from, next) => {
    console.log('ttttto', to)
    console.log('from', from)
    if(to.path === '/') {
        sessionStorage.clear()
        next()
    } else {
        if (sessionStorage.getItem('token') || whiteListName.indexOf(to.name) > -1) {
            if (from.path !== '/') {
                sessionStorage.setItem("lasterRouter", from.path)
                if(from.path === '/404'){
                    sessionStorage.setItem('chooseMenu', sessionStorage.getItem('oldChooseMenu'))
                }
            }
            next()
        } else {
            next('/')
        }
    }
})
export default router
import Vue from 'vue'
import VueRouter from 'vue-router'

import Login from 'views/login/Login.vue'
import Home from 'views/home/Home.vue'
import Welcome from 'components/Welcome'
import User from 'views/user/User'
import Rights from 'views/roles/Rights'
import Roles from 'views/roles/Roles'
import Category from 'views/commodity/Category'
import Goods from 'views/commodity/Goods'
import Params from 'views/commodity/Params'
import AddGoods from 'views/commodity/AddGoods'
Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/login',
    component: Login
  },
  {
    path: '/home',
    component: Home,
    redirect: '/welcome',
    children: [
      { path: '/welcome', component: Welcome},
      { path: '/users', component: User},
      { path: '/rights', component: Rights},
      { path: '/roles', component: Roles},
      { path: '/categories', component: Category},
      { path: '/goods', component: Goods},
      { path: '/params', component: Params},
      { path: '/goods/add', component: AddGoods},
    ]
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

router.beforeEach((to, from, next) => {
  if(to.path === '/login') return next()
  const tokenStr = window.sessionStorage.getItem('token')
  if (!tokenStr) return next('/login')
  next()
})

export default router

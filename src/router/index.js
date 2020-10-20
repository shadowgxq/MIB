import Vue from 'vue'
import VueRouter from 'vue-router'


const  Login = () => import('views/login/Login')
const  Home = () => import('views/home/Home')
const  Welcome = () => import('components/Welcome')
const  User = () => import('views/user/User')
const  Rights = () => import('views/roles/Rights')
const  Roles = () => import('views/roles/Roles')
const  Category = () => import('views/commodity/Category')
const  Goods = () => import('views/commodity/Goods')
const  Params = () => import('views/commodity/Params')
const  AddGoods = () => import('views/commodity/AddGoods')
const  Order = () => import('views/order/Order')
const Reports = () => import('views/reports/Reports')
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
      { path: '/orders', component: Order},
      { path: '/reports', component: Reports},
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

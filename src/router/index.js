import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  {
    path:"/",
    name:"Login",
    component: () => import("../views/Login")
  },
  {
    path:"/main",
    name:"Main",
    component: () => import("../views/Main"),
    children:[
      {
        path:"/home",
        name:"Home",
        component: () => import("../views/Home")
      },
      {
        path:"/menu",
        name:"Menu",
        component: () => import("../views/Menu")
      },
      {
        path:"/shopbag",
        name:"Shopbag",
        component: () => import("../views/Shopbag")
      },
      {
        path:"/my",
        name:"My",
        component: () => import("../views/My")
      },
    ]
  },
  {
    path:"/detail/:pid",
    name:"Detail",
    component: () => import("../views/Detail.vue")
  },
  {
    path:"/pay",
    name:"Pay",
    component: () => import("../views/Pay.vue")
  },
  {
    path:"/newAddress",
    name:"NewAddress",
    component: () => import("../views/NewAddress.vue")
  },
  {
    path:"/address",
    name:"Address",
    component: () => import("../views/Address.vue")
  },{
    path:"/order",
    name:"Order",
    component: () => import("../views/Order.vue")
  },
  {
    path:"/account",
    name:"Account",
    component: () => import("../views/Account.vue")
  },
  {
    path:"/favorite",
    name:"Favorite",
    component: () => import("../views/Favorite.vue")
  },
  {
    path:"/secure",
    name:"Secure",
    component: () => import("../views/Secure.vue")
  },
  {
    path: '/search',
    name: 'Search',
    component: () => import('../views/Search.vue')
  },
  {
    path: '/forgot',
    name: 'Forgot',
    component: () => import('../views/Forgot.vue')
  },
]

const router = new VueRouter({
  routes
})

export default router

import { createRouter, createWebHashHistory } from 'vue-router'
import Home from '../pages/Home.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/member/login',
    name: 'Login',
    component: () => import('../pages/LoginPage.vue')
  },
  {
    path: '/member/register',
    name: 'Register',
    component: () => import('../pages/RegisterPage.vue')
  },
  {
    path: '/member',
    name: 'Member',
    component: () => import('../pages/MemberPage.vue'),
    meta: { requiresAuth: true },
    redirect: '/member/profile',
    children: [
      {
        path: 'profile',
        name: 'MemberProfile',
        component: () => import('../pages/member/ProfilePage.vue'),
        meta: { requiresAuth: true }
      },
      {
        path: 'orders',
        name: 'MemberOrders',
        component: () => import('../pages/member/OrdersPage.vue'),
        meta: { requiresAuth: true }
      },
      {
        path: 'favorites',
        name: 'MemberFavorite',
        component: () => import('../pages/member/FavoritePage.vue')
      },
      {
        path: 'cart',
        name: 'Cart',
        component: () => import('../pages/member/Cart.vue')
      },
    ],
  },
  {
    path: '/payment',
    name: 'Payment',
    component: () => import('../pages/Payment.vue')
  },
  {
    path: '/products',
    name: 'Products',
    component: () => import('../pages/ProductsPage.vue'),
    children: [
      {
        path: '/products/headphone',
        name: 'HeadPhone',
        component: () => import('../pages/products/HeadPhone.vue')
      },
      {
        path: '/products/speaker',
        name: 'SoundBar',
        component: () => import('../pages/products/Speaker.vue')
      },
      {
        path: '/products/tv',
        name: 'TV',
        component: () => import('../pages/products/TV.vue')
      },
      {
        path: ':productId',
        name: 'ProductId',
        component: () => import('../pages/products/ProductMore.vue')
      }
    ]
  },
  {
    path: '/backstage',
    name: 'backstage',
    component: () => import('../pages/backstage/LoginPage.vue'),
  },
  {
    path: '/dashboard',
    name: 'DashBoard',
    component: () => import('../pages/backstage/Dashboard.vue'),
    children: [
      {
        path: '',
        name: 'DashboardHome',
        component: () => import('../pages/backstage/DashboardHome.vue')
      },
      {
        path: 'products',
        name: 'BackstageProducts',
        component: () => import('../pages/backstage/ProductPage.vue')
      },
      {
        path: 'coupons',
        name: 'Coupons',
        component: () => import('../pages/backstage/Coupons.vue')
      },
      {
        path: 'orders',
        name: 'Orders',
        component: () => import('../pages/backstage/Orders.vue')
      },
    ]
  }
]

const router = createRouter({
  history: createWebHashHistory('/ProjectZ/'),
  routes
})

// 路由守衛：檢查是否需要登入
router.beforeEach((to, from, next) => {
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth)
  
  if (requiresAuth) {
    // 檢查 localStorage 或 sessionStorage 中是否有登入資訊
    const memberUser = localStorage.getItem('memberUser') || sessionStorage.getItem('memberUser')
    const memberToken = localStorage.getItem('memberToken') || sessionStorage.getItem('memberToken')
    
    if (memberUser && memberToken) {
      next()
    } else {
      // 未登入，重定向到登入頁
      next({ name: 'Login', query: { redirect: to.fullPath } })
    }
  } else {
    next()
  }
})

export default router
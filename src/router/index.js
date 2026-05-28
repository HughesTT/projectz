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
    meta: { 
      requiresAuth: true,
      breadcrumb: [{ name: '會員中心', path: '/member' }]
    },
    redirect: '/member/profile',
    children: [
      {
        path: 'profile',
        name: 'MemberProfile',
        component: () => import('../pages/member/ProfilePage.vue'),
        meta: { 
          requiresAuth: true,
          breadcrumb: [
            { name: '會員中心', path: '/member' },
            { name: '會員資料', path: null }
          ]
        }
      },
      {
        path: 'orders',
        name: 'MemberOrders',
        component: () => import('../pages/member/OrdersPage.vue'),
        meta: { 
          requiresAuth: true,
          breadcrumb: [
            { name: '會員中心', path: '/member' },
            { name: '訂單記錄', path: null }
          ]
        }
      },
      {
        path: 'favorites',
        name: 'MemberFavorite',
        component: () => import('../pages/member/FavoritePage.vue'),
        meta: {
          breadcrumb: [
            { name: '會員中心', path: '/member' },
            { name: '追蹤清單', path: null }
          ]
        }
      },
      {
        path: 'cart',
        name: 'Cart',
        component: () => import('../pages/member/Cart.vue'),
        meta: {
          breadcrumb: [
            { name: '會員中心', path: '/member' },
            { name: '購物車', path: null }
          ]
        }
      },
    ],
  },
  {
    path: '/payment',
    name: 'Payment',
    component: () => import('../pages/Payment.vue'),
    meta: {
      breadcrumb: [{ name: '結帳', path: null }]
    }
  },
  {
    path: '/products',
    name: 'Products',
    component: () => import('../pages/ProductsPage.vue'),
    children: [
      {
        path: '/products/headphone',
        name: '耳機',
        component: () => import('../pages/products/HeadPhone.vue'),
        meta: {
          breadcrumb: [{ name: '耳機', path: null }]
        }
      },
      {
        path: '/products/speaker',
        name: '揚聲器',
        component: () => import('../pages/products/Speaker.vue'),
        meta: {
          breadcrumb: [{ name: '揚聲器', path: null }]
        }
      },
      {
        path: '/products/tv',
        name: '電視',
        component: () => import('../pages/products/TV.vue'),
        meta: {
          breadcrumb: [{ name: '電視', path: null }]
        }
      },
      {
        path: ':productId',
        name: 'ProductId',
        component: () => import('../pages/products/ProductMore.vue'),
        meta: {
          // 使用 breadcrumbBuilder 動態生成麵包屑
          breadcrumbBuilder: async (route, productStore) => {
            // 確認產品資料是否載入
            if (productStore.allProducts.length === 0) {
              await productStore.getAllProducts()
            }

            const product = productStore.allProducts.find(
              p => p.id === route.params.productId
            )

            if (!product) {
              return [{ name: '產品詳情', path: null }]
            }

            // 根據產品的 unit 或 category 決定分類
            const categoryMap = {
              'headphone': { name: '耳機', path: '/products/headphone' },
              'speaker': { name: '揚聲器', path: '/products/speaker' },
              'tv': { name: '電視', path: '/products/tv' }
            }

            const unit = product.unit?.toLowerCase()
            const category = categoryMap[unit] || { name: '產品', path: '/products/headphone' }

            return [
              { name: category.name, path: category.path },
              { name: product.title, path: null }
            ]
          }
        }
      },
      {
        path: '/result',
        name: '商品搜尋',
        component: () => import('../pages/SearchPage.vue'),
        meta: {
          breadcrumb: [{ name: '搜尋結果', path: null }]
        }
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
        path: 'products/:category',
        name: 'BackstageProductsByCategory',
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
  },
  {
    path: '/:pathMatch(.*)*',
    name: '404Page',
    component: () => import('../pages/404Page.vue'),
  },
]

const router = createRouter({
  history: createWebHashHistory('/ProjectZ/'),
  routes,
  scrollBehavior(to, from, savedPosition) {
    // 如果有保存的位置（例如使用瀏覽器的前進/後退按鈕）
    if (savedPosition) {
      return savedPosition
    }
    // 如果有 hash（錨點連結）
    if (to.hash) {
      return {
        el: to.hash,
        behavior: 'smooth'
      }
    }
    
    // 針對產品詳細頁面，返回 null 讓元件自行處理畫面捲動
    // 確保在資料載入完成後才捲動，避免被中斷
    if (to.name === 'ProductId') {
      return null
    }
    
    // 預設情況：滾動到頂部
    return { top: 0, behavior: 'auto' }
  }
})

// 路由檢查是否需要登入
router.beforeEach((to, from) => {
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth)
  
  if (requiresAuth) {
    // 檢查 localStorage 或 sessionStorage 中是否有登入資訊
    const memberUser = localStorage.getItem('memberUser') || sessionStorage.getItem('memberUser')
    const memberToken = localStorage.getItem('memberToken') || sessionStorage.getItem('memberToken')
    
    if (memberUser && memberToken) {
      return true // 允許訪問
    } else {
      // 未登入，導向到登入頁
      return { name: 'Login', query: { redirect: to.fullPath } }
    }
  }
  
  return true // 不需要驗證，允許訪問
})

export default router
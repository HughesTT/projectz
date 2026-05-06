/**
 * 路由配置文件
 * 集中管理產品分類和導向配置
 */

// 產品分類配置（用於導向）
export const productCategories = [
  { 
    name: '耳機', 
    link: '/products/headphone',
    unit: 'headphone'
  },
  { 
    name: '揚聲器', 
    link: '/products/speaker',
    unit: 'speaker'
  },
  { 
    name: '電視', 
    link: '/products/tv',
    unit: 'tv'
  },
]

// 會員中心頁面
export const memberPages = {
  'MemberProfile': {
    name: '會員資料',
    icon: 'bi-person',
    path: '/member/profile'
  },
  'MemberOrders': {
    name: '訂單記錄',
    icon: 'bi-receipt',
    path: '/member/orders'
  },
  'MemberFavorite': {
    name: '追蹤清單',
    icon: 'bi-heart',
    path: '/member/favorites'
  },
  'Cart': {
    name: '購物車',
    icon: 'bi-cart',
    path: '/member/cart'
  }
}

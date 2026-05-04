/**
 * 路由配置文件
 * 未來新增產品分類或會員頁面，只需在這裡添加配置即可
 */

// 產品分類配置
export const productCategories = {
  // 產品 unit 類型（主要分類）
  units: {
    'headphone': {
      name: '耳機',
      path: '/products/headphone',
      icon: 'bi-headphones'
    },
    'speaker': {
      name: '揚聲器',
      path: '/products/speaker',
      icon: 'bi-speaker'
    },
    'tv': {
      name: '電視',
      path: '/products/tv',
      icon: 'bi-tv'
    }
  },

  // 產品 category 子分類（用於麵包屑和篩選）
  subCategories: {
    'bluetooth': {
      name: '藍牙耳機',
      parentUnit: 'headphone',
      icon: 'bi-bluetooth'
    },
    'noise-canceling': {
      name: '降噪耳機',
      parentUnit: 'headphone',
      icon: 'bi-headphones'
    },
    'gaming': {
      name: '電競耳機',
      parentUnit: 'headphone',
      icon: 'bi-controller'
    },
    'soundbar': {
      name: 'Soundbar',
      parentUnit: 'speaker',
      icon: 'bi-soundwave'
    }
  }
}

// 會員中心頁面配置
export const memberPages = {
  'MemberProfile': {
    name: '個人資料',
    icon: 'bi-person',
    order: 1
  },
  'MemberOrders': {
    name: '訂單記錄',
    icon: 'bi-receipt',
    order: 2
  },
  'MemberFavorite': {
    name: '我的最愛',
    icon: 'bi-heart',
    order: 3
  },
  'Cart': {
    name: '購物車',
    icon: 'bi-cart',
    order: 4
  }
}

// 其他特殊頁面配置
export const specialPages = {
  'Payment': {
    name: '結帳',
    parent: null
  },
  'Login': {
    name: '登入',
    parent: null
  },
  'Register': {
    name: '註冊',
    parent: null
  }
}

/**
 * 根據產品資料獲取分類信息
 * @param {Object} product - 產品物件
 * @returns {Object} - { name: '分類名稱', path: '分類路徑' }
 */
export function getCategoryInfoFromProduct(product) {
  if (!product) return null

  // 1. 優先檢查 category（子分類）
  const category = product.category?.toLowerCase()
  if (category && productCategories.subCategories[category]) {
    const subCat = productCategories.subCategories[category]
    const parentUnit = productCategories.units[subCat.parentUnit]
    return {
      name: subCat.name,
      path: parentUnit.path
    }
  }

  // 2. 檢查 unit（主分類）
  const unit = product.unit?.toLowerCase()
  if (unit && productCategories.units[unit]) {
    return {
      name: productCategories.units[unit].name,
      path: productCategories.units[unit].path
    }
  }

  // 3. Fallback：返回耳機分類
  return {
    name: '產品',
    path: '/products/headphone'
  }
}

/**
 * 獲取會員頁面信息
 * @param {String} routeName - 路由名稱
 * @returns {Object|null}
 */
export function getMemberPageInfo(routeName) {
  return memberPages[routeName] || null
}

/**
 * 檢查路由名稱是否為產品列表頁
 * @param {String} routeName - 路由名稱
 * @returns {Boolean}
 */
export function isProductListPage(routeName) {
  return Object.values(productCategories.units).some(unit => unit.name === routeName)
}

/**
 * 檢查路由名稱是否為會員中心頁面
 * @param {String} routeName - 路由名稱
 * @returns {Boolean}
 */
export function isMemberPage(routeName) {
  return routeName in memberPages
}

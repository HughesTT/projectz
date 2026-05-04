# 路由配置系統使用指南

## 📖 概述

這個配置化系統讓您可以在**不修改業務邏輯代碼**的情況下，輕鬆添加新的產品分類、會員頁面和麵包屑路徑。

所有配置集中在 `/src/config/routeConfig.js` 文件中。

---

## 🎯 如何添加新產品分類

### 情境 1：添加新的主要產品類型（如：智能手錶）

**步驟 1：在 `routeConfig.js` 的 `units` 中添加配置**

```js
export const productCategories = {
  units: {
    'headphone': { name: '耳機', path: '/products/headphone', icon: 'bi-headphones' },
    'speaker': { name: '揚聲器', path: '/products/speaker', icon: 'bi-speaker' },
    'tv': { name: '電視', path: '/products/tv', icon: 'bi-tv' },
    // ✨ 新增
    'watch': {
      name: '智能手錶',
      path: '/products/watch',
      icon: 'bi-smartwatch'
    }
  },
  // ...
}
```

**步驟 2：在 `router/index.js` 添加路由**

```js
{
  path: '/products/watch',
  name: '智能手錶',  // 名稱要與 units 中的 name 一致
  component: () => import('../pages/products/Watch.vue')
}
```

**步驟 3：創建頁面組件 `/pages/products/Watch.vue`**

複製現有的 `HeadPhone.vue` 並修改：
```js
onMounted(async () => {
  selectedCategory.value = 'all'
  selectedUnit.value = 'watch'  // 設置為新的 unit
  await productStore.getAllProducts()
  getFavorite()
})
```

**完成！** 麵包屑會自動顯示：`首頁 > 智能手錶`

---

### 情境 2：添加產品子分類（如：運動耳機）

**只需在 `routeConfig.js` 的 `subCategories` 中添加**

```js
export const productCategories = {
  // ...
  subCategories: {
    'bluetooth': { name: '藍牙耳機', parentUnit: 'headphone', icon: 'bi-bluetooth' },
    // ✨ 新增
    'sport': {
      name: '運動耳機',
      parentUnit: 'headphone',
      icon: 'bi-activity'
    }
  }
}
```

**完成！** 當產品的 `category` 欄位為 `'sport'` 時，麵包屑會自動顯示：`首頁 > 運動耳機 > 產品名稱`

---

## 👤 如何添加會員中心新頁面

### 情境：添加「優惠券」頁面

**步驟 1：在 `routeConfig.js` 的 `memberPages` 中添加**

```js
export const memberPages = {
  'MemberProfile': { name: '個人資料', icon: 'bi-person', order: 1 },
  // ✨ 新增
  'MemberCoupons': {
    name: '優惠券',
    icon: 'bi-ticket-perforated',
    order: 5
  }
}
```

**步驟 2：在 `router/index.js` 添加子路由**

```js
{
  path: '/member',
  name: 'Member',
  children: [
    // ...
    {
      path: 'coupons',
      name: 'MemberCoupons',  // 名稱要與 memberPages 的 key 一致
      component: () => import('../pages/member/CouponsPage.vue')
    }
  ]
}
```

**完成！** 麵包屑會自動顯示：`首頁 > 會員中心 > 優惠券`

---

## 🔧 進階：使用路由 Meta 自定義麵包屑

如果需要更複雜的麵包屑邏輯，可以在路由配置中直接定義：

```js
{
  path: '/special-offer',
  name: 'SpecialOffer',
  component: () => import('../pages/SpecialOffer.vue'),
  meta: {
    breadcrumb: [
      { name: '優惠活動', path: '/promotions' },
      { name: '限時特惠', path: null }
    ]
  }
}
```

麵包屑組件會優先使用 `meta.breadcrumb` 配置。

---

## 📋 配置項說明

### productCategories.units（主要產品類型）

| 欄位 | 類型 | 說明 | 範例 |
|------|------|------|------|
| key | String | 產品的 `unit` 欄位值 | `'headphone'` |
| name | String | 顯示名稱 | `'耳機'` |
| path | String | 路由路徑 | `'/products/headphone'` |
| icon | String | Bootstrap Icon 類名 | `'bi-headphones'` |

### productCategories.subCategories（產品子分類）

| 欄位 | 類型 | 說明 | 範例 |
|------|------|------|------|
| key | String | 產品的 `category` 欄位值 | `'bluetooth'` |
| name | String | 顯示名稱 | `'藍牙耳機'` |
| parentUnit | String | 所屬主分類的 key | `'headphone'` |
| icon | String | Bootstrap Icon 類名 | `'bi-bluetooth'` |

### memberPages（會員中心頁面）

| 欄位 | 類型 | 說明 | 範例 |
|------|------|------|------|
| key | String | 路由 name | `'MemberProfile'` |
| name | String | 顯示名稱 | `'個人資料'` |
| icon | String | Bootstrap Icon 類名 | `'bi-person'` |
| order | Number | 排序順序 | `1` |

---

## ✅ 優勢總結

### ✨ 之前的做法
- ❌ 添加新分類需要修改多個檔案
- ❌ 邏輯散落在 Breadcrum.vue 和產品頁面
- ❌ 硬編碼的 if-else 判斷
- ❌ 難以維護和擴展

### 🎯 現在的做法
- ✅ **單一配置文件**：只需修改 `routeConfig.js`
- ✅ **自動生成**：麵包屑自動根據配置生成
- ✅ **類型安全**：輔助函數統一處理邏輯
- ✅ **易於測試**：配置和邏輯分離
- ✅ **可擴展性**：支持 meta 自定義

---

## 🚀 快速檢查清單

添加新產品分類時：
- [ ] 在 `routeConfig.js` 添加配置
- [ ] 在 `router/index.js` 添加路由
- [ ] 創建對應的頁面組件
- [ ] 測試麵包屑顯示

添加會員頁面時：
- [ ] 在 `routeConfig.js` 的 `memberPages` 添加配置
- [ ] 在 `router/index.js` 的 `/member` 子路由中添加
- [ ] 創建對應的頁面組件
- [ ] 測試麵包屑顯示

**未來不需要修改任何業務邏輯代碼！** 🎉

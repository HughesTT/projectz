# 會員認證 Composable 使用指南

## 📁 檔案架構

```
src/
├── composable/
│   ├── useMemberAuth.js      # 會員認證 composable（新建）
│   ├── useAuth.js             # 後台管理認證（既有）
│   └── useToast.js            # Toast 通知（既有）
├── components/
│   ├── member/
│   │   ├── LoginForm.vue      # 登入表單組件（已更新）
│   │   └── RegisterForm.vue   # 註冊表單組件（已更新）
│   └── Navbar.vue             # 導覽列（已更新）
└── pages/
    ├── LoginPage.vue          # 登入頁面容器
    └── RegisterPage.vue       # 註冊頁面容器
```

## 🎯 為什麼使用 Composable？

### ✅ 優點

1. **邏輯重用** - 多個組件可以共享相同的認證邏輯
2. **關注點分離** - UI 組件專注於顯示，composable 處理業務
3. **統一狀態管理** - 登入狀態在整個應用中保持同步
4. **易於測試** - 可以獨立測試認證邏輯
5. **易於維護** - 認證相關的邏輯集中在一處

### ❌ 如果不使用 Composable

- 每個組件都要重複寫登入邏輯
- 登入狀態難以在組件間共享
- 修改認證邏輯需要改多個文件
- 測試困難且重複

## 🚀 快速開始

### 1. 在組件中使用 useMemberAuth

```vue
<script setup>
import { useMemberAuth } from '@/composable/useMemberAuth'

const { 
  login, 
  register, 
  logout, 
  isAuthenticated, 
  currentUser,
  isLoading 
} = useMemberAuth()

// 登入
const handleLogin = async () => {
  const result = await login({
    email: 'user@example.com',
    password: '12345678',
    rememberMe: true
  })
  
  if (result.success) {
    console.log('登入成功', result.user)
  }
}

// 註冊
const handleRegister = async () => {
  const result = await register({
    name: '王小明',
    email: 'user@example.com',
    phone: '0912345678',
    password: '12345678'
  })
  
  if (result.success) {
    console.log('註冊成功')
  }
}

// 登出
const handleLogout = async () => {
  await logout()
}
</script>
```

### 2. 檢查登入狀態

```vue
<template>
  <div v-if="isAuthenticated">
    歡迎回來，{{ currentUser?.name }}
  </div>
  <div v-else>
    請先登入
  </div>
</template>

<script setup>
import { useMemberAuth } from '@/composable/useMemberAuth'

const { isAuthenticated, currentUser } = useMemberAuth()
</script>
```

### 3. 在路由守衛中使用

```javascript
// router/index.js
import { useMemberAuth } from '@/composable/useMemberAuth'

router.beforeEach((to, from, next) => {
  const { checkAuth } = useMemberAuth()
  
  if (to.meta.requiresAuth && !checkAuth()) {
    next('/login')
  } else {
    next()
  }
})
```

## 📚 API 文件

### 狀態（State）

| 名稱 | 類型 | 說明 |
|------|------|------|
| `currentUser` | `ComputedRef<User \| null>` | 當前登入的使用者資訊 |
| `isAuthenticated` | `ComputedRef<boolean>` | 是否已登入 |
| `isLoading` | `ComputedRef<boolean>` | 是否正在處理請求 |
| `errorMessage` | `ComputedRef<string>` | 錯誤訊息 |

### 方法（Methods）

#### `login(credentials)`
會員登入

**參數：**
```typescript
{
  email: string
  password: string
  rememberMe?: boolean  // 是否記住登入狀態
}
```

**返回：**
```typescript
{
  success: boolean
  message: string
  user?: User
}
```

#### `register(userData)`
會員註冊

**參數：**
```typescript
{
  name: string
  email: string
  phone: string
  password: string
}
```

**返回：**
```typescript
{
  success: boolean
  message: string
  user?: User
}
```

#### `socialLogin(provider)`
社交媒體登入

**參數：**
- `provider: 'google' | 'facebook'`

**返回：**
```typescript
{
  success: boolean
  message: string
}
```

#### `logout()`
會員登出

**返回：**
```typescript
{
  success: boolean
  message: string
}
```

#### `updateUserProfile(userData)`
更新使用者資料

**參數：**
```typescript
{
  name?: string
  phone?: string
  // 其他可更新的欄位
}
```

#### `resetPassword(email)`
發送重設密碼信

**參數：**
- `email: string`

#### `checkAuth()`
檢查是否已登入

**返回：** `boolean`

## 🔧 實作步驟

### Step 1: 連接後端 API

在 `useMemberAuth.js` 中找到 TODO 標記，替換為實際的 API 端點：

```javascript
// 範例
const apiBase = import.meta.env.VITE_APP_API || '/api'
const api = `${apiBase}/member/login`  // 改成你的實際 API
```

### Step 2: 調整資料格式

根據後端 API 回傳的資料格式，調整：

```javascript
if (data.success) {
  saveAuth(data.user, data.token, credentials.rememberMe)
  // 根據實際回傳格式調整
}
```

### Step 3: 設定環境變數

在 `.env` 檔案中設定 API 基礎路徑：

```env
VITE_APP_API=http://localhost:3000/api
```

## 💾 資料儲存

### LocalStorage（記住我）
當用戶勾選「記住我」時：
- `memberUser` - 使用者資訊（JSON）
- `memberToken` - 認證 Token
- `memberRememberMe` - 記住狀態標記

### SessionStorage（不記住）
當用戶不勾選「記住我」時：
- 使用 sessionStorage 儲存，關閉瀏覽器後清除

## 🎨 已整合的組件

### 1. LoginForm.vue
- ✅ 使用 `useMemberAuth` 的 `login()` 方法
- ✅ 使用 `useMemberAuth` 的 `socialLogin()` 方法
- ✅ 整合 `useToast` 顯示訊息

### 2. RegisterForm.vue
- ✅ 使用 `useMemberAuth` 的 `register()` 方法
- ✅ 使用 `useMemberAuth` 的 `socialLogin()` 方法
- ✅ 整合密碼驗證邏輯
- ✅ 整合 `useToast` 顯示訊息

### 3. Navbar.vue
- ✅ 使用 `isAuthenticated` 顯示登入狀態
- ✅ 使用 `currentUser` 顯示使用者資訊
- ✅ 使用 `logout()` 處理登出

## 🔐 安全性考量

1. **Token 管理**
   - Token 應設定過期時間
   - 定期檢查 Token 有效性
   - 敏感操作前重新驗證

2. **密碼處理**
   - 前端不儲存明文密碼
   - 使用 HTTPS 傳輸
   - 後端進行加密處理

3. **XSS 防護**
   - 使用者輸入需要驗證
   - 避免直接渲染不信任的內容

## 📝 範例：完整登入流程

```vue
<template>
  <div class="login-page">
    <form @submit.prevent="handleLogin">
      <input v-model="email" type="email" required>
      <input v-model="password" type="password" required>
      <button type="submit" :disabled="isLoading">
        {{ isLoading ? '登入中...' : '登入' }}
      </button>
    </form>
    <p v-if="errorMessage">{{ errorMessage }}</p>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useMemberAuth } from '@/composable/useMemberAuth'

const router = useRouter()
const { login, isLoading, errorMessage } = useMemberAuth()

const email = ref('')
const password = ref('')

const handleLogin = async () => {
  const result = await login({
    email: email.value,
    password: password.value,
    rememberMe: true
  })
  
  if (result.success) {
    router.push('/member/profile')
  }
}
</script>
```

## 🐛 常見問題

### Q: 刷新頁面後登入狀態消失？
A: 檢查是否正確初始化 `initAuth()`，它會從 localStorage/sessionStorage 恢復狀態。

### Q: 多個組件使用 composable 會重複請求嗎？
A: 不會。composable 中的狀態是全域共享的（使用模組作用域的 ref）。

### Q: 如何在非組件中使用？
A: 可以直接 import 並呼叫，例如在 API 攔截器中。

## 🎓 進階應用

### 1. 自動刷新 Token

```javascript
// 在 useMemberAuth.js 中加入
const refreshToken = async () => {
  const token = localStorage.getItem('memberToken')
  const response = await fetch(`${apiBase}/member/refresh`, {
    headers: { 'Authorization': `Bearer ${token}` }
  })
  // 更新 token
}
```

### 2. 權限檢查

```javascript
const hasPermission = (permission) => {
  return currentUser.value?.permissions?.includes(permission)
}
```

### 3. 整合 Pinia Store（可選）

```javascript
import { defineStore } from 'pinia'
import { useMemberAuth } from '@/composable/useMemberAuth'

export const useAuthStore = defineStore('auth', () => {
  const auth = useMemberAuth()
  return { ...auth }
})
```

## 📌 總結

使用 Composable 是 Vue 3 的最佳實踐，它讓你的程式碼：
- ✅ 更容易重用
- ✅ 更容易測試
- ✅ 更容易維護
- ✅ 更符合現代 Vue 開發規範

現在你的認證系統已經完全模組化和可重用了！🎉

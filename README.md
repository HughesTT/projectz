# ProjectZ - 電商平台

使用 Vue 3 + Vite 開發的電商平台，提供耳機、揚聲器、電視等產品的線上購物體驗。

## 🌐 線上預覽

- **GitHub Pages**: https://hughestt.github.io/projectz/#/
- **Repository**: https://github.com/HughesTT/projectz

---

## ✨ 主要功能

### 前台功能
- **首頁**: 輪播廣告、熱銷商品展示
- **產品分類**: 耳機、揚聲器、電視分類瀏覽
- **產品搜尋**: 關鍵字搜尋功能
- **產品詳細頁**: 圖片展示、規格說明、相關產品推薦
- **購物車**: 商品數量調整、價格計算
- **收藏清單**: 追蹤喜愛的商品
- **會員系統**: 登入、註冊、個人資料管理
- **訂單管理**: 訂單查詢與狀態追蹤

### 後台管理
- **後台主頁面**: 數據統計與概覽
- **產品管理**: 新增、編輯、刪除產品
- **訂單管理**: 訂單狀態更新
- **優惠券管理**: 折扣碼設定

---

## 🛠️ 使用技術

### 核心框架
- **Vue 3**: Composition API
- **Vite**: 快速的開發建置工具
- **Vue Router**: 路由管理
- **Pinia**: 狀態管理

### UI/UX
- **SCSS**: 樣式預處理器
- **Bootstrap Icons**: icon圖庫
- **響應式設計**: 支援桌面、平板、手機

### 部署
- **GitHub Actions**: 自動化 CI/CD
- **GitHub Pages**: 靜態網站託管

---

## 📂 專案結構

```
projectz/
├── .github/
│   └── workflows/
│       └── deploy.yml         # GitHub Actions 工作流程
├── public/                    # 靜態資源
│   └── img/                   # 圖片資源
├── src/
│   ├── api/                   # API 請求
│   ├── assets/                # 資源文件
│   ├── components/            # Vue 元件
│   │   ├── backstage/         # 後台元件
│   │   └── ...                # 前台元件
│   ├── composable/            # 可組合函數
│   │   ├── useAuth.js         # 驗證邏輯
│   │   ├── useCart.js         # 購物車邏輯
│   │   ├── useCoupon.js       # 優惠券邏輯
│   │   └── useToast.js        # 提示訊息
│   ├── config/                # 配置文件
│   │   └── routeConfig.js     # 路由配置
│   ├── pages/                 # 頁面元件
│   │   ├── products/          # 產品相關頁面
│   │   ├── member/            # 會員相關頁面
│   │   └── backstage/         # 後台管理頁面
│   ├── router/                # 路由配置
│   │   └── index.js
│   ├── store/                 # Pinia 狀態管理
│   │   ├── productStore.js    # 產品狀態
│   │   ├── orderStore.js      # 訂單狀態
│   │   └── statusStore.js     # 全域狀態
│   ├── App.vue                # 根元件
│   ├── main.js                # 入口文件
│   └── style.css              # 全域樣式
├── deploy.ps1                 # 部署腳本
├── DEPLOYMENT.md              # 部署文件
├── vite.config.js             # Vite 配置
└── package.json               # 專案配置
```


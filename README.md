# ProjectZ - 電商平台 🎧

使用 Vue 3 + Vite 開發的電商平台，提供耳機、揚聲器、電視等產品的線上購物體驗。

## 🌐 線上預覽

- **GitHub Pages**: https://hughestt.github.io/projectz/#/
- **Repository**: https://github.com/HughesTT/projectz

---

## ✨ 主要功能

### 前台功能
- 🏠 **首頁**: 輪播廣告、熱銷商品展示
- 📦 **產品分類**: 耳機、揚聲器、電視分類瀏覽
- 🔍 **產品搜尋**: 關鍵字搜尋功能
- 📄 **產品詳細頁**: 圖片展示、規格說明、相關產品推薦
- 🛒 **購物車**: 商品數量調整、價格計算
- ❤️ **收藏清單**: 追蹤喜愛的商品
- 👤 **會員系統**: 登入、註冊、個人資料管理
- 📋 **訂單管理**: 訂單查詢與狀態追蹤

### 後台管理
- 📊 **後台主頁面**: 數據統計與概覽
- 🎁 **產品管理**: 新增、編輯、刪除產品
- 📝 **訂單管理**: 訂單狀態更新
- 🎫 **優惠券管理**: 折扣碼設定

---

## 🛠️ 使用技術

### 核心框架
- **Vue 3**: Composition API with `<script setup>`
- **Vite**: 快速的開發建置工具
- **Vue Router**: 路由管理
- **Pinia**: 狀態管理

### UI/UX
- **SCSS**: 樣式預處理器
- **Bootstrap Icons**: 圖標庫
- **響應式設計**: 支援桌面、平板、手機

### 部署
- **GitHub Actions**: 自動化 CI/CD
- **GitHub Pages**: 靜態網站託管

---

## 🚀 快速開始

### 環境需求
- Node.js 16+ 
- npm 或 yarn

### 安裝依賴
```bash
npm install
```

### 開發模式
```bash
npm run dev
```
開發伺服器將啟動在 `http://localhost:5173/`

### 建置專案
```bash
npm run build
```

### 預覽建置結果
```bash
npm run preview
```

---

## 📦 部署

本專案已設置自動部署到 GitHub Pages。

### 使用部署腳本（推薦）
```powershell
.\deploy.ps1
```

### 手動部署
```bash
git add -A
git commit -m "your message"
git push origin main
```

推送到 `main` 分支後，GitHub Actions 會自動建置並部署到 GitHub Pages。

詳細部署說明請參考 [DEPLOYMENT.md](./DEPLOYMENT.md)

---

## 📂 專案結構

```
projectz/
├── .github/
│   └── workflows/
│       └── deploy.yml          # GitHub Actions 工作流程
├── public/                     # 靜態資源
│   └── img/                   # 圖片資源
├── src/
│   ├── api/                   # API 請求
│   ├── assets/                # 資源文件
│   ├── components/            # Vue 元件
│   │   ├── backstage/         # 後台元件
│   │   └── ...               # 前台元件
│   ├── composable/            # 可組合函數
│   │   ├── useAuth.js        # 驗證邏輯
│   │   ├── useCart.js        # 購物車邏輯
│   │   ├── useCoupon.js      # 優惠券邏輯
│   │   └── useToast.js       # 提示訊息
│   ├── config/                # 配置文件
│   │   └── routeConfig.js    # 路由配置
│   ├── pages/                 # 頁面元件
│   │   ├── products/          # 產品相關頁面
│   │   ├── member/            # 會員相關頁面
│   │   └── backstage/         # 後台管理頁面
│   ├── router/                # 路由配置
│   │   └── index.js
│   ├── store/                 # Pinia 狀態管理
│   │   ├── productStore.js   # 產品狀態
│   │   ├── orderStore.js     # 訂單狀態
│   │   └── statusStore.js    # 全域狀態
│   ├── App.vue               # 根元件
│   ├── main.js               # 入口文件
│   └── style.css             # 全域樣式
├── deploy.ps1                # 部署腳本
├── DEPLOYMENT.md             # 部署文件
├── vite.config.js           # Vite 配置
└── package.json             # 專案配置
```

---

## 🎨 設計系統

### 色彩配置
- **主色**: `#7030a0` (紫色)
- **次要色**: `#a855f7` (淡紫色)
- **漸層**: `linear-gradient(135deg, #7030a0, #a855f7)`

### 響應式斷點
- 手機: `< 576px`
- 平板: `576px - 992px`
- 桌面: `> 992px`

---

## 📝 開發規範

### 提交訊息格式
```
feat: 新增功能
fix: 修復問題
style: 樣式調整
refactor: 重構代碼
docs: 文件更新
perf: 性能優化
```

### 程式碼風格
- 使用 Composition API
- 使用 `<script setup>` 語法
- SCSS 模組化樣式
- 響應式優先設計

---

## 📄 相關文件

- [部署指南](./DEPLOYMENT.md) - GitHub Pages 部署說明
- [重構指南](./REFACTORING_GUIDE.md) - 代碼重構文件
- [路由配置指南](./docs/ROUTE_CONFIG_GUIDE.md) - 路由配置說明

---

## 🤝 貢獻

歡迎提交 Issue 或 Pull Request！

---

## 📜 授權

MIT License

---

## 📞 聯絡方式

如有問題或建議，歡迎透過 GitHub Issues 聯繫。


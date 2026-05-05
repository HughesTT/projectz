# 專案部署指南

## 📦 部署到 GitHub Pages

本專案已設置自動部署到 GitHub Pages，使用 GitHub Actions 自動化工作流程。

### 🌐 線上網址
- **GitHub Pages**: https://huguestt.github.io/projectz/
- **GitHub Repository**: https://github.com/HughesTT/projectz

---

## 🚀 部署方式

### 方式一：自動部署（推薦）✨

只要推送代碼到 `main` 分支，GitHub Actions 會自動：
1. 安裝依賴 (`npm ci`)
2. 建置專案 (`npm run build`)
3. 部署到 GitHub Pages

```powershell
# 使用提供的部署腳本
.\deploy.ps1
```

### 方式二：手動部署

```powershell
# 1. 確保在 main 分支
git checkout main

# 2. 添加並提交更改
git add -A
git commit -m "Your commit message"

# 3. 推送到 GitHub
git push origin main

# 4. GitHub Actions 會自動建置和部署
```

---

## 🔧 配置說明

### Vite 配置
```javascript
// vite.config.js
export default defineConfig({
  base: '/projectz/', // GitHub Pages 部署路徑
})
```

### Router 配置
```javascript
// src/router/index.js
const router = createRouter({
  history: createWebHashHistory('/ProjectZ/'), // Hash 模式，無需伺服器配置
})
```

### GitHub Actions 工作流程
- 文件位置: `.github/workflows/deploy.yml`
- 觸發條件: 推送到 `main` 分支或手動觸發
- 自動執行: 安裝 → 建置 → 部署

---

## 📊 查看部署狀態

1. **Actions 頁面**: https://github.com/HughesTT/projectz/actions
   - 查看建置和部署歷史
   - 檢查是否有錯誤

2. **Settings → Pages**:
   - 確認 GitHub Pages 設置
   - 查看部署來源和狀態

---

## 🛠️ 本地測試

### 開發模式
```powershell
npm run dev
```
- 本地開發伺服器
- 熱重載功能
- 適合開發測試

### 預覽建置結果
```powershell
npm run build
npm run preview
```
- 預覽生產環境建置
- 確保部署前沒有問題

---

## 📝 提交規範建議

為了保持提交歷史清晰，建議使用以下格式：

```
feat: 新增功能
fix: 修復問題
style: 樣式調整
refactor: 代碼重構
docs: 文件更新
perf: 性能最佳化
test: 測試相關
chore: 其他雜項
```

範例：
```powershell
git commit -m "feat: 新增產品詳細頁面滾動最佳化"
git commit -m "fix: 修正行動裝置滾動問題"
```

---

## 🔍 常見問題

### 1. 部署後看不到更新？
- 檢查 GitHub Actions 是否成功執行
- 清除瀏覽器快取（Ctrl + Shift + R）
- 等待 1-2 分鐘讓 GitHub Pages 更新

### 2. 樣式或資源載入失敗？
- 確認 `vite.config.js` 的 `base` 設置正確
- 檢查資源路徑是否使用相對路徑

### 3. 路由不正常？
- 使用 Hash 模式 (`createWebHashHistory`) 適合 GitHub Pages
- 避免使用 History 模式，因為需要伺服器配置

---

## 📞 技術支援

如有問題，請查看：
- [Vite 部署文件](https://vitejs.dev/guide/static-deploy.html)
- [GitHub Pages 文件](https://docs.github.com/en/pages)
- [GitHub Actions 文件](https://docs.github.com/en/actions)

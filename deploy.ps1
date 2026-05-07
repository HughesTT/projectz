# 自動部署腳本 - 部署到 GitHub Pages
# 使用方式: .\deploy.ps1

Write-Host "🚀 開始部署到 GitHub..." -ForegroundColor Cyan

# 1. 確保在 main 分支上
Write-Host "`n📌 切換到 main 分支..." -ForegroundColor Yellow
git checkout main

# 2. 添加所有更改
Write-Host "`n📦 增加所有變更..." -ForegroundColor Yellow
git add -A

# 3. 提交變更
$commitMessage = Read-Host "`n💬 請輸入提交訊息 (直接按 Enter 使用預設訊息)"
if ([string]::IsNullOrWhiteSpace($commitMessage)) {
    $commitMessage = "Update: $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')"
}

Write-Host "`n💾 提交更改: $commitMessage" -ForegroundColor Yellow
git commit -m $commitMessage

# 4. 推送到 GitHub
Write-Host "`n⬆️  推送到 GitHub..." -ForegroundColor Yellow
git push origin main

# 5. 建立專案
Write-Host "`n🔨 建立專案..." -ForegroundColor Yellow
npm run build

if ($LASTEXITCODE -eq 0) {
    Write-Host "`n✅ 建立成功！" -ForegroundColor Green
    Write-Host "`n🎉 部署完成！GitHub Actions 將自動部署到 GitHub Pages" -ForegroundColor Green
    Write-Host "📍 請前往查看: https://huguestt.github.io/projectz/" -ForegroundColor Cyan
    Write-Host "📊 查看部署狀態: https://github.com/HughesTT/projectz/actions" -ForegroundColor Cyan
} else {
    Write-Host "`n❌ 建立失敗！請檢查錯誤訊息" -ForegroundColor Red
    exit 1
}

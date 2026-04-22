<template>
  <div class="dashboard-menu">
    <!-- 使用者資訊卡片 -->
    <div class="user-card">
      <div class="user-avatar">
        <i class="bi bi-person-circle"></i>
      </div>
      <div class="user-info">
        <div class="user-name">{{ user.username || '訪客' }}</div>
        <div class="user-role">管理員</div>
      </div>
      <button class="btn-logout" @click="handleLogout" title="登出">
        <i class="bi bi-box-arrow-right"></i>
      </button>
    </div>

    <!-- 導覽選單 -->
    <nav class="nav-menu">
      <div class="menu-section">
        <div class="section-title">總覽</div>
        <router-link to="/dashboard" class="nav-link nav-link-home">
          <i class="bi bi-grid-fill"></i>
          <span>管理系統首頁</span>
        </router-link>
      </div>

      <div class="menu-section">
        <div class="section-title">管理功能</div>
        <router-link to="/dashboard/products" class="nav-link">
          <i class="bi bi-box-seam"></i>
          <span>商品管理</span>
        </router-link>
        <router-link to="/dashboard/orders" class="nav-link">
          <i class="bi bi-cart-check"></i>
          <span>訂單管理</span>
        </router-link>
        <router-link to="/dashboard/coupons" class="nav-link">
          <i class="bi bi-ticket-perforated"></i>
          <span>優惠券管理</span>
        </router-link>
      </div>

      <div class="menu-section">
        <div class="section-title">其他</div>
        <router-link to="/" class="nav-link" target="_blank">
          <i class="bi bi-house-door"></i>
          <span>前台頁面</span>
        </router-link>
      </div>
    </nav>
  </div>
</template>
<script setup>
import { useAuth } from '../../composable/useAuth'

const { user, logout } = useAuth()
const handleLogout = () => {
  logout()
}
</script>
<style lang="scss" scoped>
.dashboard-menu {
  height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  position: fixed;
  width: 250px;
  padding: 1.5rem 1rem;
  box-shadow: 4px 0 20px rgba(0, 0, 0, 0.1);
  overflow-y: auto;
}

/* 使用者資訊 Card */
.user-card {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-radius: 12px;
  padding: 1rem;
  margin-bottom: 2rem;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.user-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15);
}

.user-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.user-avatar i {
  font-size: 24px;
  color: white;
}

.user-info {
  flex: 1;
  min-width: 0;
}

.user-name {
  font-size: 0.9rem;
  font-weight: 600;
  color: #2d3748;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.user-role {
  font-size: 0.75rem;
  color: #718096;
  margin-top: 2px;
}

.btn-logout {
  background: #f7fafc;
  border: none;
  width: 32px;
  height: 32px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
  flex-shrink: 0;
}

.btn-logout:hover {
  background: #edf2f7;
  transform: scale(1.1);
}

.btn-logout i {
  font-size: 16px;
  color: #e53e3e;
}

/* 導覽選單 */
.nav-menu {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.menu-section {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.section-title {
  font-size: 0.75rem;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.7);
  text-transform: uppercase;
  letter-spacing: 0.5px;
  padding: 0.5rem 1rem;
  margin-bottom: 0.25rem;
}

.nav-link {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 1rem;
  text-decoration: none;
  color: white;
  border-radius: 10px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  font-size: 0.95rem;
  font-weight: 500;
  position: relative;
  overflow: hidden;
}

.nav-link::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0;
  height: 100%;
  width: 3px;
  background: white;
  transform: scaleY(0);
  transition: transform 0.3s ease;
}

.nav-link i {
  font-size: 1.1rem;
  width: 20px;
  text-align: center;
  transition: transform 0.3s ease;
}

.nav-link span {
  flex: 1;
}

.nav-link:hover {
  background: rgba(255, 255, 255, 0.15);
  padding-left: 1.25rem;
}

.nav-link:hover i {
  transform: scale(1.15);
}

/* 首頁連結：完全符合時才增加提示效果 */
.nav-link-home.router-link-active:not(.router-link-exact-active) {
  background: transparent;
  box-shadow: none;
}

.nav-link-home.router-link-active:not(.router-link-exact-active)::before {
  transform: scaleY(0);
}

/* 選項啟動狀態（其他頁面） */
.nav-link.router-link-active {
  background: rgba(255, 255, 255, 0.25);
  backdrop-filter: blur(10px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.nav-link.router-link-active::before {
  transform: scaleY(1);
}

.nav-link.router-link-active i {
  transform: scale(1.1);
}

/* 自訂捲軸 */
.dashboard-menu::-webkit-scrollbar {
  width: 6px;
}

.dashboard-menu::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 10px;
}

.dashboard-menu::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.3);
  border-radius: 10px;
}

.dashboard-menu::-webkit-scrollbar-thumb:hover {
  background: rgba(255, 255, 255, 0.5);
}
</style>
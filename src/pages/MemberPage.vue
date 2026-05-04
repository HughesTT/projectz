<template>
  <Navbar />
  <Breadcrum />
  <div class="member-page">
    <div class="member-container">
      <!-- 側邊導航 -->
      <aside class="member-sidebar">
        <div class="member-info">
          <div class="member-avatar">
            <i class="bi bi-person-circle"></i>
          </div>
          <h3 class="member-name">{{ currentUser?.name || '會員' }}</h3>
          <p class="member-email">{{ currentUser?.email }}</p>
        </div>

        <nav class="member-nav">
          <router-link to="/member/profile" class="nav-item" active-class="active">
            <i class="bi bi-person"></i>
            <span>會員資料</span>
          </router-link>
          <router-link to="/member/orders" class="nav-item" active-class="active">
            <i class="bi bi-box-seam"></i>
            <span>訂單查詢</span>
          </router-link>
          <router-link to="/member/cart" class="nav-item" active-class="active">
            <i class="bi bi-cart3"></i>
            <span>購物車</span>
          </router-link>
          <router-link to="/member/favorites" class="nav-item" active-class="active">
            <i class="bi bi-heart"></i>
            <span>追蹤清單</span>
          </router-link>
        </nav>
      </aside>

      <!-- 內容區域 -->
      <main class="member-content">
        <router-view />
      </main>
    </div>
  </div>
  <Footer />
</template>

<script setup>
import Navbar from '../components/Navbar.vue'
import Footer from '../components/Footer.vue'
import Breadcrum from '../components/Breadcrum.vue';
import { useMemberAuth } from '../composable/useMemberAuth'

const { currentUser } = useMemberAuth()
</script>

<style lang="scss" scoped>
.member-page {
  min-height: calc(100vh - 200px);
  background: #f7fafc;
  padding: 2rem 0;
}

.member-container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 2rem;
  display: grid;
  grid-template-columns: 280px 1fr;
  gap: 2rem;

  @media (max-width: 992px) {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }
}

/* 側邊欄 */
.member-sidebar {
  background: white;
  border-radius: 16px;
  padding: 2rem;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
  height: fit-content;
  position: sticky;
  top: 100px;

  @media (max-width: 992px) {
    position: static;
  }
}

.member-info {
  text-align: center;
  padding-bottom: 1.5rem;
  border-bottom: 1px solid #e2e8f0;
  margin-bottom: 1.5rem;
}

.member-avatar {
  width: 80px;
  height: 80px;
  margin: 0 auto 1rem;
  border-radius: 50%;
  background: linear-gradient(135deg, #7030a0, #a855f7);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 3rem;
}

.member-name {
  font-size: 1.25rem;
  font-weight: 600;
  color: #2d3748;
  margin-bottom: 0.25rem;
}

.member-email {
  font-size: 0.9rem;
  color: #718096;
  word-break: break-all;
}

.member-nav {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;

  @media (max-width: 992px) {
    flex-direction: row;
    overflow-x: auto;
  }
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.875rem 1rem;
  border-radius: 12px;
  color: #4a5568;
  text-decoration: none;
  transition: all 0.3s ease;
  font-weight: 500;

  i {
    font-size: 1.2rem;
    width: 24px;
  }

  &:hover {
    background: rgba(112, 48, 160, 0.08);
    color: #7030a0;
  }

  &.active {
    background: linear-gradient(135deg, #7030a0, #a855f7);
    color: white;
  }

  @media (max-width: 992px) {
    white-space: nowrap;
  }
}

/* 內容區域 */
.member-content {
  background: white;
  border-radius: 16px;
  padding: 2rem;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
  min-height: 500px;

  @media (max-width: 768px) {
    padding: 1.5rem;
  }
}
</style>
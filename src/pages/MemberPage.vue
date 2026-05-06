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
  /* 防止水平滾動 */
  overflow-x: hidden;

  @media (max-width: 768px) {
    padding: 1.5rem 0;
  }

  @media (max-width: 576px) {
    padding: 1rem 0;
  }
}

.member-container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 2rem;
  display: grid;
  grid-template-columns: 280px 1fr;
  gap: 2rem;
  /* 防止內容溢出 */
  width: 100%;
  box-sizing: border-box;
  overflow-x: hidden;

  @media (max-width: 992px) {
    grid-template-columns: 1fr;
    gap: 1.5rem;
    padding: 0 1.5rem;
  }

  @media (max-width: 768px) {
    padding: 0 1rem;
    gap: 1rem;
  }

  @media (max-width: 576px) {
    padding: 0 0.75rem;
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
  /* 防止溢出 */
  width: 100%;
  max-width: 100%;
  box-sizing: border-box;
  overflow-x: hidden;
  overflow-wrap: break-word;

  @media (max-width: 992px) {
    position: static;
    padding: 1.5rem;
  }

  @media (max-width: 768px) {
    padding: 1.25rem;
    border-radius: 12px;
  }

  @media (max-width: 576px) {
    padding: 1rem;
  }
}

.member-info {
  text-align: center;
  padding-bottom: 1.5rem;
  border-bottom: 1px solid #e2e8f0;
  margin-bottom: 1.5rem;
  /* 防止溢出 */
  width: 100%;
  max-width: 100%;
  box-sizing: border-box;
  overflow-x: hidden;

  @media (max-width: 768px) {
    padding-bottom: 1.25rem;
    margin-bottom: 1.25rem;
  }

  @media (max-width: 576px) {
    padding-bottom: 1rem;
    margin-bottom: 1rem;
  }
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

  @media (max-width: 768px) {
    width: 70px;
    height: 70px;
    font-size: 2.5rem;
    margin-bottom: 0.875rem;
  }

  @media (max-width: 576px) {
    width: 60px;
    height: 60px;
    font-size: 2rem;
    margin-bottom: 0.75rem;
  }
}

.member-name {
  font-size: 1.25rem;
  font-weight: 600;
  color: #2d3748;
  margin-bottom: 0.25rem;
  width: 100%;
  max-width: 100%;
  box-sizing: border-box;
  overflow-wrap: break-word;
  word-break: break-word;

  @media (max-width: 768px) {
    font-size: 1.125rem;
  }

  @media (max-width: 576px) {
    font-size: 1rem;
  }
}

.member-email {
  font-size: 0.9rem;
  color: #718096;
  word-break: break-all;
  /* 防止郵箱過長導致溢出 */
  overflow-wrap: break-word;
  padding: 0 0.5rem;
  width: 100%;
  max-width: 100%;
  box-sizing: border-box;
  overflow: hidden;
  text-overflow: ellipsis;

  @media (max-width: 768px) {
    font-size: 0.875rem;
  }

  @media (max-width: 576px) {
    font-size: 0.8125rem;
    padding: 0 0.25rem;
  }
}

.member-nav {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  /* 防止溢出 */
  width: 100%;
  max-width: 100%;
  box-sizing: border-box;

  @media (max-width: 992px) {
    flex-direction: row;
    overflow-x: auto;
    overflow-y: hidden;
    -webkit-overflow-scrolling: touch;
    scrollbar-width: thin;
    /* 允許滾動但不超出容器 */
    max-width: 100%;

    /* 隱藏滾動條但保持功能 */
    &::-webkit-scrollbar {
      height: 4px;
    }

    &::-webkit-scrollbar-track {
      background: transparent;
    }

    &::-webkit-scrollbar-thumb {
      background: rgba(112, 48, 160, 0.2);
      border-radius: 4px;
    }
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
  /* 防止在小螢幕上被壓縮 */
  flex-shrink: 0;

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

  @media (max-width: 768px) {
    padding: 0.75rem 0.875rem;
    gap: 0.5rem;
    font-size: 0.9375rem;
  }

  @media (max-width: 576px) {
    padding: 0.625rem 0.75rem;
    font-size: 0.875rem;

    i {
      font-size: 1.1rem;
      width: 20px;
    }
  }
}

/* 內容區域 */
.member-content {
  background: white;
  border-radius: 16px;
  padding: 2rem;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
  min-height: 500px;
  /* 防止內容溢出 */
  width: 100%;
  max-width: 100%;
  box-sizing: border-box;
  overflow-x: hidden;
  word-wrap: break-word;
  overflow-wrap: break-word;

  @media (max-width: 992px) {
    padding: 1.75rem;
  }

  @media (max-width: 768px) {
    padding: 1.5rem;
    border-radius: 12px;
  }

  @media (max-width: 576px) {
    padding: 1rem;
    min-height: 400px;
  }
}
</style>
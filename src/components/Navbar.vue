<template>
  <nav class="modern-navbar">
    <div class="navbar-container">
      <!-- Logo -->
      <router-link to="/" class="navbar-logo">
        <img src="../../public/img/logo.2dcc836c.png" alt="Logo" class="logo-img">
      </router-link>

      <!-- 產品分類 (桌面版) -->
      <div class="navbar-links">
        <router-link v-for="item in productCategories" :key="item.name" :to="item.link" class="nav-link"
          active-class="active">
          <i :class="item.icon"></i>
          <span>{{ item.name }}</span>
        </router-link>
      </div>

      <!-- 右側功能區 -->
      <div class="navbar-actions">
        <!-- 搜尋欄 -->
        <div class="search-box" :class="{ active: isSearchActive }">
          <button class="search-toggle" @click="toggleSearch">
            <i class="bi bi-search"></i>
          </button>
          <input ref="searchInput" type="text" class="search-input" placeholder="搜尋商品..." v-model="searchQuery"
            @keyup.enter="handleSearch" @blur="handleSearchBlur">
        </div>

        <!-- 購物車 -->
        <router-link to="/member/cart" class="action-btn cart-btn">
          <i class="bi bi-cart3"></i>
          <span class="badge" v-if="cartItemCount > 0">{{ cartItemCount }}</span>
        </router-link>

        <!-- 會員功能 -->
        <div class="member-dropdown" v-if="isAuthenticated" @click.stop>
          <button class="action-btn member-btn" @click="toggleMemberMenu">
            <i class="bi bi-person-circle"></i>
            <span>{{ currentUser?.name || '會員' }}</span>
          </button>
          <!-- 使用 Teleport 將選單渲染到 body -->
          <Teleport to="body">
            <div v-if="showMemberMenu" class="member-dropdown-menu" @click.stop>
              <router-link to="/member/profile" class="dropdown-item" @click="closeMemberMenu">
                <i class="bi bi-person"></i>
                <span>會員資料</span>
              </router-link>
              <router-link to="/member/orders" class="dropdown-item" @click="closeMemberMenu">
                <i class="bi bi-box-seam"></i>
                <span>訂單查詢</span>
              </router-link>
              <div class="dropdown-divider"></div>
              <button class="dropdown-item logout" @click="handleLogout">
                <i class="bi bi-box-arrow-right"></i>
                <span>登出</span>
              </button>
            </div>
          </Teleport>
        </div>

        <!-- 未登入狀態 -->
        <router-link v-else to="/member/login" class="action-btn login-btn">
          <i class="bi bi-person"></i>
          <span class="login-text">登入</span>
        </router-link>

        <!-- 手機版選單按鈕 -->
        <button class="mobile-menu-btn" @click="toggleMobileMenu">
          <i class="bi" :class="showMobileMenu ? 'bi-x-lg' : 'bi-list'"></i>
        </button>
      </div>
    </div>

    <!-- 手機版選單 -->
    <transition name="slide">
      <div class="mobile-menu" v-show="showMobileMenu">
        <div class="mobile-menu-content">
          <!-- 產品分類 -->
          <div class="mobile-section">
            <h3 class="mobile-section-title">產品分類</h3>
            <router-link v-for="item in productCategories" :key="item.name" :to="item.link" class="mobile-link"
              @click="closeMobileMenu">
              <i :class="item.icon"></i>
              <span>{{ item.name }}</span>
            </router-link>
          </div>

          <!-- 會員功能 -->
          <div class="mobile-section" v-if="isAuthenticated">
            <h3 class="mobile-section-title">會員中心</h3>
            <router-link to="/member/profile" class="mobile-link" @click="closeMobileMenu">
              <i class="bi bi-person"></i>
              <span>會員資料</span>
            </router-link>
            <router-link to="/member/orders" class="mobile-link" @click="closeMobileMenu">
              <i class="bi bi-box-seam"></i>
              <span>訂單查詢</span>
            </router-link>
            <button class="mobile-link logout" @click="handleLogout">
              <i class="bi bi-box-arrow-right"></i>
              <span>登出</span>
            </button>
          </div>
        </div>
      </div>
    </transition>
  </nav>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useMemberAuth } from '../composable/useMemberAuth'
import { useCart } from '../composable/useCart'
import { useToast } from '../composable/useToast'

const router = useRouter()
const { currentUser, isAuthenticated, logout, checkAuth } = useMemberAuth()
const { showToast } = useToast()

// 產品分類
const productCategories = ref([
  { name: '耳機', link: '/products/headphone', icon: 'bi bi-headphones' },
  { name: '揚聲器', link: '/products/speaker', icon: 'bi bi-speaker' },
  { name: '電視', link: '/products/tv', icon: 'bi bi-tv' },
])

// 搜尋功能
const searchQuery = ref('')
const isSearchActive = ref(false)
const searchInput = ref(null)

const toggleSearch = () => {
  isSearchActive.value = !isSearchActive.value
  if (isSearchActive.value) {
    setTimeout(() => {
      searchInput.value?.focus()
    }, 100)
  }
}

const handleSearchBlur = () => {
  if (!searchQuery.value) {
    setTimeout(() => {
      isSearchActive.value = false
    }, 200)
  }
}

const handleSearch = () => {
  if (searchQuery.value.trim()) {
    router.push({ path: '/result', query: { search: searchQuery.value } })
    isSearchActive.value = false
  }
}

// 購物車
const { cartItemCount, getCart } = useCart()

// 初始化購物車
getCart()

// 會員功能
const showMemberMenu = ref(false)

const toggleMemberMenu = () => {
  showMemberMenu.value = !showMemberMenu.value
}

const closeMemberMenu = () => {
  showMemberMenu.value = false
}

const handleLogout = async () => {
  // 執行登出邏輯
  const result = await logout()
  if (result.success) {
    showToast('登出成功', 'success')
  }
  showMemberMenu.value = false
  closeMobileMenu()
}

// 手機版選單
const showMobileMenu = ref(false)

const toggleMobileMenu = () => {
  showMobileMenu.value = !showMobileMenu.value
}

const closeMobileMenu = () => {
  showMobileMenu.value = false
}

// 點擊外部關閉下拉選單
const handleClickOutside = (event) => {
  const memberDropdown = document.querySelector('.member-dropdown')
  const dropdownMenu = document.querySelector('.member-dropdown-menu')

  if (showMemberMenu.value) {
    // 如果點擊不在按鈕內也不在選單內，則關閉選單
    if (memberDropdown && !memberDropdown.contains(event.target) &&
      dropdownMenu && !dropdownMenu.contains(event.target)) {
      showMemberMenu.value = false
    }
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
  // 檢查登入狀態
  checkAuth()
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>

<style lang="scss" scoped>
.modern-navbar {
  background: #ffffff;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
  position: sticky;
  top: 0;
  z-index: 1000;
  backdrop-filter: blur(10px);
}

.navbar-container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0.75rem 2rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 2rem;
}

/* Logo */
.navbar-logo {
  display: flex;
  align-items: center;
  text-decoration: none;

  .logo-img {
    height: 50px;
    width: auto;
    transition: transform 0.3s ease;

    &:hover {
      transform: scale(1.05);
    }
  }
}

/* 產品分類連結 */
.navbar-links {
  display: flex;
  gap: 0.5rem;
  flex: 1;
  justify-content: center;

  @media (max-width: 992px) {
    display: none;
  }
}

.nav-link {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  color: #444;
  text-decoration: none;
  font-weight: 500;
  border-radius: 12px;
  transition: all 0.3s ease;
  position: relative;

  i {
    font-size: 1.2rem;
  }

  &::before {
    content: '';
    position: absolute;
    bottom: 0;
    left: 50%;
    transform: translateX(-50%);
    width: 0;
    height: 3px;
    background: linear-gradient(90deg, #7030a0, #a855f7);
    border-radius: 3px 3px 0 0;
    transition: width 0.3s ease;
  }

  &:hover {
    color: #7030a0;
    background: rgba(112, 48, 160, 0.05);

    &::before {
      width: 60%;
    }
  }

  &.active {
    color: #7030a0;
    background: rgba(112, 48, 160, 0.1);

    &::before {
      width: 60%;
    }
  }
}

/* 右側功能區 */
.navbar-actions {
  display: flex;
  align-items: center;
  gap: 0.75rem;

  .cart-btn {
    font-size: 1.2rem;
  }
}

/* 搜尋框 */
.search-box {
  position: relative;
  display: flex;
  align-items: center;

  .search-toggle {
    background: none;
    border: none;
    padding: 0.5rem 0.75rem;
    cursor: pointer;
    color: #444;
    font-size: 1.2rem;
    border-radius: 50%;
    transition: all 0.3s ease;
    z-index: 2;

    &:hover {
      color: #7030a0;
      background: rgba(112, 48, 160, 0.1);
    }
  }

  .search-input {
    position: absolute;
    right: 0;
    width: 0;
    padding: 0.75rem 3rem 0.75rem 1rem;
    border: 2px solid transparent;
    border-radius: 24px;
    background: #f5f5f5;
    font-size: 0.95rem;
    opacity: 0;
    transition: all 0.3s ease;
    pointer-events: none;

    &:focus {
      outline: none;
    }
  }

  &.active {
    .search-input {
      width: 280px;
      opacity: 1;
      pointer-events: auto;
      border-color: #7030a0;
    }
  }

  @media (max-width: 768px) {
    &.active .search-input {
      width: 200px;
    }
  }
}

/* 動作按鈕 */
.action-btn {
  position: relative;
  padding: 0.5rem 0.75rem;
  background: none;
  border: none;
  border-radius: 50%;
  cursor: pointer;
  color: #444;
  font-size: 1rem;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  text-decoration: none;

  &:hover {
    color: #ddd;
    background: rgba(112, 48, 160, 0.1);
  }

  .badge {
    position: absolute;
    top: 0;
    right: 0;
    background: linear-gradient(135deg, #ff6b6b, #ee5a6f);
    color: white;
    font-size: 0.7rem;
    font-weight: 600;
    padding: 0.15rem 0.4rem;
    border-radius: 10px;
    min-width: 18px;
    text-align: center;
  }
}

.login-btn {
  background: linear-gradient(135deg, #7030a0, #a855f7);
  color: white;
  padding: 0.2rem 0.7rem;
  border-radius: 24px;
  font-weight: 500;

  &:hover {
    background: linear-gradient(135deg, #5a2580, #8b3fd9);
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(112, 48, 160, 0.3);
  }

  .login-text {
    @media (max-width: 576px) {
      display: none;
    }
  }
}

/* 會員下拉選單 */
.member-dropdown {
  position: relative;
}

/* 手機版選單按鈕 */
.mobile-menu-btn {
  display: none;
  background: none;
  border: none;
  padding: 0.75rem;
  font-size: 1.5rem;
  color: #444;
  cursor: pointer;
  border-radius: 8px;
  transition: all 0.3s ease;

  &:hover {
    color: #7030a0;
    background: rgba(112, 48, 160, 0.1);
  }

  @media (max-width: 992px) {
    display: block;
  }
}

/* 手機版選單 */
.mobile-menu {
  background: white;
  border-top: 1px solid #e0e0e0;

  @media (min-width: 993px) {
    display: none !important;
  }
}

.mobile-menu-content {
  max-width: 1400px;
  margin: 0 auto;
  padding: 1.5rem 2rem;
  max-height: calc(100vh - 80px);
  overflow-y: auto;
}

.mobile-section {
  margin-bottom: 2rem;

  &:last-child {
    margin-bottom: 0;
  }
}

.mobile-section-title {
  font-size: 0.85rem;
  font-weight: 600;
  color: #999;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: 1rem;
}

.mobile-link {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  color: #444;
  text-decoration: none;
  border-radius: 12px;
  transition: all 0.3s ease;
  margin-bottom: 0.5rem;
  background: none;
  border: none;
  width: 100%;
  text-align: left;
  font-size: 1rem;
  cursor: pointer;

  i {
    font-size: 1.3rem;
    width: 24px;
    color: #7030a0;
  }

  &:hover {
    background: rgba(112, 48, 160, 0.08);
    color: #7030a0;
  }

  &.logout {
    color: #dc3545;

    i {
      color: #dc3545;
    }

    &:hover {
      background: rgba(220, 53, 69, 0.08);
    }
  }
}

/* 動畫 */
@keyframes fadeInDown {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.slide-enter-active,
.slide-leave-active {
  transition: all 0.3s ease;
}

.slide-enter-from {
  opacity: 0;
  transform: translateY(-20px);
}

.slide-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

/* 響應式調整 */
@media (max-width: 1200px) {
  .navbar-container {
    padding: 0.75rem 1.5rem;
  }
}

@media (max-width: 768px) {
  .navbar-container {
    padding: 0.75rem 1rem;
    gap: 0.5rem;
  }

  .navbar-logo .logo-img {
    height: 40px;
  }
}
</style>

<!-- 全局樣式：處理 Teleport 到 body 的選單 -->
<style lang="scss" scoped>
.member-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 0.75rem;
  background: none;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  color: #444;
  font-size: 1rem;
  transition: all 0.3s ease;

  &:hover {
    color: #7030a0;
    background: rgba(112, 48, 160, 0.1);
  }

  i {
    font-size: 1.2rem;
  }
}

.member-dropdown-menu {
  position: fixed;
  top: 60px;
  right: 20px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  min-width: 200px;
  overflow: hidden;
  z-index: 9999;
  animation: fadeInDown 0.3s ease;
}

.member-dropdown-menu .dropdown-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.875rem 1.25rem;
  color: #444;
  text-decoration: none;
  transition: all 0.2s ease;
  background: none;
  border: none;
  width: 100%;
  text-align: left;
  font-size: 0.95rem;
  cursor: pointer;
}

.member-dropdown-menu .dropdown-item i {
  font-size: 1.1rem;
  width: 20px;
}

.member-dropdown-menu .dropdown-item:hover {
  background: rgba(112, 48, 160, 0.08);
  color: #7030a0;
}

.member-dropdown-menu .dropdown-item.logout {
  color: #dc3545;
}

.member-dropdown-menu .dropdown-item.logout:hover {
  background: rgba(220, 53, 69, 0.08);
}

.member-dropdown-menu .dropdown-divider {
  height: 1px;
  background: #e0e0e0;
  margin: 0.5rem 0;
}
</style>
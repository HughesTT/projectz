<template>
  <div class="dashboard-home">
    <!-- 歡迎區塊 -->
    <div class="welcome-section">
      <div class="welcome-card">
        <div class="welcome-icon">
          <i class="bi bi-grid-fill"></i>
        </div>
        <h1 class="welcome-title">歡迎使用後台管理系統</h1>
        <p class="welcome-subtitle">請從左側選單選擇您要管理的項目</p>
      </div>
    </div>

    <!-- 快速導航卡片 -->
    <div class="quick-nav-section">
      <h2 class="section-title">
        <i class="bi bi-lightning-fill me-2"></i>
        快速導覽
      </h2>
      <div class="nav-cards">
        <router-link to="/dashboard/products" class="nav-card products">
          <div class="card-icon">
            <i class="bi bi-box-seam"></i>
          </div>
          <div class="card-content">
            <h3>產品管理</h3>
            <p>新增、編輯、刪除產品資訊</p>
          </div>
          <i class="bi bi-arrow-right card-arrow"></i>
        </router-link>

        <router-link to="/dashboard/coupons" class="nav-card coupons">
          <div class="card-icon">
            <i class="bi bi-ticket-perforated"></i>
          </div>
          <div class="card-content">
            <h3>優惠券管理</h3>
            <p>管理優惠券、折扣碼設定</p>
          </div>
          <i class="bi bi-arrow-right card-arrow"></i>
        </router-link>

        <router-link to="/dashboard/orders" class="nav-card orders">
          <div class="card-icon">
            <i class="bi bi-receipt"></i>
          </div>
          <div class="card-content">
            <h3>訂單管理</h3>
            <p>查看、處理客戶訂單</p>
          </div>
          <i class="bi bi-arrow-right card-arrow"></i>
        </router-link>
      </div>
    </div>

    <!-- 系統資訊（可選，未來可以擴展） -->
    <div class="system-info-section">
      <h2 class="section-title">
        <i class="bi bi-info-circle me-2"></i>
        系統資訊
      </h2>
      <div class="info-cards">
        <div class="info-card">
          <div class="info-icon">
            <i class="bi bi-calendar-check"></i>
          </div>
          <div class="info-content">
            <span class="info-label">今日日期</span>
            <span class="info-value">{{ currentDate }}</span>
          </div>
        </div>

        <div class="info-card">
          <div class="info-icon">
            <i class="bi bi-clock"></i>
          </div>
          <div class="info-content">
            <span class="info-label">現在時間</span>
            <span class="info-value">{{ currentTime }}</span>
          </div>
        </div>

        <div class="info-card">
          <div class="info-icon">
            <i class="bi bi-person-circle"></i>
          </div>
          <div class="info-content">
            <span class="info-label">登入者資訊</span>
            <span class="info-value">系統管理員</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const currentDate = ref('')
const currentTime = ref('')
let timeInterval = null

// 更新時間
const updateTime = () => {
  const now = new Date()
  currentDate.value = now.toLocaleDateString('zh-TW', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    weekday: 'long'
  })
  currentTime.value = now.toLocaleTimeString('zh-TW', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  })
}

onMounted(() => {
  updateTime()
  timeInterval = setInterval(updateTime, 1000)
})

onUnmounted(() => {
  if (timeInterval) {
    clearInterval(timeInterval)
  }
})
</script>

<style lang="scss" scoped>
.dashboard-home {
  max-width: 1400px;
  margin: 0 auto;
}

// 歡迎區塊
.welcome-section {
  margin-bottom: 2rem;

  .welcome-card {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    border-radius: 20px;
    padding: 1.5rem;
    text-align: center;
    color: white;
    box-shadow: 0 10px 30px rgba(102, 126, 234, 0.3);

    .welcome-icon {
      font-size: 4rem;
      margin-bottom: 1rem;
      opacity: 0.9;
    }

    .welcome-title {
      font-size: 2rem;
      font-weight: 700;
      margin-bottom: 1rem;
    }

    .welcome-subtitle {
      font-size: 1.1rem;
      opacity: 0.9;
      margin: 0;
    }
  }
}

// 區塊標題
.section-title {
  font-size: 1.5rem;
  font-weight: 600;
  color: #2d3748;
  margin-bottom: 1.5rem;
  display: flex;
  align-items: center;
}

// 快速導航區
.quick-nav-section {
  margin-bottom: 3rem;

  .nav-cards {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 1.5rem;
  }

  .nav-card {
    background: white;
    border-radius: 16px;
    padding: 2rem;
    display: flex;
    align-items: center;
    gap: 1.5rem;
    text-decoration: none;
    color: inherit;
    transition: all 0.3s ease;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
    border: 2px solid transparent;

    i {
      transition: all 0.3s ease;
    }

    &:hover {
      transform: translateY(-4px);
      box-shadow: 0 8px 20px rgba(0, 0, 0, 0.12);

      i {
        color: #fff;
      }
    }

    &.products {
      &:hover {
        border-color: #667eea;

        .card-icon {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        }
      }
    }

    &.coupons {
      &:hover {
        border-color: #f093fb;

        .card-icon {
          transition: all 0.3s ease;
          background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
        }
      }
    }

    &.orders {
      &:hover {
        border-color: #4facfe;

        .card-icon {
          transition: all 0.3s ease;
          background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
        }
      }
    }

    .card-icon {
      width: 60px;
      height: 60px;
      border-radius: 12px;
      background: #f7fafc;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.8rem;
      color: #667eea;
      transition: all 0.3s ease;
      flex-shrink: 0;
    }

    .card-content {
      flex: 1;

      h3 {
        font-size: 1.2rem;
        font-weight: 600;
        color: #2d3748;
        margin-bottom: 0.5rem;
      }

      p {
        font-size: 0.9rem;
        color: #718096;
        margin: 0;
      }
    }

    .card-arrow {
      font-size: 1.5rem;
      color: #cbd5e0;
      transition: all 0.3s ease;
    }

    &:hover .card-arrow {
      color: #667eea;
      transform: translateX(4px);
    }
  }
}

// 系統資訊區
.system-info-section {
  .info-cards {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 1.5rem;
  }

  .info-card {
    background: white;
    border-radius: 16px;
    padding: 1.5rem;
    display: flex;
    align-items: center;
    gap: 1rem;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);

    .info-icon {
      width: 50px;
      height: 50px;
      border-radius: 10px;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.5rem;
      flex-shrink: 0;
    }

    .info-content {
      display: flex;
      flex-direction: column;
      gap: 0.25rem;

      .info-label {
        font-size: 0.85rem;
        color: #718096;
      }

      .info-value {
        font-size: 1.1rem;
        font-weight: 600;
        color: #2d3748;
      }
    }
  }
}

// 響應式設計
@media (max-width: 768px) {
  .welcome-section {
    .welcome-card {
      padding: 2rem;

      .welcome-icon {
        font-size: 3rem;
      }

      .welcome-title {
        font-size: 1.5rem;
      }

      .welcome-subtitle {
        font-size: 1rem;
      }
    }
  }

  .nav-cards {
    grid-template-columns: 1fr !important;
  }

  .info-cards {
    grid-template-columns: 1fr !important;
  }
}
</style>

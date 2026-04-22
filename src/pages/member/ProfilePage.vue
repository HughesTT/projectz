<template>
  <div class="profile-page">
    <div class="page-header">
      <h1 class="page-title">
        <i class="bi bi-person"></i>
        會員資料
      </h1>
      <p class="page-subtitle">管理您的個人資訊</p>
    </div>

    <div class="profile-content">
      <div class="info-card">
        <h3 class="card-title">基本資料<span class="user-rank">{{ currentUser?.rank || '一般會員' }}</span></h3>
        <div class="info-grid">
          <div class="info-item">
            <label>姓名</label>
            <div class="info-value">{{ currentUser?.name || '未設定' }}</div>
          </div>
          <div class="info-item">
            <label>電子郵件</label>
            <div class="info-value">{{ currentUser?.email || '未設定' }}</div>
          </div>
          <div class="info-item">
            <label>電話</label>
            <div class="info-value">{{ currentUser?.phone || '未設定' }}</div>
          </div>
          <div class="info-item">
            <label>註冊日期</label>
            <div class="info-value">{{ formatDate(currentUser?.createdAt) }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useMemberAuth } from '../../composable/useMemberAuth'

const { currentUser } = useMemberAuth()

const formatDate = (dateString) => {
  if (!dateString) return '無資料'
  const date = new Date(dateString)
  return date.toLocaleDateString('zh-TW', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  })
}
</script>

<style lang="scss" scoped>
// CSS Variables
$primary-color: #7030a0;
$secondary-color: #a855f7;
$gradient-primary: linear-gradient(135deg, $primary-color, $secondary-color);

.profile-page {
  width: 100%;
}

.page-header {
  margin-bottom: 2rem;
  padding-bottom: 1.5rem;
  border-bottom: 2px solid #e2e8f0;
}

.page-title {
  font-size: 1.75rem;
  font-weight: 700;
  color: #2d3748;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin: 0 0 0.5rem 0;

  i {
    color: $primary-color;
  }
}

.page-subtitle {
  color: #718096;
  font-size: 0.95rem;
  margin: 0;
}

.profile-content {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.info-card {
  background: white;
  border-radius: 16px;
  padding: 2rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;

  &:hover {
    box-shadow: 0 4px 16px rgba(112, 48, 160, 0.1);
  }
}

.card-title {
  font-size: 1.25rem;
  font-weight: 700;
  color: #2d3748;
  margin: 0 0 1.5rem 0;
  padding-bottom: 1rem;
  border-bottom: 2px solid #f7fafc;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.user-rank {
  display: inline-flex;
  align-items: center;
  margin-left: auto;
  padding: 0.375rem 1rem;
  background: $gradient-primary;
  color: white;
  font-size: 0.875rem;
  font-weight: 600;
  border-radius: 20px;
  box-shadow: 0 2px 8px rgba(112, 48, 160, 0.25);
}

.info-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1.5rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
}

.info-item {
  label {
    display: block;
    font-size: 0.875rem;
    font-weight: 600;
    color: #718096;
    margin-bottom: 0.5rem;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }

  .info-value {
    font-size: 1rem;
    font-weight: 500;
    color: #2d3748;
    padding: 0.875rem 1rem;
    background: #f7fafc;
    border-radius: 8px;
    border: 2px solid #e2e8f0;
    transition: all 0.3s ease;

    &:hover {
      border-color: $primary-color;
      background: white;
    }
  }
}
</style>
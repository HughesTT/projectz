<template>
  <div class="register-form-wrapper">
    <div class="form-header">
      <h2 class="form-title">會員註冊</h2>
      <p class="form-subtitle">填寫資料加入會員</p>
    </div>

    <form @submit.prevent="handleSubmit" class="register-form">
      <!-- 姓名輸入 -->
      <div class="form-group">
        <label for="name" class="form-label">
          <i class="bi bi-person"></i>
          姓名
        </label>
        <input type="text" id="name" v-model="formData.name" class="form-input" placeholder="請輸入姓名" required>
      </div>

      <!-- 電子郵件輸入 -->
      <div class="form-group">
        <label for="email" class="form-label">
          <i class="bi bi-envelope"></i>
          電子郵件
        </label>
        <input type="email" id="email" v-model="formData.email" class="form-input" placeholder="請輸入電子郵件" required>
      </div>

      <!-- 手機號碼輸入 -->
      <div class="form-group">
        <label for="phone" class="form-label">
          <i class="bi bi-phone"></i>
          手機號碼
        </label>
        <input type="tel" id="phone" v-model="formData.phone" class="form-input" placeholder="請輸入手機號碼" required>
      </div>

      <!-- 密碼輸入 -->
      <div class="form-group">
        <label for="password" class="form-label">
          <i class="bi bi-lock"></i>
          密碼
        </label>
        <div class="password-input-wrapper">
          <input :type="showPassword ? 'text' : 'password'" id="password" v-model="formData.password" class="form-input"
            placeholder="請輸入密碼（至少 8 個字元）" required minlength="8">
          <button type="button" class="password-toggle" @click="showPassword = !showPassword">
            <i class="bi" :class="showPassword ? 'bi-eye-slash' : 'bi-eye'"></i>
          </button>
        </div>
      </div>

      <!-- 確認密碼輸入 -->
      <div class="form-group">
        <label for="confirmPassword" class="form-label">
          <i class="bi bi-lock-fill"></i>
          確認密碼
        </label>
        <div class="password-input-wrapper">
          <input :type="showConfirmPassword ? 'text' : 'password'" id="confirmPassword"
            v-model="formData.confirmPassword" class="form-input" placeholder="請再次輸入密碼" required>
          <button type="button" class="password-toggle" @click="showConfirmPassword = !showConfirmPassword">
            <i class="bi" :class="showConfirmPassword ? 'bi-eye-slash' : 'bi-eye'"></i>
          </button>
        </div>
        <span v-if="passwordMismatch" class="error-message">
          密碼不一致
        </span>
      </div>

      <!-- 同意條款 -->
      <label class="checkbox-label">
        <input type="checkbox" v-model="formData.agreeTerms" required>
        <span class="checkbox-custom"></span>
        <span class="checkbox-text">
          我同意
          <router-link class="link">服務條款</router-link>
          和
          <router-link class="link">隱私政策</router-link>
        </span>
      </label>

      <!-- 註冊按鈕 -->
      <button type="submit" class="submit-btn" :disabled="isLoading || passwordMismatch || !formData.agreeTerms">
        <span v-if="!isLoading">註冊</span>
        <span v-else class="loading-spinner">
          <i class="bi bi-arrow-repeat spin"></i>
          註冊中...
        </span>
      </button>

      <!-- 分隔線 -->
      <div class="divider">
        <span>或</span>
      </div>

      <!-- 社交媒體註冊 -->
      <div class="social-login">
        <button type="button" class="social-btn google">
          <i class="bi bi-google"></i>
          <span>Google 註冊</span>
        </button>
        <button type="button" class="social-btn facebook">
          <i class="bi bi-facebook"></i>
          <span>Facebook 註冊</span>
        </button>
      </div>

      <!-- 登入連結 -->
      <div class="login-link">
        已有帳號？
        <router-link to="/member/login">立即登入</router-link>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

// 表單資料
const formData = ref({
  name: '',
  email: '',
  phone: '',
  password: '',
  confirmPassword: '',
  agreeTerms: false
})

// UI 狀態
const showPassword = ref(false)
const showConfirmPassword = ref(false)
const isLoading = ref(false)

// 密碼驗證
const passwordMismatch = computed(() => {
  return formData.value.confirmPassword &&
    formData.value.password !== formData.value.confirmPassword
})

// 表單提交處理
const handleSubmit = async () => {
  if (passwordMismatch.value) {
    return
  }

  isLoading.value = true

  try {
    // TODO: 實作註冊邏輯
    // 例如：await register(formData.value)
    console.log('註冊表單提交', formData.value)

    // 註冊成功後導向
    // router.push('/login')
  } catch (error) {
    console.error('註冊失敗', error)
    // TODO: 顯示錯誤訊息
  } finally {
    isLoading.value = false
  }
}

// 社交媒體註冊
const handleSocialRegister = async (provider) => {
  try {
    // TODO: 實作社交媒體註冊邏輯
    console.log('社交媒體註冊:', provider)
  } catch (error) {
    console.error('社交註冊失敗', error)
  }
}
</script>

<style lang="scss" scoped>
.register-form-wrapper {
  width: 100%;
}

.form-header {
  text-align: center;
  margin-bottom: 2.5rem;
}

.form-title {
  font-size: 2rem;
  font-weight: 700;
  color: #2d3748;
  margin-bottom: 0.5rem;
}

.form-subtitle {
  color: #718096;
  font-size: 1rem;
}

/* 表單樣式 */
.register-form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 600;
  color: #4a5568;
  font-size: 0.95rem;

  i {
    color: #7030a0;
  }
}

.form-input {
  width: 100%;
  padding: 0.875rem 1rem;
  border: 2px solid #e2e8f0;
  border-radius: 12px;
  font-size: 1rem;
  transition: all 0.1s ease;
  background: #f7fafc;

  &:focus {
    outline: none;
    border-color: #7030a0;
    background: white;
    box-shadow: 0 0 0 4px rgba(112, 48, 160, 0.1);
  }

  &::placeholder {
    color: #a0aec0;
  }
}

.password-input-wrapper {
  position: relative;

  .form-input {
    padding-right: 3rem;
  }

  .password-toggle {
    position: absolute;
    right: 0.75rem;
    top: 50%;
    transform: translateY(-50%);
    background: none;
    border: none;
    color: #718096;
    font-size: 1.2rem;
    cursor: pointer;
    padding: 0.5rem;
    border-radius: 8px;
    transition: all 0.3s ease;

    &:hover {
      color: #7030a0;
      background: rgba(112, 48, 160, 0.1);
    }
  }
}

.error-message {
  color: #e53e3e;
  font-size: 0.875rem;
  margin-top: -0.25rem;
}

/* 核取方塊 */
.checkbox-label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  user-select: none;
  margin-top: 0.5rem;

  input[type="checkbox"] {
    display: none;
  }

  .checkbox-custom {
    width: 20px;
    height: 20px;
    min-width: 20px;
    border: 2px solid #cbd5e0;
    border-radius: 6px;
    position: relative;
    transition: all 0.3s ease;

    &::after {
      content: '';
      position: absolute;
      top: 2px;
      left: 6px;
      width: 5px;
      height: 10px;
      border: solid white;
      border-width: 0 2px 2px 0;
      transform: rotate(45deg);
      opacity: 0;
      transition: opacity 0.3s ease;
    }
  }

  input[type="checkbox"]:checked+.checkbox-custom {
    background: #7030a0;
    border-color: #7030a0;

    &::after {
      opacity: 1;
    }
  }

  .checkbox-text {
    font-size: 0.9rem;
    color: #4a5568;

    .link {
      color: #7030a0;
      text-decoration: none;
      font-weight: 500;

      &:hover {
        text-decoration: underline;
      }
    }
  }
}

/* 註冊按鈕 */
.submit-btn {
  width: 100%;
  padding: 1rem;
  background: linear-gradient(135deg, #7030a0, #a855f7);
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-top: 0.5rem;

  &:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 8px 20px rgba(112, 48, 160, 0.3);
  }

  &:active:not(:disabled) {
    transform: translateY(0);
  }

  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }
}

.loading-spinner {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;

  i {
    font-size: 1.2rem;
  }
}

/* 分隔線 */
.divider {
  display: flex;
  align-items: center;
  text-align: center;
  color: #a0aec0;
  margin: 1rem 0;

  &::before,
  &::after {
    content: '';
    flex: 1;
    border-bottom: 1px solid #e2e8f0;
  }

  span {
    padding: 0 1rem;
    font-size: 0.9rem;
  }
}

/* 社交媒體註冊 */
.social-login {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;

  @media (max-width: 480px) {
    grid-template-columns: 1fr;
  }
}

.social-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.875rem 1rem;
  border: 2px solid #e2e8f0;
  border-radius: 12px;
  background: white;
  color: #4a5568;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;

  i {
    font-size: 1.2rem;
  }

  &:hover {
    border-color: #cbd5e0;
    background: #f7fafc;
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  }

  &.google {
    &:hover {
      border-color: #ea4335;
      color: #ea4335;
    }
  }

  &.facebook {
    &:hover {
      border-color: #1877f2;
      color: #1877f2;
    }
  }
}

/* 登入連結 */
.login-link {
  text-align: center;
  color: #718096;
  font-size: 0.95rem;

  a {
    color: #7030a0;
    text-decoration: none;
    font-weight: 600;
    margin-left: 0.25rem;

    &:hover {
      text-decoration: underline;
    }
  }
}

/* 動畫 */
@keyframes spin {
  from {
    transform: rotate(0deg);
  }

  to {
    transform: rotate(360deg);
  }
}

.spin {
  animation: spin 1s linear infinite;
}
</style>

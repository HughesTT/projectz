<template>
  <div class="login-form-wrapper">
    <div class="form-header">
      <h2 class="form-title">會員登入</h2>
      <p class="form-subtitle">使用您的帳號密碼登入</p>
    </div>

    <form @submit.prevent="handleSubmit" class="login-form">
      <!-- 電子郵件輸入 -->
      <div class="form-group">
        <label for="email" class="form-label">
          <i class="bi bi-envelope"></i>
          電子郵件
        </label>
        <input type="email" id="email" v-model="formData.email" class="form-input" placeholder="請輸入電子郵件" required>
      </div>

      <!-- 密碼輸入 -->
      <div class="form-group">
        <label for="password" class="form-label">
          <i class="bi bi-lock"></i>
          密碼
        </label>
        <div class="password-input-wrapper">
          <input :type="showPassword ? 'text' : 'password'" id="password" v-model="formData.password" class="form-input"
            placeholder="請輸入密碼" required>
          <button type="button" class="password-toggle" @click="showPassword = !showPassword">
            <i class="bi" :class="showPassword ? 'bi-eye-slash' : 'bi-eye'"></i>
          </button>
        </div>
      </div>

      <!-- 記住我與忘記密碼 -->
      <div class="form-options">
        <label class="checkbox-label">
          <input type="checkbox" v-model="formData.rememberMe">
          <span class="checkbox-custom"></span>
          <span class="checkbox-text">記住我</span>
        </label>
        <router-link class="forgot-link">
          忘記密碼？
        </router-link>
      </div>

      <!-- 登入按鈕 -->
      <button type="submit" class="submit-btn" :disabled="isLoading">
        <span v-if="!isLoading">登入</span>
        <span v-else class="loading-spinner">
          <i class="bi bi-arrow-repeat spin"></i>
          登入中...
        </span>
      </button>

      <!-- 分隔線 -->
      <div class="divider">
        <span>或</span>
      </div>

      <!-- 社交媒體登入 -->
      <div class="social-login">
        <button type="button" class="social-btn google">
          <i class="bi bi-google"></i>
          <span>Google 登入</span>
        </button>
        <button type="button" class="social-btn facebook">
          <i class="bi bi-facebook"></i>
          <span>Facebook 登入</span>
        </button>
      </div>

      <!-- 註冊連結 -->
      <div class="register-link">
        還沒有帳號？
        <router-link to="/member/register">立即註冊</router-link>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useMemberAuth } from '../../composable/useMemberAuth'
import { useToast } from '../../composable/useToast'

const props = defineProps({
  modelValue: {
    type: Object,
    default: () => ({})
  },
  loading: {
    type: Boolean,
    default: false
  }
})
const emit = defineEmits(['submit'])
const router = useRouter()
const { login, isLoading, errorMessage, getRememberedEmail } = useMemberAuth()
const { showToast } = useToast()

// 表單資料
const formData = ref({
  email: '',
  password: '',
  rememberMe: false
})

// UI 狀態
const showPassword = ref(false)

// 組件掛載時，讀取上次記住的 email
onMounted(() => {
  const rememberedEmail = getRememberedEmail()
  if (rememberedEmail) {
    formData.value.email = rememberedEmail
    formData.value.rememberMe = true // 如果有記住的 email，預設勾選記住我
  }
})

// 表單處理
const handleSubmit = async () => {
  // 呼叫 composable 的 login 方法
  const result = await login(formData.value)
  if (result.success) {
    // 登入成功，顯示成功訊息並導向首頁
    showToast('登入成功', 'success')

    // 如果有 redirect 參數，導向原本要去的頁面
    const redirect = router.currentRoute.value.query.redirect
    if (redirect) {
      router.push(redirect)
    } else {
      router.push('/')
    }
  } else {
    // 登入失敗，顯示錯誤訊息
    showToast(result.message || '帳號或密碼錯誤', 'error')
  }
}
</script>

<style lang="scss" scoped>
.login-form-wrapper {
  width: 100%;
  max-width: 100%;
  box-sizing: border-box;
}

.form-header {
  text-align: center;
  margin-bottom: 2.5rem;

  @media (max-width: 768px) {
    margin-bottom: 2rem;
  }

  @media (max-width: 576px) {
    margin-bottom: 1.5rem;
  }
}

.form-title {
  font-size: 2rem;
  font-weight: 700;
  color: #2d3748;
  margin-bottom: 0.5rem;

  @media (max-width: 768px) {
    font-size: 1.75rem;
  }

  @media (max-width: 576px) {
    font-size: 1.5rem;
  }
}

.form-subtitle {
  color: #718096;
  font-size: 1rem;

  @media (max-width: 768px) {
    font-size: 0.9375rem;
  }

  @media (max-width: 576px) {
    font-size: 0.875rem;
  }
}

/* 表單樣式 */
.login-form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;

  @media (max-width: 768px) {
    gap: 1.25rem;
  }

  @media (max-width: 576px) {
    gap: 1rem;
  }
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;

  @media (max-width: 576px) {
    gap: 0.375rem;
  }
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
    flex-shrink: 0;
  }

  @media (max-width: 768px) {
    font-size: 0.9rem;
  }

  @media (max-width: 576px) {
    font-size: 0.875rem;
    gap: 0.375rem;
  }
}

.form-input {
  width: 100%;
  max-width: 100%;
  box-sizing: border-box;
  padding: 0.875rem 1rem;
  border: 2px solid #e2e8f0;
  border-radius: 12px;
  font-size: 1rem;
  transition: all 0.3s ease;
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

  @media (max-width: 768px) {
    padding: 0.75rem 0.875rem;
    font-size: 0.9375rem;
    border-radius: 10px;
  }

  @media (max-width: 576px) {
    padding: 0.625rem 0.75rem;
    font-size: 0.875rem;
    border-radius: 8px;
  }
}

.password-input-wrapper {
  position: relative;

  .form-input {
    padding-right: 3rem;

    @media (max-width: 576px) {
      padding-right: 2.75rem;
    }
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

    @media (max-width: 768px) {
      font-size: 1.1rem;
      padding: 0.4rem;
      right: 0.625rem;
    }

    @media (max-width: 576px) {
      font-size: 1rem;
      padding: 0.375rem;
      right: 0.5rem;
    }
  }
}

/* 表單選項 */
.form-options {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: -0.5rem;
  gap: 0.5rem;

  @media (max-width: 576px) {
    flex-wrap: wrap;
    margin-top: -0.25rem;
  }
}

.checkbox-label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  user-select: none;

  input[type="checkbox"] {
    display: none;
  }

  .checkbox-custom {
    width: 20px;
    height: 20px;
    border: 2px solid #cbd5e0;
    border-radius: 6px;
    position: relative;
    transition: all 0.3s ease;
    flex-shrink: 0;

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

    @media (max-width: 576px) {
      width: 18px;
      height: 18px;

      &::after {
        top: 1px;
        left: 5px;
        width: 4px;
        height: 9px;
      }
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

    @media (max-width: 768px) {
      font-size: 0.875rem;
    }

    @media (max-width: 576px) {
      font-size: 0.8125rem;
    }
  }
}

.forgot-link {
  font-size: 0.9rem;
  color: #7030a0;
  text-decoration: none;
  font-weight: 500;
  transition: color 0.3s ease;
  white-space: nowrap;

  &:hover {
    color: #5a2580;
    text-decoration: underline;
  }

  @media (max-width: 768px) {
    font-size: 0.875rem;
  }

  @media (max-width: 576px) {
    font-size: 0.8125rem;
  }
}

/* 登入按鈕 */
.submit-btn {
  width: 100%;
  max-width: 100%;
  box-sizing: border-box;
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

  @media (max-width: 768px) {
    padding: 0.875rem;
    font-size: 1.05rem;
    border-radius: 10px;
  }

  @media (max-width: 576px) {
    padding: 0.75rem;
    font-size: 1rem;
    border-radius: 8px;
    margin-top: 0.25rem;
  }
}

.loading-spinner {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;

  i {
    font-size: 1.2rem;

    @media (max-width: 576px) {
      font-size: 1.1rem;
    }
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
    flex-shrink: 0;

    @media (max-width: 576px) {
      padding: 0 0.75rem;
      font-size: 0.875rem;
    }
  }

  @media (max-width: 576px) {
    margin: 0.75rem 0;
  }
}

/* 社交媒體登入 */
.social-login {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;

  @media (max-width: 576px) {
    gap: 0.75rem;
  }

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
  width: 100%;
  max-width: 100%;
  box-sizing: border-box;

  i {
    font-size: 1.2rem;
    flex-shrink: 0;
  }

  span {
    @media (max-width: 768px) {
      font-size: 0.9375rem;
    }

    @media (max-width: 576px) {
      font-size: 0.875rem;
    }
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

  @media (max-width: 768px) {
    padding: 0.75rem 0.875rem;
    border-radius: 10px;

    i {
      font-size: 1.1rem;
    }
  }

  @media (max-width: 576px) {
    padding: 0.625rem 0.75rem;
    border-radius: 8px;

    i {
      font-size: 1rem;
    }
  }
}

/* 註冊連結 */
.register-link {
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

  @media (max-width: 768px) {
    font-size: 0.9rem;
  }

  @media (max-width: 576px) {
    font-size: 0.875rem;
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

/* 防止元素溢出 */
* {
  box-sizing: border-box;
}
</style>

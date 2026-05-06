<template>
  <div class="container mt-5">
    <form class="row justify-content-center" @submit.prevent="emit('submit')">
      <div class="signinUI col-md-5 mt-3">
        <img src="../../../public/logo.png" alt="Bolby Logo" class="img-fluid mb-3" />
        <h3>後台管理系統</h3>
        <div class="mb-3">
          <label for="inputEmail" class="row sr-only">
            電子信箱
            <input v-model="modelValue.username" type="email" id="inputEmail" class="form-control" placeholder="Email"
              required />
          </label>
        </div>
        <div class="mb-3">
          <label for="inputPassword" class="row sr-only">
            密碼
            <input v-model="modelValue.password" type="password" id="inputPassword" class="form-control"
              placeholder="Password" required />
          </label>
        </div>

        <div class="text-end mt-4">
          <button class="btn btn-lg btn-secondary btn-block" type="submit" :disabled="loading">
            <span v-if="loading" class="spinner-border spinner-border-sm me-2"></span>
            {{ loading ? '登入中...' : '登入' }}
          </button>
        </div>
      </div>
    </form>
  </div>
</template>

<script setup>
defineProps({
  modelValue: Object, // 接收父元件傳入的 user 物件
  loading: Boolean, // 接收父元件傳入的 loading 狀態
})

const emit = defineEmits(['submit']) // 只需要 submit 事件
</script>

<style scoped>
.container {
  width: 100%;
  max-width: 100%;
  box-sizing: border-box;
  padding: 1rem;

  @media (max-width: 768px) {
    padding: 0.75rem;
  }

  @media (max-width: 576px) {
    padding: 0.5rem;
  }
}

.row {
  width: 100%;
  max-width: 100%;
  margin: 0;
  box-sizing: border-box;
}

.signinUI {
  background: white;
  padding: 2.5rem;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  width: 100%;
  max-width: 100%;
  box-sizing: border-box;

  @media (max-width: 992px) {
    padding: 2rem;
  }

  @media (max-width: 768px) {
    padding: 1.75rem;
    border-radius: 12px;
    margin-top: 1rem !important;
  }

  @media (max-width: 576px) {
    padding: 1.5rem;
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
  }
}

h3 {
  text-align: center;
  font-size: 1.75rem;
  font-weight: 700;
  color: #2d3748;
  margin-bottom: 2rem;

  @media (max-width: 768px) {
    font-size: 1.5rem;
    margin-bottom: 1.5rem;
  }

  @media (max-width: 576px) {
    font-size: 1.25rem;
    margin-bottom: 1.25rem;
  }
}

img {
  display: block;
  margin-left: auto;
  margin-right: auto;
  width: 50%;
  max-width: 200px;
  height: auto;
  margin-bottom: 1.5rem;

  @media (max-width: 768px) {
    width: 45%;
    max-width: 150px;
    margin-bottom: 1.25rem;
  }

  @media (max-width: 576px) {
    width: 40%;
    max-width: 120px;
    margin-bottom: 1rem;
  }
}

.mb-3 {
  margin-bottom: 1.5rem !important;

  @media (max-width: 768px) {
    margin-bottom: 1.25rem !important;
  }

  @media (max-width: 576px) {
    margin-bottom: 1rem !important;
  }
}

label {
  width: 100%;
  max-width: 100%;
  box-sizing: border-box;
  font-weight: 600;
  color: #4a5568;
  margin-bottom: 0.5rem;
  font-size: 0.95rem;

  @media (max-width: 768px) {
    font-size: 0.9rem;
  }

  @media (max-width: 576px) {
    font-size: 0.875rem;
    margin-bottom: 0.375rem;
  }
}

.form-control {
  width: 100%;
  max-width: 100%;
  box-sizing: border-box;
  padding: 0.75rem 1rem;
  font-size: 1rem;
  border: 2px solid #e2e8f0;
  border-radius: 8px;
  transition: all 0.3s ease;

  &:focus {
    border-color: #7030a0;
    box-shadow: 0 0 0 3px rgba(112, 48, 160, 0.1);
    outline: none;
  }

  @media (max-width: 768px) {
    padding: 0.625rem 0.875rem;
    font-size: 0.9375rem;
  }

  @media (max-width: 576px) {
    padding: 0.5rem 0.75rem;
    font-size: 0.875rem;
    border-radius: 6px;
  }
}

.text-end {
  @media (max-width: 576px) {
    text-align: center !important;
  }
}

.btn {
  width: 100%;
  max-width: 100%;
  box-sizing: border-box;
  padding: 0.875rem 2rem;
  font-size: 1.125rem;
  font-weight: 600;
  border-radius: 8px;
  transition: all 0.3s ease;

  @media (max-width: 768px) {
    padding: 0.75rem 1.75rem;
    font-size: 1rem;
  }

  @media (max-width: 576px) {
    padding: 0.625rem 1.5rem;
    font-size: 0.9375rem;
    border-radius: 6px;
  }
}

.btn-secondary {
  background: linear-gradient(135deg, #7030a0, #a855f7);
  border: none;
  color: white;

  &:hover:not(:disabled) {
    background: linear-gradient(135deg, #5a2580, #8b3fd9);
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(112, 48, 160, 0.3);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
}

.spinner-border-sm {
  width: 1rem;
  height: 1rem;
  border-width: 0.15em;

  @media (max-width: 576px) {
    width: 0.875rem;
    height: 0.875rem;
  }
}

/* 防止表單元素在小螢幕上溢出 */
* {
  box-sizing: border-box;
}
</style>
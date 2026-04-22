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
h3 {
  text-align: center;
}

img {
  display: block;
  margin-left: auto;
  margin-right: auto;
  width: 50%;
}
</style>
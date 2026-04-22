<template>
  <div class="container mt-5">
    <form class="row justify-content-center" @submit.prevent="signIn">
      <div class="signinUI col-md-5 mt-3">
        <img src="../../../public/logo.png" alt="Bolby Logo" class="img-fluid mb-3" />
        <h3>後台管理系統</h3>
        <div class="mb-3">
          <label for="inputEmail" class="row sr-only">
            電子信箱
            <input v-model="user.username" type="email" id="inputEmail" class="form-control" placeholder="Email" />
          </label>
        </div>
        <div class="mb-3">
          <label for="inputPassword" class="row sr-only">
            密碼
            <input v-model="user.password" type="password" id="inputPassword" class="form-control"
              placeholder="Password" required />
          </label>
        </div>

        <div class="text-end mt-4">
          <button class="btn btn-lg btn-secondary btn-block" type="submit">登入</button>
        </div>
      </div>
    </form>
  </div>
</template>

<script setup>
import { reactive } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const user = reactive({
  username: '',
  password: '',
})

const logIn = async () => {
  try {
    // Vite 環境變數使用 import.meta.env
    const apiBase = import.meta.env.VITE_APP_API
    const api = `${apiBase}admin/signin`

    const response = await fetch(api, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(user),
    })

    // 檢查資料回傳資料
    if (!response.ok) {
      throw new Error(`HTTP 錯誤! 狀態: ${response.status}`)
    }

    // 檢查是否為 JSON 格式
    const contentType = response.headers.get('content-type')
    if (!contentType || !contentType.includes('application/json')) { // 如果不是 JSON 格式
      const text = await response.text() // 讀取回傳的文字內容
      console.error('伺服器回傳:', text)
      throw new Error('伺服器回傳的不是 JSON 格式')
    }

    const data = await response.json() // 定義 data 為解析後的 JSON 物件

    if (data.success) { // 如果登入成功
      const { token, expired } = data // 從 data 中解構出 token 和 expired
      document.cookie = `userToken=${token};expires=${new Date(expired)};` // 設定 cookie
      router.push('/dashboard')
      console.log('登入成功:', data)
    } else {
      alert(data.message || '登入失敗，請檢查帳號密碼')
    }
  } catch (error) {
    console.error('登入錯誤:', error)
    alert(`登入失敗: ${error.message}`)
  }
}
</script>

<style scoped>
img {
  display: block;
  margin-left: auto;
  margin-right: auto;
  width: 50%;
}
</style>
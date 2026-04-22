<template>
  <div>
    <LoginForm v-model="loginInfo" :loading="loading" @submit="login" />
    <ToastPage />
  </div>
</template>

<script setup>
import LoginForm from '../../components/backstage/LoginForm.vue'
import ToastPage from '../../components/backstage/ToastPage.vue'
import { useAuth } from '../../composable/useAuth'

const { loginInfo, login, logout, loading } = useAuth()
</script>

<style></style>
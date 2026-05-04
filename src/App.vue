<template>
  <RouterView />
  <ToastPage />
  <BackToTop />
</template>
<script setup>
import ToastPage from './components/backstage/ToastPage.vue'
import BackToTop from './components/BackToTop.vue'
</script>

<style>
@import './style.css';
</style>
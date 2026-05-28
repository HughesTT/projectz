<script setup>
import Navbar from '../components/Navbar.vue'
import HeaderView from '../components/HeaderView.vue'
import BestSelling from '../components/BestSelling.vue';
import HomeCoupon from '../components/HomeCoupon.vue'
import HomeContent from '../components/HomeContent.vue'
import Footer from '../components/Footer.vue'
import BackToTop from '../components/BackToTop.vue'
import { storeToRefs } from 'pinia';
import { useStatusStore } from '../store/statusStore'
import LoadingOverlay from '../components/backstage/LoadingOverlay.vue';
import { onMounted } from 'vue';

const statusStore = useStatusStore()
const { isLoading } = storeToRefs(statusStore)

// const homeLoading = () => {
//   isLoading.value = true
//   // 模擬載入時間
//   setTimeout(() => {
//     isLoading.value = false
//   }, 1000)
// }

onMounted(() => {
  window.scrollTo(0, 0) // 確保頁面載入時從頁首開始
  // homeLoading()
})
</script>

<template>
  <LoadingOverlay :active="isLoading" color="#7030a0" message="讀取中..." />
  <Navbar />
  <HeaderView />
  <BestSelling />
  <HomeCoupon />
  <HomeContent />
  <Footer />
  <BackToTop />
</template>

<style></style>

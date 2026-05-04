<template>
  <Navbar />
  <Breadcrum />
  <router-view />
  <Footer />
</template>

<script setup>
import Navbar from '../components/Navbar.vue'
import Footer from '../components/Footer.vue'
import Breadcrum from '../components/Breadcrum.vue'
</script>

<style scoped></style>
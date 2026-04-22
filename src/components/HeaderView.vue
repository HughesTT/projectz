<template>
  <div class="row headercard">
    <HeaderSlider />
    <HeaderCard />
  </div>
</template>

<script setup>
import HeaderSlider from '../components/HeaderSlider.vue'
import HeaderCard from '../components/HeaderCard.vue'
</script>

<style scoped>
.headercard {
  margin-top: 20px;
}
</style>
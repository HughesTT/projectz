<template>
  <div class="header-container">
    <div class="header-slider-wrapper">
      <HeaderSlider />
    </div>
    <div class="header-card-wrapper">
      <HeaderCard />
    </div>
  </div>
</template>

<script setup>
import HeaderSlider from '../components/HeaderSlider.vue'
import HeaderCard from '../components/HeaderCard.vue'
</script>

<style scoped>
.header-container {
  display: flex;
  gap: 1.5rem;
  margin-top: 20px;
  align-items: stretch;
  min-height: 500px;
  padding: 0 1rem;
}

.header-slider-wrapper {
  flex: 1;
  min-width: 80%;
  max-width: 82%;
  display: flex;
}

.header-card-wrapper {
  flex: 0 1 auto;
  min-width: 18%;
  display: flex;
  flex-direction: column;
  height: 100%;
}

@media (max-width: 1024px) {
  .header-container {
    flex-direction: column;
  }

  .header-slider-wrapper {
    min-width: 100%;
    max-width: 100%;
  }

  .header-card-wrapper {
    min-width: 100%;
    flex-direction: row;
    gap: 1rem;
  }
}

@media (max-width: 768px) {
  .header-card-wrapper {
    flex-direction: column;
  }
}
</style>
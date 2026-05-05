<template>
  <div class="headerslider">
    <div id="carouselExampleControls" class="carousel slide" data-bs-ride="carousel">
      <div class="carousel-inner">
        <div class="carousel-item" v-for="item in imgItems" :key="item.id" :class="{ active: item.id === 0 }">
          <router-link :to="item.link">
            <picture>
              <source :srcset="item.mobileSrc" media="(max-width: 768px)">
              <img :src="item.src" :alt="item.title" class="d-block w-100">
            </picture>
          </router-link>
        </div>
      </div>
      <button class="carousel-control-prev" type="button" data-bs-target="#carouselExampleControls"
        data-bs-slide="prev">
        <span class="carousel-control-prev-icon" aria-hidden="true"></span>
        <span class="visually-hidden">Previous</span>
      </button>
      <button class="carousel-control-next" type="button" data-bs-target="#carouselExampleControls"
        data-bs-slide="next">
        <span class="carousel-control-next-icon" aria-hidden="true"></span>
        <span class="visually-hidden">Next</span>
      </button>
    </div>
  </div>
</template>

<script setup>
import router from '../router';

// 使用 import 導入圖片，讓 Vite 正確處理路徑
import banner1 from '/img/headerbanner01.e030209c.jpg'
import banner2 from '/img/headerbanner02.79562a15.jpg'
import banner3 from '/img/headerbanner03.a7c8bb9a.jpg'
import banner4 from '/img/headerbanner04.c0e2c68a.jpg'
import mobiBanner1 from '/img/mobibanner-1.f88d0c1b.jpg'
import mobiBanner2 from '/img/mobibanner-2.27962580.jpg'
import mobiBanner3 from '/img/mobibanner-3.21b3a764.jpg'
import mobiBanner4 from '/img/mobibanner-4.42a9ce71.jpg'

const imgItems = [
  {
    id: 0,
    src: banner1,
    mobileSrc: mobiBanner2,
    link: '/products/-OMLz1SRWqZBwVKngzGA',
    title: 'RS 60 PLUS'
  },
  {
    id: 1,
    src: banner2,
    mobileSrc: mobiBanner1,
    link: '/products/-ONJMpek8GaaL3jwYTeG',
    title: 'HQ 990 PRO PLUS'
  },
  {
    id: 2,
    src: banner3,
    mobileSrc: mobiBanner3,
    link: '/products/-ONOT2norCR4vTU_J0t7',
    title: 'HA 30 PRO'
  },
  {
    id: 3,
    src: banner4,
    mobileSrc: mobiBanner4,
    link: '/products/-ONOoCZ8szRMi3HMrAqj',
    title: 'TRUE VOICE'
  }
]
</script>

<style scoped>
.headerslider {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.carousel {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.carousel-inner {
  border-radius: 20px;
  flex: 1;
  height: 100%;
}

.carousel-item {
  height: 100%;
}

.carousel-item img {
  height: 100%;
  object-fit: cover;
}
</style>
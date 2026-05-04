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

const imgItems = [
  {
    id: 0,
    src: './../../public/img/headerbanner01.e030209c.jpg',
    mobileSrc: './../../public/img/mobibanner-2.27962580.jpg',
    link: '/products/-OMLz1SRWqZBwVKngzGA',
    title: 'RS 60 PLUS'
  },
  {
    id: 1,
    src: './../../public/img/headerbanner02.79562a15.jpg',
    mobileSrc: './../../public/img/mobibanner-1.f88d0c1b.jpg',
    link: '/products/-ONJMpek8GaaL3jwYTeG',
    title: 'HQ 990 PRO PLUS'
  },
  {
    id: 2,
    src: './../../public/img/headerbanner03.a7c8bb9a.jpg',
    mobileSrc: './../../public/img/mobibanner-3.21b3a764.jpg',
    link: '/products/-ONOT2norCR4vTU_J0t7',
    title: 'HA 30 PRO'
  },
  {
    id: 3,
    src: './../../public/img/headerbanner04.c0e2c68a.jpg',
    mobileSrc: './../../public/img/mobibanner-4.42a9ce71.jpg',
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
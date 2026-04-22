<template>
  <div class="col-md-8 offset-md-1">
    <div class="headerslider">
      <div id="carouselExampleControls" class="carousel slide" data-bs-ride="carousel">
        <div class="carousel-inner">
          <div class="carousel-item" v-for="item in imgItems" :key="item.id" :class="{ active: item.id === 0 }">
            <img :src="item.src" class="rounded d-block w-100" :alt="item.captionTitle">
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
  </div>
</template>

<script setup>
const imgItems = [
  {
    id: 0,
    src: './../../public/img/headerbanner01.e030209c.jpg',
    captionTitle: '',
    captionText: '',
  },
  {
    id: 1,
    src: './../../public/img/headerbanner02.79562a15.jpg',
    captionTitle: '',
    captionText: '',
  },
  {
    id: 2,
    src: './../../public/img/headerbanner03.a7c8bb9a.jpg',
    captionTitle: '',
    captionText: '',
  },
  {
    id: 3,
    src: './../../public/img/headerbanner04.c0e2c68a.jpg',
    captionTitle: '',
    captionText: '',
  }
]
</script>

<style scoped></style>
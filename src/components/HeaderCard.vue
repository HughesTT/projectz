<template>
  <div class="col-md-2">
    <div class="card mb-3" v-for="img in headerCardImgs" :key="img.id">
      <img :src="img.src" class="card-img-top" alt="...">
      <div class="card-body">
        <p class="card-text">{{ img.text }}</p>
      </div>
    </div>
  </div>
</template>
<script setup>
const headerCardImgs = [
  {
    id: 0,
    src: '../../public/img/headercard/headercard1.png',
    text: '限時折扣',
  },
  {
    id: 1,
    src: '../../public/img/headercard/headercard2.png',
    text: '新品上市',
  },
]
</script>
<style lang="scss" scoped>
.headercard-title {
  font-size: 1.3em;
  font-weight: bold;
  color: #fff;
  background: #7030a0;
  margin-bottom: 5px;
  padding: 10px;
}

.card-body {
  background-color: #fff;
  padding: 10px;

  padding: 3px;

  .card-text {
    text-align: center;
    font-size: 1.3em;
    font-weight: bold;
    color: #666;
  }
}
</style>
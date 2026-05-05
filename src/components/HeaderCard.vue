<template>
  <div class="header-cards-container">
    <div class="header-card" v-for="img in headerCardImgs" :key="img.id">
      <router-link :to="img.link">
        <div class="card-image-wrapper">
          <img :src="img.src" class="card-img" alt="...">
        </div>
        <div class="card-body">
          <p class="card-text">{{ img.text }}</p>
        </div>
      </router-link>
    </div>
  </div>
</template>
<script setup>
const headerCardImgs = [
  {
    id: 0,
    src: '/img/headercard/headercard1.png',
    text: '限時折扣',
    link: '/products/-OMLz1SRWqZBwVKngzGA',
  },
  {
    id: 1,
    src: '/img/headercard/headercard2.png',
    text: '新品上市',
    link: '/products/-Oqyu0xi4ru6-AuIgfqz',
  },
]
</script>
<style lang="scss" scoped>
$primary: #7030a0;
$secondary: #a855f7;

.header-cards-container {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  height: 100%;
}

.header-card {
  flex: 1;
  background: white;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  display: flex;
  flex-direction: column;

  a {
    text-decoration: none;
    color: inherit;
    display: flex;
    flex-direction: column;
    height: 100%;
  }
}

.card-image-wrapper {
  position: relative;
  overflow: hidden;
  flex: 1;
  background: linear-gradient(135deg, rgba($primary, 0.05), rgba($secondary, 0.05));

  &::after {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(135deg, rgba($primary, 0.1), transparent);
    opacity: 0;
    transition: opacity 0.3s ease;
  }

  &:hover::after {
    opacity: 1;
  }
}

.card-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
  transition: transform 0.5s ease;

  .header-card:hover & {
    transform: scale(1.08);
  }
}

.card-body {
  background: linear-gradient(135deg, $primary, $secondary);
  padding: 1rem;

  .card-text {
    text-align: center;
    text-decoration: none;
    font-size: 1.2rem;
    font-weight: 700;
    color: white;
    margin: 0;
    letter-spacing: 0.05em;
    text-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  }
}

@media (max-width: 1024px) {
  .header-cards-container {
    flex-direction: row;
  }

  .header-card {
    min-height: 250px;
  }
}

@media (max-width: 768px) {
  .header-cards-container {
    flex-direction: column;
  }

  .header-card {
    min-height: 200px;
  }

  .card-body {
    padding: 0.75rem;

    .card-text {
      font-size: 1.1rem;
    }
  }
}
</style>
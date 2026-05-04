<template>
  <div class="onsaleproducts">
    <div class="container">
      <div class="row justify-content-md-center">
        <h3>熱銷商品</h3>
        <div class="productbox col-md-3 col-6" v-for="item in products" :key="item.id">
          <router-link :to="`/products/${item.id}`">
            <div class="product_img">
              <div class="morebox">
                <div class="morebtn">更多資訊</div>
              </div>
              <img :src="item.imageUrl" class="img-fluid" alt="image">
            </div>
            <div class="product_title">
              {{ item.title }}
            </div>
            <div class="product_price">
              $ {{ item.price }}
            </div>
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const products = [
  {
    title: 'RS 9 幻彩版電競耳機',
    id: '-ONOE8MPlXPzy0pvdKXN',
    imageUrl: 'https://storage.googleapis.com/vue-course-api.appspot.com/hughesh-api/1744179966908.jpg',
    orgin_price: '4680',
    price: '3990',
  },
  {
    title: 'PINK LADY Wireless耳機',
    id: '-ONORV0Wh0mhoGexvpLf',
    imageUrl: 'https://storage.googleapis.com/vue-course-api.appspot.com/hughesh-api/1744189279230.jpg',
    orgin_price: '2990',
    price: '2690',
  },
  {
    title: 'DB Buds4 lite 無線藍芽耳機',
    id: '-ONOoCZ8szRMi3HMrAqj',
    imageUrl: 'https://storage.googleapis.com/vue-course-api.appspot.com/hughesh-api/1744189667455.jpg',
    orgin_price: '3690',
    price: '2990',
  },
  {
    title: 'WH-A 主動式降噪耳機',
    id: '-ONOixmhE1FmZy0ovyti',
    imageUrl: 'https://storage.googleapis.com/vue-course-api.appspot.com/hughesh-api/1744188336018.jpg',
    orgin_price: '11900',
    price: '10400',
  },
]
</script>

<style lang="scss" scoped>
$primary-color: #7030a0;
$secondary-color: #a855f7;

.container {
  padding: 3rem 1rem;
}

.onsaleproducts {
  width: 100%;
  padding: 0;

  h3 {
    text-align: center;
    font-size: 2.5rem;
    font-weight: 700;
    color: #2d3748;
    margin-bottom: 2rem;
    position: relative;
    padding-bottom: 1rem;

    &::after {
      content: '';
      position: absolute;
      bottom: 0;
      left: 50%;
      transform: translateX(-50%);
      width: 80px;
      height: 4px;
      background: linear-gradient(135deg, $primary-color, $secondary-color);
      border-radius: 2px;
    }
  }
}

.productbox {
  margin-bottom: 2rem;
  padding: 0.5rem;

  a {
    text-decoration: none;
    color: inherit;
    display: block;
    transition: transform 0.3s ease;

    &:hover {
      transform: translateY(-10px);

      .product_img .morebox {
        opacity: 1;
        visibility: visible;
      }

      .product_img img {
        transform: scale(1.05);
      }
    }
  }
}

.product_img {
  position: relative;
  border-radius: 16px;
  overflow: hidden;
  background: #f7fafc;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  margin-bottom: 1rem;
  aspect-ratio: 1 / 1;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.5s ease;
  }

  .morebox {
    position: absolute;
    inset: 0;
    background: linear-gradient(135deg, rgba(112, 48, 160, 0.95), rgba(168, 85, 247, 0.95));
    display: flex;
    align-items: center;
    justify-content: center;
    opacity: 0;
    visibility: hidden;
    transition: all 0.3s ease;
  }

  .morebtn {
    padding: 0.875rem 2rem;
    background: white;
    color: $primary-color;
    font-weight: 600;
    border-radius: 50px;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
    transition: all 0.3s ease;

    &:hover {
      transform: scale(1.1);
      box-shadow: 0 6px 20px rgba(0, 0, 0, 0.3);
    }
  }
}

.product_title {
  font-size: 1.1rem;
  font-weight: 600;
  color: #2d3748;
  margin-bottom: 0.5rem;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.product_price {
  font-size: 1.5rem;
  font-weight: 700;
  color: $primary-color;
  display: flex;
  align-items: center;
  gap: 0.5rem;

  &::before {
    content: 'NT$';
    font-size: 1rem;
    font-weight: 600;
    color: #718096;
  }
}

@media (max-width: 768px) {
  .onsaleproducts h3 {
    font-size: 2rem;
    margin-bottom: 2rem;
  }

  .product_title {
    font-size: 0.95rem;
  }

  .product_price {
    font-size: 1.25rem;
  }
}
</style>
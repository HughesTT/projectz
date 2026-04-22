<template>
  <div class="container">
    <div class="onsaleproducts">
      <div class="container">
        <div class="row justify-content-md-center">
          <h3>熱銷商品</h3>
          <div class="productbox col-md-3 col-6" v-for="item in products" :key="item.id">
            <a href="#" @click.prevent="viewProduct(item.id)">
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
            </a>
          </div>
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

<style lang="scss" scoped></style>
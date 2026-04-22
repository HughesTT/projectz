<template>
  <div class="modal fade" id="ProductModal" tabindex="-1" aria-labelledby="ProductModalLabel" aria-hidden="true"
    ref="modal">
    <div class="modal-dialog modal-xl">
      <div class="modal-content">
        <div class="modal-header border-0">
          <h5 class="modal-title" id="exampleModalLabel">
            <i class="bi bi-receipt-cutoff"></i>
            {{ isNew ? '新增產品' : '編輯產品' }}
          </h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body">
          <div class="modal-body">
            <div class="row">
              <div class="col-sm-4">
                <div class="mb-3">
                  <label for="image" class="form-label">
                    輸入圖片網址
                    <input type="text" class="form-control" id="image" v-model="tempProduct.imageUrl"
                      placeholder="請輸入圖片連結">
                  </label>
                </div>
                <div class="mb-3">
                  <label for="customFile" class="form-label">
                    或 上傳圖片
                    <input type="file" id="customFile" class="form-control" ref="fileInput" @change="uploadFile"
                      accept="image/*">
                  </label>
                </div>
                <img class="img-fluid" :src="tempProduct.imageUrl" alt="">
                <!-- 延伸技巧，多圖 -->
                <div class="mt-5" v-if="tempProduct.images">
                  <div v-for="(image, key) in tempProduct.images" class="mb-3 input-group" :key="key">
                    <input type="url" class="form-control form-control" v-model="tempProduct.images[key]"
                      placeholder="請輸入連結" />
                    <button type="button" class="btn btn-outline-danger" @click="tempProduct.images.splice(key, 1)">
                      移除
                    </button>
                  </div>
                  <div v-if="
                    tempProduct.images[tempProduct.images.length - 1] || !tempProduct.images.length
                  ">
                    <button class="btn btn-outline-primary btn-sm d-block w-100" @click="tempProduct.images.push('')">
                      新增圖片
                    </button>
                  </div>
                </div>
              </div>
              <div class="col-sm-8">
                <div class="mb-3">
                  <label for="title" class="form-label">
                    標題
                    <input type="text" class="form-control" id="title" v-model="tempProduct.title" placeholder="請輸入標題">
                  </label>
                </div>

                <div class="row gx-2">
                  <div class="mb-3 col-md-6">
                    <label for="category" class="form-label">
                      分類
                      <input type="text" class="form-control" id="category" v-model="tempProduct.category"
                        placeholder="請輸入分類">
                    </label>
                  </div>
                  <div class="mb-3 col-md-6">
                    <label for="price" class="form-label">
                      單位
                      <input type="text" class="form-control" id="unit" v-model="tempProduct.unit" placeholder="請輸入單位">
                    </label>
                  </div>
                </div>

                <div class="row gx-2">
                  <div class="mb-3 col-md-6">
                    <label for="origin_price" class="form-label">
                      原價
                      <input type="number" class="form-control" id="origin_price" v-model="tempProduct.origin_price"
                        placeholder="請輸入原價">
                    </label>
                  </div>
                  <div class="mb-3 col-md-6">
                    <label for="price" class="form-label">
                      售價
                      <input type="number" class="form-control" id="price" v-model="tempProduct.price"
                        placeholder="請輸入售價">
                    </label>
                  </div>
                </div>
                <hr>

                <div class="mb-3">
                  <label for="description" class="form-label col-md-12">
                    產品描述
                    <textarea type="text" class="form-control" id="description" v-model="tempProduct.description"
                      placeholder="請輸入產品描述"></textarea>
                  </label>
                </div>
                <div class="mb-3">
                  <label for="content" class="form-label col-md-12">
                    說明內容
                    <textarea type="text" class="form-control" id="content" v-model="tempProduct.content"
                      placeholder="請輸入產品說明內容"></textarea>
                  </label>
                </div>
                <div class="mb-3">
                  <div class="form-check">
                    <label class="form-check-label" for="is_enabled">
                      是否啟用
                      <input class="form-check-input" type="checkbox" v-model="tempProduct.is_enabled" :true-value="1"
                        :false-value="0" id="is_enabled">
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">關閉</button>
          <button type="button" class="btn btn-primary" @click="emit('update-product', tempProduct)">儲存</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import { Modal } from 'bootstrap'

// 接收父元件傳來的 product 物件
const props = defineProps({
  product: {
    type: Object,
    default: () => ({})
  },
  isNew: {
    type: Boolean,
    default: true
  }
})

// 將更新後的 tempProduct 傳回父元件
const emit = defineEmits(['update-product', 'upload-file'])

const modal = ref(null) // Modal DOM 參考
let bsModal = null // Bootstrap Modal 實例

// 本地暫存的產品資料
const tempProduct = ref({
  title: '',
  category: '',
  unit: '',
  origin_price: 0,
  price: 0,
  description: '',
  content: '',
  is_enabled: 1,
  imageUrl: '',
  images: []
})

// 監聽 props.product 變化，更新 tempProduct
watch(() => props.product, (newProduct) => {
  if (newProduct && Object.keys(newProduct).length > 0) {
    tempProduct.value = { ...newProduct }
  } else {
    // 新增模式：重置為預設值
    tempProduct.value = {
      title: '',
      category: '',
      unit: '',
      origin_price: 0,
      price: 0,
      description: '',
      content: '',
      is_enabled: 1,
      imageUrl: '',
      images: []
    }
  }
}, { immediate: true, deep: true })

// 顯示 Modal
const showModal = () => {
  if (!bsModal && modal.value) {
    bsModal = new Modal(modal.value)
  }
  bsModal?.show()
}

// 隱藏 Modal
const hideModal = () => {
  bsModal?.hide()
}

// 檔案上傳參考
const fileInput = ref(null)

// 上傳檔案
const uploadFile = async () => {
  const file = fileInput.value?.files[0]
  if (!file) {
    return
  }

  const formData = new FormData()
  formData.append('file-to-upload', file)

  try {
    const apiBase = import.meta.env.VITE_APP_API
    const apiPath = import.meta.env.VITE_APP_PATH
    const token = document.cookie
      .split('; ')
      .find(row => row.startsWith('userToken='))
      ?.split('=')[1]

    if (!token) {
      alert('請先登入')
      return
    }

    const apiUrl = `${apiBase}api/${apiPath}/admin/upload`

    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Authorization': token
      },
      body: formData
    })

    const data = await response.json()

    if (data.success) {
      tempProduct.value.imageUrl = data.imageUrl
    } else {
      alert('上傳失敗: ' + (data.message || '未知錯誤'))
    }
  } catch (error) {
    alert('上傳失敗，請稍後再試')
  }
}

// 暴露方法給父元件使用
defineExpose({
  showModal,
  hideModal,
  uploadFile
})


</script>

<style lang="scss" scoped>
.modal-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 1.5rem 2rem;

  .modal-title {
    color: white;
    font-size: 1.5rem;
    font-weight: 600;
    margin: 0;

    i {
      margin-right: 0.5rem;
    }
  }

  .btn-close {
    filter: brightness(0) invert(1);
    opacity: 0.8;

    &:hover {
      opacity: 1;
    }
  }
}
</style>
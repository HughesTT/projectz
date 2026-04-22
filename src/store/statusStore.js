import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useStatusStore = defineStore('statusStore', () => {
  const isLoading = ref(false) // 全域 loading 狀態
  const cartLoadingItem = ref('') // 目前操作的購物車商品 ID
  
  return {
    isLoading,
    cartLoadingItem
  }
})

export default useStatusStore
import { ref } from 'vue'
import { showToast } from './useToast'

// 全域通用的收藏清單
const favorites = ref([])
const favoriteIds = ref([])

export const useFavorite = () => {
  // 切換追蹤狀態
  const toggleFavorite = (product) => {
    const toggleId = product.id
    const hasFavorite = favoriteIds.value.includes(toggleId) // 判斷是否已經在追蹤清單中
    
    if (!hasFavorite) { // 若非已追蹤
      favorites.value.push(product) // 將其加入 favorites 陣列
      localStorage.setItem('favorite', JSON.stringify(favorites.value)) // 本機
      showToast('已加入追蹤清單', 'success')
    } else {
      // 移除追蹤清單
      const delIndex = favorites.value.findIndex((fav) => fav.id === toggleId)
      favorites.value.splice(delIndex, 1)
      localStorage.setItem('favorite', JSON.stringify(favorites.value))
      showToast('已取消追蹤', 'info')
    }
    
    // 更新 favoriteIds
    favoriteIds.value = favorites.value.map(item => item.id)
  }

  // 從 localStorage 取得追蹤清單
  const getFavorite = () => {
    try {
      const storedFavorites = localStorage.getItem('favorite')
      const parsed = storedFavorites ? JSON.parse(storedFavorites) : []

      // 確保是陣列
      if (Array.isArray(parsed)) { // 如果是陣列，直接使用
        favorites.value = parsed
      } else {
        // 如果不是陣列，清空並重置
        favorites.value = []
        localStorage.removeItem('favorite')
      }

      // 重建 favoriteIds 陣列
      favoriteIds.value = favorites.value.map(item => item.id)
    } catch (error) {
      favorites.value = []
      favoriteIds.value = []
      localStorage.removeItem('favorite')
    }
  }

  return {
    favorites,
    favoriteIds,
    toggleFavorite,
    getFavorite
  }
}
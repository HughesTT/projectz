import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'

// 全域共用元件
const currentUser = ref(null) // 目前的使用者
const isAuthenticated = ref(false) // 判斷是否記憶帳號

// 測試用帳號密碼
const TEST_MEMBER = {
  email: 'abc@abc.com',
  password: 'abc1234'
}

// 初始化 token 認證
const initAuth = () => {
  // 優先從 localStorage 讀取（rememberMe = true 的情況）
  let storedUser = localStorage.getItem('memberUser')
  let token = localStorage.getItem('memberToken')
  
  // 如果 localStorage 沒有，再從 sessionStorage 讀取（rememberMe = false 的情況）
  if (!storedUser || !token) {
    storedUser = sessionStorage.getItem('memberUser')
    token = sessionStorage.getItem('memberToken')
  }

  if (storedUser && token) {
    try {
      currentUser.value = JSON.parse(storedUser) // 目前使用者資訊為轉換成JSON 格式的 storedUser
      isAuthenticated.value = true // 判定為已驗證
      console.log('登入成功:', currentUser.value.name)
    } catch (error) {
      console.log('無法解析 user 資料', error)
      clearAuth() // 清除認證
    }
  }
}

// 清除認證資料
const clearAuth = () => {
  currentUser.value = null // 目前使用者資料為空值
  isAuthenticated.value = false // 判斷驗證為 false
  
  // 移除 localStorage 的儲存資料
  localStorage.removeItem('memberUser')
  localStorage.removeItem('memberToken')
  localStorage.removeItem('memberRememberMe')
  
  // 同時移除 sessionStorage 的儲存資料
  sessionStorage.removeItem('memberUser')
  sessionStorage.removeItem('memberToken')
}

// 記憶登入狀態，瀏覽器關閉重開仍是登入
const saveAuth = (user, token, rememberMe = false) => { // 需儲存的認證資料有 user、token、rememberMe(預設為 false)
  currentUser.value = user // user 的資料為目前使用者資料
  isAuthenticated.value = true // 記憶帳號狀態為 true

  if (rememberMe) { // 若記憶帳號狀態為 true，將 user、token、rememberMe 資料存在本機
    localStorage.setItem('memberUser', JSON.stringify(user))
    localStorage.setItem('memberToken', token)
    localStorage.setItem('memberRememberMe', 'true')
    localStorage.setItem('rememberedEmail', user.email) // 記住 email，登出後仍保留
  } else { // 認證狀態為 false， 將 user、token 暫存於 sessionStorage，隨分頁關閉消失
    sessionStorage.setItem('memberUser', JSON.stringify(user))
    sessionStorage.setItem('memberToken', token)
  }
}

// 記憶登入帳號，讓登出後仍能記住前次的帳號
const getRememberedEmail = () => {
  return localStorage.getItem('rememberedEmail') || ''
}

const clearRememberedEmail = () => {
  localStorage.removeItem('rememberedEmail')
}


// 初始化認證狀態
initAuth()


// 主要 composable 函式
export function useMemberAuth() {
  const router = useRouter()

  // UI 狀態
  const isLoading = ref(false)
  const errorMessage = ref('')

  /**
   * 會員登入，定義參數與回傳值
   * @param {Object} credentials - { email、 password、 rememberMe }
   * @returns {Promise<Object} { success, message, user? }
   */ 
  const login = async(credentials) => {
    isLoading.value = true 
    errorMessage.value = ''

    try {
      // 模擬 API 延遲
      await new Promise(resolve => setTimeout(resolve, 800))

      // 驗證帳號密碼
      if (credentials.email === TEST_MEMBER.email && credentials.password === TEST_MEMBER.password) {
        
        // 模擬顯示的會員資料
        const mockUser = {
          id: 1,
          name: 'Admin',
          rank: '黃金會員',
          email: credentials.email,
          phone: '0912345678',
          avatar: null,
          createdAt: new Date().toISOString()
        }

        // 建立 Token
        const mockToken = 'mock_member_token' + Date.now()

        // 儲存認證資料
        saveAuth(mockUser, mockToken, credentials.rememberMe)
        

        return {
          success: true,
          message: '登入成功',
          user: mockUser
        }
      } else {
        throw new Error('帳號或密碼錯誤')
      }
    } catch (error) {
      errorMessage.value = error.message
      return {
        success: false,
        message: error.message
      }
    } finally {
      isLoading.value = false
    }
  }
  /**
   * 會員登出 
   * @returns {Promise<Object>}
   */ 
  const logout = async() => {
    try {
      clearAuth()
      router.push('/member/login')

      return {
        success: true,
        message: '登出成功'
      }
    } catch (error) {
      console.log('登出失敗', error)
      clearAuth()
      router.push('/member/login')

      return {
        success: false,
        message: error.message
      }
    }
  }


  /**
   * 確認是否已登入（會重新檢查 storage）
   * @returns {boolean}
   */
  const checkAuth = () => {
    // 如果當前未認證，嘗試從 storage 恢復
    if (!isAuthenticated.value) {
      initAuth()
    }
    return isAuthenticated.value
  }


  // 取得目前使用者資訊 
  const getCurrentUser = computed(() => currentUser.value)

  // 回傳所有方法和狀態
  return {
    //狀態
    currentUser: getCurrentUser,
    isAuthenticated: computed(() => isAuthenticated.value),
    isLoading: computed(() => isLoading.value),
    errorMessage: computed(() => errorMessage.value),
    // 方法
    login,
    logout,
    checkAuth,
    getRememberedEmail,
    clearRememberedEmail,
  }
}

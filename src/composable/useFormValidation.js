import { showToast } from './useToast'

/**
 * 表單驗證 Composable
 * 提供各種表單欄位的驗證邏輯
 */
export const useFormValidation = () => {
  /**
   * 驗證購買人資訊
   * @param {Object} buyerInfo - 購買人資訊物件
   * @returns {boolean} - 是否通過驗證
   */
  const validateBuyerInfo = (buyerInfo) => {
    if (!buyerInfo.name || !buyerInfo.name.trim()) {
      showToast('請輸入姓名', 'warning')
      return false
    }

    if (!buyerInfo.phone || !buyerInfo.phone.trim()) {
      showToast('請輸入電話', 'warning')
      return false
    }

    // 驗證電話格式（台灣手機號碼）
    const phoneRegex = /^09\d{8}$/
    const cleanPhone = buyerInfo.phone.replace(/\s|-/g, '')
    if (!phoneRegex.test(cleanPhone)) {
      showToast('請輸入有效的手機號碼（09開頭，10碼）', 'warning')
      return false
    }

    if (!buyerInfo.email || !buyerInfo.email.trim()) {
      showToast('請輸入電子郵件', 'warning')
      return false
    }

    // 驗證 Email 格式
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(buyerInfo.email)) {
      showToast('請輸入有效的電子郵件地址', 'warning')
      return false
    }

    if (!buyerInfo.address || !buyerInfo.address.trim()) {
      showToast('請輸入地址', 'warning')
      return false
    }

    return true
  }

  /**
   * 驗證信用卡資訊
   * @param {Object} cardInfo - 信用卡資訊物件
   * @returns {boolean} - 是否通過驗證
   */
  const validateCardInfo = (cardInfo) => {
    if (!cardInfo.number || !cardInfo.number.trim()) {
      showToast('請輸入信用卡號', 'warning')
      return false
    }

    // 移除空格驗證卡號長度
    const cleanCardNumber = cardInfo.number.replace(/\s/g, '')
    if (cleanCardNumber.length < 13 || cleanCardNumber.length > 19) {
      showToast('請輸入有效的信用卡號（13-19碼）', 'warning')
      return false
    }

    // Luhn 演算法驗證信用卡號
    if (!isValidCardNumber(cleanCardNumber)) {
      showToast('信用卡號格式不正確', 'warning')
      return false
    }

    if (!cardInfo.name || !cardInfo.name.trim()) {
      showToast('請輸入持卡人姓名', 'warning')
      return false
    }

    if (!cardInfo.expiry || !cardInfo.expiry.trim()) {
      showToast('請輸入有效期限', 'warning')
      return false
    }

    // 驗證有效期限格式 MM/YY
    const expiryRegex = /^(0[1-9]|1[0-2])\/\d{2}$/
    if (!expiryRegex.test(cardInfo.expiry)) {
      showToast('有效期限格式不正確（MM/YY）', 'warning')
      return false
    }

    // 驗證是否過期
    const [month, year] = cardInfo.expiry.split('/')
    const expiry = new Date(2000 + parseInt(year), parseInt(month) - 1)
    const now = new Date()
    if (expiry < now) {
      showToast('信用卡已過期', 'warning')
      return false
    }

    if (!cardInfo.cvv || !cardInfo.cvv.trim()) {
      showToast('請輸入安全碼', 'warning')
      return false
    }

    // 驗證 CVV 長度（3-4碼）
    if (cardInfo.cvv.length < 3 || cardInfo.cvv.length > 4) {
      showToast('安全碼必須為3或4碼', 'warning')
      return false
    }

    return true
  }

  /**
   * 使用 Luhn 演算法驗證信用卡號
   * @param {string} cardNumber - 信用卡號（純數字）
   * @returns {boolean} - 是否有效
   */
  const isValidCardNumber = (cardNumber) => {
    // 只允許數字
    if (!/^\d+$/.test(cardNumber)) {
      return false
    }

    let sum = 0
    let isEven = false

    // 從右往左處理
    for (let i = cardNumber.length - 1; i >= 0; i--) {
      let digit = parseInt(cardNumber[i])

      if (isEven) {
        digit *= 2
        if (digit > 9) {
          digit -= 9
        }
      }

      sum += digit
      isEven = !isEven
    }

    return sum % 10 === 0
  }

  /**
   * 驗證完整表單
   * @param {Object} buyerInfo - 購買人資訊
   * @param {Object} cardInfo - 信用卡資訊
   * @returns {boolean} - 是否通過驗證
   */
  const validateForm = (buyerInfo, cardInfo) => {
    // 先驗證購買人資訊
    if (!validateBuyerInfo(buyerInfo)) {
      return false
    }

    // 再驗證信用卡資訊
    if (!validateCardInfo(cardInfo)) {
      return false
    }

    return true
  }

  /**
   * 驗證單一欄位
   * @param {string} fieldName - 欄位名稱
   * @param {any} value - 欄位值
   * @returns {Object} - { valid: boolean, message: string }
   */
  const validateField = (fieldName, value) => {
    switch (fieldName) {
      case 'name':
        if (!value || !value.trim()) {
          return { valid: false, message: '姓名不能為空' }
        }
        return { valid: true, message: '' }

      case 'phone':
        if (!value || !value.trim()) {
          return { valid: false, message: '電話不能為空' }
        }
        const phoneRegex = /^09\d{8}$/
        const cleanPhone = value.replace(/\s|-/g, '')
        if (!phoneRegex.test(cleanPhone)) {
          return { valid: false, message: '請輸入有效的手機號碼' }
        }
        return { valid: true, message: '' }

      case 'email':
        if (!value || !value.trim()) {
          return { valid: false, message: 'Email 不能為空' }
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!emailRegex.test(value)) {
          return { valid: false, message: '請輸入有效的 Email' }
        }
        return { valid: true, message: '' }

      case 'address':
        if (!value || !value.trim()) {
          return { valid: false, message: '地址不能為空' }
        }
        return { valid: true, message: '' }

      case 'cardNumber':
        if (!value || !value.trim()) {
          return { valid: false, message: '信用卡號不能為空' }
        }
        const cleanCardNumber = value.replace(/\s/g, '')
        if (!isValidCardNumber(cleanCardNumber)) {
          return { valid: false, message: '信用卡號格式不正確' }
        }
        return { valid: true, message: '' }

      case 'cardName':
        if (!value || !value.trim()) {
          return { valid: false, message: '持卡人姓名不能為空' }
        }
        return { valid: true, message: '' }

      case 'expiry':
        if (!value || !value.trim()) {
          return { valid: false, message: '有效期限不能為空' }
        }
        const expiryRegex = /^(0[1-9]|1[0-2])\/\d{2}$/
        if (!expiryRegex.test(value)) {
          return { valid: false, message: '格式不正確（MM/YY）' }
        }
        return { valid: true, message: '' }

      case 'cvv':
        if (!value || !value.trim()) {
          return { valid: false, message: 'CVV 不能為空' }
        }
        if (value.length < 3 || value.length > 4) {
          return { valid: false, message: 'CVV 必須為3或4碼' }
        }
        return { valid: true, message: '' }

      default:
        return { valid: true, message: '' }
    }
  }

  return {
    validateBuyerInfo,
    validateCardInfo,
    validateForm,
    validateField,
    isValidCardNumber
  }
}

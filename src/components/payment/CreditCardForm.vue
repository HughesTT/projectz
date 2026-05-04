<template>
  <div class="credit-card-form">
    <h3 class="form-title">
      <i class="bi bi-credit-card-2-front-fill"></i>
      信用卡資訊
    </h3>

    <div class="form-grid">
      <div class="form-group full-width">
        <label class="form-label" for="card-number">
          卡號 <span class="required">*</span>
        </label>
        <div class="input-with-icon">
          <i class="bi bi-credit-card"></i>
          <input id="card-number" v-model="localCardInfo.number" type="text" class="form-input"
            placeholder="1234 5678 9012 3456" maxlength="19" @input="handleCardNumberInput" />
        </div>
      </div>

      <div class="form-group full-width">
        <label class="form-label" for="card-name">
          持卡人姓名 <span class="required">*</span>
        </label>
        <div class="input-with-icon">
          <i class="bi bi-person"></i>
          <input id="card-name" v-model="localCardInfo.name" type="text" class="form-input"
            placeholder="CARDHOLDER NAME" @input="updateValue" />
        </div>
      </div>

      <div class="form-group">
        <label class="form-label" for="card-expiry">
          有效期限 <span class="required">*</span>
        </label>
        <div class="input-with-icon">
          <i class="bi bi-calendar3"></i>
          <input id="card-expiry" v-model="localCardInfo.expiry" type="text" class="form-input" placeholder="MM/YY"
            maxlength="5" @input="handleExpiryInput" />
        </div>
      </div>

      <div class="form-group">
        <label class="form-label" for="card-cvv">
          安全碼 (CVV) <span class="required">*</span>
        </label>
        <div class="input-with-icon">
          <i class="bi bi-shield-lock"></i>
          <input id="card-cvv" v-model="localCardInfo.cvv" type="text" class="form-input" placeholder="123"
            maxlength="3" @input="handleCvvInput" />
        </div>
      </div>
    </div>

    <!-- 安全提示 -->
    <div class="security-note">
      <i class="bi bi-shield-check"></i>
      <span>您的付款資訊採用 SSL 加密保護</span>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'

const props = defineProps({
  modelValue: {
    type: Object,
    required: true,
    default: () => ({
      number: '',
      name: '',
      expiry: '',
      cvv: ''
    })
  }
})

const emit = defineEmits(['update:modelValue'])

const localCardInfo = ref({ ...props.modelValue })

watch(() => props.modelValue, (newVal) => {
  localCardInfo.value = { ...newVal }
}, { deep: true })

const updateValue = () => {
  emit('update:modelValue', { ...localCardInfo.value })
}

// 格式化信用卡號（每4位加空格）
const handleCardNumberInput = (event) => {
  let value = event.target.value.replace(/\s/g, '').replace(/\D/g, '')
  let formattedValue = value.match(/.{1,4}/g)?.join(' ') || value
  localCardInfo.value.number = formattedValue
  updateValue()
}

// 格式化有效期限（MM/YY）
const handleExpiryInput = (event) => {
  let value = event.target.value.replace(/\D/g, '')
  if (value.length >= 2) {
    value = value.slice(0, 2) + '/' + value.slice(2, 4)
  }
  localCardInfo.value.expiry = value
  updateValue()
}

// 只允許數字
const handleCvvInput = (event) => {
  let value = event.target.value.replace(/\D/g, '')
  localCardInfo.value.cvv = value
  updateValue()
}
</script>

<style lang="scss" scoped>
$primary-color: #7030a0;

.credit-card-form {
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.form-title {
  font-size: 1.25rem;
  font-weight: 700;
  color: #2d3748;
  margin: 0 0 1.5rem 0;
  display: flex;
  align-items: center;
  gap: 0.5rem;

  i {
    color: $primary-color;
  }
}

.form-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1.25rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;

  &.full-width {
    grid-column: 1 / -1;
  }
}

.form-label {
  font-weight: 600;
  color: #2d3748;
  font-size: 0.95rem;

  .required {
    color: #e53e3e;
  }
}

.input-with-icon {
  position: relative;
  display: flex;
  align-items: center;

  i {
    position: absolute;
    left: 1rem;
    color: #a0aec0;
    font-size: 1.1rem;
    pointer-events: none;
  }

  .form-input {
    padding-left: 2.75rem;
  }
}

.form-input {
  padding: 0.875rem 1rem;
  border: 2px solid #e2e8f0;
  border-radius: 8px;
  font-size: 0.95rem;
  transition: all 0.2s;
  width: 100%;

  &:focus {
    outline: none;
    border-color: $primary-color;
    box-shadow: 0 0 0 3px rgba(112, 48, 160, 0.1);
  }

  &::placeholder {
    color: #a0aec0;
  }
}

.security-note {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  margin-top: 1.25rem;
  padding: 0.875rem;
  background: #f7fafc;
  border-radius: 8px;
  font-size: 0.875rem;
  color: #718096;

  i {
    color: #48bb78;
    font-size: 1.1rem;
  }
}

@media (max-width: 768px) {
  .form-grid {
    grid-template-columns: 1fr;
  }

  .form-group.full-width {
    grid-column: 1;
  }
}
</style>

<template>
  <div class="buyer-info-form">
    <h3 class="form-title">
      <i class="bi bi-person-fill"></i>
      購買人資訊
    </h3>

    <div class="form-grid">
      <div class="form-group">
        <label class="form-label" for="buyer-name">
          姓名 <span class="required">*</span>
        </label>
        <input id="buyer-name" v-model="localBuyerInfo.name" type="text" class="form-input" placeholder="請輸入您的姓名"
          @input="updateValue" />
      </div>

      <div class="form-group">
        <label class="form-label" for="buyer-phone">
          電話 <span class="required">*</span>
        </label>
        <input id="buyer-phone" v-model="localBuyerInfo.phone" type="tel" class="form-input" placeholder="請輸入聯絡電話"
          @input="updateValue" />
      </div>

      <div class="form-group full-width">
        <label class="form-label" for="buyer-email">
          電子郵件 <span class="required">*</span>
        </label>
        <input id="buyer-email" v-model="localBuyerInfo.email" type="email" class="form-input"
          placeholder="example@email.com" @input="updateValue" />
      </div>

      <div class="form-group full-width">
        <label class="form-label" for="buyer-address">
          地址 <span class="required">*</span>
        </label>
        <input id="buyer-address" v-model="localBuyerInfo.address" type="text" class="form-input" placeholder="請輸入收件地址"
          @input="updateValue" />
      </div>

      <div class="form-group full-width">
        <label class="form-label" for="buyer-note">
          備註
        </label>
        <textarea id="buyer-note" v-model="localBuyerInfo.note" class="form-textarea" placeholder="有任何特殊需求嗎？（選填）"
          rows="3" @input="updateValue"></textarea>
      </div>
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
      name: '',
      phone: '',
      email: '',
      address: '',
      note: ''
    })
  }
})

const emit = defineEmits(['update:modelValue'])

const localBuyerInfo = ref({ ...props.modelValue })

watch(() => props.modelValue, (newVal) => {
  localBuyerInfo.value = { ...newVal }
}, { deep: true })

const updateValue = () => {
  emit('update:modelValue', { ...localBuyerInfo.value })
}
</script>

<style lang="scss" scoped>
$primary-color: #7030a0;

.buyer-info-form {
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

.form-input,
.form-textarea {
  padding: 0.875rem 1rem;
  border: 2px solid #e2e8f0;
  border-radius: 8px;
  font-size: 0.95rem;
  transition: all 0.2s;
  font-family: inherit;

  &:focus {
    outline: none;
    border-color: $primary-color;
    box-shadow: 0 0 0 3px rgba(112, 48, 160, 0.1);
  }

  &::placeholder {
    color: #a0aec0;
  }
}

.form-textarea {
  resize: vertical;
  min-height: 80px;
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

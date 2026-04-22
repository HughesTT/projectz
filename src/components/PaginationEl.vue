<template>
  <nav class="custom-pagination" aria-label="Page navigation">
    <div class="pagination-container">
      <button class="pagination-btn pagination-btn-edge" :disabled="!pages.has_pre" @click="updatePage(1)" title="第一頁">
        <i class="bi bi-chevron-double-left"></i>
      </button>
      <button class="pagination-btn" :disabled="!pages.has_pre" @click="prevPage" title="上一頁">
        <i class="bi bi-chevron-left"></i>
      </button>
      <div class="pagination-pages">
        <template v-for="page in visiblePages" :key="page">
          <span v-if="page === '...'" class="pagination-dots">...</span>
          <button v-else class="pagination-btn pagination-number" :class="{ 'active': page === pages.current_page }"
            @click="updatePage(page)">
            {{ page }}
          </button>
        </template>
      </div>
      <button class="pagination-btn" :disabled="!pages.has_next" @click="nextPage" title="下一頁">
        <i class="bi bi-chevron-right"></i>
      </button>
      <button class="pagination-btn pagination-btn-edge" :disabled="!pages.has_next" @click="endPage" title="最後一頁">
        <i class="bi bi-chevron-double-right"></i>
      </button>
    </div>
    <div class="pagination-info">
      第 <strong>{{ pages.current_page || 0 }}</strong> 頁，共 <strong>{{ pages.total_pages || 0 }}</strong> 頁
    </div>
  </nav>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  pages: {
    type: Object,
    default: () => ({})
  }
})

const emit = defineEmits(['emit-pages'])

// 計算可見的頁碼（避免頁數過多）
const visiblePages = computed(() => {
  const current = props.pages.current_page || 1
  const total = props.pages.total_pages || 1
  const pages = []

  // 如果總頁數 <= 10，顯示全部
  if (total <= 10) {
    for (let i = 1; i <= total; i++) {
      pages.push(i)
    }
    return pages
  }

  // 預設顯示第一頁
  pages.push(1)

  // 計算中間要顯示的頁碼範圍
  let start = Math.max(2, current - 1)
  let end = Math.min(total - 1, current + 1)

  // 如果目前頁接近開頭
  if (current <= 3) {
    end = 5
  }

  // 如果目前頁接近結尾
  if (current >= total - 2) {
    start = total - 4
  }

  // 添加省略號
  if (start > 2) {
    pages.push('...')
  }

  // 添加中間頁碼
  for (let i = start; i <= end; i++) {
    pages.push(i)
  }

  // 添加省略號
  if (end < total - 1) {
    pages.push('...')
  }

  // 顯示最後一頁
  if (total > 1) {
    pages.push(total)
  }

  return pages
})

const updatePage = (page) => {
  if (typeof page === 'number') {
    emit('emit-pages', page)
  }
}

const prevPage = () => {
  if (props.pages.has_pre) {
    emit('emit-pages', props.pages.current_page - 1)
  }
}

const nextPage = () => {
  if (props.pages.has_next) {
    emit('emit-pages', props.pages.current_page + 1)
  }
}

const endPage = () => {
  if (props.pages?.total_pages) {
    emit('emit-pages', props.pages.total_pages)
  }
}
</script>

<style scoped>
nav {
  margin: 0 !important;
}

.custom-pagination {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  margin-top: 2rem;
  padding: 1.5rem 0;
}

.pagination-container {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  flex-wrap: wrap;
  justify-content: center;
}

.pagination-pages {
  display: flex;
  gap: 0.25rem;
}

/* 按鈕基礎樣式 */
.pagination-btn {
  min-width: 40px;
  height: 40px;
  padding: 0 0.75rem;
  border: 1px solid #e2e8f0;
  background: white;
  color: #4a5568;
  font-size: 0.875rem;
  font-weight: 500;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.pagination-btn:hover:not(:disabled) {
  background: #f7fafc;
  border-color: #7030a0;
  color: #7030a0;
  transform: translateY(-1px);
  box-shadow: 0 2px 4px rgba(112, 48, 160, 0.1);
}

.pagination-btn:active:not(:disabled) {
  transform: translateY(0);
  box-shadow: 0 1px 2px rgba(112, 48, 160, 0.1);
}

.pagination-btn:disabled {
  background: #f7fafc;
  color: #cbd5e0;
  cursor: not-allowed;
  border-color: #e2e8f0;
}

/* 頁碼按鈕 */
.pagination-number {
  min-width: 40px;
  font-weight: 600;
}

.pagination-number.active {
  background: linear-gradient(135deg, #7030a0 0%, #5a2580 100%);
  color: white;
  border-color: #7030a0;
  box-shadow: 0 4px 8px rgba(112, 48, 160, 0.3);
}

.pagination-number.active:hover {
  background: linear-gradient(135deg, #5a2580 0%, #7030a0 100%);
  transform: translateY(-1px);
}

/* 邊緣按鈕（第一頁/最後一頁） */
.pagination-btn-edge {
  background: linear-gradient(135deg, #f7fafc 0%, #edf2f7 100%);
  font-weight: 600;
}

.pagination-btn-edge:hover:not(:disabled) {
  background: linear-gradient(135deg, #e2e8f0 0%, #cbd5e0 100%);
}

/* 省略號 */
.pagination-dots {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 40px;
  height: 40px;
  color: #a0aec0;
  font-weight: 600;
  user-select: none;
}

/* 頁面資訊 */
.pagination-info {
  font-size: 0.875rem;
  color: #718096;
  text-align: center;
}

.pagination-info strong {
  color: #7030a0;
  font-weight: 600;
}

/* 響應式設計 */
@media (max-width: 768px) {
  .pagination-btn {
    min-width: 36px;
    height: 36px;
    font-size: 0.8125rem;
  }

  .pagination-number {
    min-width: 36px;
  }

  .pagination-dots {
    min-width: 36px;
    height: 36px;
  }

  .pagination-btn-edge {
    padding: 0 0.5rem;
  }
}

@media (max-width: 480px) {
  .pagination-container {
    gap: 0.25rem;
  }

  .pagination-pages {
    gap: 0.125rem;
  }

  .pagination-btn {
    min-width: 32px;
    height: 32px;
    font-size: 0.75rem;
  }

  .pagination-number {
    min-width: 32px;
  }

  .pagination-info {
    font-size: 0.8125rem;
  }
}

/* 動畫效果 */
@keyframes pulse {

  0%,
  100% {
    opacity: 1;
  }

  50% {
    opacity: 0.5;
  }
}

.pagination-btn:disabled {
  animation: none;
}
</style>
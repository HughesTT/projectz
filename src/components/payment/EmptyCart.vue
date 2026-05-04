<template>
  <div class="empty-cart">
    <div class="empty-cart-icon">
      <i class="bi bi-cart-x"></i>
    </div>
    <h3 class="empty-cart-title">購物車是空的</h3>
    <p class="empty-cart-description">
      目前購物車中沒有商品，快去挑選您喜歡的商品吧！
    </p>
    <div class="empty-cart-actions">
      <router-link to="/products/headphone" class="browse-btn primary">
        <i class="bi bi-headphones"></i>
        選購耳機
      </router-link>
      <router-link to="/products/speaker" class="browse-btn">
        <i class="bi bi-speaker"></i>
        選購喇叭
      </router-link>
      <router-link to="/products/tv" class="browse-btn">
        <i class="bi bi-tv"></i>
        選購電視
      </router-link>
    </div>
  </div>
</template>

<script setup>
// 無需 props 或 emits
</script>

<style lang="scss" scoped>
$primary-color: #7030a0;

.empty-cart {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 4rem 2rem;
  text-align: center;
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.empty-cart-icon {
  width: 120px;
  height: 120px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #f7f5ff 0%, #fff 100%);
  border-radius: 50%;
  margin-bottom: 2rem;

  i {
    font-size: 3.5rem;
    color: #a0aec0;
  }
}

.empty-cart-title {
  font-size: 1.75rem;
  font-weight: 700;
  color: #2d3748;
  margin: 0 0 1rem 0;
}

.empty-cart-description {
  font-size: 1rem;
  color: #718096;
  margin: 0 0 2rem 0;
  max-width: 500px;
}

.empty-cart-actions {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
  justify-content: center;
}

.browse-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.875rem 1.5rem;
  border: 2px solid #e2e8f0;
  border-radius: 10px;
  font-weight: 600;
  color: #2d3748;
  text-decoration: none;
  transition: all 0.2s;
  background: white;

  i {
    font-size: 1.25rem;
  }

  &:hover {
    border-color: $primary-color;
    color: $primary-color;
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(112, 48, 160, 0.15);
  }

  &.primary {
    background: linear-gradient(135deg, $primary-color, #a855f7);
    color: white;
    border-color: transparent;

    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 20px rgba(112, 48, 160, 0.3);
    }
  }
}

@media (max-width: 768px) {
  .empty-cart {
    padding: 3rem 1.5rem;
  }

  .empty-cart-icon {
    width: 100px;
    height: 100px;

    i {
      font-size: 3rem;
    }
  }

  .empty-cart-title {
    font-size: 1.5rem;
  }

  .empty-cart-actions {
    flex-direction: column;
    width: 100%;

    .browse-btn {
      width: 100%;
      justify-content: center;
    }
  }
}
</style>

import { createPinia } from 'pinia'

// 创建Pinia实例
export const pinia = createPinia()

// 导出所有stores
export { useAuthStore } from './auth'
export { useProductStore } from './product'
export { useCategoryStore } from './category'
export { useSpecStore } from './spec'
export { useSkuStore } from './sku'
export { useProductImageStore } from './productImage'
import { defineStore } from 'pinia'
import { ref, computed, readonly } from 'vue'
import { api } from '@/api'
import type { Product, PaginationInfo, QueryParams, PageResponse } from '@/types'

export const useProductStore = defineStore('product', () => {
  // 状态
  const products = ref<Product[]>([])
  const currentProduct = ref<Product | null>(null)
  const loading = ref(false)
  const pagination = ref<PaginationInfo>({
    pageNo: 1,
    pageSize: 10,
    total: 0,
    totalPages: 0
  })

  // 计算属性
  const hasProducts = computed(() => products.value.length > 0)
  const isLoading = computed(() => loading.value)

  // 获取商品列表
  const fetchProducts = async (params: QueryParams = {}): Promise<void> => {
    loading.value = true
    try {
      const queryParams = {
        pageNo: params.pageNo || pagination.value.pageNo,
        pageSize: params.pageSize || pagination.value.pageSize,
        ...params
      }

      const response = await api.goods.list(queryParams) as PageResponse<Product>

      products.value = response.records
      pagination.value = {
        pageNo: response.current,
        pageSize: response.size,
        total: response.total,
        totalPages: response.pages
      }
    } catch (error) {
      console.error('Failed to fetch products:', error)
      throw error
    } finally {
      loading.value = false
    }
  }

  // 获取单个商品
  const fetchProduct = async (id: number): Promise<Product> => {
    loading.value = true
    try {
      const product = await api.goods.get(id) as Product
      currentProduct.value = product
      return product
    } catch (error) {
      console.error('Failed to fetch product:', error)
      throw error
    } finally {
      loading.value = false
    }
  }

  // 创建商品
  const createProduct = async (product: Omit<Product, 'id' | 'createTime' | 'updateTime' | 'delFlag'> | FormData): Promise<Product> => {
    loading.value = true
    try {
      const newProduct = await api.goods.create(product) as Product
      products.value.unshift(newProduct)
      return newProduct
    } catch (error) {
      console.error('Failed to create product:', error)
      throw error
    } finally {
      loading.value = false
    }
  }

  // 更新商品
  const updateProduct = async (product: Product | FormData): Promise<Product> => {
    loading.value = true
    try {
      const updatedProduct = await api.goods.update(product) as Product

      // 更新列表中的商品
      if (!(product instanceof FormData) && 'id' in product) {
        const index = products.value.findIndex(p => p.id === product.id)
        if (index !== -1) {
          products.value[index] = updatedProduct
        }

        // 更新当前商品
        if (currentProduct.value?.id === product.id) {
          currentProduct.value = updatedProduct
        }
      }

      return updatedProduct
    } catch (error) {
      console.error('Failed to update product:', error)
      throw error
    } finally {
      loading.value = false
    }
  }

  // 删除商品
  const deleteProduct = async (id: number): Promise<void> => {
    loading.value = true
    try {
      await api.goods.delete(id)

      // 从列表中移除商品
      products.value = products.value.filter(p => p.id !== id)

      // 如果删除的是当前商品，清空当前商品
      if (currentProduct.value?.id === id) {
        currentProduct.value = null
      }
    } catch (error) {
      console.error('Failed to delete product:', error)
      throw error
    } finally {
      loading.value = false
    }
  }

  // 搜索商品
  const searchProducts = async (keyword: string, params: QueryParams = {}): Promise<void> => {
    await fetchProducts({
      ...params,
      keyword
    })
  }

  // 重置状态
  const resetState = (): void => {
    products.value = []
    currentProduct.value = null
    loading.value = false
    pagination.value = {
      pageNo: 1,
      pageSize: 10,
      total: 0,
      totalPages: 0
    }
  }

  return {
    // 状态
    products: readonly(products),
    currentProduct: readonly(currentProduct),
    loading: readonly(loading),
    pagination: readonly(pagination),

    // 计算属性
    hasProducts,
    isLoading,

    // 方法
    fetchProducts,
    fetchProduct,
    createProduct,
    updateProduct,
    deleteProduct,
    searchProducts,
    resetState
  }
})

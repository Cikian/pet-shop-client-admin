import { defineStore } from 'pinia'
import { ref, computed, readonly } from 'vue'
import { api } from '@/api'
import type { ProductImage, PaginationInfo, QueryParams, PageResponse } from '@/types'

export const useProductImageStore = defineStore('productImage', () => {
  // 状态
  const productImages = ref<ProductImage[]>([])
  const currentProductImage = ref<ProductImage | null>(null)
  const loading = ref(false)
  const pagination = ref<PaginationInfo>({
    pageNo: 1,
    pageSize: 10,
    total: 0,
    totalPages: 0
  })

  // 计算属性
  const hasProductImages = computed(() => productImages.value.length > 0)
  const isLoading = computed(() => loading.value)

  // 获取商品附图列表
  const fetchProductImages = async (params: QueryParams = {}): Promise<void> => {
    loading.value = true
    try {
      const queryParams = {
        pageNo: params.pageNo || pagination.value.pageNo,
        pageSize: params.pageSize || pagination.value.pageSize,
        ...params
      }

      const response = await api.productImage.list(queryParams) as PageResponse<ProductImage>

      productImages.value = response.records
      pagination.value = {
        pageNo: response.current,
        pageSize: response.size,
        total: response.total,
        totalPages: response.pages
      }
    } catch (error) {
      console.error('Failed to fetch product images:', error)
      throw error
    } finally {
      loading.value = false
    }
  }

  // 根据商品ID获取附图
  const fetchImagesByProductId = async (productId: string): Promise<ProductImage[]> => {
    loading.value = true
    try {
      const images = await api.productImage.getByProductId(productId) as ProductImage[]
      productImages.value = images
      return images
    } catch (error) {
      console.error('Failed to fetch images by product ID:', error)
      throw error
    } finally {
      loading.value = false
    }
  }

  // 获取单个商品附图
  const fetchProductImage = async (id: string): Promise<ProductImage> => {
    loading.value = true
    try {
      const image = await api.productImage.get(id) as ProductImage
      currentProductImage.value = image
      return image
    } catch (error) {
      console.error('Failed to fetch product image:', error)
      throw error
    } finally {
      loading.value = false
    }
  }

  // 创建商品附图
  const createProductImage = async (image: Omit<ProductImage, 'id' | 'createTime' | 'updateTime' | 'delFlag'>): Promise<ProductImage> => {
    loading.value = true
    try {
      const newImage = await api.productImage.create(image) as ProductImage
      productImages.value.unshift(newImage)
      return newImage
    } catch (error) {
      console.error('Failed to create product image:', error)
      throw error
    } finally {
      loading.value = false
    }
  }

  // 更新商品附图
  const updateProductImage = async (image: ProductImage): Promise<ProductImage> => {
    loading.value = true
    try {
      const updatedImage = await api.productImage.update(image) as ProductImage

      // 更新列表中的附图
      const index = productImages.value.findIndex(img => img.id === image.id)
      if (index !== -1) {
        productImages.value[index] = updatedImage
      }

      // 更新当前附图
      if (currentProductImage.value?.id === image.id) {
        currentProductImage.value = updatedImage
      }

      return updatedImage
    } catch (error) {
      console.error('Failed to update product image:', error)
      throw error
    } finally {
      loading.value = false
    }
  }

  // 删除商品附图
  const deleteProductImage = async (id: string): Promise<void> => {
    loading.value = true
    try {
      await api.productImage.delete(id)

      // 从列表中移除附图
      productImages.value = productImages.value.filter(img => img.id !== id)

      // 如果删除的是当前附图，清空当前附图
      if (currentProductImage.value?.id === id) {
        currentProductImage.value = null
      }
    } catch (error) {
      console.error('Failed to delete product image:', error)
      throw error
    } finally {
      loading.value = false
    }
  }

  // 重置状态
  const resetState = (): void => {
    productImages.value = []
    currentProductImage.value = null
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
    productImages: readonly(productImages),
    currentProductImage: readonly(currentProductImage),
    loading: readonly(loading),
    pagination: readonly(pagination),

    // 计算属性
    hasProductImages,
    isLoading,

    // 方法
    fetchProductImages,
    fetchImagesByProductId,
    fetchProductImage,
    createProductImage,
    updateProductImage,
    deleteProductImage,
    resetState
  }
})

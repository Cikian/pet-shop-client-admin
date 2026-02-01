import { defineStore } from 'pinia'
import { ref, computed, readonly } from 'vue'
import { api } from '@/api'
import type { SKU, PaginationInfo, QueryParams, PageResponse } from '@/types'

export const useSkuStore = defineStore('sku', () => {
  // 状态
  const skus = ref<SKU[]>([])
  const currentSku = ref<SKU | null>(null)
  const loading = ref(false)
  const pagination = ref<PaginationInfo>({
    pageNo: 1,
    pageSize: 10,
    total: 0,
    totalPages: 0
  })

  // 计算属性
  const hasSkus = computed(() => skus.value.length > 0)
  const isLoading = computed(() => loading.value)

  // 获取SKU列表
  const fetchSkus = async (params: QueryParams = {}): Promise<void> => {
    loading.value = true
    try {
      const queryParams = {
        pageNo: params.pageNo || pagination.value.pageNo,
        pageSize: params.pageSize || pagination.value.pageSize,
        ...params
      }

      const response = await api.sku.list(queryParams) as PageResponse<SKU>

      skus.value = response.records
      pagination.value = {
        pageNo: response.current,
        pageSize: response.size,
        total: response.total,
        totalPages: response.pages
      }
    } catch (error) {
      console.error('Failed to fetch SKUs:', error)
      throw error
    } finally {
      loading.value = false
    }
  }

  // 根据商品ID获取SKU
  const fetchSkusByProductId = async (productId: number): Promise<SKU[]> => {
    loading.value = true
    try {
      const skuList = await api.sku.getByProductId(productId) as SKU[]
      skus.value = skuList
      return skuList
    } catch (error) {
      console.error('Failed to fetch SKUs by product ID:', error)
      throw error
    } finally {
      loading.value = false
    }
  }

  // 获取单个SKU
  const fetchSku = async (id: number): Promise<SKU> => {
    loading.value = true
    try {
      const sku = await api.sku.get(id) as SKU
      currentSku.value = sku
      return sku
    } catch (error) {
      console.error('Failed to fetch SKU:', error)
      throw error
    } finally {
      loading.value = false
    }
  }

  // 创建SKU
  const createSku = async (sku: Omit<SKU, 'id' | 'createTime' | 'updateTime' | 'delFlag'>): Promise<SKU> => {
    loading.value = true
    try {
      const newSku = await api.sku.create(sku) as SKU
      skus.value.unshift(newSku)
      return newSku
    } catch (error) {
      console.error('Failed to create SKU:', error)
      throw error
    } finally {
      loading.value = false
    }
  }

  // 更新SKU
  const updateSku = async (sku: SKU): Promise<SKU> => {
    loading.value = true
    try {
      const updatedSku = await api.sku.update(sku) as SKU

      // 更新列表中的SKU
      const index = skus.value.findIndex(s => s.id === sku.id)
      if (index !== -1) {
        skus.value[index] = updatedSku
      }

      // 更新当前SKU
      if (currentSku.value?.id === sku.id) {
        currentSku.value = updatedSku
      }

      return updatedSku
    } catch (error) {
      console.error('Failed to update SKU:', error)
      throw error
    } finally {
      loading.value = false
    }
  }

  // 删除SKU
  const deleteSku = async (id: number): Promise<void> => {
    loading.value = true
    try {
      await api.sku.delete(id)

      // 从列表中移除SKU
      skus.value = skus.value.filter(s => s.id !== id)

      // 如果删除的是当前SKU，清空当前SKU
      if (currentSku.value?.id === id) {
        currentSku.value = null
      }
    } catch (error) {
      console.error('Failed to delete SKU:', error)
      throw error
    } finally {
      loading.value = false
    }
  }

  // 重置状态
  const resetState = (): void => {
    skus.value = []
    currentSku.value = null
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
    skus: readonly(skus),
    currentSku: readonly(currentSku),
    loading: readonly(loading),
    pagination: readonly(pagination),

    // 计算属性
    hasSkus,
    isLoading,

    // 方法
    fetchSkus,
    fetchSkusByProductId,
    fetchSku,
    createSku,
    updateSku,
    deleteSku,
    resetState
  }
})

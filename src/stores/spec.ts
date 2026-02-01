import { defineStore } from 'pinia'
import { ref, computed, readonly } from 'vue'
import { api } from '@/api'
import type { SpecKey, SpecValue, SKUSpecRelation, PaginationInfo, QueryParams, PageResponse } from '@/types'

export const useSpecStore = defineStore('spec', () => {
  // 状态
  const specKeys = ref<SpecKey[]>([])
  const specValues = ref<SpecValue[]>([])
  const skuSpecRelations = ref<SKUSpecRelation[]>([])
  const currentSpecKey = ref<SpecKey | null>(null)
  const currentSpecValue = ref<SpecValue | null>(null)
  const loading = ref(false)
  const pagination = ref<PaginationInfo>({
    pageNo: 1,
    pageSize: 10,
    total: 0,
    totalPages: 0
  })

  // 计算属性
  const hasSpecKeys = computed(() => specKeys.value.length > 0)
  const hasSpecValues = computed(() => specValues.value.length > 0)
  const isLoading = computed(() => loading.value)

  // 获取规格键列表
  const fetchSpecKeys = async (params: QueryParams = {}): Promise<void> => {
    loading.value = true
    try {
      const queryParams = {
        pageNo: params.pageNo || pagination.value.pageNo,
        pageSize: params.pageSize || pagination.value.pageSize,
        ...params
      }

      const response = await api.specKey.list(queryParams) as PageResponse<SpecKey>

      specKeys.value = response.records
      pagination.value = {
        pageNo: response.current,
        pageSize: response.size,
        total: response.total,
        totalPages: response.pages
      }
    } catch (error) {
      console.error('Failed to fetch spec keys:', error)
      throw error
    } finally {
      loading.value = false
    }
  }

  // 根据商品或SKU ID获取规格键
  const fetchSpecKeysByProductOrSkuId = async (params: { pId?: number; skuId?: number }): Promise<SpecKey[]> => {
    loading.value = true
    try {
      const keys = await api.specKey.getByProductOrSkuId(params) as SpecKey[]
      specKeys.value = keys
      return keys
    } catch (error) {
      console.error('Failed to fetch spec keys by product or SKU ID:', error)
      throw error
    } finally {
      loading.value = false
    }
  }

  // 获取规格值列表
  const fetchSpecValues = async (params: QueryParams = {}): Promise<void> => {
    loading.value = true
    try {
      const queryParams = {
        pageNo: params.pageNo || pagination.value.pageNo,
        pageSize: params.pageSize || pagination.value.pageSize,
        ...params
      }

      const response = await api.specValue.list(queryParams) as PageResponse<SpecValue>

      specValues.value = response.records
      pagination.value = {
        pageNo: response.current,
        pageSize: response.size,
        total: response.total,
        totalPages: response.pages
      }
    } catch (error) {
      console.error('Failed to fetch spec values:', error)
      throw error
    } finally {
      loading.value = false
    }
  }

  // 根据规格键ID获取规格值
  const fetchSpecValuesBySpecKeyId = async (specKeyId: number): Promise<SpecValue[]> => {
    loading.value = true
    try {
      const values = await api.specValue.getBySpecKeyId(specKeyId) as SpecValue[]
      specValues.value = values
      return values
    } catch (error) {
      console.error('Failed to fetch spec values by spec key ID:', error)
      throw error
    } finally {
      loading.value = false
    }
  }

  // 获取SKU规格关系
  const fetchSkuSpecRelations = async (params: QueryParams = {}): Promise<void> => {
    loading.value = true
    try {
      const queryParams = {
        pageNo: params.pageNo || pagination.value.pageNo,
        pageSize: params.pageSize || pagination.value.pageSize,
        ...params
      }

      const response = await api.skuSpec.list(queryParams) as PageResponse<SKUSpecRelation>

      skuSpecRelations.value = response.records
      pagination.value = {
        pageNo: response.current,
        pageSize: response.size,
        total: response.total,
        totalPages: response.pages
      }
    } catch (error) {
      console.error('Failed to fetch SKU spec relations:', error)
      throw error
    } finally {
      loading.value = false
    }
  }

  // 根据SKU ID获取规格关系
  const fetchSkuSpecRelationsBySkuId = async (skuId: number): Promise<SKUSpecRelation[]> => {
    loading.value = true
    try {
      const relations = await api.skuSpec.getBySkuId(skuId) as SKUSpecRelation[]
      skuSpecRelations.value = relations
      return relations
    } catch (error) {
      console.error('Failed to fetch SKU spec relations by SKU ID:', error)
      throw error
    } finally {
      loading.value = false
    }
  }

  // 创建规格键
  const createSpecKey = async (specKey: Omit<SpecKey, 'id' | 'createTime' | 'updateTime' | 'delFlag'>): Promise<SpecKey> => {
    loading.value = true
    try {
      const newSpecKey = await api.specKey.create(specKey) as SpecKey
      specKeys.value.unshift(newSpecKey)
      return newSpecKey
    } catch (error) {
      console.error('Failed to create spec key:', error)
      throw error
    } finally {
      loading.value = false
    }
  }

  // 更新规格键
  const updateSpecKey = async (specKey: SpecKey): Promise<SpecKey> => {
    loading.value = true
    try {
      const updatedSpecKey = await api.specKey.update(specKey) as SpecKey

      // 更新列表中的规格键
      const index = specKeys.value.findIndex(key => key.id === specKey.id)
      if (index !== -1) {
        specKeys.value[index] = updatedSpecKey
      }

      // 更新当前规格键
      if (currentSpecKey.value?.id === specKey.id) {
        currentSpecKey.value = updatedSpecKey
      }

      return updatedSpecKey
    } catch (error) {
      console.error('Failed to update spec key:', error)
      throw error
    } finally {
      loading.value = false
    }
  }

  // 删除规格键
  const deleteSpecKey = async (id: number): Promise<void> => {
    loading.value = true
    try {
      await api.specKey.delete(id)

      // 从列表中移除规格键
      specKeys.value = specKeys.value.filter(key => key.id !== id)

      // 如果删除的是当前规格键，清空当前规格键
      if (currentSpecKey.value?.id === id) {
        currentSpecKey.value = null
      }
    } catch (error) {
      console.error('Failed to delete spec key:', error)
      throw error
    } finally {
      loading.value = false
    }
  }

  // 创建规格值
  const createSpecValue = async (specValue: Omit<SpecValue, 'id' | 'createTime' | 'updateTime' | 'delFlag'>): Promise<SpecValue> => {
    loading.value = true
    try {
      const newValue = await api.specValue.create(specValue) as SpecValue
      specValues.value.unshift(newValue)
      return newValue
    } catch (error) {
      console.error('Failed to create spec value:', error)
      throw error
    } finally {
      loading.value = false
    }
  }

  // 更新规格值
  const updateSpecValue = async (specValue: SpecValue): Promise<SpecValue> => {
    loading.value = true
    try {
      const updatedValue = await api.specValue.update(specValue) as SpecValue

      // 更新列表中的规格值
      const index = specValues.value.findIndex(value => value.id === specValue.id)
      if (index !== -1) {
        specValues.value[index] = updatedValue
      }

      // 更新当前规格值
      if (currentSpecValue.value?.id === specValue.id) {
        currentSpecValue.value = updatedValue
      }

      return updatedValue
    } catch (error) {
      console.error('Failed to update spec value:', error)
      throw error
    } finally {
      loading.value = false
    }
  }

  // 删除规格值
  const deleteSpecValue = async (id: number): Promise<void> => {
    loading.value = true
    try {
      await api.specValue.delete(id)

      // 从列表中移除规格值
      specValues.value = specValues.value.filter(value => value.id !== id)

      // 如果删除的是当前规格值，清空当前规格值
      if (currentSpecValue.value?.id === id) {
        currentSpecValue.value = null
      }
    } catch (error) {
      console.error('Failed to delete spec value:', error)
      throw error
    } finally {
      loading.value = false
    }
  }

  // 创建SKU规格关系
  const createSkuSpecRelation = async (relation: Omit<SKUSpecRelation, 'id' | 'createTime' | 'updateTime' | 'delFlag'>): Promise<SKUSpecRelation> => {
    loading.value = true
    try {
      const newRelation = await api.skuSpec.create(relation) as SKUSpecRelation
      skuSpecRelations.value.unshift(newRelation)
      return newRelation
    } catch (error) {
      console.error('Failed to create SKU spec relation:', error)
      throw error
    } finally {
      loading.value = false
    }
  }

  // 删除SKU规格关系
  const deleteSkuSpecRelation = async (id: number): Promise<void> => {
    loading.value = true
    try {
      await api.skuSpec.delete(id)

      // 从列表中移除关系
      skuSpecRelations.value = skuSpecRelations.value.filter(relation => relation.id !== id)
    } catch (error) {
      console.error('Failed to delete SKU spec relation:', error)
      throw error
    } finally {
      loading.value = false
    }
  }

  // 重置状态
  const resetState = (): void => {
    specKeys.value = []
    specValues.value = []
    skuSpecRelations.value = []
    currentSpecKey.value = null
    currentSpecValue.value = null
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
    specKeys: readonly(specKeys),
    specValues: readonly(specValues),
    skuSpecRelations: readonly(skuSpecRelations),
    currentSpecKey: readonly(currentSpecKey),
    currentSpecValue: readonly(currentSpecValue),
    loading: readonly(loading),
    pagination: readonly(pagination),

    // 计算属性
    hasSpecKeys,
    hasSpecValues,
    isLoading,

    // 方法
    fetchSpecKeys,
    fetchSpecKeysByProductOrSkuId,
    fetchSpecValues,
    fetchSpecValuesBySpecKeyId,
    fetchSkuSpecRelations,
    fetchSkuSpecRelationsBySkuId,
    createSpecKey,
    updateSpecKey,
    deleteSpecKey,
    createSpecValue,
    updateSpecValue,
    deleteSpecValue,
    createSkuSpecRelation,
    deleteSkuSpecRelation,
    resetState
  }
})

import { defineStore } from 'pinia'
import { ref, computed, readonly } from 'vue'
import { api } from '@/api'
import type { Category, PaginationInfo, QueryParams } from '@/types'

export const useCategoryStore = defineStore('category', () => {
  // 状态
  const categories = ref<Category[]>([])
  const currentCategory = ref<Category | null>(null)
  const loading = ref(false)
  const pagination = ref<PaginationInfo>({
    pageNo: 1,
    pageSize: 10,
    total: 0,
    totalPages: 0
  })

  // 计算属性
  const hasCategories = computed(() => categories.value.length > 0)
  const isLoading = computed(() => loading.value)

  // 获取分类列表
  const fetchCategories = async (params: QueryParams = {}): Promise<void> => {
    loading.value = true
    try {
      const queryParams = {
        pageNo: params.pageNo || pagination.value.pageNo,
        pageSize: params.pageSize || pagination.value.pageSize,
        ...params
      }

      const response = await api.category.list(queryParams) as any

      categories.value = response.records
      pagination.value = {
        pageNo: response.current,
        pageSize: response.size,
        total: response.total,
        totalPages: response.pages
      }
    } catch (error) {
      console.error('Failed to fetch categories:', error)
      throw error
    } finally {
      loading.value = false
    }
  }

  // 获取所有分类（不分页）
  const fetchAllCategories = async (): Promise<Category[]> => {
    loading.value = true
    try {
      const response = await api.category.list({ pageSize: 1000 }) as any
      return response.records
    } catch (error) {
      console.error('Failed to fetch all categories:', error)
      throw error
    } finally {
      loading.value = false
    }
  }

  // 获取单个分类
  const fetchCategory = async (id: number): Promise<Category> => {
    loading.value = true
    try {
      const category = await api.category.get(id) as Category
      currentCategory.value = category
      return category
    } catch (error) {
      console.error('Failed to fetch category:', error)
      throw error
    } finally {
      loading.value = false
    }
  }

  // 创建分类
  const createCategory = async (category: Omit<Category, 'id' | 'createTime' | 'updateTime' | 'delFlag'>): Promise<Category> => {
    loading.value = true
    try {
      const newCategory = await api.category.create(category) as Category
      categories.value.unshift(newCategory)
      return newCategory
    } catch (error) {
      console.error('Failed to create category:', error)
      throw error
    } finally {
      loading.value = false
    }
  }

  // 更新分类
  const updateCategory = async (category: Category): Promise<Category> => {
    loading.value = true
    try {
      const updatedCategory = await api.category.update(category) as Category

      // 更新列表中的分类
      const index = categories.value.findIndex(c => c.id === category.id)
      if (index !== -1) {
        categories.value[index] = updatedCategory
      }

      // 更新当前分类
      if (currentCategory.value?.id === category.id) {
        currentCategory.value = updatedCategory
      }

      return updatedCategory
    } catch (error) {
      console.error('Failed to update category:', error)
      throw error
    } finally {
      loading.value = false
    }
  }

  // 删除分类
  const deleteCategory = async (id: number): Promise<void> => {
    loading.value = true
    try {
      await api.category.delete(id)

      // 从列表中移除分类
      categories.value = categories.value.filter(c => c.id !== id)

      // 如果删除的是当前分类，清空当前分类
      if (currentCategory.value?.id === id) {
        currentCategory.value = null
      }
    } catch (error) {
      console.error('Failed to delete category:', error)
      throw error
    } finally {
      loading.value = false
    }
  }

  // 搜索分类
  const searchCategories = async (keyword: string, params: QueryParams = {}): Promise<void> => {
    await fetchCategories({
      ...params,
      keyword
    })
  }

  // 重置状态
  const resetState = (): void => {
    categories.value = []
    currentCategory.value = null
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
    categories: readonly(categories),
    currentCategory: readonly(currentCategory),
    loading: readonly(loading),
    pagination: readonly(pagination),

    // 计算属性
    hasCategories,
    isLoading,

    // 方法
    fetchCategories,
    fetchAllCategories,
    fetchCategory,
    createCategory,
    updateCategory,
    deleteCategory,
    searchCategories,
    resetState
  }
})

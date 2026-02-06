import { defineStore } from 'pinia'
import { ref, computed, readonly } from 'vue'
import { api } from '@/api'
import type { PaginationInfo, QueryParams } from '@/types'

// 用户类型定义
export interface User {
  id: string
  username: string
  nickname: string
  avatar: string
  birthday: string | Date
  sex: number
  email: string
  phone: string
  status: number
  lastLoginTime: string | Date
  lastLoginIp: string
  createTime: string | Date
  updateTime?: string | Date
}

export const useUserStore = defineStore('user', () => {
  // 状态
  const users = ref<User[]>([])
  const currentUser = ref<User | null>(null)
  const loading = ref(false)
  const pagination = ref<PaginationInfo>({
    pageNo: 1,
    pageSize: 10,
    total: 0,
    totalPages: 0
  })

  // 计算属性
  const hasUsers = computed(() => users.value.length > 0)
  const isLoading = computed(() => loading.value)

  // 获取用户列表
  const fetchUsers = async (params: QueryParams = {}): Promise<void> => {
    loading.value = true
    try {
      const queryParams = {
        pageNo: params.pageNo || pagination.value.pageNo,
        pageSize: params.pageSize || pagination.value.pageSize,
        ...params
      }

      const response = await api.user.list(queryParams) as any
      console.log('User API response:', response)

      // 检查响应格式，适配不同的API响应结构
      if (response.records) {
        // 标准分页响应格式
        users.value = response.records
        pagination.value = {
          pageNo: response.current || response.pageNo || 1,
          pageSize: response.size || response.pageSize || 10,
          total: response.total || 0,
          totalPages: response.pages || 0
        }
      } else if (Array.isArray(response)) {
        // 直接返回数组的格式
        users.value = response
        pagination.value = {
          pageNo: 1,
          pageSize: response.length,
          total: response.length,
          totalPages: 1
        }
      } else {
        // 其他格式，设为空数组
        users.value = []
        pagination.value = {
          pageNo: 1,
          pageSize: 10,
          total: 0,
          totalPages: 0
        }
      }
    } catch (error) {
      console.error('Failed to fetch users:', error)
      // 错误时也确保有默认值
      users.value = []
      pagination.value = {
        pageNo: 1,
        pageSize: 10,
        total: 0,
        totalPages: 0
      }
    } finally {
      loading.value = false
    }
  }

  // 获取单个用户
  const fetchUser = async (id: string): Promise<User> => {
    loading.value = true
    try {
      const user = await api.user.get(id) as User
      currentUser.value = user
      return user
    } catch (error) {
      console.error('Failed to fetch user:', error)
      throw error
    } finally {
      loading.value = false
    }
  }

  // 搜索用户
  const searchUsers = async (keyword: string, params: QueryParams = {}): Promise<void> => {
    await fetchUsers({
      ...params,
      keyword
    })
  }

  // 重置状态
  const resetState = (): void => {
    users.value = []
    currentUser.value = null
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
    users: readonly(users),
    currentUser: readonly(currentUser),
    loading: readonly(loading),
    pagination: readonly(pagination),

    // 计算属性
    hasUsers,
    isLoading,

    // 方法
    fetchUsers,
    fetchUser,
    searchUsers,
    resetState
  }
})
import { defineStore } from 'pinia'
import { ref, computed, readonly } from 'vue'
import { httpService } from '@/api/http'
import type { User, LoginRequest, LoginResponse } from '@/types'

// 认证状态接口
export interface AuthState {
  accessToken: string | null
  user: User | null
  isAuthenticated: boolean
}

export const useAuthStore = defineStore('auth', () => {
  // 状态
  const accessToken = ref<string | null>(localStorage.getItem('accessToken'))
  const user = ref<User | null>(null)

  // 计算属性
  const isAuthenticated = computed(() => !!accessToken.value)

  // 获取访问令牌
  const getAccessToken = (): string | null => {
    return accessToken.value
  }

  // 更新访问令牌
  const updateToken = (token: string): void => {
    accessToken.value = token
    localStorage.setItem('accessToken', token)
  }

  // 登录
  const login = async (credentials: LoginRequest): Promise<void> => {
    try {
      const response = await httpService.postAction<LoginResponse>('/api/v1/auth/login', credentials)

      // 存储访问令牌到状态和本地存储
      accessToken.value = response.accessToken
      localStorage.setItem('accessToken', response.accessToken)

      // 存储用户信息到状态
      user.value = response.user

      // 如果有刷新令牌，也存储到本地存储
      if (response.refreshToken) {
        localStorage.setItem('refreshToken', response.refreshToken)
      }
    } catch (error) {
      // 清理状态
      accessToken.value = null
      user.value = null
      localStorage.removeItem('accessToken')
      localStorage.removeItem('refreshToken')
      throw error
    }
  }

  // 登出
  const logout = (): void => {
    // 清理状态
    accessToken.value = null
    user.value = null

    // 清理本地存储
    localStorage.removeItem('accessToken')
    localStorage.removeItem('refreshToken')
  }

  // 刷新令牌
  const refreshToken = async (): Promise<void> => {
    const refreshTokenValue = localStorage.getItem('refreshToken')
    if (!refreshTokenValue) {
      throw new Error('No refresh token available')
    }

    try {
      const response = await httpService.postAction<LoginResponse>('/auth/refresh', {
        refreshToken: refreshTokenValue
      })

      // 更新访问令牌
      accessToken.value = response.accessToken
      localStorage.setItem('accessToken', response.accessToken)

      // 更新用户信息
      user.value = response.user

      // 如果有新的刷新令牌，更新它
      if (response.refreshToken) {
        localStorage.setItem('refreshToken', response.refreshToken)
      }
    } catch (error) {
      // 刷新失败，清理所有状态
      logout()
      throw error
    }
  }

  // 初始化时从本地存储恢复用户信息
  const initializeAuth = async (): Promise<void> => {
    const token = localStorage.getItem('accessToken')
    if (token) {
      accessToken.value = token
      try {
        // 尝试获取用户信息
        const userInfo = await httpService.getAction<User>('/auth/userinfo')
        user.value = userInfo
      } catch (error) {
        // 如果获取用户信息失败，清理状态
        logout()
      }
    }
  }

  return {
    // 状态
    accessToken: readonly(accessToken),
    user: readonly(user),

    // 计算属性
    isAuthenticated,

    // 方法
    getAccessToken,
    updateToken,
    login,
    logout,
    refreshToken,
    initializeAuth
  }
})

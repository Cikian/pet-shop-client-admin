import axios, { AxiosInstance, AxiosResponse } from 'axios'

// HTTP服务接口定义
export interface HttpService {
  getAction<T>(url: string, params?: any): Promise<T>
  postAction<T>(url: string, data?: any): Promise<T>
  putAction<T>(url: string, data?: any): Promise<T>
  deleteAction<T>(url: string): Promise<T>
}

// 获取访问令牌的函数
const getAccessToken = (): string | null => {
  return localStorage.getItem('accessToken')
}

// 更新访问令牌的函数
const updateAccessToken = (token: string): void => {
  localStorage.setItem('accessToken', token)
  // 动态导入auth store以避免循环依赖
  import('@/stores/auth').then(({ useAuthStore }) => {
    const authStore = useAuthStore()
    authStore.updateToken(token)
  })
}

// 处理未授权的函数
const handleUnauthorized = (): void => {
  localStorage.removeItem('accessToken')
  localStorage.removeItem('refreshToken')
  // 动态导入auth store以避免循环依赖
  import('@/stores/auth').then(({ useAuthStore }) => {
    const authStore = useAuthStore()
    authStore.logout()
  })
  // 检查当前是否已经在登录页面
  if (window.location.pathname !== '/login') {
    // 动态导入router以避免循环依赖
    import('@/router').then(({ default: router }) => {
      router.push('/login')
    })
  }
}

// 创建axios实例
const apiClient: AxiosInstance = axios.create({
  baseURL: import.meta.env.DEV ? 'http://127.0.0.1:18500' : '/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
})

// 请求拦截器 - 自动添加Authorization请求头
apiClient.interceptors.request.use(
  (config) => {
    const token = getAccessToken()
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// 响应拦截器 - 自动令牌更新和Result对象解析
apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    // 检查是否有新令牌需要更新
    const newToken = response.headers['new-token']
    if (newToken) {
      updateAccessToken(newToken)
    }
    
    // 解析Result对象，返回result属性中的数据
    if (response.data && typeof response.data === 'object' && 'result' in response.data) {
      return response.data.result
    }
    
    return response.data
  },
  (error) => {
    // 处理401未授权错误
    if (error.response?.status === 401) {
      handleUnauthorized()
    }
    
    return Promise.reject(error)
  }
)

// 封装的HTTP方法
export const httpService: HttpService = {
  getAction: <T>(url: string, params?: any): Promise<T> => 
    apiClient.get(url, { params }),
  postAction: <T>(url: string, data?: any): Promise<T> => {
    if (data instanceof FormData) {
      // 对于FormData，不设置Content-Type，让浏览器自动设置
      return apiClient.post(url, data, {
        headers: {
          'Content-Type': undefined
        }
      })
    }
    return apiClient.post(url, data)
  },
  
  putAction: <T>(url: string, data?: any): Promise<T> => {
    if (data instanceof FormData) {
      // 对于FormData，不设置Content-Type，让浏览器自动设置
      return apiClient.put(url, data, {
        headers: {
          'Content-Type': undefined
        }
      })
    }
    return apiClient.put(url, data)
  },
  
  deleteAction: <T>(url: string): Promise<T> => 
    apiClient.delete(url)
}

export default apiClient
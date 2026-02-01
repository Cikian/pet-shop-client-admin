// 环境配置
export const isDev = import.meta.env.DEV
export const isProd = import.meta.env.PROD

// API基础URL
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api'

// 应用配置
export const APP_CONFIG = {
  title: '电商管理后台',
  version: '1.0.0',
  description: '现代化电商管理系统'
}
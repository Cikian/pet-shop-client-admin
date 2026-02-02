// 基础类型定义
export interface BaseEntity {
  id?: number
  createTime?: Date
  updateTime?: Date
  delFlag?: boolean
}

// 分页信息
export interface PaginationInfo {
  pageNo: number
  pageSize: number
  total: number
  totalPages: number
}

// 查询参数
export interface QueryParams {
  pageNo?: number
  pageSize?: number
  keyword?: string
  [key: string]: any
}

// API响应结构
export interface ApiResponse<T = any> {
  success: boolean
  result: T
  message?: string
  code?: number
  timestamp?: number
}

// HTTP请求结果包装
export interface Result<T = any> {
  result: T
}

// 用户信息
export interface User {
  id: number
  username: string
  realname?: string
  avatar?: string
  email?: string
  phone?: string
  status: number
}

// 登录请求
export interface LoginRequest {
  username: string
  password: string
}

// 登录响应
export interface LoginResponse {
  accessToken: string
  refreshToken: string | null
  tokenType: string
  expiresIn: number | null
  user: User
  authorities: string[]
}

// 商品分类
export interface Category extends BaseEntity {
  name: string
  cateCode: string
}

// 规格键
export interface SpecKey extends BaseEntity {
  name: string
  categoryId?: string
  inputType: 'select' | 'text' | 'image'
  sortOrder: number
}

// 规格值
export interface SpecValue extends BaseEntity {
  specKeyId: number
  value: string
  image?: string
  sortOrder: number
}

// 商品
export interface Product extends BaseEntity {
  id?: number
  name: string
  description: string
  categoryId?: string
  mainImg?: string
  status: number
  createTime?: Date
  updateTime?: Date
  delFlag?: boolean
}

// 商品附图
export interface ProductImage extends BaseEntity {
  id?: number
  productId: number
  description?: string
  imgUrl: string
  sortOrder: number
  status: boolean
  delFlag?: boolean
}

// SKU
export interface SKU extends BaseEntity {
  id?: number
  productId: number
  skuCode: string
  name: string
  price: number
  originalPrice: number
  stock: number
  warningStock: number
  isDefault: boolean
  delFlag?: boolean
}

// SKU规格关系
export interface SKUSpecRelation extends BaseEntity {
  id?: number
  skuId: number
  specKeyId: number
  specValueId: number
  delFlag?: boolean
}

// 分页响应
export interface PageResponse<T> {
  records: T[]
  total: number
  size: number
  current: number
  pages: number
}
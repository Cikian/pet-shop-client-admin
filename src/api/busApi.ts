import { httpService } from './http'

// API接口类型定义
export interface ApiInterface {
  goods: {
    list: (params: any) => Promise<any>,
    get: (id: number) => Promise<any>,
    create: (data: any) => Promise<any>,
    update: (data: any) => Promise<any>,
    delete: (id: number) => Promise<any>
  },
  productImage: {
    list: (params: any) => Promise<any>,
    get: (id: number) => Promise<any>,
    getByProductId: (productId: number) => Promise<any>,
    create: (data: any) => Promise<any>,
    update: (data: any) => Promise<any>,
    delete: (id: number) => Promise<any>
  },
  category: {
    list: (params: any) => Promise<any>,
    get: (id: number) => Promise<any>,
    create: (data: any) => Promise<any>,
    update: (data: any) => Promise<any>,
    delete: (id: number) => Promise<any>
  },
  sku: {
    list: (params: any) => Promise<any>,
    get: (id: number) => Promise<any>,
    getByProductId: (productId: number) => Promise<any>,
    create: (data: any) => Promise<any>,
    update: (data: any) => Promise<any>,
    delete: (id: number) => Promise<any>
  },
  specKey: {
    list: (params: any) => Promise<any>,
    get: (id: number) => Promise<any>,
    getByProductOrSkuId: (params: { pId?: number; skuId?: number }) => Promise<any>,
    create: (data: any) => Promise<any>,
    update: (data: any) => Promise<any>,
    delete: (id: number) => Promise<any>
  },
  specValue: {
    list: (params: any) => Promise<any>,
    get: (id: number) => Promise<any>,
    getBySpecKeyId: (specKeyId: number) => Promise<any>,
    create: (data: any) => Promise<any>,
    update: (data: any) => Promise<any>,
    delete: (id: number) => Promise<any>
  },
  skuSpec: {
    list: (params: any) => Promise<any>,
    get: (id: number) => Promise<any>,
    getBySkuId: (skuId: number) => Promise<any>,
    create: (data: any) => Promise<any>,
    update: (data: any) => Promise<any>,
    delete: (id: number) => Promise<any>
  }
}

// API接口定义
export const api: ApiInterface = {
  // 商品相关API
  goods: {
    list: (params: any) => httpService.getAction('/api/goods/list', params),
    get: (id: number) => httpService.getAction(`/api/goods/${id}`),
    create: (data: any) => httpService.postAction('/api/goods', data),
    update: (data: any) => httpService.putAction('/api/goods', data),
    delete: (id: number) => httpService.deleteAction(`/api/goods/${id}`)
  },
  
  // 商品附图相关API
  productImage: {
    list: (params: any) => httpService.getAction('/api/proimg/list', params),
    get: (id: number) => httpService.getAction(`/api/proimg/${id}`),
    getByProductId: (productId: number) => httpService.getAction('/api/proimg', { productId }),
    create: (data: any) => httpService.postAction('/api/proimg', data),
    update: (data: any) => httpService.putAction('/api/proimg', data),
    delete: (id: number) => httpService.deleteAction(`/api/proimg/${id}`)
  },
  
  // 商品分类相关API
  category: {
    list: (params: any) => httpService.getAction('/api/cate/list', params),
    get: (id: number) => httpService.getAction(`/api/cate/${id}`),
    create: (data: any) => httpService.postAction('/api/cate', data),
    update: (data: any) => httpService.putAction('/api/cate', data),
    delete: (id: number) => httpService.deleteAction(`/api/cate/${id}`)
  },
  
  // SKU相关API
  sku: {
    list: (params: any) => httpService.getAction('/api/sku/list', params),
    get: (id: number) => httpService.getAction(`/api/sku/${id}`),
    getByProductId: (productId: number) => httpService.getAction('/api/sku', { productId }),
    create: (data: any) => httpService.postAction('/api/sku', data),
    update: (data: any) => httpService.putAction('/api/sku', data),
    delete: (id: number) => httpService.deleteAction(`/api/sku/${id}`)
  },
  
  // 规格键相关API
  specKey: {
    list: (params: any) => httpService.getAction('/api/spkey/list', params),
    get: (id: number) => httpService.getAction(`/api/spkey/${id}`),
    getByProductOrSkuId: (params: { pId?: number; skuId?: number }) => httpService.getAction('/api/spkey', params),
    create: (data: any) => httpService.postAction('/api/spkey', data),
    update: (data: any) => httpService.putAction('/api/spkey', data),
    delete: (id: number) => httpService.deleteAction(`/api/spkey/${id}`)
  },
  
  // 规格值相关API
  specValue: {
    list: (params: any) => httpService.getAction('/api/spvalue/list', params),
    get: (id: number) => httpService.getAction(`/api/spvalue/${id}`),
    getBySpecKeyId: (specKeyId: number) => httpService.getAction('/api/spvalue', { specKeyId }),
    create: (data: any) => httpService.postAction('/api/spvalue', data),
    update: (data: any) => httpService.putAction('/api/spvalue', data),
    delete: (id: number) => httpService.deleteAction(`/api/spvalue/${id}`)
  },
  
  // SKU规格关系相关API
  skuSpec: {
    list: (params: any) => httpService.getAction('/api/skuSpec/list', params),
    get: (id: number) => httpService.getAction(`/api/skuSpec/${id}`),
    getBySkuId: (skuId: number) => httpService.getAction('/api/skuSpec', { skuId }),
    create: (data: any) => httpService.postAction('/api/skuSpec', data),
    update: (data: any) => httpService.putAction('/api/skuSpec', data),
    delete: (id: number) => httpService.deleteAction(`/api/skuSpec/${id}`)
  }
}

export default api

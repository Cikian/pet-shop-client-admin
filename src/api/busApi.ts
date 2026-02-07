import { httpService } from './http'

// API接口类型定义
export interface ApiInterface {
  goods: {
    list: (params: any) => Promise<any>,
    get: (id: string) => Promise<any>,
    create: (data: any) => Promise<any>,
    update: (data: any) => Promise<any>,
    delete: (id: string) => Promise<any>
  },
  productImage: {
    list: (params: any) => Promise<any>,
    get: (id: string) => Promise<any>,
    getByProductId: (productId: string) => Promise<any>,
    create: (data: any) => Promise<any>,
    update: (data: any) => Promise<any>,
    delete: (id: string) => Promise<any>
  },
  category: {
    list: (params: any) => Promise<any>,
    get: (id: string) => Promise<any>,
    create: (data: any) => Promise<any>,
    update: (data: any) => Promise<any>,
    delete: (id: string) => Promise<any>
  },
  sku: {
    list: (params: any) => Promise<any>,
    get: (id: string) => Promise<any>,
    getByProductId: (productId: string) => Promise<any>,
    create: (data: any) => Promise<any>,
    update: (data: any) => Promise<any>,
    delete: (id: string) => Promise<any>
  },
  specKey: {
    list: (params: any) => Promise<any>,
    get: (id: string) => Promise<any>,
    getByProductId: (productId: string) => Promise<any>,
    getBySkuId: (skuId: string) => Promise<any>,
    create: (data: any) => Promise<any>,
    update: (data: any) => Promise<any>,
    delete: (id: string) => Promise<any>
  },
  specValue: {
    list: (params: any) => Promise<any>,
    get: (id: string) => Promise<any>,
    getBySpecKeyId: (specKeyId: string) => Promise<any>,
    create: (data: any) => Promise<any>,
    update: (data: any) => Promise<any>,
    delete: (id: string) => Promise<any>
  },
  skuSpec: {
    list: (params: any) => Promise<any>,
    get: (id: string) => Promise<any>,
    getBySkuId: (skuId: string) => Promise<any>,
    create: (data: any) => Promise<any>,
    update: (data: any) => Promise<any>,
    delete: (id: string) => Promise<any>
  },
  tags: {
    getList: (keyword: string) => Promise<any>,
    getByProductId: (productId: string) => Promise<any>
  },
  user: {
    list: (params: any) => Promise<any>,
    get: (id: string) => Promise<any>,
    getByRole: (params: any) => Promise<any>,
    getWithoutRole: (params: any) => Promise<any>
  },
  role: {
    // 角色管理
    list: (params: any) => Promise<any>,
    add: (data: any) => Promise<any>,
    edit: (data: any) => Promise<any>,
    delete: (id: string) => Promise<any>,
    
    // 权限管理
    permissions: (params: any) => Promise<any>,
    permissionsByRole: (params: any) => Promise<any>,
    permissionsWithoutRole: (params: any) => Promise<any>,
    addPermission: (data: any) => Promise<any>,
    editPermission: (data: any) => Promise<any>,
    deletePermission: (id: string) => Promise<any>,
    
    // 角色权限关联
    addRolePermission: (data: any) => Promise<any>,
    deleteRolePermission: (permissionId: string, roleId: string) => Promise<any>,
    
    // 用户角色关联
    addUserRole: (params: any) => Promise<any>,
    deleteUserRole: (userId: string, roleId: string) => Promise<any>
  }
}

// API接口定义
export const api: ApiInterface = {
  // 商品相关API
  goods: {
    list: (params: any) => httpService.getAction('/api/goods/list', params),
    get: (id: string) => httpService.getAction(`/api/goods/${id}`),
    create: (data: any) => httpService.postAction('/api/goods', data),
    update: (data: any) => httpService.putAction('/api/goods', data),
    delete: (id: string) => httpService.deleteAction(`/api/goods/${id}`)
  },
  
  // 商品附图相关API
  productImage: {
    list: (params: any) => httpService.getAction('/api/proimg/list', params),
    get: (id: string) => httpService.getAction(`/api/proimg/${id}`),
    getByProductId: (productId: string) => httpService.getAction('/api/proimg', { productId }),
    create: (data: any) => httpService.postAction('/api/proimg', data),
    update: (data: any) => httpService.putAction('/api/proimg', data),
    delete: (id: string) => httpService.deleteAction(`/api/proimg/${id}`)
  },
  
  // 商品分类相关API
  category: {
    list: (params: any) => httpService.getAction('/api/cate/list', params),
    get: (id: string) => httpService.getAction(`/api/cate/${id}`),
    create: (data: any) => httpService.postAction('/api/cate', data),
    update: (data: any) => httpService.putAction('/api/cate', data),
    delete: (id: string) => httpService.deleteAction(`/api/cate/${id}`)
  },
  
  // SKU相关API
  sku: {
    list: (params: any) => httpService.getAction('/api/sku/list', params),
    get: (id: string) => httpService.getAction(`/api/sku/${id}`),
    getByProductId: (productId: string) => httpService.getAction('/api/sku/product', { productId }),
    create: (data: any) => httpService.postAction('/api/sku', data),
    update: (data: any) => httpService.putAction('/api/sku', data),
    delete: (id: string) => httpService.deleteAction(`/api/sku/${id}`)
  },
  
  // 规格键相关API
  specKey: {
    list: (params: any) => httpService.getAction('/api/spkey/list', params),
    get: (id: string) => httpService.getAction(`/api/spkey/${id}`),
    getByProductId: (productId: string) => httpService.getAction('/api/spkey/product', { productId }),
    getBySkuId: (skuId: string) => httpService.getAction('/api/spkey/sku', { skuId }),
    create: (data: any) => httpService.postAction('/api/spkey', data),
    update: (data: any) => httpService.putAction('/api/spkey', data),
    delete: (id: string) => httpService.deleteAction(`/api/spkey/${id}`)
  },
  
  // 规格值相关API
  specValue: {
    list: (params: any) => httpService.getAction('/api/spvalue/list', params),
    get: (id: string) => httpService.getAction(`/api/spvalue/${id}`),
    getBySpecKeyId: (specKeyId: string) => httpService.getAction('/api/spvalue', { specKeyId }),
    create: (data: any) => httpService.postAction('/api/spvalue', data),
    update: (data: any) => httpService.putAction('/api/spvalue', data),
    delete: (id: string) => httpService.deleteAction(`/api/spvalue/${id}`)
  },
  
  // SKU规格关系相关API
  skuSpec: {
    list: (params: any) => httpService.getAction('/api/skuSpec/list', params),
    get: (id: string) => httpService.getAction(`/api/skuSpec/${id}`),
    getBySkuId: (skuId: string) => httpService.getAction('/api/skuSpec', { skuId }),
    create: (data: any) => httpService.postAction('/api/skuSpec', data),
    update: (data: any) => httpService.putAction('/api/skuSpec', data),
    delete: (id: string) => httpService.deleteAction(`/api/skuSpec/${id}`)
  },
  
  // 标签相关API
  tags: {
    getList: (keyword: string) => httpService.getAction('/api/tags/get', { keyword }),
    getByProductId: (productId: string) => httpService.getAction('/api/tags', { productId })
  },
  
  // 用户相关API
  user: {
    list: (params: any) => httpService.getAction('/api/user/list', params),
    get: (id: string) => httpService.getAction(`/api/user/${id}`),
    getByRole: (params: any) => httpService.getAction('/api/user/byRole', params),
    getWithoutRole: (params: any) => httpService.getAction('/api/user/withoutRole', params)
  },
  
  // 角色权限相关API
  role: {
    // 角色管理
    list: (params: any) => httpService.getAction('/api/role/list', params),
    add: (data: any) => httpService.postAction('/api/role/addRole', data),
    edit: (data: any) => httpService.putAction('/api/role/editRole', data),
    delete: (id: string) => httpService.deleteAction(`/api/role/deleteRole?id=${id}`),
    
    // 权限管理
    permissions: (params: any) => httpService.getAction('/api/role/permissions', params),
    permissionsByRole: (params: any) => httpService.getAction('/api/role/permissionsByRole', params),
    permissionsWithoutRole: (params: any) => httpService.getAction('/api/role/permissionsWithoutRole', params),
    addPermission: (data: any) => httpService.postAction('/api/role/addPermission', data),
    editPermission: (data: any) => httpService.putAction('/api/role/editPermission', data),
    deletePermission: (id: string) => httpService.deleteAction(`/api/role/deletePermission?id=${id}`),
    
    // 角色权限关联
    addRolePermission: (params: any) => httpService.postAction('/api/role/addRolePermission?roleId=' + params.roleId + '&permissionId=' + params.permissionId),
    deleteRolePermission: (permissionId: string, roleId: string) => httpService.deleteAction(`/api/role/deleteRolePermission?permissionId=${permissionId}&roleId=${roleId}`),
    
    // 用户角色关联
    addUserRole: (params: any) => httpService.postAction('/api/role/addUserRole?userId=' + params.userId + '&roleId=' + params.roleId),
    deleteUserRole: (userId: string, roleId: string) => httpService.deleteAction(`/api/role/deleteUserRole?userId=${userId}&roleId=${roleId}`)
  }
}

export default api

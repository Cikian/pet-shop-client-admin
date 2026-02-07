import { defineStore } from 'pinia'
import { ref, computed, readonly } from 'vue'
import { api } from '@/api'
import type { PaginationInfo, QueryParams } from '@/types'

// 角色类型定义
export interface Role {
  id: string
  roleName: string
  roleKey: string
  createTime: string | Date
  updateTime?: string | Date
}

// 权限类型定义
export interface Permission {
  id: string
  permissionName: string
  permissionCode: string
  createTime: string | Date
  updateTime?: string | Date
}

// 角色权限关联类型
export interface RolePermission {
  id: string
  roleId: string
  permissionId: string
  createTime: string | Date
}

// 用户角色关联类型
export interface UserRole {
  id: string
  userId: string
  roleId: string
  createTime: string | Date
}

export const useRoleStore = defineStore('role', () => {
  // 状态
  const roles = ref<Role[]>([])
  const permissions = ref<Permission[]>([])
  const rolePermissions = ref<RolePermission[]>([])
  const userRoles = ref<UserRole[]>([])
  const loading = ref(false)
  const pagination = ref<PaginationInfo>({
    pageNo: 1,
    pageSize: 10,
    total: 0,
    totalPages: 0
  })

  // 计算属性
  const hasRoles = computed(() => roles.value.length > 0)
  const hasPermissions = computed(() => permissions.value.length > 0)
  const isLoading = computed(() => loading.value)

  // 获取角色列表
  const fetchRoles = async (params: QueryParams = {}): Promise<void> => {
    loading.value = true
    try {
      const queryParams = {
        pageNo: params.pageNo || pagination.value.pageNo,
        pageSize: params.pageSize || pagination.value.pageSize,
        ...params
      }

      const response = await api.role.list(queryParams) as any
      roles.value = response.records
      pagination.value = {
        pageNo: response.current || response.pageNo || 1,
        pageSize: response.size || response.pageSize || 10,
        total: response.total || 0,
        totalPages: response.pages || 0
      }
    } catch (error) {
      console.error('Failed to fetch roles:', error)
      roles.value = []
    } finally {
      loading.value = false
    }
  }

  // 添加角色
  const addRole = async (role: { roleName: string; roleKey: string }): Promise<Role> => {
    loading.value = true
    try {
      const newRole = await api.role.add(role) as Role
      roles.value.unshift(newRole)
      return newRole
    } catch (error) {
      console.error('Failed to add role:', error)
      throw error
    } finally {
      loading.value = false
    }
  }

  // 编辑角色
  const editRole = async (role: { id: string; roleName: string; roleKey: string }): Promise<Role> => {
    loading.value = true
    try {
      const updatedRole = await api.role.edit(role) as Role
      const index = roles.value.findIndex(r => r.id === role.id)
      if (index !== -1) {
        roles.value[index] = updatedRole
      }
      return updatedRole
    } catch (error) {
      console.error('Failed to edit role:', error)
      throw error
    } finally {
      loading.value = false
    }
  }

  // 删除角色
  const deleteRole = async (id: string): Promise<void> => {
    loading.value = true
    try {
      await api.role.delete(id)
      roles.value = roles.value.filter(r => r.id !== id)
    } catch (error) {
      console.error('Failed to delete role:', error)
      throw error
    } finally {
      loading.value = false
    }
  }

  // 获取权限列表
  const fetchPermissions = async (params: QueryParams = {}): Promise<void> => {
    loading.value = true
    try {
      const queryParams = {
        pageNo: params.pageNo || pagination.value.pageNo,
        pageSize: params.pageSize || pagination.value.pageSize,
        ...params
      }

      const response = await api.role.permissions(queryParams) as any
      permissions.value = response.records
      pagination.value = {
        pageNo: response.current || response.pageNo || 1,
        pageSize: response.size || response.pageSize || 10,
        total: response.total || 0,
        totalPages: response.pages || 0
      }
    } catch (error) {
      console.error('Failed to fetch permissions:', error)
      permissions.value = []
    } finally {
      loading.value = false
    }
  }

  // 获取角色的权限列表
  const fetchPermissionsByRole = async (params: { roleId: string; pageNo?: number; pageSize?: number }): Promise<void> => {
    loading.value = true
    try {
      const queryParams = {
        pageNo: params.pageNo || pagination.value.pageNo,
        pageSize: params.pageSize || pagination.value.pageSize,
        ...params
      }

      const response = await api.role.permissionsByRole(queryParams) as any
      permissions.value = response.records
      pagination.value = {
        pageNo: response.current || response.pageNo || 1,
        pageSize: response.size || response.pageSize || 10,
        total: response.total || 0,
        totalPages: response.pages || 0
      }
    } catch (error) {
      console.error('Failed to fetch permissions by role:', error)
      permissions.value = []
    } finally {
      loading.value = false
    }
  }

  // 添加权限
  const addPermission = async (permission: { permissionName: string; permissionCode: string }): Promise<Permission> => {
    loading.value = true
    try {
      const newPermission = await api.role.addPermission(permission) as Permission
      permissions.value.unshift(newPermission)
      return newPermission
    } catch (error) {
      console.error('Failed to add permission:', error)
      throw error
    } finally {
      loading.value = false
    }
  }

  // 编辑权限
  const editPermission = async (permission: { id: string; permissionName: string; permissionCode: string }): Promise<Permission> => {
    loading.value = true
    try {
      const updatedPermission = await api.role.editPermission(permission) as Permission
      const index = permissions.value.findIndex(p => p.id === permission.id)
      if (index !== -1) {
        permissions.value[index] = updatedPermission
      }
      return updatedPermission
    } catch (error) {
      console.error('Failed to edit permission:', error)
      throw error
    } finally {
      loading.value = false
    }
  }

  // 删除权限
  const deletePermission = async (id: string): Promise<void> => {
    loading.value = true
    try {
      await api.role.deletePermission(id)
      permissions.value = permissions.value.filter(p => p.id !== id)
    } catch (error) {
      console.error('Failed to delete permission:', error)
      throw error
    } finally {
      loading.value = false
    }
  }

  // 添加角色权限关联
  const addRolePermission = async (data: { roleId: string; permissionId: string }): Promise<RolePermission> => {
    loading.value = true
    try {
      const newRolePermission = await api.role.addRolePermission(data) as RolePermission
      rolePermissions.value.unshift(newRolePermission)
      return newRolePermission
    } catch (error) {
      console.error('Failed to add role permission:', error)
      throw error
    } finally {
      loading.value = false
    }
  }

  // 删除角色权限关联
  const deleteRolePermission = async (params: { roleId?: string; permissionId?: string; id?: string }): Promise<void> => {
    loading.value = true
    try {
      await api.role.deleteRolePermission(params.permissionId || '', params.roleId || '')
      if (params.id) {
        rolePermissions.value = rolePermissions.value.filter(rp => rp.id !== params.id)
      } else if (params.roleId && params.permissionId) {
        rolePermissions.value = rolePermissions.value.filter(rp => !(rp.roleId === params.roleId && rp.permissionId === params.permissionId))
      }
    } catch (error) {
      console.error('Failed to delete role permission:', error)
      throw error
    } finally {
      loading.value = false
    }
  }

  // 添加用户角色关联
  const addUserRole = async (params: { userId: string; roleId: string }): Promise<UserRole> => {
    loading.value = true
    try {
      const newUserRole = await api.role.addUserRole(params) as UserRole
      userRoles.value.unshift(newUserRole)
      return newUserRole
    } catch (error) {
      console.error('Failed to add user role:', error)
      throw error
    } finally {
      loading.value = false
    }
  }

  // 删除用户角色关联
  const deleteUserRole = async (userId: string, roleId: string): Promise<void> => {
    loading.value = true
    try {
      await api.role.deleteUserRole(userId, roleId)
      userRoles.value = userRoles.value.filter(ur => !(ur.userId === userId && ur.roleId === roleId))
    } catch (error) {
      console.error('Failed to delete user role:', error)
      throw error
    } finally {
      loading.value = false
    }
  }

  // 重置状态
  const resetState = (): void => {
    roles.value = []
    permissions.value = []
    rolePermissions.value = []
    userRoles.value = []
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
    roles: readonly(roles),
    permissions: readonly(permissions),
    rolePermissions: readonly(rolePermissions),
    userRoles: readonly(userRoles),
    loading: readonly(loading),
    pagination: readonly(pagination),

    // 计算属性
    hasRoles,
    hasPermissions,
    isLoading,

    // 方法
    fetchRoles,
    addRole,
    editRole,
    deleteRole,
    fetchPermissions,
    fetchPermissionsByRole,
    addPermission,
    editPermission,
    deletePermission,
    addRolePermission,
    deleteRolePermission,
    addUserRole,
    deleteUserRole,
    resetState
  }
})
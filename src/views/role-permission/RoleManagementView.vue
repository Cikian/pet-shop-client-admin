<template>
    <div class="role-management-view">
        <!-- 页面头部 -->
        <div class="page-header">
            <div class="header-left">
                <h1 class="page-title">角色管理</h1>
                <p class="page-description">管理系统角色，支持角色的增删改查操作</p>
            </div>
            <div class="header-right">
                <el-button type="primary" @click="handleAdd">
                    <el-icon>
                        <Plus />
                    </el-icon>
                    新增角色
                </el-button>
            </div>
        </div>

        <!-- 搜索区域 -->
        <div class="search-section">
            <el-card>
                <el-form :model="searchForm" inline>
                    <el-form-item label="角色名称">
                        <el-input v-model="searchForm.keyword" placeholder="请输入角色名称" clearable
                            @keyup.enter="handleSearch" style="width: 200px" />
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="handleSearch">
                            <el-icon>
                                <Search />
                            </el-icon>
                            搜索
                        </el-button>
                        <el-button @click="handleReset">
                            <el-icon>
                                <Refresh />
                            </el-icon>
                            重置
                        </el-button>
                    </el-form-item>
                </el-form>
            </el-card>
        </div>

        <!-- 数据表格 -->
        <div class="table-section">
            <el-card>
                <el-table :data="roleStore.roles" :loading="roleStore.isLoading" stripe style="width: 100%">
                    <el-table-column label="序号" width="80">
                        <template #default="scope">
                            {{ (currentPage - 1) * pageSize + scope.$index + 1 }}
                        </template>
                    </el-table-column>

                    <el-table-column prop="id" label="角色ID" min-width="100" />
                    <el-table-column prop="roleName" label="角色名称" min-width="120" />
                    <el-table-column prop="roleKey" label="角色标识" min-width="120" />
                    <el-table-column prop="createTime" label="创建时间" width="180">
                        <template #default="{ row }">
                            {{ formatDateTime(row.createTime) }}
                        </template>
                    </el-table-column>
                    <el-table-column label="操作" width="300" fixed="right">
                        <template #default="{ row }">
                            <el-button type="primary" link @click="handleEdit(row)">
                                <el-icon>
                                    <Edit />
                                </el-icon>
                                编辑
                            </el-button>
                            <el-button type="danger" link @click="handleDelete(row)">
                                <el-icon>
                                    <Delete />
                                </el-icon>
                                删除
                            </el-button>
                            <el-button type="info" link @click="handleUsers(row)">
                                <el-icon>
                                    <User />
                                </el-icon>
                                用户
                            </el-button>
                            <el-button type="success" link @click="handlePermissions(row)">
                                <el-icon>
                                    <Lock />
                                </el-icon>
                                权限
                            </el-button>
                        </template>
                    </el-table-column>
                </el-table>

                <!-- 分页 -->
                <div class="pagination-wrapper">
                    <el-pagination v-model:current-page="currentPage" v-model:page-size="pageSize"
                        :page-sizes="[10, 20, 50, 100]" :total="roleStore.pagination.total"
                        layout="total, sizes, prev, pager, next, jumper" @size-change="handleSizeChange"
                        @current-change="handleCurrentChange" />
                </div>
            </el-card>
        </div>

        <!-- 角色编辑对话框 -->
        <el-dialog
            v-model="dialogVisible"
            :title="dialogTitle"
            width="500px"
        >
            <el-form :model="roleForm" :rules="rules" ref="roleFormRef" label-width="100px">
                <el-form-item label="角色名称" prop="roleName">
                    <el-input v-model="roleForm.roleName" placeholder="请输入角色名称" />
                </el-form-item>
                <el-form-item label="角色标识" prop="roleKey">
                    <el-input v-model="roleForm.roleKey" placeholder="请输入角色标识" />
                </el-form-item>
            </el-form>
            <template #footer>
                <span class="dialog-footer">
                    <el-button @click="dialogVisible = false">取消</el-button>
                    <el-button type="primary" @click="handleSubmit">确定</el-button>
                </span>
            </template>
        </el-dialog>

        <!-- 用户管理侧边栏 -->
        <el-drawer
            v-model="userDrawerVisible"
            title="角色用户"
            size="60%"
        >
            <div class="user-drawer-content">
                <div class="section-header">
                    <h3 class="section-title">{{ currentRole?.roleName }} - 用户管理</h3>
                </div>
                
                <!-- 搜索 -->
                <el-form :model="userSearchForm" inline class="search-form">
                    <el-form-item label="关键词">
                        <el-input v-model="userSearchForm.keyword" placeholder="请输入查询关键词" clearable style="width: 200px" />
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="handleUserSearch">
                            <el-icon><Search /></el-icon>
                            查询
                        </el-button>
                        <el-button @click="handleUserReset">
                            重置
                        </el-button>
                    </el-form-item>
                </el-form>

                <!-- 标签页 -->
                <el-tabs>
                    <el-tab-pane label="已添加的用户">
                        <el-card>
                            <el-table :data="assignedUsers" :loading="assignedUsersLoading" stripe style="width: 100%">
                                <el-table-column label="#" width="80">
                                    <template #default="scope">
                                        {{ (currentPage - 1) * pageSize + scope.$index + 1 }}
                                    </template>
                                </el-table-column>
                                <el-table-column label="用户名" prop="username" min-width="120" />
                                <el-table-column label="昵称" prop="nickname" min-width="120" />
                                <el-table-column label="邮箱" prop="email" min-width="120" />
                                <el-table-column label="来源" prop="userSource" min-width="120" />
                                <el-table-column label="状态" width="100">
                                    <template #default="{ row }">
                                        <el-tag :type="row.status === 1 ? 'success' : 'danger'">
                                            {{ row.status === 1 ? '启用' : '禁用' }}
                                        </el-tag>
                                    </template>
                                </el-table-column>
                                <el-table-column label="操作" width="100" fixed="right">
                                    <template #default="{ row }">
                                        <el-button type="danger" size="small" link @click="handleRemoveUserFromRole(row.id, currentRole.id)">
                                            移除
                                        </el-button>
                                    </template>
                                </el-table-column>
                            </el-table>
                            <div class="pagination-wrapper">
                                <el-pagination 
                                    v-model:current-page="assignedUserCurrentPage"
                                    v-model:page-size="assignedUserPageSize"
                                    :page-sizes="[10, 20, 50, 100]"
                                    :total="assignedUsersTotal"
                                    layout="total, sizes, prev, pager, next, jumper"
                                    @size-change="handleAssignedUserSizeChange"
                                    @current-change="handleAssignedUserCurrentChange"
                                />
                            </div>
                        </el-card>
                    </el-tab-pane>

                    <el-tab-pane label="未添加的用户">
                        <el-card>
                            <el-table :data="unassignedUsers" :loading="unassignedUsersLoading" stripe
                                style="width: 100%">
                                <el-table-column label="#" width="80">
                                    <template #default="scope">
                                        {{ (currentPage - 1) * pageSize + scope.$index + 1 }}
                                    </template>
                                </el-table-column>
                                <el-table-column label="用户名" prop="username" min-width="120" />
                                <el-table-column label="昵称" prop="nickname" min-width="120" />
                                <el-table-column label="邮箱" prop="email" min-width="120" />
                                <el-table-column label="来源" prop="userSource" min-width="120" />
                                <el-table-column label="状态" width="100">
                                    <template #default="{ row }">
                                        <el-tag :type="row.status === 1 ? 'success' : 'danger'">
                                            {{ row.status === 1 ? '启用' : '禁用' }}
                                        </el-tag>
                                    </template>
                                </el-table-column>
                                <el-table-column label="操作" width="100" fixed="right">
                                    <template #default="{ row }">
                                        <el-button type="primary" size="small" link
                                            @click="handleAddUserToRole(row.id)">
                                            添加
                                        </el-button>
                                    </template>
                                </el-table-column>
                            </el-table>
                            <div class="pagination-wrapper">
                                <el-pagination v-model:current-page="unassignedUserCurrentPage"
                                    v-model:page-size="unassignedUserPageSize" :page-sizes="[10, 20, 50, 100]"
                                    :total="unassignedUsersTotal" layout="total, sizes, prev, pager, next, jumper"
                                    @size-change="handleUnassignedUserSizeChange"
                                    @current-change="handleUnassignedUserCurrentChange" />
                            </div>
                        </el-card>
                    </el-tab-pane>
                </el-tabs>
            </div>
        </el-drawer>

        <!-- 权限配置侧边栏 -->
        <el-drawer
            v-model="permissionDrawerVisible"
            title="角色权限配置"
            size="60%"
        >
            <div class="permission-drawer-content">
                <div class="section-header">
                    <h3 class="section-title">{{ currentRole?.roleName }} - 权限配置</h3>
                </div>
                
                <!-- 搜索 -->
                <el-form :model="permissionSearchForm" inline class="search-form">
                    <el-form-item label="权限名称">
                        <el-input v-model="permissionSearchForm.keyword" placeholder="请输入权限名称" clearable style="width: 200px" />
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="handlePermissionSearch">
                            <el-icon><Search /></el-icon>
                            查询
                        </el-button>
                        <el-button @click="handlePermissionReset">
                            重置
                        </el-button>
                    </el-form-item>
                </el-form>

                <!-- 标签页 -->
                <el-tabs>
                    <el-tab-pane label="已添加的权限">
                        <el-card>
                            <el-table :data="assignedPermissions" :loading="assignedPermissionsLoading" stripe style="width: 100%">
                                <el-table-column label="#" width="80">
                                    <template #default="scope">
                                        {{ (currentPage - 1) * pageSize + scope.$index + 1 }}
                                    </template>
                                </el-table-column>
                                <el-table-column label="权限名称" prop="permissionName" min-width="150" />
                                <el-table-column label="权限标识" prop="permissionCode" min-width="150" />
                                <el-table-column label="操作" width="100" fixed="right">
                                    <template #default="{ row }">
                                        <el-button type="danger" size="small" link @click="handleRemovePermissionFromRole(row.id, currentRole.id)">
                                            移除
                                        </el-button>
                                    </template>
                                </el-table-column>
                            </el-table>
                            <div class="pagination-wrapper">
                                <el-pagination 
                                    v-model:current-page="assignedPermissionCurrentPage"
                                    v-model:page-size="assignedPermissionPageSize"
                                    :page-sizes="[10, 20, 50, 100]"
                                    :total="assignedPermissionsTotal"
                                    layout="total, sizes, prev, pager, next, jumper"
                                    @size-change="handleAssignedPermissionSizeChange"
                                    @current-change="handleAssignedPermissionCurrentChange"
                                />
                            </div>
                        </el-card>
                    </el-tab-pane>

                    <el-tab-pane label="未添加的权限">
                        <el-card>
                            <el-table :data="unassignedPermissions" :loading="unassignedPermissionsLoading" stripe
                                style="width: 100%">
                                <el-table-column label="#" width="80">
                                    <template #default="scope">
                                        {{ (currentPage - 1) * pageSize + scope.$index + 1 }}
                                    </template>
                                </el-table-column>
                                <el-table-column label="权限名称" prop="permissionName" min-width="150" />
                                <el-table-column label="权限标识" prop="permissionCode" min-width="150" />
                                <el-table-column label="操作" width="100" fixed="right">
                                    <template #default="{ row }">
                                        <el-button type="primary" size="small" link
                                            @click="handleAddPermissionToRole(row.id)">
                                            添加
                                        </el-button>
                                    </template>
                                </el-table-column>
                            </el-table>
                            <div class="pagination-wrapper">
                                <el-pagination v-model:current-page="unassignedPermissionCurrentPage"
                                    v-model:page-size="unassignedPermissionPageSize" :page-sizes="[10, 20, 50, 100]"
                                    :total="unassignedPermissionsTotal" layout="total, sizes, prev, pager, next, jumper"
                                    @size-change="handleUnassignedPermissionSizeChange"
                                    @current-change="handleUnassignedPermissionCurrentChange" />
                            </div>
                        </el-card>
                    </el-tab-pane>
                </el-tabs>
            </div>
        </el-drawer>
    </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, computed } from 'vue'
import { ElMessage, ElMessageBox, ElDrawer } from 'element-plus'
import { Plus, Search, Refresh, Edit, Delete, User, Lock } from '@element-plus/icons-vue'
import { useRoleStore } from '@/stores/role'
import type { Role } from '@/stores/role'
import api from '@/api/busApi'

// 状态管理
const roleStore = useRoleStore()

// 响应式数据
const searchForm = reactive({
    keyword: ''
})

const currentPage = ref(1)
const pageSize = ref(10)

// 对话框相关
const dialogVisible = ref(false)
const dialogTitle = ref('新增角色')
const roleForm = reactive({
    id: '',
    roleName: '',
    roleKey: ''
})

const roleFormRef = ref()

// 侧边栏相关
const userDrawerVisible = ref(false)
const permissionDrawerVisible = ref(false)
const currentRole = ref<Role>({
    id: '',
    roleName: '',
    roleKey: '',
    createTime: ''
})
const selectedRoleId = ref('')

// 用户搜索表单
const userSearchForm = reactive({
    keyword: ''
})

// 用户分页信息
const unassignedUserCurrentPage = ref(1)
const unassignedUserPageSize = ref(10)
const unassignedUsersLoading = ref(false)
const unassignedUsersTotal = ref(0)

// 已分配的用户分页信息
const assignedUserCurrentPage = ref(1)
const assignedUserPageSize = ref(10)
const assignedUsersLoading = ref(false)
const assignedUsersTotal = ref(0)

// 未分配的用户列表
const unassignedUsers = ref<any[]>([])

// 已分配的用户列表
const assignedUsers = ref<any[]>([])

// 权限搜索表单
const permissionSearchForm = reactive({
    keyword: ''
})

// 已分配的权限分页信息
const assignedPermissionCurrentPage = ref(1)
const assignedPermissionPageSize = ref(10)
const assignedPermissionsLoading = ref(false)
const assignedPermissionsTotal = ref(0)

// 未分配的权限分页信息
const unassignedPermissionCurrentPage = ref(1)
const unassignedPermissionPageSize = ref(10)
const unassignedPermissionsLoading = ref(false)
const unassignedPermissionsTotal = ref(0)

// 已分配的权限列表
const assignedPermissions = ref<any[]>([])

// 未分配的权限列表
const unassignedPermissions = ref<any[]>([])

// 表单规则
const rules = {
    roleName: [
        { required: true, message: '请输入角色名称', trigger: 'blur' }
    ],
    roleKey: [
        { required: true, message: '请输入角色标识', trigger: 'blur' }
    ]
}

// 计算属性
const searchParams = computed(() => ({
    pageNo: currentPage.value,
    pageSize: pageSize.value,
    keyword: searchForm.keyword || undefined
}))

// 格式化日期时间
const formatDateTime = (dateTime: Date | string | undefined): string => {
    if (!dateTime) return '-'
    const date = new Date(dateTime)
    return date.toLocaleString('zh-CN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
    })
}

// 加载角色列表
const loadRoles = async () => {
    try {
        await roleStore.fetchRoles(searchParams.value)
    } catch (error) {
        ElMessage.error('加载角色列表失败')
    }
}

// 搜索处理
const handleSearch = () => {
    currentPage.value = 1
    loadRoles()
}

// 重置搜索
const handleReset = () => {
    searchForm.keyword = ''
    currentPage.value = 1
    loadRoles()
}

// 分页大小变化
const handleSizeChange = (newSize: number) => {
    pageSize.value = newSize
    currentPage.value = 1
    loadRoles()
}

// 当前页变化
const handleCurrentChange = (newPage: number) => {
    currentPage.value = newPage
    loadRoles()
}

// 新增角色
const handleAdd = () => {
    roleForm.id = ''
    roleForm.roleName = ''
    roleForm.roleKey = ''
    dialogTitle.value = '新增角色'
    dialogVisible.value = true
}

// 编辑角色
const handleEdit = (role: Role) => {
    roleForm.id = role.id
    roleForm.roleName = role.roleName
    roleForm.roleKey = role.roleKey
    dialogTitle.value = '编辑角色'
    dialogVisible.value = true
}

// 删除角色
const handleDelete = async (role: Role) => {
    try {
        await ElMessageBox.confirm(
            `确定要删除角色"${role.roleName}"吗？此操作不可恢复。`,
            '确认删除',
            {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }
        )

        await roleStore.deleteRole(role.id)
        ElMessage.success('删除成功')

        // 如果当前页没有数据了，回到上一页
        if (roleStore.roles.length === 0 && currentPage.value > 1) {
            currentPage.value -= 1
        }

        loadRoles()
    } catch (error: any) {
        if (error !== 'cancel') {
            ElMessage.error('删除失败')
        }
    }
}

// 加载未分配的用户
const loadUnassignedUsers = async () => {
    if (!selectedRoleId.value) return
    
    unassignedUsersLoading.value = true
    try {
        // 调用真实的API接口
        const response = await api.user.getWithoutRole({
            roleId: selectedRoleId.value,
            pageNo: unassignedUserCurrentPage.value,
            pageSize: unassignedUserPageSize.value,
            keyword: userSearchForm.keyword || ''
        })
        unassignedUsers.value = response.records || []
        unassignedUsersTotal.value = response.total || 0
    } catch (error) {
        ElMessage.error('加载未分配用户失败')
    } finally {
        unassignedUsersLoading.value = false
    }
}

// 加载已分配的用户
const loadAssignedUsers = async () => {
    if (!selectedRoleId.value) return
    
    assignedUsersLoading.value = true
    try {
        // 调用真实的API接口
        const response = await api.user.getByRole({
            roleId: selectedRoleId.value,
            pageNo: assignedUserCurrentPage.value,
            pageSize: assignedUserPageSize.value,
            keyword: userSearchForm.keyword || ''
        })
        assignedUsers.value = response.records || []
        assignedUsersTotal.value = response.total || 0
    } catch (error) {
        ElMessage.error('加载已分配用户失败')
    } finally {
        assignedUsersLoading.value = false
    }
}

// 用户管理
const handleUsers = (role: Role) => {
    currentRole.value = role
    selectedRoleId.value = role.id
    userDrawerVisible.value = true
    
    // 重置分页
    unassignedUserCurrentPage.value = 1
    assignedUserCurrentPage.value = 1
    
    // 加载用户数据
    loadUnassignedUsers()
    loadAssignedUsers()
}

// 用户搜索处理
const handleUserSearch = () => {
    unassignedUserCurrentPage.value = 1
    assignedUserCurrentPage.value = 1
    loadUnassignedUsers()
    loadAssignedUsers()
}

// 用户搜索重置
const handleUserReset = () => {
    userSearchForm.keyword = ''
    unassignedUserCurrentPage.value = 1
    assignedUserCurrentPage.value = 1
    loadUnassignedUsers()
    loadAssignedUsers()
}

// 未分配用户分页大小变化
const handleUnassignedUserSizeChange = (newSize: number) => {
    unassignedUserPageSize.value = newSize
    unassignedUserCurrentPage.value = 1
    loadUnassignedUsers()
}

// 未分配用户当前页变化
const handleUnassignedUserCurrentChange = (newPage: number) => {
    unassignedUserCurrentPage.value = newPage
    loadUnassignedUsers()
}

// 已分配用户分页大小变化
const handleAssignedUserSizeChange = (newSize: number) => {
    assignedUserPageSize.value = newSize
    assignedUserCurrentPage.value = 1
    loadAssignedUsers()
}

// 已分配用户当前页变化
const handleAssignedUserCurrentChange = (newPage: number) => {
    assignedUserCurrentPage.value = newPage
    loadAssignedUsers()
}

// 添加用户到角色
const handleAddUserToRole = async (userId: string) => {
    if (!selectedRoleId.value) return
    
    try {
        // 调用真实的API接口
        await api.role.addUserRole({
            userId: userId,
            roleId: selectedRoleId.value
        })
        ElMessage.success('添加成功')
        // 重新加载数据
        loadUnassignedUsers()
        loadAssignedUsers()
    } catch (error) {
        ElMessage.error('添加失败')
    }
}

// 从角色移除用户
const handleRemoveUserFromRole = async (userId: string, roleId: string) => {
    try {
        // 调用真实的API接口
        await api.role.deleteUserRole(userId, roleId)   
        ElMessage.success('移除成功')
        // 重新加载数据
        loadUnassignedUsers()
        loadAssignedUsers()
    } catch (error) {
        ElMessage.error('移除失败')
    }
}

// 加载未分配的权限
const loadUnassignedPermissions = async () => {
    if (!selectedRoleId.value) return
    
    unassignedPermissionsLoading.value = true
    try {
        // 调用真实的API接口
        const response = await api.role.permissionsWithoutRole({
            roleId: selectedRoleId.value,
            pageNo: unassignedPermissionCurrentPage.value,
            pageSize: unassignedPermissionPageSize.value,
            keyword: permissionSearchForm.keyword || ''
        })
        unassignedPermissions.value = response.records || []
        unassignedPermissionsTotal.value = response.total || 0
    } catch (error) {
        ElMessage.error('加载未分配权限失败')
    } finally {
        unassignedPermissionsLoading.value = false
    }
}

// 加载已分配的权限
const loadAssignedPermissions = async () => {
    if (!selectedRoleId.value) return
    
    assignedPermissionsLoading.value = true
    try {
        // 调用真实的API接口
        const response = await api.role.permissionsByRole({
            roleId: selectedRoleId.value,
            pageNo: assignedPermissionCurrentPage.value,
            pageSize: assignedPermissionPageSize.value,
            keyword: permissionSearchForm.keyword || ''
        })
        assignedPermissions.value = response.records || []
        assignedPermissionsTotal.value = response.total || 0
    } catch (error) {
        ElMessage.error('加载已分配权限失败')
    } finally {
        assignedPermissionsLoading.value = false
    }
}

// 权限管理
const handlePermissions = (role: Role) => {
    currentRole.value = role
    selectedRoleId.value = role.id
    permissionDrawerVisible.value = true
    
    // 重置分页
    assignedPermissionCurrentPage.value = 1
    unassignedPermissionCurrentPage.value = 1
    
    // 加载权限数据
    loadAssignedPermissions()
    loadUnassignedPermissions()
}

// 权限搜索处理
const handlePermissionSearch = () => {
    assignedPermissionCurrentPage.value = 1
    unassignedPermissionCurrentPage.value = 1
    loadAssignedPermissions()
    loadUnassignedPermissions()
}

// 权限搜索重置
const handlePermissionReset = () => {
    permissionSearchForm.keyword = ''
    assignedPermissionCurrentPage.value = 1
    unassignedPermissionCurrentPage.value = 1
    loadAssignedPermissions()
    loadUnassignedPermissions()
}

// 未分配权限分页大小变化
const handleUnassignedPermissionSizeChange = (newSize: number) => {
    unassignedPermissionPageSize.value = newSize
    unassignedPermissionCurrentPage.value = 1
    loadUnassignedPermissions()
}

// 未分配权限当前页变化
const handleUnassignedPermissionCurrentChange = (newPage: number) => {
    unassignedPermissionCurrentPage.value = newPage
    loadUnassignedPermissions()
}

// 已分配权限分页大小变化
const handleAssignedPermissionSizeChange = (newSize: number) => {
    assignedPermissionPageSize.value = newSize
    assignedPermissionCurrentPage.value = 1
    loadAssignedPermissions()
}

// 已分配权限当前页变化
const handleAssignedPermissionCurrentChange = (newPage: number) => {
    assignedPermissionCurrentPage.value = newPage
    loadAssignedPermissions()
}

// 添加权限到角色
const handleAddPermissionToRole = async (permissionId: string) => {
    if (!selectedRoleId.value) return
    
    try {
        // 调用真实的API接口
        await api.role.addRolePermission({
            roleId: selectedRoleId.value,
            permissionId: permissionId
        })
        ElMessage.success('添加成功')
        // 重新加载数据
        loadAssignedPermissions()
        loadUnassignedPermissions()
    } catch (error) {
        ElMessage.error('添加失败')
    }
}

// 从角色移除权限
const handleRemovePermissionFromRole = async (permissionId: string, roleId: string) => {
    try {
        // 调用真实的API接口
        await api.role.deleteRolePermission(permissionId, roleId)
        ElMessage.success('移除成功')
        // 重新加载数据
        loadAssignedPermissions()
        loadUnassignedPermissions()
    } catch (error) {
        ElMessage.error('移除失败')
    }
}

// 提交表单
const handleSubmit = async () => {
    if (!roleFormRef.value) return
    
    try {
        await roleFormRef.value.validate()
        
        if (roleForm.id) {
            // 编辑角色
            await roleStore.editRole(roleForm)
            ElMessage.success('编辑成功')
        } else {
            // 新增角色
            await roleStore.addRole({
                roleName: roleForm.roleName,
                roleKey: roleForm.roleKey
            })
            ElMessage.success('新增成功')
        }
        
        dialogVisible.value = false
        loadRoles()
    } catch (error) {
        console.error('提交失败:', error)
    }
}

// 组件挂载时加载数据
onMounted(() => {
    loadRoles()
})
</script>

<style scoped lang="scss">
.role-management-view {
    padding: 20px;

    .page-header {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        margin-bottom: 20px;

        .header-left {
            .page-title {
                margin: 0 0 8px 0;
                font-size: 24px;
                font-weight: 600;
                color: var(--el-text-color-primary);
            }

            .page-description {
                margin: 0;
                color: var(--el-text-color-regular);
                font-size: 14px;
            }
        }

        .header-right {
            .el-button {
                .el-icon {
                    margin-right: 4px;
                }
            }
        }
    }

    .search-section {
        margin-bottom: 20px;

        .el-card {
            .el-form {
                margin-bottom: 0;

                .el-form-item {
                    margin-bottom: 0;

                    .el-button {
                        .el-icon {
                            margin-right: 4px;
                        }
                    }
                }
            }
        }
    }

    .table-section {
        .el-card {
            .el-table {
                .el-button {
                    .el-icon {
                        margin-right: 4px;
                    }
                }
            }

            .pagination-wrapper {
                display: flex;
                justify-content: center;
                margin-top: 20px;
            }
        }
    }
}

// 侧边栏样式
.user-drawer-content,
.permission-drawer-content {
    padding: 20px;

    .section-header {
        margin-bottom: 20px;

        .section-title {
            margin: 0;
            font-size: 18px;
            font-weight: 600;
            color: var(--el-text-color-primary);
        }
    }

    .search-form {
        margin-bottom: 20px;

        .el-form-item {
            margin-bottom: 10px;
        }
    }

    .drawer-footer {
        margin-top: 30px;
        display: flex;
        justify-content: flex-end;
        gap: 10px;
    }

    .permission-node {
        font-size: 14px;
    }
}

// 响应式设计
@media (max-width: 768px) {
    .role-management-view {
        padding: 10px;

        .page-header {
            flex-direction: column;
            gap: 16px;

            .header-right {
                align-self: stretch;

                .el-button {
                    width: 100%;
                }
            }
        }

        .search-section {
            .el-form {
                .el-form-item {
                    display: block;
                    margin-bottom: 16px;

                    .el-input {
                        width: 100% !important;
                    }
                }
            }
        }

        .table-section {
            .el-table {
                .el-button {
                    font-size: 12px;

                    .el-icon {
                        font-size: 14px;
                    }
                }
            }
        }

        .user-drawer-content,
        .permission-drawer-content {
            padding: 10px;

            .search-form {
                .el-form-item {
                    display: block;
                    margin-bottom: 16px;

                    .el-input {
                        width: 100% !important;
                    }
                }
            }

            .drawer-footer {
                flex-direction: column;
                gap: 8px;

                .el-button {
                    width: 100%;
                }
            }
        }
    }
}
</style>
<template>
    <div class="permission-management-view">
        <!-- 页面头部 -->
        <div class="page-header">
            <div class="header-left">
                <h1 class="page-title">权限管理</h1>
                <p class="page-description">管理系统权限，支持权限的增删改查操作</p>
            </div>
            <div class="header-right">
                <el-button type="primary" @click="handleAdd">
                    <el-icon>
                        <Plus />
                    </el-icon>
                    新增权限
                </el-button>
            </div>
        </div>

        <!-- 搜索区域 -->
        <div class="search-section">
            <el-card>
                <el-form :model="searchForm" inline>
                    <el-form-item label="权限名称">
                        <el-input v-model="searchForm.keyword" placeholder="请输入权限名称" clearable
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
                <el-table :data="roleStore.permissions" :loading="roleStore.isLoading" stripe style="width: 100%">
                    <el-table-column label="序号" width="80">
                        <template #default="scope">
                            {{ (currentPage - 1) * pageSize + scope.$index + 1 }}
                        </template>
                    </el-table-column>

                    <el-table-column prop="permissionName" label="权限名称" min-width="120" />
                    <el-table-column prop="permissionCode" label="权限编码" min-width="150" />
                    <el-table-column label="操作" width="150" fixed="right">
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

        <!-- 权限编辑对话框 -->
        <el-dialog
            v-model="dialogVisible"
            :title="dialogTitle"
            width="500px"
        >
            <el-form :model="permissionForm" :rules="rules" ref="permissionFormRef" label-width="100px">
                <el-form-item label="权限名称" prop="permissionName">
                    <el-input v-model="permissionForm.permissionName" placeholder="请输入权限名称" />
                </el-form-item>
                <el-form-item label="权限编码" prop="permissionCode">
                    <el-input v-model="permissionForm.permissionCode" placeholder="请输入权限编码" />
                </el-form-item>
            </el-form>
            <template #footer>
                <span class="dialog-footer">
                    <el-button @click="dialogVisible = false">取消</el-button>
                    <el-button type="primary" @click="handleSubmit">确定</el-button>
                </span>
            </template>
        </el-dialog>
    </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, computed } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Plus, Search, Refresh, Edit, Delete } from '@element-plus/icons-vue'
import { useRoleStore } from '@/stores/role'
import type { Permission } from '@/stores/role'

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
const dialogTitle = ref('新增权限')
const permissionForm = reactive({
    id: '',
    permissionName: '',
    permissionCode: ''
})

const permissionFormRef = ref()

// 表单规则
const rules = {
    permissionName: [
        { required: true, message: '请输入权限名称', trigger: 'blur' }
    ],
    permissionCode: [
        { required: true, message: '请输入权限编码', trigger: 'blur' }
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

// 加载权限列表
const loadPermissions = async () => {
    try {
        await roleStore.fetchPermissions(searchParams.value)
    } catch (error) {
        ElMessage.error('加载权限列表失败')
    }
}

// 搜索处理
const handleSearch = () => {
    currentPage.value = 1
    loadPermissions()
}

// 重置搜索
const handleReset = () => {
    searchForm.keyword = ''
    currentPage.value = 1
    loadPermissions()
}

// 分页大小变化
const handleSizeChange = (newSize: number) => {
    pageSize.value = newSize
    currentPage.value = 1
    loadPermissions()
}

// 当前页变化
const handleCurrentChange = (newPage: number) => {
    currentPage.value = newPage
    loadPermissions()
}

// 新增权限
const handleAdd = () => {
    permissionForm.id = ''
    permissionForm.permissionName = ''
    permissionForm.permissionCode = ''
    dialogTitle.value = '新增权限'
    dialogVisible.value = true
}

// 编辑权限
const handleEdit = (permission: Permission) => {
    permissionForm.id = permission.id
    permissionForm.permissionName = permission.permissionName
    permissionForm.permissionCode = permission.permissionCode
    dialogTitle.value = '编辑权限'
    dialogVisible.value = true
}

// 删除权限
const handleDelete = async (permission: Permission) => {
    try {
        await ElMessageBox.confirm(
            `确定要删除权限"${permission.permissionName}"吗？此操作不可恢复。`,
            '确认删除',
            {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }
        )

        await roleStore.deletePermission(permission.id)
        ElMessage.success('删除成功')

        // 如果当前页没有数据了，回到上一页
        if (roleStore.permissions.length === 0 && currentPage.value > 1) {
            currentPage.value -= 1
        }

        loadPermissions()
    } catch (error: any) {
        if (error !== 'cancel') {
            ElMessage.error('删除失败')
        }
    }
}

// 提交表单
const handleSubmit = async () => {
    if (!permissionFormRef.value) return
    
    try {
        await permissionFormRef.value.validate()
        
        if (permissionForm.id) {
            // 编辑权限
            await roleStore.editPermission(permissionForm)
            ElMessage.success('编辑成功')
        } else {
            // 新增权限
            await roleStore.addPermission({
                permissionName: permissionForm.permissionName,
                permissionCode: permissionForm.permissionCode
            })
            ElMessage.success('新增成功')
        }
        
        dialogVisible.value = false
        loadPermissions()
    } catch (error) {
        console.error('提交失败:', error)
    }
}

// 组件挂载时加载数据
onMounted(() => {
    loadPermissions()
})
</script>

<style scoped lang="scss">
.permission-management-view {
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

// 响应式设计
@media (max-width: 768px) {
    .permission-management-view {
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
    }
}
</style>
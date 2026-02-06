<template>
    <div class="user-list-view">
        <!-- 页面头部 -->
        <div class="page-header">
            <div class="header-left">
                <h1 class="page-title">用户管理</h1>
                <p class="page-description">管理用户信息，支持用户的查询和分页操作</p>
            </div>
        </div>

        <!-- 搜索区域 -->
        <div class="search-section">
            <el-card>
                <el-form :model="searchForm" inline>
                    <el-form-item label="用户关键词">
                        <el-input v-model="searchForm.keyword" placeholder="请输入用户名称或邮箱" clearable
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
                <el-table :data="userStore.users" :loading="userStore.isLoading" stripe style="width: 100%">
                    <el-table-column label="序号" width="80">
                        <template #default="scope">
                            {{ (currentPage - 1) * pageSize + scope.$index + 1 }}
                        </template>
                    </el-table-column>

                    <el-table-column prop="username" label="用户名" min-width="120" />
                    <el-table-column prop="nickname" label="昵称" min-width="120" />
                    <el-table-column label="头像" width="100">
                        <template #default="{ row }">
                            <el-avatar v-if="row.avatar" :src="row.avatar" size="small" />
                            <el-avatar v-else size="small">
                                {{ row.nickname?.charAt(0) || '用' }}
                            </el-avatar>
                        </template>
                    </el-table-column>
                    <el-table-column prop="birthday" label="生日" width="120">
                        <template #default="{ row }">
                            {{ formatDate(row.birthday) }}
                        </template>
                    </el-table-column>
                    <el-table-column prop="sex" label="性别" width="80">
                        <template #default="{ row }">
                            {{ row.sex === 1 ? '男' : row.sex === 2 ? '女' : '未知' }}
                        </template>
                    </el-table-column>
                    <el-table-column prop="email" label="邮箱" min-width="150" />
                    <el-table-column prop="phone" label="电话" min-width="120" />
                    <el-table-column prop="status" label="状态" width="80">
                        <template #default="{ row }">
                            <el-tag :type="row.status === 1 ? 'success' : 'danger'">
                                {{ row.status === 1 ? '启用' : '禁用' }}
                            </el-tag>
                        </template>
                    </el-table-column>
                    <el-table-column prop="lastLoginTime" label="最后登录时间" width="180">
                        <template #default="{ row }">
                            {{ formatDateTime(row.lastLoginTime) }}
                        </template>
                    </el-table-column>
                    <el-table-column prop="lastLoginIp" label="最后登录IP" min-width="120" />
                    <el-table-column prop="createTime" label="创建时间" width="180">
                        <template #default="{ row }">
                            {{ formatDateTime(row.createTime) }}
                        </template>
                    </el-table-column>
                </el-table>

                <!-- 分页 -->
                <div class="pagination-wrapper">
                    <el-pagination v-model:current-page="currentPage" v-model:page-size="pageSize"
                        :page-sizes="[10, 20, 50, 100]" :total="userStore.pagination.total"
                        layout="total, sizes, prev, pager, next, jumper" @size-change="handleSizeChange"
                        @current-change="handleCurrentChange" />
                </div>
            </el-card>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, computed } from 'vue'
import { ElMessage } from 'element-plus'
import { Search, Refresh } from '@element-plus/icons-vue'
import { useUserStore } from '@/stores/user'

// 状态管理
const userStore = useUserStore()

// 响应式数据
const searchForm = reactive({
    keyword: ''
})

const currentPage = ref(1)
const pageSize = ref(10)

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

// 格式化日期
const formatDate = (date: Date | string | undefined): string => {
    if (!date) return '-'
    const d = new Date(date)
    return d.toLocaleDateString('zh-CN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
    })
}

// 加载用户列表
const loadUsers = async () => {
    try {
        await userStore.fetchUsers(searchParams.value)
    } catch (error) {
        ElMessage.error('加载用户列表失败')
    }
}

// 搜索处理
const handleSearch = () => {
    currentPage.value = 1
    loadUsers()
}

// 重置搜索
const handleReset = () => {
    searchForm.keyword = ''
    currentPage.value = 1
    loadUsers()
}

// 分页大小变化
const handleSizeChange = (newSize: number) => {
    pageSize.value = newSize
    currentPage.value = 1
    loadUsers()
}

// 当前页变化
const handleCurrentChange = (newPage: number) => {
    currentPage.value = newPage
    loadUsers()
}

// 组件挂载时加载数据
onMounted(() => {
    loadUsers()
})
</script>

<style scoped lang="scss">
.user-list-view {
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
    .user-list-view {
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
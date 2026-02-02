<template>
    <div class="category-list-view">
        <!-- 页面头部 -->
        <div class="page-header">
            <div class="header-left">
                <h1 class="page-title">商品分类管理</h1>
                <p class="page-description">管理商品分类信息，支持分类的增删改查操作</p>
            </div>
            <div class="header-right">
                <el-button type="primary" @click="handleAdd">
                    <el-icon>
                        <Plus />
                    </el-icon>
                    新增分类
                </el-button>
            </div>
        </div>

        <!-- 搜索区域 -->
        <div class="search-section">
            <el-card>
                <el-form :model="searchForm" inline>
                    <el-form-item label="分类名称">
                        <el-input v-model="searchForm.keyword" placeholder="请输入分类名称" clearable
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
                <el-table :data="categoryStore.categories" :loading="categoryStore.isLoading" stripe style="width: 100%"
                    @sort-change="handleSortChange">
                    <el-table-column label="序号" width="80">
                        <template #default="scope">
                            {{ (currentPage - 1) * pageSize + scope.$index + 1 }}
                        </template>
                    </el-table-column>

                    <el-table-column prop="name" label="分类名称" min-width="150" sortable="custom" />
                    <el-table-column prop="cateCode" label="分类编码" min-width="120" sortable="custom" />
                    <el-table-column prop="createTime" label="创建时间" width="180" sortable="custom">
                        <template #default="{ row }">
                            {{ formatDateTime(row.createTime) }}
                        </template>
                    </el-table-column>
                    <el-table-column prop="updateTime" label="更新时间" width="180" sortable="custom">
                        <template #default="{ row }">
                            {{ formatDateTime(row.updateTime) }}
                        </template>
                    </el-table-column>
                    <el-table-column label="操作" width="180" fixed="right">
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
                        :page-sizes="[10, 20, 50, 100]" :total="categoryStore.pagination.total"
                        layout="total, sizes, prev, pager, next, jumper" @size-change="handleSizeChange"
                        @current-change="handleCurrentChange" />
                </div>
            </el-card>
        </div>

        <!-- 分类编辑对话框 -->
        <CategoryEditDialog v-model:visible="dialogVisible" :category="currentCategory"
            @success="handleDialogSuccess" />
    </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, computed } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Plus, Search, Refresh, Edit, Delete } from '@element-plus/icons-vue'
import { useCategoryStore } from '@/stores/category'
import CategoryEditDialog from './components/CategoryEditDialog.vue'
import type { Category } from '@/types'

// 状态管理
const categoryStore = useCategoryStore()

// 响应式数据
const searchForm = reactive({
    keyword: ''
})

const currentPage = ref(1)
const pageSize = ref(10)
const dialogVisible = ref(false)
const currentCategory = ref<Category | null>(null)
const sortField = ref('')
const sortOrder = ref('')

// 计算属性
const searchParams = computed(() => ({
    pageNo: currentPage.value,
    pageSize: pageSize.value,
    keyword: searchForm.keyword || undefined,
    sortField: sortField.value || undefined,
    sortOrder: sortOrder.value || undefined
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

// 加载分类列表
const loadCategories = async () => {
    try {
        await categoryStore.fetchCategories(searchParams.value)
    } catch (error) {
        ElMessage.error('加载分类列表失败')
    }
}

// 搜索处理
const handleSearch = () => {
    currentPage.value = 1
    loadCategories()
}

// 重置搜索
const handleReset = () => {
    searchForm.keyword = ''
    currentPage.value = 1
    sortField.value = ''
    sortOrder.value = ''
    loadCategories()
}

// 分页大小变化
const handleSizeChange = (newSize: number) => {
    pageSize.value = newSize
    currentPage.value = 1
    loadCategories()
}

// 当前页变化
const handleCurrentChange = (newPage: number) => {
    currentPage.value = newPage
    loadCategories()
}

// 排序变化
const handleSortChange = ({ prop, order }: { prop: string; order: string | null }) => {
    if (order) {
        sortField.value = prop
        sortOrder.value = order === 'ascending' ? 'asc' : 'desc'
    } else {
        sortField.value = ''
        sortOrder.value = ''
    }
    currentPage.value = 1
    loadCategories()
}

// 新增分类
const handleAdd = () => {
    currentCategory.value = null
    dialogVisible.value = true
}

// 编辑分类
const handleEdit = (category: Category) => {
    currentCategory.value = { ...category }
    dialogVisible.value = true
}

// 删除分类
const handleDelete = async (category: Category) => {
    try {
        await ElMessageBox.confirm(
            `确定要删除分类"${category.name}"吗？此操作不可恢复。`,
            '确认删除',
            {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }
        )

        await categoryStore.deleteCategory(category.id!)
        ElMessage.success('删除成功')

        // 如果当前页没有数据了，回到上一页
        if (categoryStore.categories.length === 0 && currentPage.value > 1) {
            currentPage.value -= 1
        }

        loadCategories()
    } catch (error: any) {
        if (error !== 'cancel') {
            ElMessage.error('删除失败')
        }
    }
}

// 对话框成功回调
const handleDialogSuccess = () => {
    dialogVisible.value = false
    loadCategories()
}

// 组件挂载时加载数据
onMounted(() => {
    loadCategories()
})
</script>

<style scoped lang="scss">
.category-list-view {
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
    .category-list-view {
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
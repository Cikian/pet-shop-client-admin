<template>
  <div class="product-list-view">
    <!-- 页面头部 -->
    <div class="page-header">
      <div class="header-left">
        <h1 class="page-title">商品管理</h1>
        <p class="page-description">管理商品信息，支持商品的增删改查操作</p>
      </div>
      <div class="header-right">
        <el-button type="primary" @click="handleAddProduct">
          <el-icon><Plus /></el-icon>
          新增商品
        </el-button>
      </div>
    </div>

    <!-- 搜索区域 -->
    <div class="search-section">
      <el-card>
        <el-form :model="searchForm" inline>
          <el-form-item label="商品名称">
            <el-input
              v-model="searchForm.keyword"
              placeholder="请输入商品名称"
              clearable
              @keyup.enter="handleSearch"
              style="width: 200px"
            />
          </el-form-item>
          <el-form-item label="分类">
            <el-select
              v-model="searchForm.categoryId"
              placeholder="请选择分类"
              clearable
              style="width: 150px"
            >
              <el-option
                v-for="category in categories"
                :key="category.id"
                :label="category.name"
                :value="category.id"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="状态">
            <el-select
              v-model="searchForm.status"
              placeholder="请选择状态"
              clearable
              style="width: 120px"
            >
              <el-option label="上架" value="1" />
              <el-option label="下架" value="0" />
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="handleSearch">
              <el-icon><Search /></el-icon>
              搜索
            </el-button>
            <el-button @click="handleReset">
              <el-icon><Refresh /></el-icon>
              重置
            </el-button>
          </el-form-item>
        </el-form>
      </el-card>
    </div>

    <!-- 数据表格 -->
    <div class="table-section">
      <el-card>
        <el-table
          :data="productStore.products"
          :loading="productStore.isLoading"
          stripe
          style="width: 100%"
          @sort-change="handleSortChange"
        >
          <el-table-column prop="id" label="ID" width="80" sortable="custom" />
          <el-table-column prop="name" label="商品名称" min-width="150" sortable="custom" />
          <el-table-column prop="description" label="商品描述" min-width="200" />
          <el-table-column label="分类" min-width="120" sortable="custom">
            <template #default="scope">
              {{ getCategoryName(scope.row.categoryId) }}
            </template>
          </el-table-column>
          <el-table-column label="状态" width="100">
            <template #default="scope">
              <el-tag :type="scope.row.status === 1 ? 'success' : 'info'">
                {{ scope.row.status === 1 ? '上架' : '下架' }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="createTime" label="创建时间" width="180" sortable="custom">
            <template #default="scope">
              {{ formatDateTime(scope.row.createTime) }}
            </template>
          </el-table-column>
          <el-table-column label="操作" width="180" fixed="right">
            <template #default="scope">
              <el-button type="primary" link @click="handleEditProduct(scope.row)">
                <el-icon><Edit /></el-icon>
                编辑
              </el-button>
              <el-button type="danger" link @click="handleDeleteProduct(scope.row)">
                <el-icon><Delete /></el-icon>
                删除
              </el-button>
            </template>
          </el-table-column>
        </el-table>

        <!-- 分页 -->
        <div class="pagination-wrapper">
          <el-pagination
            v-model:current-page="currentPage"
            v-model:page-size="pageSize"
            :page-sizes="[10, 20, 50, 100]"
            :total="productStore.pagination.total"
            layout="total, sizes, prev, pager, next, jumper"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
          />
        </div>
      </el-card>
    </div>

    <!-- 商品编辑对话框 -->
    <ProductEditDialog
      v-model:visible="productEditDialogVisible"
      :product="currentProduct"
      @success="handleDialogSuccess"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, computed } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Plus, Search, Refresh, Edit, Delete } from '@element-plus/icons-vue'
import { useProductStore } from '@/stores/product'
import { useCategoryStore } from '@/stores/category'
import ProductEditDialog from './components/ProductEditDialog.vue'
import type { Product, Category } from '@/types'

// 状态管理
const productStore = useProductStore()
const categoryStore = useCategoryStore()

// 响应式数据
const searchForm = reactive({
  keyword: '',
  categoryId: undefined,
  status: undefined
})

const currentPage = ref(1)
const pageSize = ref(10)
const productEditDialogVisible = ref(false)
const currentProduct = ref<Product | null>(null)
const categories = ref<Category[]>([])
const sortField = ref('')
const sortOrder = ref('')

// 计算属性
const searchParams = computed(() => ({
  pageNo: currentPage.value,
  pageSize: pageSize.value,
  keyword: searchForm.keyword || undefined,
  categoryId: searchForm.categoryId || undefined,
  status: searchForm.status || undefined,
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

// 加载商品列表
const loadProducts = async () => {
  try {
    await productStore.fetchProducts(searchParams.value)
  } catch (error) {
    ElMessage.error('加载商品列表失败')
  }
}

// 搜索处理
const handleSearch = () => {
  currentPage.value = 1
  loadProducts()
}

// 重置搜索
const handleReset = () => {
  searchForm.keyword = ''
  searchForm.categoryId = undefined
  searchForm.status = undefined
  currentPage.value = 1
  sortField.value = ''
  sortOrder.value = ''
  loadProducts()
}

// 分页大小变化
const handleSizeChange = (newSize: number) => {
  pageSize.value = newSize
  currentPage.value = 1
  loadProducts()
}

// 当前页变化
const handleCurrentChange = (newPage: number) => {
  currentPage.value = newPage
  loadProducts()
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
  loadProducts()
}

// 新增商品
const handleAddProduct = () => {
  currentProduct.value = null
  productEditDialogVisible.value = true
}

// 编辑商品
const handleEditProduct = (product: Product) => {
  currentProduct.value = { ...product }
  productEditDialogVisible.value = true
}

// 删除商品
const handleDeleteProduct = async (product: Product) => {
  try {
    await ElMessageBox.confirm(
      `确定要删除商品"${product.name}"吗？此操作不可恢复。`,
      '确认删除',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }
    )

    await productStore.deleteProduct(product.id!)
    ElMessage.success('删除成功')
    
    // 如果当前页没有数据了，回到上一页
    if (productStore.products.length === 0 && currentPage.value > 1) {
      currentPage.value -= 1
    }
    
    loadProducts()
  } catch (error: any) {
    if (error !== 'cancel') {
      ElMessage.error('删除失败')
    }
  }
}

// 对话框成功回调
const handleDialogSuccess = () => {
  productEditDialogVisible.value = false
  loadProducts()
}

// 获取分类列表
const fetchCategories = async () => {
  try {
    await categoryStore.fetchCategories({ pageSize: 100 })
    categories.value = Array.from(categoryStore.categories)
  } catch (error) {
    console.error('Failed to fetch categories:', error)
  }
}

// 获取分类名称
const getCategoryName = (categoryId: number): string => {
  const category = categories.value.find(c => c.id === categoryId)
  return category ? category.name : '未知分类'
}

// 组件挂载时加载数据
onMounted(() => {
  loadProducts()
  fetchCategories()
})
</script>

<style scoped lang="scss">
.product-list-view {
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
  .product-list-view {
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
          
          .el-input,
          .el-select {
            width: 100% !important;
          }
        }
      }
    }
  }
}
</style>

import { describe, it, expect, beforeEach, vi } from 'vitest'
import { mount, type VueWrapper } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import ElementPlus from 'element-plus'
import { Plus, Search, Refresh, Edit, Delete } from '@element-plus/icons-vue'
import CategoryListView from '../CategoryListView.vue'
import CategoryEditDialog from '../components/CategoryEditDialog.vue'
import { useCategoryStore } from '@/stores/category'
import type { Category } from '@/types'

// 模拟Element Plus的消息和对话框
vi.mock('element-plus', async (importOriginal) => {
  const original = await importOriginal<typeof import('element-plus')>()
  return {
    ...original,
    ElMessage: {
      error: vi.fn(),
      success: vi.fn()
    },
    ElMessageBox: {
      confirm: vi.fn()
    }
  }
})

// 模拟分类store
vi.mock('@/stores/category', () => {
  const mockCategories: Category[] = [
    { id: 1, name: '电子产品', cateCode: 'ELECTRONICS', createTime: new Date(), updateTime: new Date(), delFlag: false },
    { id: 2, name: '服装', cateCode: 'CLOTHING', createTime: new Date(), updateTime: new Date(), delFlag: false }
  ]
  
  return {
    useCategoryStore: vi.fn(() => ({
      categories: mockCategories,
      pagination: {
        pageNo: 1,
        pageSize: 10,
        total: 2,
        totalPages: 1
      },
      isLoading: false,
      fetchCategories: vi.fn(),
      deleteCategory: vi.fn()
    }))
  }
})

describe('CategoryListView', () => {
  let wrapper: VueWrapper
  let categoryStore: any

  beforeEach(() => {
    // 创建pinia实例
    const pinia = createPinia()
    setActivePinia(pinia)
    
    // 挂载组件
    wrapper = mount(CategoryListView, {
      global: {
        plugins: [ElementPlus],
        components: {
          CategoryEditDialog,
          Plus,
          Search,
          Refresh,
          Edit,
          Delete
        }
      }
    })
    
    // 获取store实例
    categoryStore = useCategoryStore()
  })

  it('should render correctly', () => {
    expect(wrapper.exists()).toBe(true)
    expect(wrapper.find('.page-title').text()).toBe('商品分类管理')
    expect(wrapper.find('.page-description').text()).toBe('管理商品分类信息，支持分类的增删改查操作')
  })

  it('should render category table with data', () => {
    const tableRows = wrapper.findAll('.el-table__row')
    expect(tableRows.length).toBe(2)
    expect(wrapper.text()).toContain('电子产品')
    expect(wrapper.text()).toContain('服装')
  })

  it('should call fetchCategories on mount', () => {
    expect(categoryStore.fetchCategories).toHaveBeenCalled()
  })

  it('should handle search functionality', async () => {
    // 清空之前的调用记录
    vi.clearAllMocks()
    
    // 输入搜索关键词
    await wrapper.find('[placeholder="请输入分类名称"]').setValue('电子')
    await wrapper.find('.el-button--primary').trigger('click')
    
    // 验证fetchCategories被调用
    expect(categoryStore.fetchCategories).toHaveBeenCalledWith({
      pageNo: 1,
      pageSize: 10,
      keyword: '电子',
      sortField: undefined,
      sortOrder: undefined
    })
  })

  it('should handle reset functionality', async () => {
    // 清空之前的调用记录
    vi.clearAllMocks()
    
    // 输入搜索关键词
    await wrapper.find('[placeholder="请输入分类名称"]').setValue('电子')
    await wrapper.findAll('.el-button')[1].trigger('click')
    
    // 验证输入框被清空
    expect((wrapper.find('[placeholder="请输入分类名称"]').element as HTMLInputElement).value).toBe('')
    // 验证fetchCategories被调用
    expect(categoryStore.fetchCategories).toHaveBeenCalledWith({
      pageNo: 1,
      pageSize: 10,
      keyword: undefined,
      sortField: undefined,
      sortOrder: undefined
    })
  })

  it('should handle pagination size change', async () => {
    // 清空之前的调用记录
    vi.clearAllMocks()
    
    // 模拟分页大小变化
    await (wrapper.find('.el-pagination') as any).trigger('size-change', 20)
    
    // 验证fetchCategories被调用
    expect(categoryStore.fetchCategories).toHaveBeenCalledWith({
      pageNo: 1,
      pageSize: 20,
      keyword: undefined,
      sortField: undefined,
      sortOrder: undefined
    })
  })

  it('should handle pagination current change', async () => {
    // 清空之前的调用记录
    vi.clearAllMocks()
    
    // 模拟当前页变化
    await (wrapper.find('.el-pagination') as any).trigger('current-change', 2)
    
    // 验证fetchCategories被调用
    expect(categoryStore.fetchCategories).toHaveBeenCalledWith({
      pageNo: 2,
      pageSize: 10,
      keyword: undefined,
      sortField: undefined,
      sortOrder: undefined
    })
  })

  it('should handle sort change', async () => {
    // 清空之前的调用记录
    vi.clearAllMocks()
    
    // 模拟排序变化
    await wrapper.find('.el-table').trigger('sort-change', {
      prop: 'name',
      order: 'ascending'
    })
    
    // 验证fetchCategories被调用
    expect(categoryStore.fetchCategories).toHaveBeenCalledWith({
      pageNo: 1,
      pageSize: 10,
      keyword: undefined,
      sortField: 'name',
      sortOrder: 'asc'
    })
  })

  it('should handle add category button click', async () => {
    await wrapper.find('.el-button--primary').trigger('click')
    
    // 验证编辑对话框可见性
    const editDialog = wrapper.findComponent(CategoryEditDialog)
    expect(editDialog.props('visible')).toBe(true)
  })

  it('should handle edit category button click', async () => {
    // 点击编辑按钮
    await wrapper.findAll('.el-button--primary.is-link')[0].trigger('click')
    
    // 验证编辑对话框可见性和分类数据
    const editDialog = wrapper.findComponent(CategoryEditDialog)
    expect(editDialog.props('visible')).toBe(true)
    expect(editDialog.props('category')).toEqual({
      id: 1,
      name: '电子产品',
      cateCode: 'ELECTRONICS',
      createTime: expect.any(Date),
      updateTime: expect.any(Date),
      delFlag: false
    })
  })

  it('should handle delete category button click', async () => {
    // 模拟确认对话框
    const { ElMessageBox } = await import('element-plus')
    ;(ElMessageBox.confirm as any).mockResolvedValue(true)
    
    // 点击删除按钮
    await wrapper.findAll('.el-button--danger.is-link')[0].trigger('click')
    
    // 验证确认对话框被调用
    expect(ElMessageBox.confirm).toHaveBeenCalled()
    // 验证deleteCategory被调用
    expect(categoryStore.deleteCategory).toHaveBeenCalledWith(1)
  })

  it('should handle dialog success event', async () => {
    // 清空之前的调用记录
    vi.clearAllMocks()
    
    // 触发对话框成功事件
    const editDialog = wrapper.findComponent(CategoryEditDialog)
    await editDialog.vm.$emit('success')
    
    // 验证fetchCategories被调用
    expect(categoryStore.fetchCategories).toHaveBeenCalled()
  })
})

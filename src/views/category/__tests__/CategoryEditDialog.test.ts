import { describe, it, expect, beforeEach, vi } from 'vitest'
import { mount, type VueWrapper } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import ElementPlus from 'element-plus'
import CategoryEditDialog from '../components/CategoryEditDialog.vue'
import { useCategoryStore } from '@/stores/category'
import type { Category } from '@/types'

// 模拟Element Plus的消息
vi.mock('element-plus', async (importOriginal) => {
  const original = await importOriginal<typeof import('element-plus')>()
  return {
    ...original,
    ElMessage: {
      error: vi.fn(),
      success: vi.fn()
    }
  }
})

// 模拟分类store
vi.mock('@/stores/category', () => {
  return {
    useCategoryStore: vi.fn(() => ({
      createCategory: vi.fn(),
      updateCategory: vi.fn()
    }))
  }
})

describe('CategoryEditDialog', () => {
  let wrapper: VueWrapper
  let categoryStore: any

  beforeEach(() => {
    // 创建pinia实例
    const pinia = createPinia()
    setActivePinia(pinia)
    
    // 挂载组件
    wrapper = mount(CategoryEditDialog, {
      global: {
        plugins: [ElementPlus]
      },
      props: {
        visible: false,
        category: null
      }
    })
    
    // 获取store实例
    categoryStore = useCategoryStore()
  })

  it('should render correctly', () => {
    expect(wrapper.exists()).toBe(true)
    expect(wrapper.find('.el-dialog').exists()).toBe(true)
  })

  it('should display "新增分类" title when adding new category', async () => {
    await wrapper.setProps({ visible: true, category: null })
    expect(wrapper.find('.el-dialog__title').text()).toBe('新增分类')
  })

  it('should display "编辑分类" title when editing existing category', async () => {
    const mockCategory: Category = {
      id: 1,
      name: '电子产品',
      cateCode: 'ELECTRONICS',
      createTime: new Date(),
      updateTime: new Date(),
      delFlag: false
    }
    
    await wrapper.setProps({ visible: true, category: mockCategory })
    expect(wrapper.find('.el-dialog__title').text()).toBe('编辑分类')
  })

  it('should reset form when category prop changes to null', async () => {
    // 先设置为编辑模式
    const mockCategory: Category = {
      id: 1,
      name: '电子产品',
      cateCode: 'ELECTRONICS',
      createTime: new Date(),
      updateTime: new Date(),
      delFlag: false
    }
    
    await wrapper.setProps({ category: mockCategory })
    expect((wrapper.find('input[placeholder="请输入分类名称"]').element as HTMLInputElement).value).toBe('电子产品')
    expect((wrapper.find('input[placeholder="请输入分类编码"]').element as HTMLInputElement).value).toBe('ELECTRONICS')
    
    // 切换到新增模式
    await wrapper.setProps({ category: null })
    expect((wrapper.find('input[placeholder="请输入分类名称"]').element as HTMLInputElement).value).toBe('')
    expect((wrapper.find('input[placeholder="请输入分类编码"]').element as HTMLInputElement).value).toBe('')
  })

  it('should populate form when category prop changes to an object', async () => {
    const mockCategory: Category = {
      id: 1,
      name: '电子产品',
      cateCode: 'ELECTRONICS',
      createTime: new Date(),
      updateTime: new Date(),
      delFlag: false
    }
    
    await wrapper.setProps({ category: mockCategory })
    expect((wrapper.find('input[placeholder="请输入分类名称"]').element as HTMLInputElement).value).toBe('电子产品')
    expect((wrapper.find('input[placeholder="请输入分类编码"]').element as HTMLInputElement).value).toBe('ELECTRONICS')
  })

  it('should emit update:visible event with false when cancel button is clicked', async () => {
    await wrapper.setProps({ visible: true })
    await wrapper.find('.el-button').trigger('click')
    
    expect(wrapper.emitted('update:visible')).toEqual([[false]])
  })

  it('should emit update:visible event with false when dialog is closed', async () => {
    await wrapper.setProps({ visible: true })
    await wrapper.find('.el-dialog').trigger('close')
    
    expect(wrapper.emitted('update:visible')).toEqual([[false]])
  })

  it('should validate form before submitting', async () => {
    await wrapper.setProps({ visible: true })
    
    // 点击提交按钮（表单为空）
    await wrapper.find('.el-button--primary').trigger('click')
    
    // 验证表单验证规则被触发
    expect(wrapper.find('.el-form-item__error').exists()).toBe(true)
  })

  it('should call createCategory when submitting new category', async () => {
    // 模拟createCategory方法
    const mockCreatedCategory: Category = {
      id: 3,
      name: '家居用品',
      cateCode: 'HOME',
      createTime: new Date(),
      updateTime: new Date(),
      delFlag: false
    }
    ;(categoryStore.createCategory as any).mockResolvedValue(mockCreatedCategory)
    
    // 填写表单
    await wrapper.setProps({ visible: true })
    await wrapper.find('input[placeholder="请输入分类名称"]').setValue('家居用品')
    await wrapper.find('input[placeholder="请输入分类编码"]').setValue('HOME')
    
    // 点击提交按钮
    await wrapper.find('.el-button--primary').trigger('click')
    
    // 验证createCategory被调用
    expect(categoryStore.createCategory).toHaveBeenCalledWith({
      name: '家居用品',
      cateCode: 'HOME'
    })
    
    // 验证成功事件被触发
    expect(wrapper.emitted('success')).toBeTruthy()
    // 验证对话框被关闭
    expect(wrapper.emitted('update:visible')).toEqual([[false]])
  })

  it('should call updateCategory when submitting existing category', async () => {
    // 模拟updateCategory方法
    const mockCategory: Category = {
      id: 1,
      name: '电子产品',
      cateCode: 'ELECTRONICS',
      createTime: new Date(),
      updateTime: new Date(),
      delFlag: false
    }
    
    const mockUpdatedCategory: Category = {
      ...mockCategory,
      name: '数码产品',
      cateCode: 'DIGITAL'
    }
    
    ;(categoryStore.updateCategory as any).mockResolvedValue(mockUpdatedCategory)
    
    // 填写表单
    await wrapper.setProps({ visible: true, category: mockCategory })
    await wrapper.find('input[placeholder="请输入分类名称"]').setValue('数码产品')
    await wrapper.find('input[placeholder="请输入分类编码"]').setValue('DIGITAL')
    
    // 点击提交按钮
    await wrapper.find('.el-button--primary').trigger('click')
    
    // 验证updateCategory被调用
    expect(categoryStore.updateCategory).toHaveBeenCalledWith({
      ...mockCategory,
      name: '数码产品',
      cateCode: 'DIGITAL'
    })
    
    // 验证成功事件被触发
    expect(wrapper.emitted('success')).toBeTruthy()
    // 验证对话框被关闭
    expect(wrapper.emitted('update:visible')).toEqual([[false]])
  })

  it('should handle form validation errors', async () => {
    await wrapper.setProps({ visible: true })
    
    // 填写无效数据
    await wrapper.find('input[placeholder="请输入分类名称"]').setValue('')
    await wrapper.find('input[placeholder="请输入分类编码"]').setValue('')
    
    // 点击提交按钮
    await wrapper.find('.el-button--primary').trigger('click')
    
    // 验证错误信息被显示
    expect(wrapper.find('.el-form-item__error').exists()).toBe(true)
  })

  it('should handle API errors when creating category', async () => {
    // 导入ElMessage
    const { ElMessage } = await import('element-plus')
    
    // 模拟createCategory方法抛出错误
    ;(categoryStore.createCategory as any).mockRejectedValue(new Error('API Error'))
    
    // 填写表单
    await wrapper.setProps({ visible: true })
    await wrapper.find('input[placeholder="请输入分类名称"]').setValue('家居用品')
    await wrapper.find('input[placeholder="请输入分类编码"]').setValue('HOME')
    
    // 点击提交按钮
    await wrapper.find('.el-button--primary').trigger('click')
    
    // 验证错误消息被显示
    expect(ElMessage.error).toHaveBeenCalledWith('分类创建失败')
  })

  it('should handle API errors when updating category', async () => {
    // 导入ElMessage
    const { ElMessage } = await import('element-plus')
    
    const mockCategory: Category = {
      id: 1,
      name: '电子产品',
      cateCode: 'ELECTRONICS',
      createTime: new Date(),
      updateTime: new Date(),
      delFlag: false
    }
    
    // 模拟updateCategory方法抛出错误
    ;(categoryStore.updateCategory as any).mockRejectedValue(new Error('API Error'))
    
    // 填写表单
    await wrapper.setProps({ visible: true, category: mockCategory })
    await wrapper.find('input[placeholder="请输入分类名称"]').setValue('数码产品')
    await wrapper.find('input[placeholder="请输入分类编码"]').setValue('DIGITAL')
    
    // 点击提交按钮
    await wrapper.find('.el-button--primary').trigger('click')
    
    // 验证错误消息被显示
    expect(ElMessage.error).toHaveBeenCalledWith('分类更新失败')
  })

  it('should handle 409 error for duplicate category code', async () => {
    // 导入ElMessage
    const { ElMessage } = await import('element-plus')
    
    // 模拟createCategory方法抛出409错误
    const error = new Error('Conflict')
    ;(error as any).response = { status: 409 }
    ;(categoryStore.createCategory as any).mockRejectedValue(error)
    
    // 填写表单
    await wrapper.setProps({ visible: true })
    await wrapper.find('input[placeholder="请输入分类名称"]').setValue('家居用品')
    await wrapper.find('input[placeholder="请输入分类编码"]').setValue('HOME')
    
    // 点击提交按钮
    await wrapper.find('.el-button--primary').trigger('click')
    
    // 验证错误消息被显示
    expect(ElMessage.error).toHaveBeenCalledWith('分类编码已存在，请使用其他编码')
  })

  it('should handle 400 error for bad request', async () => {
    // 导入ElMessage
    const { ElMessage } = await import('element-plus')
    
    // 模拟createCategory方法抛出400错误
    const error = new Error('Bad Request')
    ;(error as any).response = { status: 400 }
    ;(categoryStore.createCategory as any).mockRejectedValue(error)
    
    // 填写表单
    await wrapper.setProps({ visible: true })
    await wrapper.find('input[placeholder="请输入分类名称"]').setValue('家居用品')
    await wrapper.find('input[placeholder="请输入分类编码"]').setValue('HOME')
    
    // 点击提交按钮
    await wrapper.find('.el-button--primary').trigger('click')
    
    // 验证错误消息被显示
    expect(ElMessage.error).toHaveBeenCalledWith('请求参数有误，请检查输入内容')
  })
})

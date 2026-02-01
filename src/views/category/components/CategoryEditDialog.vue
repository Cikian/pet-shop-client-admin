<template>
  <el-dialog
    v-model="dialogVisible"
    :title="isEdit ? '编辑分类' : '新增分类'"
    width="500px"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    @close="handleClose"
  >
    <el-form
      ref="formRef"
      :model="formData"
      :rules="formRules"
      label-width="80px"
      @submit.prevent
    >
      <el-form-item label="分类名称" prop="name">
        <el-input
          v-model="formData.name"
          placeholder="请输入分类名称"
          maxlength="50"
          show-word-limit
          clearable
        />
      </el-form-item>
      
      <el-form-item label="分类编码" prop="cateCode">
        <el-input
          v-model="formData.cateCode"
          placeholder="请输入分类编码"
          maxlength="20"
          show-word-limit
          clearable
        />
      </el-form-item>
    </el-form>

    <template #footer>
      <div class="dialog-footer">
        <el-button @click="handleCancel">取消</el-button>
        <el-button type="primary" :loading="loading" @click="handleSubmit">
          {{ isEdit ? '更新' : '创建' }}
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, reactive, computed, watch, nextTick } from 'vue'
import { ElMessage, type FormInstance, type FormRules } from 'element-plus'
import { useCategoryStore } from '@/stores/category'
import type { Category } from '@/types'

// Props
interface Props {
  visible: boolean
  category?: Category | null
}

const props = withDefaults(defineProps<Props>(), {
  visible: false,
  category: null
})

// Emits
interface Emits {
  (e: 'update:visible', visible: boolean): void
  (e: 'success'): void
}

const emit = defineEmits<Emits>()

// 状态管理
const categoryStore = useCategoryStore()

// 响应式数据
const formRef = ref<FormInstance>()
const loading = ref(false)

const formData = reactive({
  name: '',
  cateCode: ''
})

// 计算属性
const dialogVisible = computed({
  get: () => props.visible,
  set: (value: boolean) => emit('update:visible', value)
})

const isEdit = computed(() => !!props.category?.id)

// 表单验证规则
const formRules: FormRules = {
  name: [
    { required: true, message: '请输入分类名称', trigger: 'blur' },
    { min: 1, max: 50, message: '分类名称长度在 1 到 50 个字符', trigger: 'blur' },
    {
      pattern: /^[\u4e00-\u9fa5a-zA-Z0-9\s]+$/,
      message: '分类名称只能包含中文、英文、数字和空格',
      trigger: 'blur'
    }
  ],
  cateCode: [
    { required: true, message: '请输入分类编码', trigger: 'blur' },
    { min: 1, max: 20, message: '分类编码长度在 1 到 20 个字符', trigger: 'blur' },
    {
      pattern: /^[a-zA-Z0-9_-]+$/,
      message: '分类编码只能包含英文、数字、下划线和短横线',
      trigger: 'blur'
    }
  ]
}

// 重置表单
const resetForm = () => {
  formData.name = ''
  formData.cateCode = ''
  formRef.value?.resetFields()
}

// 监听分类数据变化
watch(
  () => props.category,
  (newCategory) => {
    if (newCategory) {
      // 编辑模式，填充表单数据
      formData.name = newCategory.name || ''
      formData.cateCode = newCategory.cateCode || ''
    } else {
      // 新增模式，重置表单数据
      resetForm()
    }
  },
  { immediate: true }
)

// 监听对话框显示状态
watch(
  () => props.visible,
  (visible) => {
    if (visible) {
      // 对话框打开时，重置验证状态
      nextTick(() => {
        formRef.value?.clearValidate()
      })
    }
  }
)

// 处理取消
const handleCancel = () => {
  dialogVisible.value = false
}

// 处理关闭
const handleClose = () => {
  resetForm()
}

// 处理提交
const handleSubmit = async () => {
  if (!formRef.value) return

  try {
    // 表单验证
    const valid = await formRef.value.validate()
    if (!valid) return

    loading.value = true

    if (isEdit.value) {
      // 编辑模式
      const updateData: Category = {
        ...props.category!,
        name: formData.name.trim(),
        cateCode: formData.cateCode.trim()
      }
      
      await categoryStore.updateCategory(updateData)
      ElMessage.success('分类更新成功')
    } else {
      // 新增模式
      const createData = {
        name: formData.name.trim(),
        cateCode: formData.cateCode.trim()
      }
      
      await categoryStore.createCategory(createData)
      ElMessage.success('分类创建成功')
    }

    // 成功后关闭对话框并触发成功事件
    dialogVisible.value = false
    emit('success')
  } catch (error: any) {
    console.error('Submit category failed:', error)
    
    // 根据错误类型显示不同的错误信息
    if (error?.response?.status === 409) {
      ElMessage.error('分类编码已存在，请使用其他编码')
    } else if (error?.response?.status === 400) {
      ElMessage.error('请求参数有误，请检查输入内容')
    } else {
      ElMessage.error(isEdit.value ? '分类更新失败' : '分类创建失败')
    }
  } finally {
    loading.value = false
  }
}
</script>

<style scoped lang="scss">
.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}

// 表单样式优化
:deep(.el-form) {
  .el-form-item {
    margin-bottom: 20px;
    
    .el-form-item__label {
      font-weight: 500;
      color: var(--el-text-color-primary);
    }
    
    .el-input {
      .el-input__wrapper {
        transition: all 0.2s ease;
        
        &:hover {
          box-shadow: 0 0 0 1px var(--el-color-primary-light-7);
        }
      }
    }
  }
}

// 对话框样式优化
:deep(.el-dialog) {
  .el-dialog__header {
    padding: 20px 20px 10px 20px;
    
    .el-dialog__title {
      font-size: 18px;
      font-weight: 600;
      color: var(--el-text-color-primary);
    }
  }
  
  .el-dialog__body {
    padding: 10px 20px 20px 20px;
  }
  
  .el-dialog__footer {
    padding: 10px 20px 20px 20px;
  }
}

// 响应式设计
@media (max-width: 768px) {
  :deep(.el-dialog) {
    width: 90% !important;
    margin: 5vh auto;
    
    .el-dialog__body {
      padding: 10px 15px 20px 15px;
    }
    
    .el-form {
      .el-form-item {
        .el-form-item__label {
          width: 70px !important;
        }
      }
    }
  }
}
</style>
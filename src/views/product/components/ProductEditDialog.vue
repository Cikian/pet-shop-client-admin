<template>
  <el-dialog
    v-model="dialogVisible"
    :title="dialogTitle"
    width="90%"
    :before-close="handleClose"
    @close="handleCancel"
  >
    <!-- 标签页 -->
    <el-tabs v-model="activeTab" type="border-card">
      <!-- 基本信息 -->
      <el-tab-pane label="基本信息" name="basic">
        <el-form
          ref="formRef"
          :model="formData"
          :rules="formRules"
          label-width="120px"
          class="product-form"
        >
          <el-form-item label="商品名称" prop="name">
            <el-input v-model="formData.name" placeholder="请输入商品名称" />
          </el-form-item>
          <el-form-item label="商品描述" prop="description">
            <el-input
              v-model="formData.description"
              type="textarea"
              placeholder="请输入商品描述"
              rows="4"
            />
          </el-form-item>
          <el-form-item label="商品分类" prop="categoryId">
            <el-select v-model="formData.categoryId" placeholder="请选择商品分类">
              <el-option
                v-for="category in categories"
                :key="category.id"
                :label="category.name"
                :value="category.id"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="主图" prop="mainImg">
            <el-upload
              v-model:file-list="mainImgFileList"
              class="main-img-upload"
              action=""
              :auto-upload="false"
              :on-change="handleMainImgChange"
              :on-remove="handleMainImgRemove"
              list-type="picture-card"
            >
              <template #default>
                <el-icon><Plus /></el-icon>
                <div class="el-upload__text">上传主图</div>
              </template>
              <template #file="{ file }">
                <div class="image-item">
                  <img :src="file.url" alt="主图" class="image-preview" />
                </div>
              </template>
            </el-upload>
          </el-form-item>
          <el-form-item label="商品状态" prop="status">
            <el-radio-group v-model="formData.status">
              <el-radio :label="1">上架</el-radio>
              <el-radio :label="0">下架</el-radio>
            </el-radio-group>
          </el-form-item>

          <!-- 商品附图 -->
          <el-form-item label="商品附图" name="images">
            <div class="product-images">
              <!-- 自定义图片上传和管理 -->
              <div class="custom-upload-container">
                <!-- 上传按钮 -->
                <el-upload
                  class="upload-demo"
                  action=""
                  :auto-upload="false"
                  :on-change="handleImageChange"
                  :show-file-list="false"
                  list-type="picture-card"
                >
                  <template #default>
                    <el-icon><Plus /></el-icon>
                    <div class="el-upload__text">上传图片</div>
                  </template>
                </el-upload>

                <!-- 图片列表 -->
                <div class="image-list">
                  <div
                    v-for="(file) in imageFileList"
                    :key="file.id || file.uid"
                    class="image-item"
                  >
                    <img :src="file.url" alt="商品图片" class="image-preview" />
                    <div class="image-actions">
                      <el-input
                        v-model="file.description"
                        placeholder="图片描述"
                        size="small"
                        class="image-description"
                      />
                      <el-input-number
                        v-model="file.sortOrder"
                        :min="1"
                        :max="100"
                        size="small"
                        class="image-sort"
                        placeholder="排序"
                      />
                    </div>
                    <span class="image-item-actions">
                      <span
                        class="image-item-preview"
                        @click="handlePictureCardPreview(file)"
                      >
                        <el-icon><View /></el-icon>
                      </span>
                      <span
                        class="image-item-delete"
                        @click="handleImageRemove(file)"
                      >
                        <el-icon><Delete /></el-icon>
                      </span>
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </el-form-item>
        </el-form>
      </el-tab-pane>

            <!-- 规格管理 -->
            <el-tab-pane label="规格管理" name="spec">
                <div class="spec-management">
                    <el-button type="primary" @click="handleAddSpecKey" style="margin-bottom: 20px">
                        <el-icon>
                            <Plus />
                        </el-icon>
                        新增规格类型
                    </el-button>

                    <div v-if="specKeys.length === 0" class="empty-spec">
                        <el-empty description="暂无规格类型，请点击新增规格类型按钮添加" />
                    </div>

                    <div v-else class="spec-list">
                        <div v-for="(specKey, keyIndex) in specKeys" :key="specKey.id || keyIndex"
                            class="spec-key-item">
                            <div class="spec-key-header">
                                <h4>{{ specKey.name ? specKey.name : '规格类型' + (keyIndex + 1) }}</h4>
                                <el-button type="danger" size="small" @click="handleRemoveSpecKey(keyIndex)">
                                    删除
                                </el-button>
                            </div>
                            <el-form :model="specKey" label-width="100px">
                                <el-form-item label="规格名称">
                                    <el-input v-model="specKey.name" placeholder="请输入规格名称，如：颜色、尺寸" />
                                </el-form-item>
                                <el-form-item label="输入类型">
                                    <el-select v-model="specKey.inputType" placeholder="请选择输入类型">
                                        <el-option label="选择" value="select" />
                                        <el-option label="文本" value="text" />
                                        <el-option label="图片" value="image" />
                                    </el-select>
                                </el-form-item>
                                <el-form-item label="排序">
                                    <el-input-number v-model="specKey.sortOrder" :min="1" :max="100"
                                        placeholder="请输入排序" />
                                </el-form-item>
                            </el-form>

                            <!-- 规格值 -->
                            <div class="spec-values">
                                <h5>规格值</h5>
                                <el-button type="success" size="small" @click="handleAddSpecValue(keyIndex)"
                                    style="margin-bottom: 10px">
                                    <el-icon>
                                        <Plus />
                                    </el-icon>
                                    新增规格值
                                </el-button>
                                <div v-if="specKey.values && specKey.values.length === 0" class="empty-spec-value">
                                    <el-empty description="暂无规格值，请点击新增规格值按钮添加" />
                                </div>
                                <div v-else class="spec-value-list">
                                    <div v-for="(specValue, valueIndex) in specKey.values"
                                        :key="specValue.id || valueIndex" class="spec-value-item">
                                        <el-form :model="specValue" label-width="80px">
                                            <el-form-item label="规格值">
                                                <el-input v-model="specValue.value" placeholder="请输入规格值" />
                                            </el-form-item>
                                            <el-form-item label="排序">
                                                <el-input-number v-model="specValue.sortOrder" :min="1" :max="100"
                                                    placeholder="请输入排序" />
                                            </el-form-item>
                                            <el-button type="danger" size="small"
                                                @click="handleRemoveSpecValue(keyIndex, valueIndex)">
                                                删除
                                            </el-button>
                                        </el-form>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </el-tab-pane>

    

      <!-- SKU管理 -->
      <el-tab-pane label="SKU管理" name="sku">
        <div class="sku-management">
          <el-button type="primary" @click="handleAddSku" style="margin-bottom: 20px">
            <el-icon><Plus /></el-icon>
            新增SKU
          </el-button>

          <div v-if="skuList.length === 0" class="empty-sku">
            <el-empty description="暂无SKU，请点击新增SKU按钮添加" />
          </div>

          <div v-else class="sku-list">
            <div
              v-for="(sku, index) in skuList"
              :key="sku.id || index"
              class="sku-item"
            >
              <div class="sku-header">
                <h4>SKU {{ index + 1 }}</h4>
                <el-button type="danger" size="small" @click="handleRemoveSku(index)">
                  删除
                </el-button>
              </div>
              <el-form :model="sku" label-width="100px">
                <el-form-item label="SKU编码">
                  <el-input v-model="sku.skuCode" placeholder="请输入SKU编码" />
                </el-form-item>
                <el-form-item label="SKU名称">
                  <el-input v-model="sku.name" placeholder="请输入SKU名称" />
                </el-form-item>
                <el-form-item label="价格">
                  <el-input-number v-model="sku.price" :min="0" :step="0.01" placeholder="请输入价格" />
                </el-form-item>
                <el-form-item label="原价">
                  <el-input-number v-model="sku.originalPrice" :min="0" :step="0.01" placeholder="请输入原价" />
                </el-form-item>
                <el-form-item label="库存">
                  <el-input-number v-model="sku.stock" :min="0" placeholder="请输入库存" />
                </el-form-item>
                <el-form-item label="预警库存">
                  <el-input-number v-model="sku.warningStock" :min="0" placeholder="请输入预警库存" />
                </el-form-item>
                <el-form-item label="默认SKU">
                  <el-checkbox v-model="sku.isDefault">设为默认</el-checkbox>
                </el-form-item>
              </el-form>
            </div>
          </div>
        </div>
      </el-tab-pane>
    </el-tabs>

    <!-- 对话框底部按钮 -->
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="handleCancel">取消</el-button>
        <el-button type="primary" @click="handleSubmit">保存</el-button>
      </span>
    </template>
  </el-dialog>

  <!-- 图片预览对话框 -->
  <el-image-viewer
    v-if="previewVisible && previewImage"
    v-model="previewVisible"
    :url-list="[previewImage]"
    @close="previewVisible = false"
  />
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import { Plus, View, Delete } from '@element-plus/icons-vue'
import { ElMessage, ElImageViewer } from 'element-plus'
import { useProductStore } from '@/stores/product'
import { useCategoryStore } from '@/stores/category'
import { useProductImageStore } from '@/stores/productImage'
import { useSkuStore } from '@/stores/sku'
import { useSpecStore } from '@/stores/spec'
import type { Product, Category, SKU, SpecKey, SpecValue } from '@/types'

// Props
const props = defineProps<{
  visible: boolean
  product: Product | null
}>()

// Emits
const emit = defineEmits<{
  'update:visible': [value: boolean]
  'success': []
}>()

// Store
const productStore = useProductStore()
const categoryStore = useCategoryStore()
const productImageStore = useProductImageStore()
const skuStore = useSkuStore()
const specStore = useSpecStore()

// 响应式数据
const dialogVisible = computed({
  get: () => props.visible,
  set: (value) => emit('update:visible', value)
})

const formRef = ref()
const activeTab = ref('basic')
const categories = ref<Category[]>([])
const disabled = ref(false)
const previewImage = ref('')
const previewVisible = ref(false)

// 生成临时ID的辅助函数
const generateTempId = () => {
  return `temp_id:${Math.random().toString(36).substring(2, 8)}`
}

// 表单数据
const formData = ref<Product>({
  id: undefined,
  name: '',
  description: '',
  categoryId: undefined,
  status: 1,
  createTime: undefined,
  updateTime: undefined,
  delFlag: false
})

// 商品附图
const imageFileList = ref<any[]>([])

// 主图
const mainImgFileList = ref<any[]>([])

// SKU列表
const skuList = ref<(SKU & { specs?: any[] })[]>([])

// 规格键值
const specKeys = ref<(SpecKey & { values: SpecValue[] })[]>([])

// 表单验证规则
const formRules = ref({
  name: [
    { required: true, message: '请输入商品名称', trigger: 'blur' },
    { min: 1, max: 100, message: '商品名称长度在1到100个字符之间', trigger: 'blur' }
  ],
  categoryId: [
    { required: true, message: '请选择商品分类', trigger: 'change' }
  ],
  status: [
    { required: true, message: '请选择商品状态', trigger: 'change' }
  ]
})

// 重置表单
const resetForm = () => {
  formData.value = {
    id: undefined,
    name: '',
    description: '',
    categoryId: undefined,
    mainImg: '',
    status: 1,
    createTime: undefined,
    updateTime: undefined,
    delFlag: false
  }
  imageFileList.value = []
  mainImgFileList.value = []
  skuList.value = []
  specKeys.value = []
  formRef.value?.resetFields()
}

// 计算属性
const dialogTitle = computed(() => {
  return props.product ? '编辑商品' : '新增商品'
})

// 监听商品数据变化
watch(
  () => props.product,
  (newProduct) => {
    if (newProduct) {
      // 编辑模式，填充表单数据
      formData.value = { ...newProduct }
      // 加载主图
      if (newProduct.mainImg) {
        mainImgFileList.value = [{
          url: newProduct.mainImg,
          name: 'mainImg'
        }]
      }
      // 加载商品附图
      loadProductImages(newProduct.id!)
      // 加载SKU
    //   loadSkus(newProduct.id!)
      // 加载规格
    //   loadSpecs(newProduct.id!)
    } else {
      // 新增模式，重置表单数据
      resetForm()
    }
  },
  { immediate: true }
)

// 加载分类
const loadCategories = async () => {
  try {
    await categoryStore.fetchCategories({ pageSize: 100 })
    categories.value = Array.from(categoryStore.categories)
  } catch (error) {
    console.error('Failed to load categories:', error)
  }
}

// 加载商品附图
const loadProductImages = async (productId: number) => {
  try {
    const images = await productImageStore.fetchImagesByProductId(productId)
    imageFileList.value = images.map(img => ({
      id: img.id,
      url: img.imgUrl,
      description: img.description,
      sortOrder: img.sortOrder,
      status: img.status
    }))
  } catch (error) {
    console.error('Failed to load product images:', error)
  }
}

// 加载SKU
const loadSkus = async (productId: number) => {
  try {
    const skus = await skuStore.fetchSkusByProductId(productId)
    skuList.value = skus
  } catch (error) {
    console.error('Failed to load skus:', error)
  }
}

// 加载规格
const loadSpecs = async (productId: number) => {
  try {
    const specKeysData = await specStore.fetchSpecKeysByProductOrSkuId({ pId: productId })
    const specsWithValues = await Promise.all(
      specKeysData.map(async (key) => {
        const values = await specStore.fetchSpecValuesBySpecKeyId(key.id!)
        return {
          ...key,
          values
        }
      })
    )
    specKeys.value = specsWithValues
  } catch (error) {
    console.error('Failed to load specs:', error)
  }
}

// 处理图片变化
const handleImageChange = (file: any) => {
  // 这里可以处理图片上传逻辑
  if (!file.url) {
    // 模拟上传，实际项目中应该调用上传接口
    file.url = URL.createObjectURL(file.raw)
  }
  if (!file.sortOrder) {
    file.sortOrder = imageFileList.value.length + 1
  }
  if (file.status === undefined) {
    file.status = true
  }
  // 将新上传的图片添加到imageFileList中
  const existingIndex = imageFileList.value.findIndex(item => item.uid === file.uid)
  if (existingIndex === -1) {
    imageFileList.value.push(file)
  }
}

// 处理图片移除
const handleImageRemove = (file: any) => {
  const index = imageFileList.value.findIndex(item => item.id === file.id || item.uid === file.uid)
  if (index !== -1) {
    imageFileList.value.splice(index, 1)
  }
}

// 处理主图变化
const handleMainImgChange = (file: any) => {
  // 关闭自动上传，只在本地预览
  if (!file.url) {
    // 模拟上传，实际项目中应该调用上传接口
    file.url = URL.createObjectURL(file.raw)
  }
  // 始终替换主图，确保只有一张
  mainImgFileList.value = [file]
}

// 处理主图移除
const handleMainImgRemove = (file: any) => {
  const index = mainImgFileList.value.findIndex(item => item.id === file.id || item.uid === file.uid)
  if (index !== -1) {
    mainImgFileList.value.splice(index, 1)
  }
}

// 处理图片预览
const handlePictureCardPreview = (file: any) => {
  previewImage.value = file.url
  previewVisible.value = true
}

// 处理添加SKU
const handleAddSku = () => {
  skuList.value.push({
    id: undefined,
    productId: formData.value.id || 0,
    skuCode: '',
    name: '',
    price: 0,
    originalPrice: 0,
    stock: 0,
    warningStock: 0,
    isDefault: skuList.value.length === 0,
    delFlag: false
  })
}

// 处理移除SKU
const handleRemoveSku = (index: number) => {
  skuList.value.splice(index, 1)
  if (skuList.value.length > 0 && !skuList.value.some(sku => sku.isDefault)) {
    skuList.value[0].isDefault = true
  }
}

// 处理添加规格键
const handleAddSpecKey = () => {
  // 为新添加的规格生成临时ID
  const tempId = generateTempId()
  specKeys.value.push({
    id: tempId,
    name: '',
    categoryId: formData.value.categoryId,
    inputType: 'select',
    sortOrder: specKeys.value.length + 1,
    delFlag: false,
    values: []
  })
}

// 处理移除规格键
const handleRemoveSpecKey = (index: number) => {
  specKeys.value.splice(index, 1)
}

// 处理添加规格值
const handleAddSpecValue = (keyIndex: number) => {
  if (!specKeys.value[keyIndex].values) {
    specKeys.value[keyIndex].values = []
  }
  // 为新添加的规格值生成临时ID
  const tempId = generateTempId()
  specKeys.value[keyIndex].values.push({
    id: tempId,
    specKeyId: specKeys.value[keyIndex].id || 0,
    value: '',
    image: '',
    sortOrder: specKeys.value[keyIndex].values.length + 1,
    delFlag: false
  })
}

// 处理移除规格值
const handleRemoveSpecValue = (keyIndex: number, valueIndex: number) => {
  specKeys.value[keyIndex].values.splice(valueIndex, 1)
}

// 处理提交
const handleSubmit = async () => {
  try {
    await formRef.value?.validate()

    let productId: number

    if (formData.value.id) {
      // 编辑模式 - 使用FormData处理文件上传
      const productFormData = new FormData()
      productFormData.append('id', formData.value.id.toString())
      productFormData.append('name', formData.value.name || '')
      productFormData.append('description', formData.value.description || '')
      productFormData.append('categoryId', (formData.value.categoryId || 0).toString())
      productFormData.append('status', formData.value.status.toString())

      // 添加主图文件
      if (mainImgFileList.value.length > 0 && mainImgFileList.value[0].raw) {
        productFormData.append('mainImg', mainImgFileList.value[0].raw)
      }

      // 添加商品附图
      imageFileList.value.forEach((file, index) => {
        // 无论是否有raw属性，都添加到FormData中
        // 已存在的图片会有id，新增的图片id为空
        if (file.id) {
          productFormData.append(`pictures[${index}].id`, file.id.toString())
        }
        productFormData.append(`pictures[${index}].description`, file.description || '')
        if (file.raw) {
          productFormData.append(`pictures[${index}].img`, file.raw)
        }
        productFormData.append(`pictures[${index}].sortOrder`, (file.sortOrder || (index + 1)).toString())
      })

      // 添加规格列表
      specKeys.value.forEach((specKey, keyIndex) => {
        if (specKey.id) {
          productFormData.append(`specs[${keyIndex}].id`, specKey.id.toString())
        }
        productFormData.append(`specs[${keyIndex}].name`, specKey.name || '')
        productFormData.append(`specs[${keyIndex}].productId`, formData.value.id?.toString() || '')
        productFormData.append(`specs[${keyIndex}].inputType`, specKey.inputType || 'select')
        productFormData.append(`specs[${keyIndex}].sortOrder`, (specKey.sortOrder || (keyIndex + 1)).toString())
        
        // 添加规格值列表
        if (specKey.values && specKey.values.length > 0) {
          specKey.values.forEach((specValue, valueIndex) => {
            if (specValue.id) {
              productFormData.append(`specs[${keyIndex}].specValueList[${valueIndex}].id`, specValue.id.toString())
            }
            productFormData.append(`specs[${keyIndex}].specValueList[${valueIndex}].specKeyId`, specKey.id?.toString() || '')
            productFormData.append(`specs[${keyIndex}].specValueList[${valueIndex}].value`, specValue.value || '')
            productFormData.append(`specs[${keyIndex}].specValueList[${valueIndex}].image`, specValue.image || '')
            productFormData.append(`specs[${keyIndex}].specValueList[${valueIndex}].sortOrder`, (specValue.sortOrder || (valueIndex + 1)).toString())
          })
        }
      })

      await productStore.updateProduct(productFormData)
      productId = formData.value.id
    } else {
      // 新增模式 - 使用FormData处理文件上传
      const productFormData = new FormData()
      productFormData.append('name', formData.value.name || '')
      productFormData.append('description', formData.value.description || '')
      productFormData.append('categoryId', (formData.value.categoryId || 0).toString())
      productFormData.append('status', formData.value.status.toString())

      // 添加主图文件
      if (mainImgFileList.value.length > 0 && mainImgFileList.value[0].raw) {
        productFormData.append('mainImg', mainImgFileList.value[0].raw)
      }

      // 添加商品附图
      imageFileList.value.forEach((file, index) => {
        if (file.raw) {
          productFormData.append(`pictures[${index}].description`, file.description || '')
          productFormData.append(`pictures[${index}].img`, file.raw)
          productFormData.append(`pictures[${index}].sortOrder`, (file.sortOrder || (index + 1)).toString())
        }
      })

      // 添加规格列表
      specKeys.value.forEach((specKey, keyIndex) => {
        if (specKey.id) {
          productFormData.append(`specs[${keyIndex}].id`, specKey.id.toString())
        }
        productFormData.append(`specs[${keyIndex}].name`, specKey.name || '')
        productFormData.append(`specs[${keyIndex}].productId`, '')
        productFormData.append(`specs[${keyIndex}].inputType`, specKey.inputType || 'select')
        productFormData.append(`specs[${keyIndex}].sortOrder`, (specKey.sortOrder || (keyIndex + 1)).toString())
        
        // 添加规格值列表
        if (specKey.values && specKey.values.length > 0) {
          specKey.values.forEach((specValue, valueIndex) => {
            if (specValue.id) {
              productFormData.append(`specs[${keyIndex}].specValueList[${valueIndex}].id`, specValue.id.toString())
            }
            productFormData.append(`specs[${keyIndex}].specValueList[${valueIndex}].specKeyId`, specKey.id?.toString() || '')
            productFormData.append(`specs[${keyIndex}].specValueList[${valueIndex}].value`, specValue.value || '')
            productFormData.append(`specs[${keyIndex}].specValueList[${valueIndex}].image`, specValue.image || '')
            productFormData.append(`specs[${keyIndex}].specValueList[${valueIndex}].sortOrder`, (specValue.sortOrder || (valueIndex + 1)).toString())
          })
        }
      })

      const newProduct = await productStore.createProduct(productFormData)
      productId = newProduct.id!
    }

    // 保存商品附图 - 现在在新增时直接提交，编辑时需要单独处理
    // await saveProductImages(productId)

    // 保存SKU
    await saveSkus(productId)

    // 保存规格
    await saveSpecs()

    ElMessage.success('保存成功')
    emit('success')
    dialogVisible.value = false
    resetForm()
  } catch (error) {
    console.error('Failed to save product:', error)
    ElMessage.error('保存失败')
  }
}

// 保存SKU
const saveSkus = async (productId: number) => {
  try {
    // 先删除旧的SKU
    if (formData.value.id) {
      const oldSkus = await skuStore.fetchSkusByProductId(productId)
      for (const sku of oldSkus) {
        await skuStore.deleteSku(sku.id!)
      }
    }

    // 保存新的SKU
    for (const sku of skuList.value) {
      const skuData: Omit<SKU, 'id' | 'createTime' | 'updateTime' | 'delFlag'> = {
        productId,
        skuCode: sku.skuCode,
        name: sku.name,
        price: sku.price,
        originalPrice: sku.originalPrice,
        stock: sku.stock,
        warningStock: sku.warningStock,
        isDefault: sku.isDefault
      }
      await skuStore.createSku(skuData)
    }
  } catch (error) {
    console.error('Failed to save skus:', error)
    throw error
  }
}

// 保存规格
const saveSpecs = async () => {
  try {
    // 先删除旧的规格（实际项目中需要根据具体情况处理）

    // 保存新的规格键
    for (const specKey of specKeys.value) {
      const keyData: Omit<SpecKey, 'id' | 'createTime' | 'updateTime' | 'delFlag'> = {
        name: specKey.name,
        categoryId: specKey.categoryId,
        inputType: specKey.inputType,
        sortOrder: specKey.sortOrder
      }
      const newKey = await specStore.createSpecKey(keyData)

      // 保存规格值
      for (const specValue of specKey.values) {
        const valueData: Omit<SpecValue, 'id' | 'createTime' | 'updateTime' | 'delFlag'> = {
          specKeyId: newKey.id!,
          value: specValue.value,
          image: specValue.image,
          sortOrder: specValue.sortOrder
        }
        await specStore.createSpecValue(valueData)
      }
    }
  } catch (error) {
    console.error('Failed to save specs:', error)
    throw error
  }
}

// 处理取消
const handleCancel = () => {
  dialogVisible.value = false
  resetForm()
}

// 处理关闭
const handleClose = () => {
  dialogVisible.value = false
  resetForm()
}

// 生命周期
onMounted(() => {
  loadCategories()
})
</script>

<style scoped lang="scss">
.product-form {
  max-width: 800px;
}

.main-img-upload {
  margin-bottom: 20px;
}

.product-images {
  margin-top: 20px;
}

.custom-upload-container {
  margin-top: 20px;
}

.image-list {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  margin-top: 20px;
}

.image-item {
  position: relative;
  width: 200px;
  padding: 10px;
  border: 1px solid #ebeef5;
  border-radius: 4px;

  .image-preview {
    width: 100%;
    height: 150px;
    object-fit: cover;
    border-radius: 4px;
  }

  .image-actions {
    margin-top: 10px;
    display: flex;
    flex-direction: column;
    gap: 8px;

    .image-description {
      width: 100%;
    }

    .image-sort {
      width: 120px;
    }
  }

  .image-item-actions {
    position: absolute;
    top: 10px;
    right: 10px;
    display: flex;
    flex-direction: column;
    gap: 5px;

    .image-item-preview,
    .image-item-delete {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 30px;
      height: 30px;
      border-radius: 50%;
      background-color: rgba(0, 0, 0, 0.5);
      color: white;
      cursor: pointer;
      transition: background-color 0.3s;

      &:hover {
        background-color: rgba(0, 0, 0, 0.7);
      }
    }
  }
}

.sku-management {
  margin-top: 20px;
}

.sku-item {
  border: 1px solid #ebeef5;
  border-radius: 4px;
  padding: 20px;
  margin-bottom: 20px;

  .sku-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 15px;

    h4 {
      margin: 0;
      font-size: 16px;
      font-weight: 600;
    }
  }
}

.spec-management {
  margin-top: 20px;
}

.spec-key-item {
  border: 1px solid #ebeef5;
  border-radius: 4px;
  padding: 20px;
  margin-bottom: 20px;

  .spec-key-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 15px;

    h4 {
      margin: 0;
      font-size: 16px;
      font-weight: 600;
    }
  }

  .spec-values {
    margin-top: 20px;

    h5 {
      margin: 0 0 15px 0;
      font-size: 14px;
      font-weight: 600;
    }

    .spec-value-item {
      border: 1px solid #f0f0f0;
      border-radius: 4px;
      padding: 15px;
      margin-bottom: 10px;
    }
  }
}

.empty-sku,
.empty-spec {
  padding: 40px 0;
  text-align: center;
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}
</style>

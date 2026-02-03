<template>
  <el-dialog
    v-model="dialogVisible"
    :title="dialogTitle"
    width="90%"
    top="26px"
    :before-close="handleClose"
    @close="handleCancel"
    class="product-edit-dialog"
  >
    <!-- 标签页 -->
    <el-tabs v-model="activeTab" type="border-card" class="product-tabs">
      <!-- 基本信息 -->
      <el-tab-pane label="基本信息" name="basic" class="tab-pane">
        <el-form
          ref="formRef"
          :model="formData"
          :rules="formRules"
          label-width="120px"
          class="product-form"
        >
          <el-form-item label="商品名称" prop="name" class="form-item">
            <el-input v-model="formData.name" placeholder="请输入商品名称" class="form-input"/>
          </el-form-item>
          <el-form-item label="商品描述" prop="description" class="form-item">
            <el-input
              v-model="formData.description"
              type="textarea"
              placeholder="请输入商品描述"
              rows="4"
              class="form-textarea"
            />
          </el-form-item>
          <el-form-item label="商品分类" prop="categoryId" class="form-item">
            <el-select v-model="formData.categoryId" placeholder="请选择商品分类" class="form-select">
              <el-option
                v-for="category in categories"
                :key="category.id"
                :label="category.name"
                :value="category.id"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="主图" prop="mainImg" class="form-item">
            <div class="main-img-section">
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
                  <div class="upload-btn">
                    <el-icon class="upload-icon">
                      <Plus/>
                    </el-icon>
                    <div class="upload-text">上传主图</div>
                  </div>
                </template>
                <template #file="{ file }">
                  <div class="image-item main-image-item">
                    <img :src="file.url" alt="主图" class="image-preview"/>
                    <div class="image-overlay">
                      <span class="overlay-text">主图</span>
                    </div>
                  </div>
                </template>
              </el-upload>
              <div class="upload-hint">* 建议上传尺寸为800x800像素的图片，支持JPG、PNG格式</div>
            </div>
          </el-form-item>
          <el-form-item label="商品状态" prop="status" class="form-item">
            <el-radio-group v-model="formData.status" class="status-radio-group">
              <el-radio :label="1" class="status-radio">上架</el-radio>
              <el-radio :label="0" class="status-radio">下架</el-radio>
            </el-radio-group>
          </el-form-item>

          <!-- 商品附图 -->
          <el-form-item label="商品附图" name="images" class="form-item">
            <div class="product-images">
              <div class="section-title">商品附图</div>
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
                    <div class="upload-btn">
                      <el-icon class="upload-icon">
                        <Plus/>
                      </el-icon>
                      <div class="upload-text">上传图片</div>
                    </div>
                  </template>
                </el-upload>

                <!-- 图片列表 -->
                <div class="image-list">
                  <div
                    v-for="(file) in imageFileList"
                    :key="file.id || file.uid"
                    class="image-item"
                  >
                    <img :src="file.url" alt="商品图片" class="image-preview"/>
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
                    <div class="image-item-actions">
                      <span
                        class="image-item-preview"
                        @click="handlePictureCardPreview(file)"
                        title="预览"
                      >
                        <el-icon><View/></el-icon>
                      </span>
                      <span
                        class="image-item-delete"
                        @click="handleImageRemove(file)"
                        title="删除"
                      >
                        <el-icon><Delete/></el-icon>
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </el-form-item>
        </el-form>
      </el-tab-pane>

      <!-- 规格管理 -->
      <el-tab-pane label="规格管理" name="spec" class="tab-pane">
        <div class="spec-management">
          <el-button type="primary" @click="handleAddSpecKey" class="add-btn">
            <el-icon class="btn-icon">
              <Plus/>
            </el-icon>
            新增规格类型
          </el-button>

          <div v-if="specKeys.length === 0" class="empty-section">
            <el-empty description="暂无规格类型，请点击新增规格类型按钮添加"/>
          </div>

          <div v-else class="spec-list">
            <div v-for="(specKey, keyIndex) in specKeys" :key="specKey.id || keyIndex"
                 class="spec-key-item">
              <div class="spec-key-header">
                <h4 class="section-title">{{ specKey.name ? specKey.name : '规格类型' + (keyIndex + 1) }}</h4>
                <el-button type="danger" size="small" @click="handleRemoveSpecKey(keyIndex)" class="delete-btn">
                  <el-icon class="btn-icon">
                    <Delete/>
                  </el-icon>
                  删除
                </el-button>
              </div>
              <el-form :model="specKey" label-width="100px" class="spec-form">
                <el-form-item label="规格名称" class="form-item">
                  <el-input v-model="specKey.name" placeholder="请输入规格名称，如：颜色、尺寸" class="form-input"/>
                </el-form-item>
                <el-form-item label="输入类型" class="form-item">
                  <el-select v-model="specKey.inputType" placeholder="请选择输入类型" class="form-select">
                    <el-option label="选择" value="select"/>
                    <el-option label="文本" value="text"/>
                    <el-option label="图片" value="image"/>
                  </el-select>
                </el-form-item>
                <el-form-item label="排序" class="form-item">
                  <el-input-number v-model="specKey.sortOrder" :min="1" :max="100"
                                   placeholder="请输入排序" class="form-input-number"/>
                </el-form-item>
              </el-form>

              <!-- 规格值 -->
              <div class="spec-values">
                <h5 class="subsection-title">规格值</h5>
                <el-button type="success" size="small" @click="handleAddSpecValue(keyIndex)"
                           class="add-small-btn">
                  <el-icon class="btn-icon">
                    <Plus/>
                  </el-icon>
                  新增规格值
                </el-button>
                <div v-if="specKey.values && specKey.values.length === 0" class="empty-subsection">
                  <el-empty description="暂无规格值，请点击新增规格值按钮添加" :image-size="80"/>
                </div>
                <div v-else class="spec-value-list">
                  <div v-for="(specValue, valueIndex) in specKey.values"
                       :key="specValue.id || valueIndex" class="spec-value-item">
                    <el-form :model="specValue" label-width="80px" class="spec-value-form">
                      <el-form-item label="规格值" class="form-item">
                        <el-input v-model="specValue.value" placeholder="请输入规格值" class="form-input"/>
                      </el-form-item>
                      <el-form-item label="排序" class="form-item">
                        <el-input-number v-model="specValue.sortOrder" :min="1" :max="100"
                                         placeholder="请输入排序" class="form-input-number"/>
                      </el-form-item>
                      <el-button type="danger" size="small"
                                 @click="handleRemoveSpecValue(keyIndex, valueIndex)" class="delete-small-btn">
                        <el-icon class="btn-icon">
                          <Delete/>
                        </el-icon>
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
      <el-tab-pane label="SKU管理" name="sku" class="tab-pane">
        <div class="sku-management">
          <el-button type="primary" @click="handleAddSku" class="add-btn">
            <el-icon class="btn-icon">
              <Plus/>
            </el-icon>
            新增SKU
          </el-button>

          <div v-if="skuList.length === 0" class="empty-section">
            <el-empty description="暂无SKU，请点击新增SKU按钮添加"/>
          </div>

          <div v-else class="sku-list">
            <div
              v-for="(sku, skuIndex) in skuList"
              :key="sku.id || skuIndex"
              class="sku-item"
            >
              <div class="sku-header">
                <h4 class="section-title">SKU {{ skuIndex + 1 }}</h4>
                <el-button type="danger" size="small" @click="handleRemoveSku(skuIndex)" class="delete-btn">
                  <el-icon class="btn-icon">
                    <Delete/>
                  </el-icon>
                  删除
                </el-button>
              </div>
              <el-form :model="sku" label-width="100px" class="sku-form">
                <div class="form-row">
                  <el-form-item label="SKU编码" class="form-item half">
                    <el-input v-model="sku.skuCode" placeholder="请输入SKU编码" class="form-input"/>
                  </el-form-item>
                  <el-form-item label="SKU名称" class="form-item half">
                    <el-input v-model="sku.name" placeholder="请输入SKU名称" class="form-input"/>
                  </el-form-item>
                </div>
                <div class="form-row">
                  <el-form-item label="价格" class="form-item half">
                    <el-input-number v-model="sku.price" :min="0" :step="0.01" placeholder="请输入价格" class="form-input-number"/>
                  </el-form-item>
                  <el-form-item label="原价" class="form-item half">
                    <el-input-number v-model="sku.originalPrice" :min="0" :step="0.01" placeholder="请输入原价" class="form-input-number"/>
                  </el-form-item>
                </div>
                <div class="form-row">
                  <el-form-item label="库存" class="form-item half">
                    <el-input-number v-model="sku.stock" :min="0" placeholder="请输入库存" class="form-input-number"/>
                  </el-form-item>
                  <el-form-item label="预警库存" class="form-item half">
                    <el-input-number v-model="sku.warningStock" :min="0" placeholder="请输入预警库存" class="form-input-number"/>
                  </el-form-item>
                </div>
                <el-form-item label="默认SKU" class="form-item">
                  <el-checkbox v-model="sku.isDefault" class="default-checkbox">设为默认</el-checkbox>
                </el-form-item>
                <el-form-item label="规格选择" class="form-item">
                  <div class="sku-spec-selection">
                    <div v-if="specKeys.length === 0" class="no-specs">
                      <el-alert
                        title="请先在规格管理中添加规格"
                        type="warning"
                        :closable="false"
                        show-icon
                      />
                    </div>
                    <div v-else class="spec-selection-list">
                      <div v-for="(specKey, keyIndex) in specKeys" :key="specKey.id || keyIndex" class="spec-selection-item">
                        <span class="spec-key-label">{{ specKey.name }}:</span>
                        <el-select
                          :model-value="sku.specSelections?.[specKey.id]"
                          @update:model-value="(value: string) => {
                            if (!sku.specSelections) sku.specSelections = {}
                            sku.specSelections[specKey.id] = value
                            handleSkuSpecChange(sku, specKey.id, value)
                          }"
                          placeholder="请选择规格值"
                          class="spec-select"
                        >
                          <el-option
                            v-for="specValue in specKey.values"
                            :key="specValue.id"
                            :label="specValue.value"
                            :value="specValue.id"
                          />
                        </el-select>
                      </div>
                    </div>
                  </div>
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
        <el-button @click="handleCancel" class="cancel-btn">取消</el-button>
        <el-button type="primary" @click="handleSubmit" class="submit-btn">保存</el-button>
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
import {ref, computed, watch, onMounted} from 'vue'
import {Plus, View, Delete} from '@element-plus/icons-vue'
import {ElMessage, ElImageViewer} from 'element-plus'
import {useProductStore} from '@/stores/product'
import {useCategoryStore} from '@/stores/category'
import {useProductImageStore} from '@/stores/productImage'
import {useSkuStore} from '@/stores/sku'
import {useSpecStore} from '@/stores/spec'
import type {Product, Category, SKU, SpecKey, SpecValue} from '@/types'

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
const skuList = ref<(SKU & { specs?: any[], skuSpecs?: any[], specSelections?: Record<string, string> })[]>([])

// 规格键值
const specKeys = ref<(SpecKey & { values: SpecValue[] })[]>([])

// 表单验证规则
const formRules = ref({
  name: [
    {required: true, message: '请输入商品名称', trigger: 'blur'},
    {min: 1, max: 100, message: '商品名称长度在1到100个字符之间', trigger: 'blur'}
  ],
  categoryId: [
    {required: true, message: '请选择商品分类', trigger: 'change'}
  ],
  status: [
    {required: true, message: '请选择商品状态', trigger: 'change'}
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
      formData.value = {...newProduct}
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
      loadSkus(newProduct.id!)
      // 加载规格
      loadSpecs(newProduct.id!)
      
    } else {
      // 新增模式，重置表单数据
      resetForm()
    }
  },
  {immediate: true}
)

// 加载分类
const loadCategories = async () => {
  try {
    await categoryStore.fetchCategories({pageSize: 100})
    categories.value = Array.from(categoryStore.categories)
  } catch (error) {
    console.error('Failed to load categories:', error)
  }
}

// 加载商品附图
const loadProductImages = async (productId: string) => {
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
const loadSkus = async (productId: string) => {
  try {
    const skus = await skuStore.fetchSkusByProductId(productId)
    // 处理 SKU 数据，添加 specSelections 字段用于渲染规格选择
    const processedSkus = skus.map((sku: any) => {
      // 创建 specSelections 对象，从 skuSpecs 中提取数据
      const specSelections: Record<string, string> = {}
      if (sku.skuSpecs) {
        sku.skuSpecs.forEach((spec: any) => {
          specSelections[spec.specKeyId] = spec.specValueId
        })
      }
      
      return {
        ...sku,
        specSelections
      }
    })
    skuList.value = processedSkus
  } catch (error) {
    console.error('Failed to load skus:', error)
  }
}

// 加载规格
const loadSpecs = async (productId: string) => {
  try {
    const specKeysData = await specStore.fetchSpecKeysByProductId(productId)
    // 直接使用接口返回的完整数据结构，将 specValueList 重命名为 values
    const specsWithValues = specKeysData.map((key) => ({
      ...key,
      values: key.specValueList || []
    }))
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
  // 添加新SKU
  skuList.value.push({
    id: undefined,
    productId: formData.value.id || '',
    skuCode: '',
    name: '',
    price: 0,
    originalPrice: 0,
    stock: 0,
    warningStock: 0,
    isDefault: skuList.value.length === 0,
    delFlag: false,
    skuSpecs: [],
    specSelections: {}
  })
}

// 处理移除SKU
const handleRemoveSku = (index: number) => {
  skuList.value.splice(index, 1)
  if (skuList.value.length > 0 && !skuList.value.some(sku => sku.isDefault)) {
    skuList.value[0].isDefault = true
  }
}

// 处理SKU规格变化
const handleSkuSpecChange = (sku: any, specKeyId: string, specValueId: string) => {
  // 确保 sku.specSelections 存在
  if (!sku.specSelections) {
    sku.specSelections = {}
  }
  
  // 更新选择状态
  sku.specSelections[specKeyId] = specValueId
  
  // 同时更新 sku.skuSpecs
  if (!sku.skuSpecs) {
    sku.skuSpecs = []
  }
  const existingIndex = sku.skuSpecs.findIndex((spec: any) => spec.specKeyId === specKeyId)
  if (existingIndex >= 0) {
    // 更新现有规格
    sku.skuSpecs[existingIndex].specValueId = specValueId
  } else {
    // 添加新规格
    sku.skuSpecs.push({
      specKeyId,
      specValueId
    })
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
    specKeyId: specKeys.value[keyIndex].id || '',
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

    let productId: string
    // 在后续逻辑中已使用 productId，无需额外读取

    if (formData.value.id) {
      // 编辑模式 - 使用FormData处理文件上传
      const productFormData = new FormData()
      productFormData.append('id', formData.value.id.toString())
      productFormData.append('name', formData.value.name || '')
      productFormData.append('description', formData.value.description || '')
      productFormData.append('categoryId', (formData.value.categoryId || '').toString())
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

      // 添加SKU列表
      skuList.value.forEach((sku, skuIndex) => {
        if (sku.id) {
          productFormData.append(`skus[${skuIndex}].id`, sku.id.toString())
        }
        productFormData.append(`skus[${skuIndex}].productId`, formData.value.id?.toString() || '')
        productFormData.append(`skus[${skuIndex}].name`, sku.name || '')
        productFormData.append(`skus[${skuIndex}].skuCode`, sku.skuCode || '')
        productFormData.append(`skus[${skuIndex}].price`, sku.price?.toString() || '0')
        productFormData.append(`skus[${skuIndex}].originalPrice`, sku.originalPrice?.toString() || '0')
        productFormData.append(`skus[${skuIndex}].stock`, sku.stock?.toString() || '0')
        productFormData.append(`skus[${skuIndex}].warningStock`, sku.warningStock?.toString() || '0')
        productFormData.append(`skus[${skuIndex}].isDefault`, sku.isDefault?.toString() || 'false')

        // 添加SKU规格关系
        if (sku.skuSpecs && sku.skuSpecs.length > 0) {
          sku.skuSpecs.forEach((skuSpec, specIndex) => {
            if (skuSpec.id) {
              productFormData.append(`skus[${skuIndex}].skuSpecs[${specIndex}].id`, skuSpec.id.toString())
            }
            productFormData.append(`skus[${skuIndex}].skuSpecs[${specIndex}].specKeyId`, skuSpec.specKeyId || '')
            productFormData.append(`skus[${skuIndex}].skuSpecs[${specIndex}].specValueId`, skuSpec.specValueId || '')
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

      // 添加SKU列表
      skuList.value.forEach((sku, skuIndex) => {
        if (sku.id) {
          productFormData.append(`skus[${skuIndex}].id`, sku.id.toString())
        }
        productFormData.append(`skus[${skuIndex}].productId`, '')
        productFormData.append(`skus[${skuIndex}].name`, sku.name || '')
        productFormData.append(`skus[${skuIndex}].skuCode`, sku.skuCode || '')
        productFormData.append(`skus[${skuIndex}].price`, sku.price?.toString() || '0')
        productFormData.append(`skus[${skuIndex}].originalPrice`, sku.originalPrice?.toString() || '0')
        productFormData.append(`skus[${skuIndex}].stock`, sku.stock?.toString() || '0')
        productFormData.append(`skus[${skuIndex}].warningStock`, sku.warningStock?.toString() || '0')
        productFormData.append(`skus[${skuIndex}].isDefault`, sku.isDefault?.toString() || 'false')

        // 添加SKU规格关系
        if (sku.skuSpecs && sku.skuSpecs.length > 0) {
          sku.skuSpecs.forEach((skuSpec, specIndex) => {
            if (skuSpec.id) {
              productFormData.append(`skus[${skuIndex}].skuSpecs[${specIndex}].id`, skuSpec.id.toString())
            }
            productFormData.append(`skus[${skuIndex}].skuSpecs[${specIndex}].specKeyId`, skuSpec.specKeyId || '')
            productFormData.append(`skus[${skuIndex}].skuSpecs[${specIndex}].specValueId`, skuSpec.specValueId || '')
          })
        }
      })

      const newProduct = await productStore.createProduct(productFormData)
      productId = newProduct.id!
    }

    // 保存商品附图 - 现在在新增时直接提交，编辑时需要单独处理
    // await saveProductImages(productId)

    // SKU和规格已经在提交商品时一起保存
    // await saveSkus(productId)
    // await saveSpecs()

    ElMessage.success('保存成功')
    emit('success')
    dialogVisible.value = false
    resetForm()
  } catch (error) {
    console.error('Failed to save product:', error)
    ElMessage.error('保存失败')
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
// 全局样式变量
:root {
  --primary-color: #409eff;
  --success-color: #67c23a;
  --danger-color: #f56c6c;
  --warning-color: #e6a23c;
  --info-color: #909399;
  --light-gray: #f5f7fa;
  --border-color: #ebeef5;
  --text-primary: #303133;
  --text-secondary: #606266;
  --text-light: #909399;
  --box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  --border-radius: 8px;
}

// 主对话框样式
.product-edit-dialog {
  .el-dialog__header {
    padding: 20px 24px;
    border-bottom: 1px solid var(--border-color);
  }
  
  .el-dialog__title {
    font-size: 18px;
    font-weight: 600;
    color: var(--text-primary);
  }
  
  .el-dialog__body {
    padding: 24px;
    max-height: 90vh;
  }
}

// 标签页样式
.product-tabs {
    .tab-pane {
      max-height: 68vh;
      overflow-y: auto;
    }

  .el-tabs__header {
    margin-bottom: 24px;
  }
  
  .el-tabs__nav {
    padding: 0 12px;
  }
  
  .el-tabs__item {
    font-size: 14px;
    padding: 0 20px;
    height: 40px;
    line-height: 40px;
  }
  
  .el-tabs__active-bar {
    height: 3px;
    background-color: var(--primary-color);
  }
}

// 表单样式
.product-form,
.sku-form,
.spec-form {
  max-width: 100%;
}

.form-row {
  display: flex;
  gap: 20px;
  margin-bottom: 16px;
  
  &:last-child {
    margin-bottom: 0;
  }
}

.form-item {
  margin-bottom: 16px;
  
  &.half {
    flex: 1;
    min-width: 0;
  }
  
  .el-form-item__label {
    font-weight: 500;
    color: var(--text-secondary);
  }
  
  .el-form-item__error {
    font-size: 12px;
  }
}

.form-input,
.form-select {
  width: 100%;
  max-width: 400px;
  transition: all 0.3s;
  
  &:hover {
    border-color: var(--primary-color);
  }
}

.form-textarea {
  width: 100%;
  max-width: 600px;
  resize: vertical;
}

.form-input-number {
  width: 100%;
  max-width: 200px;
}

// 上传样式
.upload-btn {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 120px;
  height: 120px;
  border: 2px dashed var(--border-color);
  border-radius: var(--border-radius);
  background-color: var(--light-gray);
  transition: all 0.3s;
  cursor: pointer;
  
  &:hover {
    border-color: var(--primary-color);
    background-color: rgba(64, 158, 255, 0.05);
  }
  
  .upload-icon {
    font-size: 24px;
    color: var(--text-light);
    margin-bottom: 8px;
  }
  
  .upload-text {
    font-size: 12px;
    color: var(--text-light);
  }
}

.main-img-section {
  margin-bottom: 24px;
  
  .upload-hint {
    font-size: 12px;
    color: var(--text-light);
    margin-top: 8px;
  }
}

.main-image-item {
  position: relative;
  
  .image-overlay {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: var(--border-radius);
    opacity: 0;
    transition: opacity 0.3s;
    
    &:hover {
      opacity: 1;
    }
    
    .overlay-text {
      color: white;
      font-size: 14px;
      font-weight: 600;
    }
  }
}

// 图片管理样式
.image-list {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  margin-top: 20px;
}

.image-item {
  position: relative;
  width: 200px;
  padding: 12px;
  border: 1px solid var(--border-color);
  border-radius: var(--border-radius);
  background-color: white;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.05);
  transition: all 0.3s;
  
  &:hover {
    box-shadow: var(--box-shadow);
    transform: translateY(-2px);
  }

  .image-preview {
    width: 100%;
    height: 150px;
    object-fit: cover;
    border-radius: var(--border-radius);
    margin-bottom: 12px;
  }

  .image-actions {
    margin-top: 10px;
    display: flex;
    flex-direction: column;
    gap: 8px;

    .image-description {
      width: 100%;
      transition: all 0.3s;
      
      &:hover {
        border-color: var(--primary-color);
      }
    }

    .image-sort {
      width: 120px;
    }
  }

  .image-item-actions {
    position: absolute;
    top: 12px;
    right: 12px;
    display: flex;
    gap: 8px;
    opacity: 0;
    transition: opacity 0.3s;
    
    .image-item:hover & {
      opacity: 1;
    }

    .image-item-preview,
    .image-item-delete {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 32px;
      height: 32px;
      border-radius: 50%;
      background-color: rgba(0, 0, 0, 0.6);
      color: white;
      cursor: pointer;
      transition: all 0.3s;

      &:hover {
        background-color: var(--primary-color);
        transform: scale(1.05);
      }
    }
  }
}

// 按钮样式
.add-btn {
  margin-bottom: 24px;
  padding: 10px 20px;
  font-size: 14px;
  border-radius: var(--border-radius);
  transition: all 0.3s;
  
  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 2px 8px rgba(64, 158, 255, 0.3);
  }
  
  .btn-icon {
    margin-right: 6px;
  }
}

.add-small-btn {
  margin-bottom: 16px;
  padding: 6px 16px;
  font-size: 12px;
  border-radius: var(--border-radius);
  transition: all 0.3s;
  
  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 2px 6px rgba(103, 194, 58, 0.3);
  }
  
  .btn-icon {
    margin-right: 4px;
  }
}

.delete-btn,
.delete-small-btn {
  padding: 6px 12px;
  font-size: 12px;
  border-radius: var(--border-radius);
  transition: all 0.3s;
  
  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 2px 6px rgba(245, 108, 108, 0.3);
  }
  
  .btn-icon {
    margin-right: 4px;
  }
}

// 空状态样式
.empty-section {
  padding: 60px 0;
  text-align: center;
  background-color: var(--light-gray);
  border-radius: var(--border-radius);
  margin: 20px 0;
}

.empty-subsection {
  padding: 40px 0;
  text-align: center;
  background-color: var(--light-gray);
  border-radius: var(--border-radius);
  margin: 16px 0;
}

// 规格管理样式
.spec-management {
  margin-top: 16px;
}

.spec-key-item {
  border: 1px solid var(--border-color);
  border-radius: var(--border-radius);
  padding: 24px;
  margin-bottom: 24px;
  background-color: white;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.05);

  .spec-key-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
    padding-bottom: 12px;
    border-bottom: 1px solid var(--border-color);
  }
}

.spec-values {
  margin-top: 24px;

  .spec-value-item {
    border: 1px solid var(--border-color);
    border-radius: var(--border-radius);
    padding: 16px;
    margin-bottom: 12px;
    background-color: white;
    transition: all 0.3s;
    
    &:hover {
      box-shadow: 0 1px 4px rgba(0, 0, 0, 0.05);
    }
  }
}

// SKU管理样式
.sku-management {
  margin-top: 16px;
}

.sku-item {
  border: 1px solid var(--border-color);
  border-radius: var(--border-radius);
  padding: 24px;
  margin-bottom: 24px;
  background-color: white;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.05);
  transition: all 0.3s;
  
  &:hover {
    box-shadow: var(--box-shadow);
  }

  .sku-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
    padding-bottom: 12px;
    border-bottom: 1px solid var(--border-color);
  }
}

.sku-spec-selection {
  margin-top: 16px;

  .no-specs {
    margin-bottom: 16px;
  }

  .spec-selection-list {
    display: flex;
    flex-wrap: wrap;
    gap: 16px;
    margin-top: 16px;

    .spec-selection-item {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 12px;
      border: 1px solid var(--border-color);
      border-radius: var(--border-radius);
      background-color: var(--light-gray);

      .spec-key-label {
        font-weight: 500;
        color: var(--text-primary);
        min-width: 80px;
      }

      .spec-select {
        width: 180px;
      }
    }
  }
}

// 状态选择样式
.status-radio-group {
  display: flex;
  gap: 24px;
  
  .status-radio {
    font-size: 14px;
  }
}

// 标题样式
.section-title {
  font-size: 16px;
  font-weight: 600;
  color: var(--text-primary);
  margin: 0;
}

.subsection-title {
  font-size: 14px;
  font-weight: 600;
  color: var(--text-primary);
  margin: 0 0 16px 0;
}

// 底部按钮样式
.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  padding: 20px 24px;
  border-top: 1px solid var(--border-color);
  
  .cancel-btn {
    padding: 8px 20px;
    border-radius: var(--border-radius);
  }
  
  .submit-btn {
    padding: 8px 24px;
    border-radius: var(--border-radius);
    transition: all 0.3s;
    
    &:hover {
      transform: translateY(-1px);
      box-shadow: 0 2px 8px rgba(64, 158, 255, 0.3);
    }
  }
}

// 表单输入框样式
.form-input-number {
  transition: all 0.3s;
  
  &:hover {
    border-color: var(--primary-color);
  }
}

.default-checkbox {
  font-size: 14px;
  color: var(--text-secondary);
}

// 响应式设计
@media (max-width: 768px) {
  .product-edit-dialog {
    .el-dialog {
      width: 95% !important;
    }
  }
  
  .form-row {
    flex-direction: column;
    gap: 16px;
  }
  
  .form-item.half {
    width: 100%;
  }
  
  .image-list {
    justify-content: center;
  }
  
  .spec-selection-list {
    flex-direction: column;
    
    .spec-selection-item {
      width: 100%;
      
      .spec-select {
        flex: 1;
      }
    }
  }
}
</style>

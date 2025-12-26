<script setup lang="ts">
import { ref, reactive, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { 
  getProductList, 
  saveProduct, 
  deleteProduct,
  getAllCategories,
  getAllUnits,
  getWarehouseList,
  getLocationList
} from '../../api/productApi'
import type { Product, Category, Unit, Warehouse, WarehouseLocation } from '../../api/mock/productData'
import { ProductStatus, PriceType } from '../../api/mock/productData'
import { ElMessage, ElMessageBox, ElUpload, ElIcon } from 'element-plus'
import { Plus, Upload, Delete } from '@element-plus/icons-vue'
import type { FormInstance } from 'element-plus'

// --- 数据定义 ---
const tableData = ref<Product[]>([])
const loading = ref(false)
const keyword = ref('')
const selectedCategoryId = ref(0) // 当前选中的分类ID
const categorySearchKeyword = ref('') // 分类搜索关键字
const router = useRouter() // 路由实例

// 国际化支持
const { t } = useI18n()

// 分页控制
const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(0)

// 弹窗控制
const dialogVisible = ref(false)
const dialogTitle = ref('新增产品')
const formRef = ref<FormInstance>()

// 下拉选项数据
const categories = ref<Category[]>([])
const categoriesTree = ref<any[]>([]) // 分类树数据
const units = ref<Unit[]>([])
const warehouses = ref<Warehouse[]>([])
const locations = ref<WarehouseLocation[]>([])

// 产品属性选项
const productAttributeOptions = [
  { label: '采购', value: 'purchase' },
  { label: '销售', value: 'sale' },
  { label: '委外', value: 'outsourcing' },
  { label: '生产', value: 'production' },
  { label: '半成品', value: 'semi_finished' },
  { label: '物料', value: 'material' }
]

// 表单数据
const formData = reactive<Partial<Product>>({
  id: 0,
  code: '',
  name: '',
  categoryId: 0,
  categoryName: '',
  unitId: 0,
  unitName: '',
  auxiliaryUnitId: 0,
  auxiliaryUnitName: '',
  unitConversion: 1,
  unitPrecision: 2,
  pricePrecision: 2,
  attributes: [],
  status: ProductStatus.ACTIVE,
  useSupplier: false,
  useProductionDate: false,
  useBatchNumber: false,
  useExpiryDate: false,
  defaultWarehouseId: 0,
  defaultWarehouseName: '',
  defaultLocationId: 0,
  defaultLocationName: '',
  useSerialNumber: false,
  price: 0,
  priceType: PriceType.BEFORE_TAX,
  minSaleQuantity: 1,
  maxSaleQuantity: 1000,
  saleDiscount: true,
  purchasePrice: 0,
  minPurchaseQuantity: 1,
  maxPurchaseQuantity: 1000,
  images: [],
  description: '',
  stock: 0
})

// 表单校验规则
const rules = {
  code: [{ required: true, message: t('product.pleaseEnter') + t('product.productCode'), trigger: 'blur' }],
  name: [{ required: true, message: t('product.pleaseEnter') + t('product.productName'), trigger: 'blur' }],
  categoryId: [{ required: true, message: t('product.pleaseSelect') + t('product.category'), trigger: 'change' }],
  unitId: [{ required: true, message: t('product.pleaseSelect') + t('product.unit'), trigger: 'change' }],
  price: [{ required: true, message: t('product.pleaseEnter') + t('product.price'), trigger: 'blur' }],
  purchasePrice: [{ required: true, message: t('product.pleaseEnter') + t('product.purchasePrice'), trigger: 'blur' }],
  unitPrecision: [{ required: true, message: t('product.pleaseEnter') + t('product.unitPrecision'), trigger: 'blur' }, { type: 'number', min: 0, max: 4, message: t('product.unitPrecision') + t('product.range') + '0-4' + t('product.decimalPlaces'), trigger: 'blur' }],
  pricePrecision: [{ required: true, message: t('product.pleaseEnter') + t('product.pricePrecision'), trigger: 'blur' }, { type: 'number', min: 0, max: 4, message: t('product.pricePrecision') + t('product.range') + '0-4' + t('product.decimalPlaces'), trigger: 'blur' }],
}

// --- 方法 ---

// 1. 获取列表数据
const loadData = async () => {
  loading.value = true
  try {
    const res = await getProductList(keyword.value)
    let data = res.data
    
    // 分类筛选
    if (selectedCategoryId.value > 0) {
      data = data.filter(item => item.categoryId === selectedCategoryId.value)
    }
    
    // 分页处理
    total.value = data.length
    const startIndex = (currentPage.value - 1) * pageSize.value
    const endIndex = startIndex + pageSize.value
    tableData.value = data.slice(startIndex, endIndex)
  } finally {
    loading.value = false
  }
}

// 2. 加载分类数据
const loadCategories = async () => {
  const res = await getAllCategories()
  categories.value = res.data
  // 构建分类树
  categoriesTree.value = buildCategoriesTree()
}

// 3. 加载单位数据
const loadUnits = async () => {
  const res = await getAllUnits()
  units.value = res.data
}

// 12. 过滤分类树
const filterCategoriesTree = (searchText: string) => {
  if (!searchText) {
    // 如果搜索关键字为空，显示所有分类
    categoriesTree.value = buildCategoriesTree()
    return
  }
  
  // 构建完整的分类树
  const fullTree = buildCategoriesTree()
  
  // 递归过滤分类树
  const filterTree = (nodes: any[]): any[] => {
    return nodes
      .map(node => {
        // 复制节点，避免修改原数据
        const newNode = { ...node }
        
        // 递归过滤子节点
        if (node.children && node.children.length > 0) {
          newNode.children = filterTree(node.children)
        }
        
        // 检查节点是否匹配搜索条件，或者有匹配的子节点
        const matchesSearch = node.name.toLowerCase().includes(searchText.toLowerCase())
        const hasMatchingChildren = newNode.children && newNode.children.length > 0
        
        return matchesSearch || hasMatchingChildren ? newNode : null
      })
      .filter(node => node !== null)
  }
  
  categoriesTree.value = filterTree(fullTree)
}

// 13. 跳转到分类管理页面
const goToCategory = (categoryId: number) => {
  router.push({
    path: '/product/category',
    query: { categoryId: categoryId.toString() } // 可以传递参数用于定位到具体分类
  })
}

// 14. 跳转到单位管理页面
const goToUnit = (unitId: number) => {
  router.push({
    path: '/product/unit',
    query: { unitId: unitId.toString() } // 可以传递参数用于定位到具体单位
  })
}

// 4. 分页事件处理
const handleSizeChange = (size: number) => {
  pageSize.value = size
  currentPage.value = 1 // 重置到第一页
  loadData()
}

const handleCurrentChange = (current: number) => {
  currentPage.value = current
  loadData()
}

// 5. 处理分类点击事件
const handleCategoryClick = (data: any) => {
  selectedCategoryId.value = data.id
  loadData() // 重新加载产品列表，根据选中的分类筛选
}

// 5. 构建分类树结构
const buildCategoriesTree = () => {
  // 复制分类数据，避免修改原数据
  const categoriesCopy = JSON.parse(JSON.stringify(categories.value))
  
  // 创建一个映射，方便查找父节点
  const map = new Map<number, any>()
  categoriesCopy.forEach((item: any) => {
    map.set(item.id, { ...item, children: [] })
  })
  
  // 构建树结构
  const tree: any[] = []
  categoriesCopy.forEach((item: any) => {
    const node = map.get(item.id)
    if (item.parentId === 0) {
      // 根节点
      tree.push(node)
    } else {
      // 子节点
      const parent = map.get(item.parentId)
      if (parent) {
        parent.children.push(node)
      }
    }
  })
  
  return tree
}

// 4. 加载仓库数据
const loadWarehouses = async () => {
  const res = await getWarehouseList()
  warehouses.value = res.data
}

// 5. 根据仓库加载仓位数据
const loadLocationsByWarehouse = async (warehouseId: number) => {
  if (!warehouseId) {
    locations.value = []
    return
  }
  const res = await getLocationList(warehouseId)
  locations.value = res.data
}

// 6. 打开新增窗口
const handleAdd = () => {
  dialogTitle.value = '新增产品'
  // 重置表单
  Object.assign(formData, {
    id: 0,
    code: '',
    name: '',
    categoryId: 0,
    categoryName: '',
    unitId: 0,
    unitName: '',
    auxiliaryUnitId: 0,
    auxiliaryUnitName: '',
    unitConversion: 1,
    unitPrecision: 2,
    pricePrecision: 2,
    attributes: [],
    status: ProductStatus.ACTIVE,
    useSupplier: false,
    useProductionDate: false,
    useBatchNumber: false,
    useExpiryDate: false,
    defaultWarehouseId: 0,
    defaultWarehouseName: '',
    defaultLocationId: 0,
    defaultLocationName: '',
    useSerialNumber: false,
    price: 0,
    priceType: PriceType.BEFORE_TAX,
    minSaleQuantity: 1,
    maxSaleQuantity: 1000,
    saleDiscount: true,
    purchasePrice: 0,
    minPurchaseQuantity: 1,
    maxPurchaseQuantity: 1000,
    images: [],
    description: '',
    stock: 0
  })
  dialogVisible.value = true
}

// 7. 打开编辑窗口
const handleEdit = (row: Product) => {
  dialogTitle.value = '编辑产品'
  // 复制数据到表单
  Object.assign(formData, { ...row })
  // 加载对应仓库的仓位
  loadLocationsByWarehouse(row.defaultWarehouseId)
  dialogVisible.value = true
}

// 8. 提交保存
const handleSubmit = async () => {
  if (!formRef.value) return
  await formRef.value.validate(async (valid: boolean) => {
    if (valid) {
      await saveProduct(<Product>formData)
      ElMessage.success('保存成功')
      dialogVisible.value = false
      loadData() // 刷新列表
    }
  })
}

// 9. 删除
const handleDelete = (id: number) => {
  ElMessageBox.confirm('确定要删除该产品吗？', '警告', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  }).then(async () => {
    await deleteProduct(id)
    ElMessage.success('删除成功')
    loadData()
  })
}

// 10. 处理图片上传
const handleImageUpload = (file: any) => {
  // 模拟图片上传，实际项目中需要调用真实的上传接口
  const reader = new FileReader()
  reader.onload = (e) => {
    const imageUrl = e.target?.result as string
    if (!formData.images) {
      formData.images = []
    }
    formData.images.push(imageUrl)
    ElMessage.success('图片上传成功')
  }
  reader.readAsDataURL(file.raw)
  return false // 阻止默认上传行为
}

// 11. 删除图片
const handleImageRemove = (index: number) => {
  if (formData.images) {
    formData.images.splice(index, 1)
  }
}

// 监听仓库变化，加载对应仓位
watch(() => formData.defaultWarehouseId, (newVal) => {
  formData.defaultLocationId = 0
  formData.defaultLocationName = ''
  loadLocationsByWarehouse(newVal!)
})

// 拖动调整分类栏宽度功能
const isResizing = ref(false)
const startX = ref(0)
const startWidth = ref(0)

const handleMouseDown = (e: MouseEvent) => {
  e.preventDefault() // 防止文本选择
  isResizing.value = true
  startX.value = e.clientX
  const sidebar = e.target as HTMLElement
  startWidth.value = sidebar.offsetWidth
  
  // 添加拖动状态类
  sidebar.classList.add('dragging')
  
  // 添加全局事件监听
  document.addEventListener('mousemove', handleMouseMove)
  document.addEventListener('mouseup', handleMouseUp)
}

const handleMouseMove = (e: MouseEvent) => {
  e.preventDefault() // 防止文本选择
  if (!isResizing.value) return
  
  const deltaX = e.clientX - startX.value
  const newWidth = startWidth.value + deltaX
  
  // 获取分类栏元素
  const sidebar = document.querySelector('.category-sidebar') as HTMLElement
  if (sidebar) {
    // 限制最小和最大宽度
    sidebar.style.width = `${Math.max(180, Math.min(400, newWidth))}px`
  }
}

const handleMouseUp = () => {
  isResizing.value = false
  
  // 移除拖动状态类
  const sidebar = document.querySelector('.category-sidebar') as HTMLElement
  if (sidebar) {
    sidebar.classList.remove('dragging')
  }
  
  // 移除全局事件监听
  document.removeEventListener('mousemove', handleMouseMove)
  document.removeEventListener('mouseup', handleMouseUp)
}

// 初始化加载
onMounted(() => {
  loadData()
  loadCategories()
  loadUnits()
  loadWarehouses()
  
  // 添加拖动手柄事件监听
  const sidebar = document.querySelector('.category-sidebar') as HTMLElement
  if (sidebar) {
    sidebar.addEventListener('mousedown', (e) => {
      // 只在拖动手柄区域（右侧8px）响应
      const rect = sidebar.getBoundingClientRect()
      if (e.clientX >= rect.right - 8) {
        handleMouseDown(e)
      }
    })
  }
})
</script>

<template>
  <div class="page-container">
    <!-- 左右布局：左侧分类栏，右侧产品列表 -->
    <div class="main-content" style="margin-top: 0;">
      <!-- 左侧分类栏 -->
      <div class="category-sidebar">
        <h3 class="sidebar-title">
          {{ t('product.productList') }}
          <el-input
            v-model="categorySearchKeyword"
            :placeholder="t('common.search')"
            size="small"
            clearable
            style="width: 140px"
            @input="filterCategoriesTree(categorySearchKeyword)"
            @clear="filterCategoriesTree('')"
          />
        </h3>
        <el-tree
          :data="categoriesTree"
          :props="{ label: 'name', children: 'children' }"
          :default-expand-all="true"
          @node-click="handleCategoryClick"
          :highlight-current="true"
        />
      </div>
      
      <!-- 右侧产品列表 -->
      <div class="product-list-container">
        <!-- 顶部操作栏 -->
        <div class="toolbar">
          <el-input 
            v-model="keyword" 
            :placeholder="t('product.productName') + '/' + t('common.search')" 
            style="width: 200px; margin-right: 10px;" 
            clearable
            @clear="loadData"
            @keyup.enter="loadData"
          />
          <el-button type="primary" @click="loadData">{{ t('common.search') }}</el-button>
          <el-button type="success" @click="handleAdd">{{ t('common.add') }} {{ t('common.product') }}</el-button>
          <el-button type="info" :to="'/product/category'">{{ t('product.categoryManagement') }}</el-button>
          <el-button type="info" :to="'/product/unit'">{{ t('product.unitManagement') }}</el-button>
        </div>
        
        <!-- 表格区域 -->
        <el-table :data="tableData" v-loading="loading" border style="width: 100%;">
          <el-table-column :label="t('product.productImage')" width="100" resizable>
            <template #default="{ row }">
              <div class="product-image-container">
                <img 
                  v-if="row.images && row.images.length > 0" 
                  :src="row.images[row.images.length - 1]" 
                  :alt="t('product.productImage')" 
                  class="product-image"
                />
                <div v-else class="product-image-placeholder">
                  <el-icon class="placeholder-icon"><Upload /></el-icon>
                </div>
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="code" :label="t('product.productCode')" width="120" resizable />
          <el-table-column prop="name" :label="t('product.productName')" min-width="150" resizable />
          <el-table-column prop="categoryName" :label="t('product.category')" width="120" resizable>
            <template #default="{ row }">
              <div class="clickable-cell" @click="goToCategory(row.categoryId)">
                {{ row.categoryName }}
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="unitName" :label="t('product.unit')" width="80" resizable>
            <template #default="{ row }">
              <div class="clickable-cell" @click="goToUnit(row.unitId)">
                {{ row.unitName }}
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="price" :label="t('product.price')" width="100" resizable>
            <template #default="{ row }">¥{{ (row.price ?? 0).toFixed(row.pricePrecision ?? 2) }}</template>
          </el-table-column>
          <el-table-column prop="purchasePrice" :label="t('product.purchasePrice')" width="100" resizable>
            <template #default="{ row }">¥{{ (row.purchasePrice ?? 0).toFixed(row.pricePrecision ?? 2) }}</template>
          </el-table-column>
          <el-table-column prop="status" :label="t('product.status')" width="80" resizable>
            <template #default="{ row }">
              <el-tag :type="row.status === 1 ? 'success' : 'danger'">
                {{ row.status === 1 ? t('product.active') : t('product.inactive') }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="stock" :label="t('product.stock')" width="100" resizable>
            <template #default="{ row }">
              <el-tag :type="row.stock < 10 ? 'danger' : 'success'">{{ (row.stock ?? 0).toFixed(row.unitPrecision ?? 0) }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="defaultWarehouseName" :label="t('product.defaultWarehouse')" width="120" resizable />
          <el-table-column :label="t('common.operation')" width="180" fixed="right" resizable>
            <template #default="{ row }">
              <el-button link type="primary" @click="handleEdit(row)">{{ t('common.edit') }}</el-button>
              <el-button link type="danger" @click="handleDelete(row.id)">{{ t('common.delete') }}</el-button>
            </template>
          </el-table-column>
        </el-table>

        <!-- 分页组件 -->
        <el-pagination
          v-model:current-page="currentPage"
          v-model:page-size="pageSize"
          :page-sizes="[5, 10, 20, 50]"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
          :prev-text="t('common.prevPage')"
          :next-text="t('common.nextPage')"
          :page-sizes-text="t('common.pageSize')"
          :jumper-text="t('common.jumpTo')"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </div>

    <!-- 新增/编辑 弹窗 -->
    <el-dialog v-model="dialogVisible" :title="dialogTitle" width="800px" scrollable>
      <el-form ref="formRef" :model="formData" :rules="rules" label-width="120px" style="max-height: 600px; overflow-y: auto;">
        <!-- 基本信息 -->
        <el-divider content-position="left">{{ t('product.basicInfo') }}</el-divider>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item :label="t('product.productCode')" prop="code">
              <el-input v-model="formData.code" :placeholder="t('product.pleaseEnter') + t('product.productCode')" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :label="t('product.productName')" prop="name">
              <el-input v-model="formData.name" :placeholder="t('product.pleaseEnter') + t('product.productName')" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :label="t('product.category')" prop="categoryId">
              <el-select v-model="formData.categoryId" :placeholder="t('product.pleaseSelect') + t('product.category')" style="width: 100%;">
                <el-option
                  v-for="item in categories"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :label="t('product.unit')" prop="unitId">
              <el-select v-model="formData.unitId" :placeholder="t('product.pleaseSelect') + t('product.unit')" style="width: 100%;">
                <el-option
                  v-for="item in units"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="产品图片">
              <el-upload
                :before-upload="handleImageUpload"
                action=""
                list-type="picture-card"
                :file-list="[]"
                :auto-upload="false"
              >
                <el-icon><Plus /></el-icon>
                <template #tip>
                  <div class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
                </template>
              </el-upload>
              <div class="image-list">
                <div
                  v-for="(image, index) in formData.images"
                  :key="index"
                  class="image-item"
                >
                  <img :src="image" alt="产品图片" class="image" />
                  <el-icon class="image-delete" @click="handleImageRemove(index)">
                    <Delete />
                  </el-icon>
                </div>
              </div>
            </el-form-item>
          </el-col>
        </el-row>

        <!-- 产品属性 -->
        <el-divider content-position="left">产品属性</el-divider>
        <el-row :gutter="20">
          <el-col :span="24">
            <el-form-item label="属性">
              <el-select
                v-model="formData.attributes"
                placeholder="请选择产品属性"
                multiple
                collapse-tags
                style="width: 100%;"
              >
                <el-option
                  v-for="item in productAttributeOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="单位精度" prop="unitPrecision">
              <el-input-number v-model="formData.unitPrecision" :min="0" :max="4" style="width: 100%;" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="价格精度" prop="pricePrecision">
              <el-input-number v-model="formData.pricePrecision" :min="0" :max="4" style="width: 100%;" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="辅助单位">
              <el-select v-model="formData.auxiliaryUnitId" placeholder="请选择" style="width: 100%;">
                <el-option
                  v-for="item in units"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="换算率">
              <el-input-number v-model="formData.unitConversion" :min="0.0001" :step="0.0001" style="width: 100%;" />
            </el-form-item>
          </el-col>
        </el-row>

        <!-- 库存设置 -->
        <el-divider content-position="left">库存设置</el-divider>
        <el-row :gutter="20">
          <el-col :span="24">
            <el-form-item label="库存选项">
              <el-checkbox v-model="formData.useSupplier">按供应商管理库存</el-checkbox>
              <el-checkbox v-model="formData.useProductionDate">按生产日期管理库存</el-checkbox>
              <el-checkbox v-model="formData.useBatchNumber">按批次号管理库存</el-checkbox>
              <el-checkbox v-model="formData.useExpiryDate">按失效日期管理库存</el-checkbox>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="产品状态">
              <el-radio-group v-model="formData.status" style="width: 100%;">
                <el-radio label="1">启用</el-radio>
                <el-radio label="0">停用</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="启用序列号">
              <el-switch v-model="formData.useSerialNumber" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="默认仓库">
              <el-select v-model="formData.defaultWarehouseId" placeholder="请选择" style="width: 100%;">
                <el-option
                  v-for="item in warehouses"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="默认仓位">
              <el-select v-model="formData.defaultLocationId" placeholder="请选择" style="width: 100%;" :disabled="!formData.defaultWarehouseId">
                <el-option
                  v-for="item in locations"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>

        <!-- 销售属性 -->
        <el-divider content-position="left">销售属性</el-divider>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="销售单价" prop="price">
              <el-input-number v-model="formData.price" :min="0" :precision="formData.pricePrecision" style="width: 100%;" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="价格类型">
              <el-radio-group v-model="formData.priceType">
                <el-radio :label="1">税前</el-radio>
                <el-radio :label="2">税后</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>

        <!-- 采购属性 -->
        <el-divider content-position="left">采购属性</el-divider>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="采购单价" prop="purchasePrice">
              <el-input-number v-model="formData.purchasePrice" :min="0" :precision="formData.pricePrecision" style="width: 100%;" />
            </el-form-item>
          </el-col>
        </el-row>

        <!-- 产品描述 -->
        <el-divider content-position="left">产品描述</el-divider>
        <el-row :gutter="20">
          <el-col :span="24">
            <el-form-item label="描述">
              <el-input
                v-model="formData.description"
                type="textarea"
                rows="4"
                placeholder="请输入产品描述"
              />
            </el-form-item>
          </el-col>
        </el-row>
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

<style scoped>
/* 移除可能导致溢出的高度设置 */
.page-container {
  padding: 20px;
  background: #fff;
  /* 移除min-height设置，让内容自然流动 */
}

/* 主内容区 - 左右布局 */
.main-content {
  display: flex;
  gap: 20px;
  /* 移除所有基于视口的高度计算 */
}

/* 左侧分类栏 */
.category-sidebar {
  width: 240px; /* 默认宽度 */
  min-width: 180px; /* 最小宽度限制 */
  max-width: 400px; /* 最大宽度限制 */
  background-color: #f9fafb;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  padding: 16px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  overflow-y: auto; /* 只在分类内容过多时显示滚动条 */
  position: relative;
  /* 移除固定高度限制 */
}

/* 拖动手柄 */
.category-sidebar::after {
  content: '';
  position: absolute;
  right: 0;
  top: 0;
  bottom: 0;
  width: 12px;
  cursor: col-resize;
  background: transparent;
  z-index: 10;
  transition: all 0.2s ease;
}

.category-sidebar:hover::after {
  background: rgba(0, 0, 0, 0.1);
}

/* 拖动时的样式 */
.category-sidebar.dragging {
  user-select: none;
  pointer-events: none;
}

.category-sidebar.dragging::after {
  background: rgba(0, 0, 0, 0.2);
  cursor: col-resize;
}

/* 右侧产品列表 */
.product-list-container {
  flex: 1; /* 自适应剩余宽度 */
  min-width: 0; /* 确保flex子元素可以收缩 */
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.product-list-container .el-table {
  flex: 1;
  /* 移除overflow和max-height设置，避免出现滚动条 */
}

.product-list-container .el-pagination {
  margin-top: 0;
  align-self: flex-end;
  padding: 10px 0;
  background-color: #fff;
  border-top: 1px solid #e8e8e8;
}

.toolbar {
  margin-bottom: 20px;
}

.image-list {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 10px;
}

.image-item {
  position: relative;
  width: 120px;
  height: 120px;
}

.image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 4px;
}

.image-delete {
  position: absolute;
  top: -8px;
  right: -8px;
  background: rgba(255, 255, 255, 0.8);
  border-radius: 50%;
  cursor: pointer;
}

/* 分类侧边栏样式 */
.category-sidebar {
  background-color: #ffffff;
  border: 1px solid #e1e4e8;
  border-radius: 8px;
  padding: 20px;
  height: calc(100vh - 200px);
  overflow-y: auto;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
}

.category-sidebar:hover {
  box-shadow: 0 4px 16px 0 rgba(0, 0, 0, 0.1);
}

.sidebar-title {
  margin-top: 0;
  margin-bottom: 20px;
  font-size: 20px;
  font-weight: 700;
  color: #2c3e50;
  padding-bottom: 12px;
  border-bottom: 2px solid #3498db;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

/* 分类树样式美化 */
:deep(.el-tree) {
  font-size: 14px;
}

:deep(.el-tree-node) {
  padding: 4px 0;
}

:deep(.el-tree-node__content) {
  height: 36px;
  line-height: 36px;
  border-radius: 4px;
  padding: 0 8px;
  cursor: pointer;
  transition: all 0.2s ease;
}

:deep(.el-tree-node__content:hover) {
  background-color: #ecf5ff;
  color: #3498db;
}

:deep(.el-tree-node.is-current > .el-tree-node__content) {
  background-color: #3498db;
  color: #ffffff;
  font-weight: 600;
}

:deep(.el-tree-node__expand-icon) {
  font-size: 16px;
  color: #909399;
}

:deep(.el-tree-node__expand-icon:hover) {
  color: #3498db;
}

:deep(.el-tree-node__expand-icon.is-leaf) {
  color: transparent;
}

/* 表格样式美化 */
.el-table {
  border-radius: 4px;
  overflow: hidden;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.05);
}

/* 产品图片样式 */
.product-image-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 40px;
}

.product-image {
  width: 40px;
  height: 40px;
  object-fit: cover;
  border-radius: 4px;
  border: 1px solid #e1e4e8;
  transition: all 0.2s ease;
}

.product-image:hover {
  transform: scale(1.2);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
}

.product-image-placeholder {
  width: 40px;
  height: 40px;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #f5f7fa;
  border: 1px dashed #dcdfe6;
  border-radius: 4px;
  color: #c0c4cc;
}

.placeholder-icon {
  font-size: 20px;
}

/* 可点击单元格样式 */
.clickable-cell {
  color: #3498db;
  cursor: pointer;
  text-decoration: underline;
  text-decoration-style: dashed;
  text-decoration-color: rgba(52, 152, 219, 0.3);
  transition: all 0.2s ease;
}

.clickable-cell:hover {
  color: #2980b9;
  text-decoration-style: solid;
  text-decoration-color: rgba(41, 128, 185, 0.6);
  background-color: rgba(52, 152, 219, 0.05);
}

.el-table__header-wrapper th {
  background-color: #f2f6fc;
  font-weight: 600;
  color: #303133;
}

.el-table__body-wrapper tr:hover {
  background-color: #f5f7fa;
}

/* 按钮样式美化 */
.toolbar .el-button {
  margin-left: 8px;
}

.toolbar .el-button:first-child {
  margin-left: 0;
}

/* 表单样式美化 */
.el-dialog {
  border-radius: 8px;
  overflow: hidden;
}

.el-dialog__header {
  background-color: #f2f6fc;
  padding: 16px 20px;
}

.el-dialog__title {
  font-size: 16px;
  font-weight: 600;
  color: #303133;
}

/* 分页样式美化 */
.el-pagination {
  margin-top: 20px;
  text-align: right;
}
</style>
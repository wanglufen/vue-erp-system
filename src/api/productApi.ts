import { 
  MOCK_PRODUCTS, 
  MOCK_CATEGORIES, 
  MOCK_UNITS, 
  MOCK_WAREHOUSES, 
  MOCK_LOCATIONS,
  type Product, 
  type Category, 
  type Unit, 
  type Warehouse, 
  type WarehouseLocation,
  ProductStatus
} from './mock/productData'

// 模拟延迟
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

// 模拟数据库
let dbProducts = [...MOCK_PRODUCTS]
let dbCategories = [...MOCK_CATEGORIES]
let dbUnits = [...MOCK_UNITS]
let dbWarehouses = [...MOCK_WAREHOUSES]
let dbLocations = [...MOCK_LOCATIONS]

// --- 产品相关 API --- 
export const getProductList = async (keyword: string = '') => {
  await delay(300)
  // 模拟后端模糊搜索
  const list = dbProducts.filter(item => 
    item.name.includes(keyword) || item.code.includes(keyword)
  )
  return { code: 200, msg: 'success', data: list }
}

export const saveProduct = async (product: Product) => {
  await delay(500)
  if (product.id) {
    // 编辑逻辑
    const index = dbProducts.findIndex(p => p.id === product.id)
    if (index !== -1) {
      // 获取分类、单位、仓库、仓位名称
      const category = dbCategories.find(c => c.id === product.categoryId)
      const unit = dbUnits.find(u => u.id === product.unitId)
      const warehouse = dbWarehouses.find(w => w.id === product.defaultWarehouseId)
      const location = dbLocations.find(l => l.id === product.defaultLocationId)
      
      dbProducts[index] = {
        ...dbProducts[index], // 保留原有数据，包括images字段
        ...product,
        categoryName: category?.name || '',
        unitName: unit?.name || '',
        defaultWarehouseName: warehouse?.name || '',
        defaultLocationName: location?.name || '',
        updateTime: new Date().toISOString().replace('T', ' ').substring(0, 19)
      }
    }
  } else {
    // 新增逻辑
    // 获取分类、单位名称
    const category = dbCategories.find(c => c.id === product.categoryId)
    const unit = dbUnits.find(u => u.id === product.unitId)
    const warehouse = dbWarehouses.find(w => w.id === product.defaultWarehouseId)
    const location = dbLocations.find(l => l.id === product.defaultLocationId)
    
    const newProduct: Product = {
      ...product,
      id: Date.now(), // 模拟自增 ID
      categoryName: category?.name || '',
      unitName: unit?.name || '',
      defaultWarehouseName: warehouse?.name || '',
      defaultLocationName: location?.name || '',
      images: product.images || [],
      stock: 0, // 新产品默认库存为 0
      createTime: new Date().toISOString().replace('T', ' ').substring(0, 19),
      updateTime: new Date().toISOString().replace('T', ' ').substring(0, 19)
    }
    dbProducts.push(newProduct)
  }
  return { code: 200, msg: '保存成功' }
}

export const deleteProduct = async (id: number) => {
  await delay(300)
  dbProducts = dbProducts.filter(p => p.id !== id)
  return { code: 200, msg: '删除成功' }
}

// --- 分类相关 API --- 
export const getCategoryList = async (parentId: number = 0) => {
  await delay(200)
  const list = dbCategories.filter(item => item.parentId === parentId)
  return { code: 200, msg: 'success', data: list }
}

export const getAllCategories = async () => {
  await delay(200)
  return { code: 200, msg: 'success', data: dbCategories }
}

export const saveCategory = async (category: Category) => {
  await delay(300)
  if (category.id) {
    // 编辑逻辑
    const index = dbCategories.findIndex(c => c.id === category.id)
    if (index !== -1) {
      dbCategories[index] = {
        ...category,
        updateTime: new Date().toISOString().replace('T', ' ').substring(0, 19)
      }
    }
  } else {
    // 新增逻辑
    const newCategory: Category = {
      ...category,
      id: Date.now(),
      createTime: new Date().toISOString().replace('T', ' ').substring(0, 19),
      updateTime: new Date().toISOString().replace('T', ' ').substring(0, 19)
    }
    dbCategories.push(newCategory)
  }
  return { code: 200, msg: '保存成功' }
}

export const deleteCategory = async (id: number) => {
  await delay(300)
  // 检查是否有子分类
  const hasChildren = dbCategories.some(c => c.parentId === id)
  if (hasChildren) {
    return { code: 400, msg: '该分类下有子分类，无法删除' }
  }
  // 检查是否有产品使用该分类
  const hasProducts = dbProducts.some(p => p.categoryId === id)
  if (hasProducts) {
    return { code: 400, msg: '该分类下有产品，无法删除' }
  }
  dbCategories = dbCategories.filter(c => c.id !== id)
  return { code: 200, msg: '删除成功' }
}

// --- 单位相关 API --- 
export const getUnitList = async () => {
  await delay(200)
  const list = dbUnits.filter(item => item.status === 1)
  return { code: 200, msg: 'success', data: list }
}

export const getAllUnits = async () => {
  await delay(200)
  return { code: 200, msg: 'success', data: dbUnits }
}

export const saveUnit = async (unit: Unit) => {
  await delay(300)
  if (unit.id) {
    // 编辑逻辑
    const index = dbUnits.findIndex(u => u.id === unit.id)
    if (index !== -1) {
      dbUnits[index] = {
        ...unit,
        updateTime: new Date().toISOString().replace('T', ' ').substring(0, 19)
      }
    }
  } else {
    // 新增逻辑
    const newUnit: Unit = {
      ...unit,
      id: Date.now(),
      createTime: new Date().toISOString().replace('T', ' ').substring(0, 19),
      updateTime: new Date().toISOString().replace('T', ' ').substring(0, 19)
    }
    dbUnits.push(newUnit)
  }
  return { code: 200, msg: '保存成功' }
}

export const deleteUnit = async (id: number) => {
  await delay(300)
  // 检查是否有产品使用该单位
  const hasProducts = dbProducts.some(p => p.unitId === id || p.auxiliaryUnitId === id)
  if (hasProducts) {
    return { code: 400, msg: '该单位已被产品使用，无法删除' }
  }
  dbUnits = dbUnits.filter(u => u.id !== id)
  return { code: 200, msg: '删除成功' }
}

// --- 仓库相关 API --- 
export const getWarehouseList = async () => {
  await delay(200)
  const list = dbWarehouses.filter(item => item.status === 1)
  return { code: 200, msg: 'success', data: list }
}

export const saveWarehouse = async (warehouse: Warehouse) => {
  await delay(300)
  if (warehouse.id) {
    // 编辑逻辑
    const index = dbWarehouses.findIndex(w => w.id === warehouse.id)
    if (index !== -1) {
      dbWarehouses[index] = {
        ...warehouse,
        updateTime: new Date().toISOString().replace('T', ' ').substring(0, 19)
      }
    }
  } else {
    // 新增逻辑
    const newWarehouse: Warehouse = {
      ...warehouse,
      id: Date.now(),
      createTime: new Date().toISOString().replace('T', ' ').substring(0, 19),
      updateTime: new Date().toISOString().replace('T', ' ').substring(0, 19)
    }
    dbWarehouses.push(newWarehouse)
  }
  return { code: 200, msg: '保存成功' }
}

// --- 仓位相关 API --- 
export const getLocationList = async (warehouseId: number) => {
  await delay(200)
  const list = dbLocations.filter(item => 
    item.warehouseId === warehouseId && item.status === 1
  )
  return { code: 200, msg: 'success', data: list }
}

export const saveLocation = async (location: WarehouseLocation) => {
  await delay(300)
  if (location.id) {
    // 编辑逻辑
    const index = dbLocations.findIndex(l => l.id === location.id)
    if (index !== -1) {
      const warehouse = dbWarehouses.find(w => w.id === location.warehouseId)
      dbLocations[index] = {
        ...location,
        warehouseName: warehouse?.name || '',
        updateTime: new Date().toISOString().replace('T', ' ').substring(0, 19)
      }
    }
  } else {
    // 新增逻辑
    const warehouse = dbWarehouses.find(w => w.id === location.warehouseId)
    const newLocation: WarehouseLocation = {
      ...location,
      id: Date.now(),
      warehouseName: warehouse?.name || '',
      createTime: new Date().toISOString().replace('T', ' ').substring(0, 19),
      updateTime: new Date().toISOString().replace('T', ' ').substring(0, 19)
    }
    dbLocations.push(newLocation)
  }
  return { code: 200, msg: '保存成功' }
}
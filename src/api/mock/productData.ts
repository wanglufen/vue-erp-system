// 分类接口
export interface Category {
  id: number;
  name: string;
  parentId: number;
  level: number;
  status: number; // 1启用 0停用
  sort: number;
  createTime: string;
  updateTime: string;
}

// 单位接口
export interface Unit {
  id: number;
  name: string;
  code: string;
  precision: number; // 单位精度
  status: number; // 1启用 0停用
  sort: number;
  createTime: string;
  updateTime: string;
}

// 仓库接口
export interface Warehouse {
  id: number;
  name: string;
  location: string;
  status: number;
  createTime: string;
  updateTime: string;
}

// 仓位接口
export interface WarehouseLocation {
  id: number;
  name: string;
  warehouseId: number;
  warehouseName: string;
  status: number;
  sort: number;
  createTime: string;
  updateTime: string;
}

// 产品属性枚举
export enum ProductAttribute {
  PURCHASE = 'purchase', // 采购
  SALE = 'sale', // 销售
  OUTSOURCING = 'outsourcing', // 委外
  PRODUCTION = 'production', // 生产
  SEMI_FINISHED = 'semi_finished', // 半成品
  MATERIAL = 'material' // 物料
}

// 产品状态枚举
export enum ProductStatus {
  ACTIVE = 1, // 启用
  INACTIVE = 0 // 停用
}

// 销售价格类型
export enum PriceType {
  BEFORE_TAX = 1, // 税前
  AFTER_TAX = 2 // 税后
}

export interface Product {
  // 基础信息
  id: number;
  code: string;
  name: string;
  categoryId: number;
  categoryName: string;
  unitId: number;
  unitName: string;
  auxiliaryUnitId: number;
  auxiliaryUnitName: string;
  unitConversion: number; // 主单位与辅助单位换算率
  unitPrecision: number; // 单位精度
  pricePrecision: number; // 价格精度
  
  // 产品属性
  attributes: ProductAttribute[];
  status: ProductStatus;
  
  // 库存设置
  useSupplier: boolean; // 是否使用供应商
  useProductionDate: boolean; // 是否使用生产日期
  useBatchNumber: boolean; // 是否使用批次号
  useExpiryDate: boolean; // 是否使用失效日期
  defaultWarehouseId: number;
  defaultWarehouseName: string;
  defaultLocationId: number;
  defaultLocationName: string;
  useSerialNumber: boolean; // 是否启用序列号
  
  // 销售属性
  price: number; // 销售价
  priceType: PriceType; // 价格类型
  minSaleQuantity: number; // 最小销售数量
  maxSaleQuantity: number; // 最大销售数量
  saleDiscount: boolean; // 是否允许折扣
  
  // 采购属性
  purchasePrice: number; // 采购价
  minPurchaseQuantity: number; // 最小采购数量
  maxPurchaseQuantity: number; // 最大采购数量
  
  // 其他信息
  images: string[]; // 图片路径
  description: string; // 产品描述
  stock: number; // 当前库存
  createTime: string;
  updateTime: string;
}

// 模拟分类数据
export const MOCK_CATEGORIES: Category[] = [
  { id: 1, name: '办公外设', parentId: 0, level: 1, status: 1, sort: 1, createTime: '2024-01-01 10:00:00', updateTime: '2024-01-01 10:00:00' },
  { id: 2, name: '显示设备', parentId: 0, level: 1, status: 1, sort: 2, createTime: '2024-01-01 10:00:00', updateTime: '2024-01-01 10:00:00' },
  { id: 3, name: '数码配件', parentId: 0, level: 1, status: 1, sort: 3, createTime: '2024-01-01 10:00:00', updateTime: '2024-01-01 10:00:00' },
  { id: 4, name: '办公家具', parentId: 0, level: 1, status: 1, sort: 4, createTime: '2024-01-01 10:00:00', updateTime: '2024-01-01 10:00:00' },
  { id: 5, name: '鼠标', parentId: 1, level: 2, status: 1, sort: 1, createTime: '2024-01-01 10:00:00', updateTime: '2024-01-01 10:00:00' },
  { id: 6, name: '键盘', parentId: 1, level: 2, status: 1, sort: 2, createTime: '2024-01-01 10:00:00', updateTime: '2024-01-01 10:00:00' },
  { id: 7, name: '显示器', parentId: 2, level: 2, status: 1, sort: 1, createTime: '2024-01-01 10:00:00', updateTime: '2024-01-01 10:00:00' },
];

// 模拟单位数据
export const MOCK_UNITS: Unit[] = [
  { id: 1, name: '个', code: 'PCS', precision: 0, status: 1, sort: 1, createTime: '2024-01-01 10:00:00', updateTime: '2024-01-01 10:00:00' },
  { id: 2, name: '台', code: 'UNIT', precision: 0, status: 1, sort: 2, createTime: '2024-01-01 10:00:00', updateTime: '2024-01-01 10:00:00' },
  { id: 3, name: '把', code: 'PCK', precision: 0, status: 1, sort: 3, createTime: '2024-01-01 10:00:00', updateTime: '2024-01-01 10:00:00' },
  { id: 4, name: '张', code: 'PCS', precision: 0, status: 1, sort: 4, createTime: '2024-01-01 10:00:00', updateTime: '2024-01-01 10:00:00' },
  { id: 5, name: '千克', code: 'KG', precision: 3, status: 1, sort: 5, createTime: '2024-01-01 10:00:00', updateTime: '2024-01-01 10:00:00' },
  { id: 6, name: '米', code: 'M', precision: 2, status: 1, sort: 6, createTime: '2024-01-01 10:00:00', updateTime: '2024-01-01 10:00:00' },
];

// 模拟仓库数据
export const MOCK_WAREHOUSES: Warehouse[] = [
  { id: 1, name: '主仓库', location: 'A区', status: 1, createTime: '2024-01-01 10:00:00', updateTime: '2024-01-01 10:00:00' },
  { id: 2, name: '辅仓库', location: 'B区', status: 1, createTime: '2024-01-01 10:00:00', updateTime: '2024-01-01 10:00:00' },
  { id: 3, name: '成品仓库', location: 'C区', status: 1, createTime: '2024-01-01 10:00:00', updateTime: '2024-01-01 10:00:00' },
];

// 模拟仓位数据
export const MOCK_LOCATIONS: WarehouseLocation[] = [
  { id: 1, name: 'A01-01', warehouseId: 1, warehouseName: '主仓库', status: 1, sort: 1, createTime: '2024-01-01 10:00:00', updateTime: '2024-01-01 10:00:00' },
  { id: 2, name: 'A01-02', warehouseId: 1, warehouseName: '主仓库', status: 1, sort: 2, createTime: '2024-01-01 10:00:00', updateTime: '2024-01-01 10:00:00' },
  { id: 3, name: 'B01-01', warehouseId: 2, warehouseName: '辅仓库', status: 1, sort: 1, createTime: '2024-01-01 10:00:00', updateTime: '2024-01-01 10:00:00' },
  { id: 4, name: 'C01-01', warehouseId: 3, warehouseName: '成品仓库', status: 1, sort: 1, createTime: '2024-01-01 10:00:00', updateTime: '2024-01-01 10:00:00' },
];

// 更新模拟产品数据以匹配新结构
export const MOCK_PRODUCTS: Product[] = [
  {
    id: 1, code: 'P001', name: '无线静音鼠标',
    categoryId: 5, categoryName: '鼠标',
    unitId: 1, unitName: '个',
    auxiliaryUnitId: 0, auxiliaryUnitName: '',
    unitConversion: 1,
    unitPrecision: 0,
    pricePrecision: 2,
    attributes: [ProductAttribute.PURCHASE, ProductAttribute.SALE],
    status: ProductStatus.ACTIVE,
    useSupplier: true,
    useProductionDate: true,
    useBatchNumber: true,
    useExpiryDate: false,
    defaultWarehouseId: 1,
    defaultWarehouseName: '主仓库',
    defaultLocationId: 1,
    defaultLocationName: 'A01-01',
    useSerialNumber: false,
    price: 59,
    priceType: PriceType.BEFORE_TAX,
    minSaleQuantity: 1,
    maxSaleQuantity: 1000,
    saleDiscount: true,
    purchasePrice: 25,
    minPurchaseQuantity: 10,
    maxPurchaseQuantity: 10000,
    images: [],
    description: '无线静音鼠标，支持蓝牙和2.4G连接',
    stock: 120,
    createTime: '2024-01-01 10:00:00',
    updateTime: '2024-01-01 10:00:00'
  },
  {
    id: 2, code: 'P002', name: '机械键盘 (红轴)',
    categoryId: 6, categoryName: '键盘',
    unitId: 3, unitName: '把',
    auxiliaryUnitId: 0, auxiliaryUnitName: '',
    unitConversion: 1,
    unitPrecision: 0,
    pricePrecision: 2,
    attributes: [ProductAttribute.PURCHASE, ProductAttribute.SALE],
    status: ProductStatus.ACTIVE,
    useSupplier: true,
    useProductionDate: true,
    useBatchNumber: true,
    useExpiryDate: false,
    defaultWarehouseId: 1,
    defaultWarehouseName: '主仓库',
    defaultLocationId: 2,
    defaultLocationName: 'A01-02',
    useSerialNumber: false,
    price: 299,
    priceType: PriceType.BEFORE_TAX,
    minSaleQuantity: 1,
    maxSaleQuantity: 500,
    saleDiscount: true,
    purchasePrice: 150,
    minPurchaseQuantity: 5,
    maxPurchaseQuantity: 5000,
    images: [],
    description: '机械键盘，红轴，RGB背光',
    stock: 45,
    createTime: '2024-01-01 10:00:00',
    updateTime: '2024-01-01 10:00:00'
  },
  {
    id: 3, code: 'P003', name: '27寸 4K 显示器',
    categoryId: 7, categoryName: '显示器',
    unitId: 2, unitName: '台',
    auxiliaryUnitId: 0, auxiliaryUnitName: '',
    unitConversion: 1,
    unitPrecision: 0,
    pricePrecision: 2,
    attributes: [ProductAttribute.PURCHASE, ProductAttribute.SALE],
    status: ProductStatus.ACTIVE,
    useSupplier: true,
    useProductionDate: true,
    useBatchNumber: true,
    useExpiryDate: false,
    defaultWarehouseId: 3,
    defaultWarehouseName: '成品仓库',
    defaultLocationId: 4,
    defaultLocationName: 'C01-01',
    useSerialNumber: true,
    price: 1999,
    priceType: PriceType.BEFORE_TAX,
    minSaleQuantity: 1,
    maxSaleQuantity: 200,
    saleDiscount: true,
    purchasePrice: 1200,
    minPurchaseQuantity: 2,
    maxPurchaseQuantity: 2000,
    images: [],
    description: '27寸 4K IPS显示器，144Hz刷新率',
    stock: 10,
    createTime: '2024-01-01 10:00:00',
    updateTime: '2024-01-01 10:00:00'
  }
];
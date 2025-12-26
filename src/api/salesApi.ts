// 定义类型
export interface SalesItem {
  productId: number;
  productName: string;
  price: number;
  quantity: number;
  total: number;
}

export interface SalesOrder {
  id: string;
  customerId: number;
  customerName: string;
  date: string;
  status: 'Draft' | 'Pending' | 'Approved' | 'Rejected'; // 工作流状态
  items: SalesItem[];
  totalAmount: number;
}

// 模拟数据库
let MOCK_ORDERS: SalesOrder[] = [
  {
    id: 'SO-20231027-001',
    customerId: 1,
    customerName: '华为技术有限公司',
    date: '2023-10-27',
    status: 'Approved',
    totalAmount: 10000,
    items: [{ productId: 101, productName: '高性能芯片', price: 5000, quantity: 2, total: 10000 }]
  }
];

// 模拟延迟
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// --- 接口 ---

// 1. 获取订单列表
export const getSalesList = async () => {
  await delay(300);
  return { code: 200, data: MOCK_ORDERS };
};

// 2. 保存订单 (新增或修改)
export const saveSalesOrder = async (order: SalesOrder) => {
  await delay(500);
  // 如果是新单据，生成 ID
  if (!order.id) {
    order.id = 'SO-' + Date.now();
    order.status = 'Draft'; // 默认草稿状态
    MOCK_ORDERS.push(order);
  }
  return { code: 200, msg: '保存成功' };
};

// 3. 提交审核 (触发工作流)
export const submitForApproval = async (id: string) => {
  await delay(300);
  const order = MOCK_ORDERS.find(o => o.id === id);
  if (order) {
    order.status = 'Pending'; // 变更为待审核
  }
  return { code: 200, msg: '已提交审核' };
};

// --- 辅助接口：模拟从客户和产品模块获取数据 ---
export const getCustomerOptions = async () => {
  return {
    code: 200,
    data: [
      { id: 1, name: '华为技术有限公司' },
      { id: 2, name: '小米科技' },
      { id: 3, name: '比亚迪汽车' }
    ]
  };
};

export const getProductOptions = async () => {
  return {
    code: 200,
    data: [
      { id: 101, name: '高性能芯片', price: 5000 },
      { id: 102, name: '工业显示屏', price: 1200 },
      { id: 103, name: '锂电池组', price: 3000 }
    ]
  };
};
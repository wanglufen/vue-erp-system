// 1. 定义客户数据的类型接口
export interface Customer {
  id: number;
  name: string;       // 客户名称
  contact: string;    // 联系人
  phone: string;      // 电话
  email: string;      // 邮箱
  address: string;    // 地址
  level: string;      // 客户等级 (A/B/C)
}

// 2. 初始模拟数据 (放在内存里，刷新页面会重置，这很正常)
let MOCK_DATA: Customer[] = [
  { id: 1, name: '华为技术有限公司', contact: '张经理', phone: '13800138000', email: 'zhang@huawei.com', address: '深圳市龙岗区', level: 'A' },
  { id: 2, name: '小米科技', contact: '雷总', phone: '13900000000', email: 'lei@mi.com', address: '北京市海淀区', level: 'A' },
  { id: 3, name: '楼下的便利店', contact: '王老板', phone: '13512345678', email: 'wang@shop.com', address: '幸福小区门口', level: 'C' },
  // ... 你可以多复制几条
];

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// 3. 模拟接口方法

// 获取列表 (支持搜索和分页)
export const getCustomerList = async (params: { page: number; size: number; keyword?: string }) => {
  await delay(300);
  
  let list = MOCK_DATA;
  
  // 搜索逻辑
  if (params.keyword) {
    list = list.filter(item => item.name.includes(params.keyword!) || item.contact.includes(params.keyword!));
  }
  
  // 分页逻辑
  const total = list.length;
  const start = (params.page - 1) * params.size;
  const end = start + params.size;
  const pageList = list.slice(start, end);
  
  return {
    code: 200,
    data: {
      list: pageList,
      total: total
    }
  };
};

// 新增
export const addCustomer = async (data: Omit<Customer, 'id'>) => {
  await delay(300);
  const newId = MOCK_DATA.length > 0 ? Math.max(...MOCK_DATA.map(c => c.id)) + 1 : 1;
  MOCK_DATA.unshift({ id: newId, ...data }); // 加到最前面
  return { code: 200, msg: '添加成功' };
};

// 编辑
export const updateCustomer = async (data: Customer) => {
  await delay(300);
  const index = MOCK_DATA.findIndex(item => item.id === data.id);
  if (index !== -1) {
    MOCK_DATA[index] = { ...data };
    return { code: 200, msg: '更新成功' };
  }
  return { code: 500, msg: '未找到数据' };
};

// 删除
export const deleteCustomer = async (id: number) => {
  await delay(300);
  MOCK_DATA = MOCK_DATA.filter(item => item.id !== id);
  return { code: 200, msg: '删除成功' };
};
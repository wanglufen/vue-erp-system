import { MOCK_PURCHASE_LIST, type PurchaseOrder } from './mock/purchaseData'

// 模拟内存数据库（为了让你添加数据后能看到变化，我们用一个变量存起来）
let database = [...MOCK_PURCHASE_LIST]

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

// 获取列表
export const getPurchaseListApi = async () => {
  await delay(300)
  return { code: 200, data: database }
}

// 新增采购单 (工作流起点：状态默认为 0 草稿)
export const addPurchaseApi = async (data: any) => {
  await delay(300)
  const newOrder: PurchaseOrder = {
    id: Date.now(),
    orderNo: 'PO-' + Date.now(),
    supplier: data.supplier,
    amount: Number(data.amount),
    status: 0, // 默认为草稿
    createDate: new Date().toISOString().split('T')[0]
  }
  database.unshift(newOrder) // 加到最前面
  return { code: 200, msg: '新增成功' }
}

// 提交审核 (工作流：草稿 -> 待审核)
export const submitPurchaseApi = async (id: number) => {
  await delay(200)
  const item = database.find(i => i.id === id)
  if (item) item.status = 1
  return { code: 200, msg: '已提交审核' }
}

// 审核通过 (工作流：待审核 -> 已审核)
export const approvePurchaseApi = async (id: number) => {
  await delay(200)
  const item = database.find(i => i.id === id)
  if (item) item.status = 2
  return { code: 200, msg: '审核通过' }
}
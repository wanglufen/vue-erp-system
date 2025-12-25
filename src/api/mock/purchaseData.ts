export interface PurchaseOrder {
  id: number;
  orderNo: string;
  supplier: string;
  amount: number;
  status: 0 | 1 | 2 | 3; // 0:草稿, 1:待审核, 2:已审核, 3:驳回
  createDate: string;
}

//采购订单数据模拟

export const MOCK_PURCHASE_LIST: PurchaseOrder[] = [
  { id: 1, orderNo: 'PO-20231001-001', supplier: '联想供应商', amount: 50000, status: 2, createDate: '2023-10-01' },
  { id: 2, orderNo: 'PO-20231002-002', supplier: '戴尔供应商', amount: 32000, status: 1, createDate: '2023-10-02' },
  { id: 3, orderNo: 'PO-20231005-003', supplier: '苹果供应商', amount: 88000, status: 0, createDate: '2023-10-05' }
]
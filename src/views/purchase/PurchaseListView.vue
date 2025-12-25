<script setup lang="ts">
import { ref, onMounted, reactive } from 'vue'
import { getPurchaseListApi, addPurchaseApi, submitPurchaseApi, approvePurchaseApi } from '../../api/purchaseApi'
import { ElMessage, ElMessageBox } from 'element-plus'

const tableData = ref([])
const loading = ref(false)

// 获取数据
const loadData = async () => {
  loading.value = true
  const res = await getPurchaseListApi()
  tableData.value = res.data
  loading.value = false
}

// 状态字典
const statusMap: any = {
  0: { text: '草稿', type: 'info' },
  1: { text: '待审核', type: 'warning' },
  2: { text: '已审核', type: 'success' },
  3: { text: '已驳回', type: 'danger' }
}

// --- 新增逻辑 ---
const dialogVisible = ref(false)
const form = reactive({ supplier: '', amount: '' })

const handleAdd = () => {
  form.supplier = ''
  form.amount = ''
  dialogVisible.value = true
}

const confirmAdd = async () => {
  await addPurchaseApi(form)
  ElMessage.success('采购单创建成功')
  dialogVisible.value = false
  loadData() // 刷新列表
}

// --- 工作流逻辑 ---
const handleSubmit = async (row: any) => {
  await submitPurchaseApi(row.id)
  ElMessage.success('已提交给经理审核')
  loadData()
}

const handleApprove = async (row: any) => {
  await approvePurchaseApi(row.id)
  ElMessage.success('审核通过！')
  loadData()
}

onMounted(() => {
  loadData()
})
</script>

<template>
  <div class="purchase-page">
    <div class="toolbar">
      <el-button type="primary" icon="Plus" @click="handleAdd">新建采购单</el-button>
    </div>

    <el-table :data="tableData" border style="width: 100%" v-loading="loading">
      <el-table-column prop="orderNo" label="单据编号" width="180" />
      <el-table-column prop="supplier" label="供应商" />
      <el-table-column prop="amount" label="金额 (元)" />
      <el-table-column prop="createDate" label="创建日期" width="120" />
      
      <el-table-column label="状态" width="100">
        <template #default="scope">
          <el-tag :type="statusMap[scope.row.status].type">
            {{ statusMap[scope.row.status].text }}
          </el-tag>
        </template>
      </el-table-column>

      <el-table-column label="操作 (工作流)" width="250">
        <template #default="scope">
          <!-- 只有草稿状态可以提交 -->
          <el-button 
            v-if="scope.row.status === 0" 
            size="small" 
            type="primary" 
            @click="handleSubmit(scope.row)"
          >
            提交审核
          </el-button>

          <!-- 只有待审核状态可以审核 (模拟经理权限) -->
          <el-button 
            v-if="scope.row.status === 1" 
            size="small" 
            type="success" 
            @click="handleApprove(scope.row)"
          >
            通过审核
          </el-button>
          
          <span v-if="scope.row.status === 2" style="color: green; font-size: 12px;">流程结束</span>
        </template>
      </el-table-column>
    </el-table>

    <!-- 新增弹窗 -->
    <el-dialog v-model="dialogVisible" title="新建采购单">
      <el-form :model="form">
        <el-form-item label="供应商名称" label-width="100px">
          <el-input v-model="form.supplier" autocomplete="off" />
        </el-form-item>
        <el-form-item label="采购金额" label-width="100px">
          <el-input v-model="form.amount" type="number" autocomplete="off" />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="confirmAdd">确定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<style scoped>
.toolbar { margin-bottom: 20px; }
</style>
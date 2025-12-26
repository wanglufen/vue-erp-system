<template>
  <div class="app-container">
    <div class="header-actions">
      <h2>销售订单管理</h2>
      <el-button type="primary" @click="$router.push('/sales/create')">新建订单</el-button>
    </div>

    <el-table :data="tableData" border style="width: 100%; margin-top: 20px;">
      <el-table-column prop="id" label="订单编号" width="180" />
      <el-table-column prop="customerName" label="客户名称" />
      <el-table-column prop="date" label="订单日期" width="120" />
      <el-table-column prop="totalAmount" label="总金额">
        <template #default="{ row }">
          ¥{{ row.totalAmount.toLocaleString() }}
        </template>
      </el-table-column>
      
      <el-table-column prop="status" label="状态" width="100">
        <template #default="{ row }">
          <el-tag :type="getStatusType(row.status)">{{ getStatusText(row.status) }}</el-tag>
        </template>
      </el-table-column>

      <el-table-column label="操作" width="200">
        <template #default="{ row }">
          <el-button link type="primary" v-if="row.status === 'Draft'" @click="handleSubmit(row.id)">提交审核</el-button>
          <el-button link type="primary">详情</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { getSalesList, submitForApproval } from '../../api/salesApi';
import { ElMessage } from 'element-plus';

const tableData = ref<any>([]);

const loadData = async () => {
  const res = await getSalesList();
  tableData.value = res.data;
};

const getStatusType = (status: string) => {
  const map: any = { Draft: 'info', Pending: 'warning', Approved: 'success', Rejected: 'danger' };
  return map[status];
};

const getStatusText = (status: string) => {
  const map: any = { Draft: '草稿', Pending: '待审核', Approved: '已审核', Rejected: '已驳回' };
  return map[status];
};

const handleSubmit = async (id: string) => {
  await submitForApproval(id);
  ElMessage.success('单据已提交工作流');
  loadData(); // 刷新列表
};

onMounted(loadData);
</script>

<style scoped>
.header-actions { display: flex; justify-content: space-between; align-items: center; }
.app-container { padding: 20px; }
</style>
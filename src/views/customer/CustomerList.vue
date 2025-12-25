<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { 
  getCustomerList, 
  addCustomer, 
  updateCustomer, 
  deleteCustomer, 
  type Customer 
} from '../../api/customerApi'

// --- 1. 列表数据与查询 ---
const tableData = ref<Customer[]>([])
const total = ref(0)
const loading = ref(false)
const queryParams = reactive({
  page: 1,
  size: 10,
  keyword: ''
})

// 获取数据的方法
const loadData = async () => {
  loading.value = true
  try {
    const res = await getCustomerList(queryParams)
    tableData.value = res.data.list
    total.value = res.data.total
  } finally {
    loading.value = false
  }
}

// 搜索
const handleSearch = () => {
  queryParams.page = 1 // 搜索时重置到第一页
  loadData()
}

// 分页变化
const handlePageChange = (newPage: number) => {
  queryParams.page = newPage
  loadData()
}

// --- 2. 新增/编辑弹窗逻辑 ---
const dialogVisible = ref(false)
const dialogTitle = ref('')
const formRef = ref()
const isEdit = ref(false) // 标记当前是新增还是编辑

// 表单初始数据
const formData = reactive<Customer>({
  id: 0,
  name: '',
  contact: '',
  phone: '',
  email: '',
  address: '',
  level: 'B'
})

// 表单校验规则
const rules = {
  name: [{ required: true, message: '请输入客户名称', trigger: 'blur' }],
  contact: [{ required: true, message: '请输入联系人', trigger: 'blur' }],
  phone: [{ required: true, message: '请输入电话', trigger: 'blur' }]
}

// 打开新增弹窗
const openAdd = () => {
  isEdit.value = false
  dialogTitle.value = '新增客户'
  // 重置表单
  Object.assign(formData, {
    id: 0, name: '', contact: '', phone: '', email: '', address: '', level: 'B'
  })
  dialogVisible.value = true
}

// 打开编辑弹窗
const openEdit = (row: Customer) => {
  isEdit.value = true
  dialogTitle.value = '编辑客户'
  // 复制当前行数据到表单 (使用 Object.assign 避免直接修改原数据)
  Object.assign(formData, row)
  dialogVisible.value = true
}

// 提交表单
const handleSubmit = async () => {
  if (!formRef.value) return
  await formRef.value.validate(async (valid: boolean) => {
    if (valid) {
      if (isEdit.value) {
        await updateCustomer(formData)
        ElMessage.success('更新成功')
      } else {
        await addCustomer(formData)
        ElMessage.success('添加成功')
      }
      dialogVisible.value = false
      loadData() // 刷新列表
    }
  })
}

// --- 3. 删除逻辑 ---
const handleDelete = (row: Customer) => {
  ElMessageBox.confirm(`确定要删除客户 "${row.name}" 吗？`, '警告', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(async () => {
    await deleteCustomer(row.id)
    ElMessage.success('删除成功')
    loadData()
  })
}

// 页面加载时获取数据
onMounted(() => {
  loadData()
})
</script>

<template>
  <div class="customer-container">
    <!-- 顶部搜索栏 -->
    <el-card class="search-card">
      <el-form :inline="true" :model="queryParams">
        <el-form-item label="关键词">
          <el-input v-model="queryParams.keyword" placeholder="客户名/联系人" clearable @clear="handleSearch" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearch" icon="Search">查询</el-button>
          <el-button type="success" @click="openAdd" icon="Plus">新增客户</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <!-- 表格区域 -->
    <el-card class="table-card">
      <el-table :data="tableData" border stripe v-loading="loading" style="width: 100%">
        <el-table-column prop="id" label="ID" width="60" />
        <el-table-column prop="name" label="客户名称" min-width="180" />
        <el-table-column prop="contact" label="联系人" width="100" />
        <el-table-column prop="phone" label="电话" width="120" />
        <el-table-column prop="level" label="等级" width="80">
          <template #default="{ row }">
            <el-tag :type="row.level === 'A' ? 'danger' : row.level === 'B' ? 'primary' : 'info'">
              {{ row.level }}级
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="address" label="地址" show-overflow-tooltip />
        
        <el-table-column label="操作" width="150" fixed="right">
          <template #default="{ row }">
            <el-button link type="primary" size="small" @click="openEdit(row)">编辑</el-button>
            <el-button link type="danger" size="small" @click="handleDelete(row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页 -->
      <div class="pagination-container">
        <el-pagination
          v-model:current-page="queryParams.page"
          v-model:page-size="queryParams.size"
          :total="total"
          :page-sizes="[10, 20, 50]"
          layout="total, sizes, prev, pager, next, jumper"
          @current-change="handlePageChange"
          @size-change="loadData"
        />
      </div>
    </el-card>

    <!-- 新增/编辑 弹窗 -->
    <el-dialog v-model="dialogVisible" :title="dialogTitle" width="500px">
      <el-form ref="formRef" :model="formData" :rules="rules" label-width="80px">
        <el-form-item label="客户名称" prop="name">
          <el-input v-model="formData.name" />
        </el-form-item>
        <el-form-item label="联系人" prop="contact">
          <el-input v-model="formData.contact" />
        </el-form-item>
        <el-form-item label="电话" prop="phone">
          <el-input v-model="formData.phone" />
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="formData.email" />
        </el-form-item>
        <el-form-item label="等级" prop="level">
          <el-select v-model="formData.level">
            <el-option label="A级 (VIP)" value="A" />
            <el-option label="B级 (普通)" value="B" />
            <el-option label="C级 (潜在)" value="C" />
          </el-select>
        </el-form-item>
        <el-form-item label="地址" prop="address">
          <el-input v-model="formData.address" type="textarea" />
        </el-form-item>
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
.customer-container {
  padding: 20px;
}
.search-card {
  margin-bottom: 20px;
}
.pagination-container {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
}
</style>
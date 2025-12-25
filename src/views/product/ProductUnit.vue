<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { getAllUnits, saveUnit, deleteUnit } from '../../api/productApi'
import type { Unit } from '../../api/mock/productData'
import { ElMessage, ElMessageBox } from 'element-plus'
import type { FormInstance } from 'element-plus'

// 日期格式化函数
const formatDate = (dateString: string) => {
  if (!dateString) return ''
  const date = new Date(dateString)
  return date.toLocaleString()
}

// --- 数据定义 ---
const tableData = ref<Unit[]>([])
const loading = ref(false)

// 弹窗控制
const dialogVisible = ref(false)
const dialogTitle = ref('新增单位')
const formRef = ref<FormInstance>()

// 表单数据
const formData = reactive<Partial<Unit>>({ 
  id: 0,
  name: '',
  code: '',
  sort: 0,
  status: 1
})

// 表单校验规则
const rules = {
  name: [{ required: true, message: '请输入单位名称', trigger: 'blur' }],
}

// --- 方法 ---

// 1. 获取单位列表
const loadData = async () => {
  loading.value = true
  const res = await getAllUnits()
  tableData.value = res.data
  loading.value = false
}

// 2. 打开新增窗口
const handleAdd = () => {
  dialogTitle.value = '新增单位'
  // 重置表单
  Object.assign(formData, { id: 0, name: '', code: '', sort: 0, status: 1 })
  dialogVisible.value = true
}

// 3. 打开编辑窗口
const handleEdit = (row: Unit) => {
  dialogTitle.value = '编辑单位'
  // 复制数据到表单
  Object.assign(formData, { ...row })
  dialogVisible.value = true
}

// 4. 提交保存
const handleSubmit = async () => {
  if (!formRef.value) return
  await formRef.value.validate(async (valid: boolean) => {
    if (valid) {
      await saveUnit(formData)
      ElMessage.success('保存成功')
      dialogVisible.value = false
      loadData() // 刷新列表
    }
  })
}

// 5. 删除单位
const handleDelete = (id: number) => {
  ElMessageBox.confirm('确定要删除该单位吗？', '警告', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  }).then(async () => {
    const res = await deleteUnit(id)
    if (res.code === 200) {
      ElMessage.success('删除成功')
      loadData()
    } else {
      ElMessage.error(res.msg)
    }
  })
}

// 初始化加载
onMounted(() => {
  loadData()
})
</script>

<template>
  <div class="page-container">
    <!-- 顶部操作栏 -->
    <div class="toolbar">
      <el-button type="success" @click="handleAdd">新增单位</el-button>
    </div>

    <!-- 表格区域 -->
    <el-table :data="tableData" v-loading="loading" border style="width: 100%; margin-top: 20px;">
      <el-table-column prop="name" label="单位名称" width="120" />
      <el-table-column prop="code" label="符号" width="80" />
      <el-table-column prop="sort" label="排序" width="80" />
      <el-table-column prop="status" label="状态" width="80">
        <template #default="{ row }">
          <el-tag :type="row.status === 1 ? 'success' : 'danger'">
            {{ row.status === 1 ? '启用' : '停用' }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="createTime" label="创建时间" width="180">
        <template #default="{ row }">
          {{ formatDate(row.createTime) }}
        </template>
      </el-table-column>
      <el-table-column prop="updateTime" label="更新时间" width="180">
        <template #default="{ row }">
          {{ formatDate(row.updateTime) }}
        </template>
      </el-table-column>
      <el-table-column label="操作" width="180" fixed="right">
        <template #default="{ row }">
          <el-button link type="primary" @click="handleEdit(row)">编辑</el-button>
          <el-button link type="danger" @click="handleDelete(row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 新增/编辑 弹窗 -->
    <el-dialog v-model="dialogVisible" :title="dialogTitle" width="500px">
      <el-form ref="formRef" :model="formData" :rules="rules" label-width="80px">
        <el-form-item label="单位名称" prop="name">
          <el-input v-model="formData.name" placeholder="例如: 个" />
        </el-form-item>
        <el-form-item label="符号">
          <el-input v-model="formData.code" placeholder="例如: PCS" />
        </el-form-item>
        <el-form-item label="排序">
          <el-input-number v-model="formData.sort" :min="0" style="width: 100%;" />
        </el-form-item>
        <el-form-item label="状态">
          <el-radio-group v-model="formData.status">
            <el-radio label="1">启用</el-radio>
            <el-radio label="0">停用</el-radio>
          </el-radio-group>
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
.page-container {
  padding: 20px;
  background: #fff;
  min-height: 100%;
}

.toolbar {
  margin-bottom: 20px;
}
</style>
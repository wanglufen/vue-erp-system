<template>
  <div class="app-container">
    <el-page-header @back="$router.back()" content="新建销售订单" style="margin-bottom: 20px;" />

    <el-form :model="form" label-width="80px">
      <!-- 头部信息 -->
      <el-card shadow="never" style="margin-bottom: 20px;">
        <el-row :gutter="20">
          <el-col :span="8">
            <el-form-item label="客户">
              <el-select v-model="form.customerId" placeholder="请选择客户" @change="handleCustomerChange" style="width: 100%">
                <el-option v-for="c in customerOptions" :key="c.id" :label="c.name" :value="c.id" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="日期">
              <el-date-picker v-model="form.date" type="date" value-format="YYYY-MM-DD" style="width: 100%" />
            </el-form-item>
          </el-col>
        </el-row>
      </el-card>

      <!-- 商品明细 (动态表格) -->
      <el-card shadow="never">
        <template #header>
          <div class="card-header">
            <span>商品明细</span>
            <el-button type="primary" size="small" @click="addItem">添加商品</el-button>
          </div>
        </template>
        
        <el-table :data="form.items" border>
          <el-table-column label="选择产品" width="250">
            <template #default="{ row }">
              <el-select v-model="row.productId" placeholder="请选择" @change="(val) => handleProductChange(val, row)">
                <el-option v-for="p in productOptions" :key="p.id" :label="p.name" :value="p.id" />
              </el-select>
            </template>
          </el-table-column>
        
          <el-table-column label="单价" width="150">
            <template #default="{ row }">
              <el-input-number v-model="row.price" :disabled="true" :controls="false" style="width: 100%" />
            </template>
          </el-table-column>

          <el-table-column label="数量" width="180">
            <template #default="{ row }">
              <el-input-number v-model="row.quantity" :min="1" @change="calcRowTotal(row)" style="width: 100%" />
            </template>
          </el-table-column>

          <el-table-column label="小计">
            <template #default="{ row }">
              ¥{{ row.total }}
            </template>
          </el-table-column>

          <el-table-column label="操作" width="80">
            <template #default="{ $index }">
              <el-button type="danger" link @click="removeItem($index)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>

        <div style="margin-top: 20px; text-align: right; font-size: 18px; font-weight: bold;">
          订单总金额: <span style="color: #f56c6c;">¥{{ totalAmount }}</span>
        </div>
      </el-card>

      <div style="margin-top: 20px; text-align: center;">
        <el-button @click="$router.back()">取消</el-button>
        <el-button type="primary" @click="handleSave">保存订单</el-button>
      </div>
    </el-form>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { getCustomerOptions, getProductOptions, saveSalesOrder } from '../../api/salesApi';
import { ElMessage } from 'element-plus';

const router = useRouter();
const customerOptions = ref<any[]>([]);
const productOptions = ref<any[]>([]);

// 表单数据
const form = reactive({
  id: '',
  customerId: null,
  customerName: '',
  date: new Date().toISOString().split('T')[0],
  items: [] as any[]
});

// 计算总金额
const totalAmount = computed(() => {
  return form.items.reduce((sum, item) => sum + item.total, 0);
});

// 初始化加载下拉框数据
onMounted(async () => {
  const cRes = await getCustomerOptions();
  customerOptions.value = cRes.data;
  
  const pRes = await getProductOptions();
  productOptions.value = pRes.data;
});

// 交互逻辑
const handleCustomerChange = (val: number) => {
  const customer = customerOptions.value.find(c => c.id === val);
  if (customer) form.customerName = customer.name;
};

const addItem = () => {
  form.items.push({ productId: null, productName: '', price: 0, quantity: 1, total: 0 });
};

const removeItem = (index: number) => {
  form.items.splice(index, 1);
};

const handleProductChange = (val: number, row: any) => {
  const product = productOptions.value.find(p => p.id === val);
  if (product) {
    row.productName = product.name;
    row.price = product.price;
    calcRowTotal(row);
  }
};

const calcRowTotal = (row: any) => {
  row.total = row.price * row.quantity;
};

const handleSave = async () => {
  if (!form.customerId) return ElMessage.warning('请选择客户');
  if (form.items.length === 0) return ElMessage.warning('请至少添加一件商品');

  const dataToSave = { ...form, totalAmount: totalAmount.value, status: 'Draft' };
  await saveSalesOrder(dataToSave as any);
  ElMessage.success('保存成功');
  router.push('/sales/list');
};
</script>

<style scoped>
.app-container { padding: 20px; }
.card-header { display: flex; justify-content: space-between; align-items: center; }
</style>
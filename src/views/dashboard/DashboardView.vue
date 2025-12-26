<template>
  <div class="dashboard-container">
    <el-row :gutter="20">
      <el-col :span="6">
        <el-card shadow="hover">
          <template #header>今日销售额</template>
          <div class="card-value">¥ 12,000</div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card shadow="hover">
          <template #header>待处理订单</template>
          <div class="card-value">15 单</div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card shadow="hover">
          <template #header>库存预警</template>
          <div class="card-value" style="color: red;">3 项</div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card shadow="hover">
          <template #header>员工在线</template>
          <div class="card-value">8 人</div>
        </el-card>
      </el-col>
    </el-row>
    
    <div style="margin-top: 20px;">
      <el-card>
        <h3>系统公告</h3>
        <p>欢迎使用新版 ERP 系统，当前版本 v1.0.0</p>
      </el-card>
    </div>
  </div>
</template>

<style scoped>
.card-value {
  font-size: 24px;
  font-weight: bold;
  color: #409EFF;
}
</style>
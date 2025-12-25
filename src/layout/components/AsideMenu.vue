<script setup lang="ts">
import { useRoute } from 'vue-router'
import {
  Menu as IconMenu, 
  User, 
  Goods, 
  ShoppingCart, 
  SoldOut, 
  Setting,
  Box,
  Files,
  Management
} from '@element-plus/icons-vue'

const route = useRoute()

// 接收折叠状态作为props
const props = defineProps<{
  isCollapse: boolean
}>()
</script>

<template>
  <div class="aside">
    <div class="logo">
      <img src="https://element-plus.org/images/element-plus-logo.svg" alt="logo" v-if="!isCollapse" style="height: 20px;">
      <span v-else>ERP</span>
    </div>
    
    <el-menu
      :default-active="route.path"
      class="el-menu-vertical"
      :collapse="isCollapse"
      background-color="#304156"
      text-color="#bfcbd9"
      active-text-color="#409EFF"
      router
    >
      <!-- 仪表盘 -->
      <el-menu-item index="/dashboard">
        <el-icon><IconMenu /></el-icon>
        <template #title>{{ $t('common.home') }}</template>
      </el-menu-item>

      <!-- 客户模块 -->
      <el-menu-item index="/customer">
        <el-icon><User /></el-icon>
        <template #title>{{ $t('common.customer') }}</template>
      </el-menu-item>

      <!-- 产品模块 -->
      <el-menu-item index="/product">
        <el-icon><Goods /></el-icon>
        <template #title>{{ $t('common.product') }}</template>
      </el-menu-item>

      <!-- 采购模块 -->
      <el-menu-item index="/purchase">
        <el-icon><ShoppingCart /></el-icon>
        <template #title>采购管理</template>
      </el-menu-item>

      <!-- 销售模块 -->
      <el-menu-item index="/sales/list">
        <el-icon><SoldOut /></el-icon>
        <template #title>销售管理</template>
      </el-menu-item>

      <!-- 委外模块 -->
      <el-menu-item index="/outsourcing">
        <el-icon><Box /></el-icon>
        <template #title>委外管理</template>
      </el-menu-item>

      <!-- BOM模块 -->
      <el-menu-item index="/bom">
        <el-icon><Files /></el-icon>
        <template #title>BOM管理</template>
      </el-menu-item>

      <!-- OA/HR 模块 (使用子菜单) -->
      <el-sub-menu index="/oa">
        <template #title>
          <el-icon><Management /></el-icon>
          <span>办公人事</span>
        </template>
        <el-menu-item index="/oa/workflow">OA工作流</el-menu-item>
        <el-menu-item index="/hr/staff">员工管理</el-menu-item>
      </el-sub-menu>

      <!-- 系统设置 -->
      <el-menu-item index="/settings">
        <el-icon><Setting /></el-icon>
        <template #title>{{ $t('common.settings') }}</template>
      </el-menu-item>
    </el-menu>
  </div>
</template>

<style scoped>
.aside {
  background-color: #304156;
  transition: width 0.3s;
  width: v-bind('isCollapse ? "64px" : "220px"');
  overflow-x: hidden;
  height: 100%;
}

.logo {
  height: 60px;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #2b2f3a;
  color: white;
  font-weight: bold;
  font-size: 20px;
}

.el-menu-vertical {
  border-right: none;
  height: calc(100% - 60px);
}
</style>
<script setup lang="ts">
import { useUserStore } from '../../stores/userStore'
import { useRouter } from 'vue-router'
import { ArrowDown } from '@element-plus/icons-vue'

const userStore = useUserStore()
const router = useRouter()

const handleLogout = () => {
  userStore.logout()
  router.push('/login')
}
</script>

<template>
  <div class="header-container">
    <!-- 左侧面包屑 (暂时留空，以后加) -->
    <div class="breadcrumb">
      ERP 管理系统
    </div>

    <!-- 右侧用户信息 -->
    <div class="right-menu">
      <el-dropdown>
        <span class="el-dropdown-link">
          <!-- 显示用户名，如果没有就显示 User -->
          {{ userStore.userInfo?.name || 'User' }}
          <el-icon class="el-icon--right"><arrow-down /></el-icon>
        </span>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item>个人中心</el-dropdown-item>
            <el-dropdown-item divided @click="handleLogout">退出登录</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
  </div>
</template>

<style scoped>
.header-container {
  height: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 20px;
  background-color: #fff;
  box-shadow: 0 1px 4px rgba(0,21,41,.08);
}
.el-dropdown-link {
  cursor: pointer;
  display: flex;
  align-items: center;
  color: #333;
}
</style>
<script setup lang="ts">
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useUserStore } from '../stores/userStore'
import { ArrowDown, Fold, Expand } from '@element-plus/icons-vue'
import AsideMenu from './components/AsideMenu.vue'

const route = useRoute()
const router = useRouter()
const userStore = useUserStore()

// 控制侧边栏折叠
const isCollapse = ref(false)

const handleLogout = () => {
  userStore.logout()
  router.push('/login')
}
</script>

<template>
  <el-container class="layout-container">
    <!-- 左侧侧边栏 -->
    <el-aside :width="isCollapse ? '64px' : '220px'">
      <AsideMenu :is-collapse="isCollapse" />
    </el-aside>

    <!-- 右侧内容区 -->
    <el-container>
      <!-- 顶部 Header -->
      <el-header class="header">
        <div class="header-left">
          <el-icon class="collapse-btn" @click="isCollapse = !isCollapse">
            <component :is="isCollapse ? Expand : Fold" />
          </el-icon>
          <el-breadcrumb separator="/">
            <el-breadcrumb-item :to="{ path: '/' }">{{ $t('common.home') }}</el-breadcrumb-item>
            <el-breadcrumb-item>{{ route.meta.title || '当前页面' }}</el-breadcrumb-item>
          </el-breadcrumb>
        </div>
        
        <div class="header-right">
          <el-dropdown>
            <span class="el-dropdown-link">
              {{ userStore.userInfo?.name || '管理员' }}
              <el-icon class="el-icon--right"><arrow-down /></el-icon>
            </span>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item @click="handleLogout">退出登录</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
      </el-header>

      <!-- 中间 Main 内容 -->
      <el-main class="main">
        <!-- 这里是核心：子路由的内容会显示在这里 -->
        <router-view v-slot="{ Component }">
          <transition name="fade" mode="out-in">
            <component :is="Component" />
          </transition>
        </router-view>
      </el-main>

      <!-- 底部备案信息 -->
      <el-footer class="footer">
        <div class="footer-content">
          <span>{{ $t('footer.customerService') }}：400-123-4567 | </span>
          <span>{{ $t('footer.email') }}：service@vue-erp-system.com | </span>
          <span>{{ $t('footer.recordNumber') }}：京ICP备12345678号-1 | </span>
          <span>© 2023 Vue ERP System. {{ $t('footer.copyright') }}.</span>
        </div>
      </el-footer>
    </el-container>
  </el-container>
</template>

<style scoped>
.layout-container {
  height: 100vh;
}

/* 侧边栏样式已移至AsideMenu组件 */

.header {
  background-color: #fff;
  border-bottom: 1px solid #dcdfe6;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 20px;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 20px;
}

.collapse-btn {
  font-size: 20px;
  cursor: pointer;
}

.el-dropdown-link {
  cursor: pointer;
  display: flex;
  align-items: center;
}

.main {
  background-color: #f0f2f5;
  padding: 20px;
  flex: 1;
}

/* 底部样式 */
.footer {
  background-color: #fff;
  border-top: 1px solid #e4e7ed;
  padding: 10px 20px;
  height: auto;
  min-height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.footer-content {
  font-size: 12px;
  color: #606266;
  text-align: center;
}

.footer-content span {
  margin: 0;
}

/* 页面切换动画 */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
<script setup lang="ts">
import { RouterView } from 'vue-router'
</script>

<template>
  <!-- 路由出口：这里会根据网址自动变成 LoginView 或 DashboardView -->
  <RouterView />
</template>

<style>
/* 注意：这里不要加 scoped，我们需要设置全局样式 */
html, body, #app {
  margin: 0;
  padding: 0;
  height: 100%;
  width: 100%;
  font-family: 'Helvetica Neue', Helvetica, 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', '微软雅黑', Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
}
</style>
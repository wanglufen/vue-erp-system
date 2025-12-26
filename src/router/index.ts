import { createRouter, createWebHistory } from 'vue-router'
import MainLayout from '../layout/MainLayout.vue' // 引入刚才写的 Layout

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/login',
      name: 'Login',
      component: () => import('../views/login/LoginView.vue')
    },
    {
      path: '/',
      component: MainLayout, // 使用 Layout 作为父组件
      redirect: '/dashboard',
      children: [
        {
          path: 'dashboard',
          name: 'Dashboard',
          component: () => import('../views/dashboard/DashboardView.vue'),
          meta: { title: '仪表盘' }
        },
        // 暂时先把其他模块的路由占位符写好，防止点击菜单报错
       {
          path: '/customer',
          name: 'Customer',
          component: () => import('../views/customer/CustomerList.vue'),
          meta: { title: '客户管理' }
        },
        { 
          path: '/product',          
          name: 'ProductList',          
          component: () => import('../views/product/ProductListView.vue'),          
          meta: { title: '产品列表' } 
        },        
        { 
          path: '/product/category',          
          name: 'ProductCategory',          
          component: () => import('../views/product/ProductCategory.vue'),          
          meta: { title: '产品分类' }        
        },        
        {          
          path: '/product/unit',          
          name: 'ProductUnit',          
          component: () => import('../views/product/ProductUnit.vue'),          
          meta: { title: '产品单位' }        },
        {          
          path: '/settings',          
          name: 'Settings',          
          component: () => import('../views/settings/SettingsView.vue'),          
          meta: { title: '系统设置' }        },
        {
          path: '/sales/list',
          name: 'SalesList',
          component: () => import('../views/sales/SalesList.vue')
        },
        {
          path: '/sales/create',
          name: 'SalesCreate',
          component: () => import('../views/sales/SalesForm.vue')
        },
        {
          path: 'purchase', // 访问 /purchase 时显示
          name: 'Purchase',
          component: () => import('../views/purchase/PurchaseListView.vue')
        }

        // ... 其他模块后续慢慢加
      ]
    }
  ]
})

// 路由守卫：没登录不准进
router.beforeEach((to, _from, next) => {
  const token = localStorage.getItem('token')
  if (to.path !== '/login' && !token) {
    next('/login')
  } else {
    next()
  }
})

export default router
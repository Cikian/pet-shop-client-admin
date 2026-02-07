import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const routes: RouteRecordRaw[] = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/auth/LoginView.vue'),
    meta: { requiresAuth: false }
  },
  {
    path: '/',
    name: 'Layout',
    component: () => import('@/components/layout/LayoutView.vue'),
    meta: { requiresAuth: true },
    redirect: '/dashboard',
    children: [
      {
        path: 'dashboard',
        name: 'Dashboard',
        component: () => import('@/views/dashboard/DashboardView.vue'),
        meta: { requiresAuth: true }
      },
      {
        path: 'categories',
        name: 'CategoryList',
        component: () => import('@/views/category/CategoryListView.vue'),
        meta: { requiresAuth: true }
      },
      {
        path: 'products',
        name: 'ProductList',
        component: () => import('@/views/product/ProductListView.vue'),
        meta: { requiresAuth: true }
      },
      {
        path: 'system/users',
        name: 'UserList',
        component: () => import('@/views/user/UserListView.vue'),
        meta: { requiresAuth: true }
      },
      // 角色管理
      {
        path: 'roles',
        name: 'RoleList',
        component: () => import('@/views/role-permission/RoleManagementView.vue'),
        meta: { requiresAuth: true }
      },
      // 权限管理
      {
        path: 'permissions',
        name: 'PermissionList',
        component: () => import('@/views/role-permission/PermissionManagementView.vue'),
        meta: { requiresAuth: true }
      }
      // 其他路由将在相应的页面组件创建后添加
      // {
      //   path: 'products/add',
      //   name: 'ProductAdd',
      //   component: () => import('@/views/product/ProductAddView.vue'),
      //   meta: { requiresAuth: true }
      // },
      // {
      //   path: 'products/:id/edit',
      //   name: 'ProductEdit',
      //   component: () => import('@/views/product/ProductEditView.vue'),
      //   meta: { requiresAuth: true }
      // },
      // {
      //   path: 'specs',
      //   name: 'SpecManage',
      //   component: () => import('@/views/spec/SpecManageView.vue'),
      //   meta: { requiresAuth: true }
      // },
      // {
      //   path: 'products/add',
      //   name: 'ProductAdd',
      //   component: () => import('@/views/product/ProductAddView.vue'),
      //   meta: { requiresAuth: true }
      // },
      // {
      //   path: 'products/:id/edit',
      //   name: 'ProductEdit',
      //   component: () => import('@/views/product/ProductEditView.vue'),
      //   meta: { requiresAuth: true }
      // },
      // {
      //   path: 'specs',
      //   name: 'SpecManage',
      //   component: () => import('@/views/spec/SpecManageView.vue'),
      //   meta: { requiresAuth: true }
      // }
    ]
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    redirect: '/dashboard'
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// 认证路由守卫
router.beforeEach((to, _from, next) => {
  const authStore = useAuthStore()
  
  // 检查路由是否需要认证
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth !== false)
  
  if (requiresAuth && !authStore.isAuthenticated) {
    // 需要认证但未登录，重定向到登录页
    next('/login')
  } else if (to.path === '/login' && authStore.isAuthenticated) {
    // 已登录用户访问登录页，重定向到仪表板
    next('/dashboard')
  } else {
    // 允许访问
    next()
  }
})

export default router
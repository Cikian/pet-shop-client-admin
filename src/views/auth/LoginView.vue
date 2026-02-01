<template>
  <div class="login-view">
    <div class="login-container">
      <div class="login-header">
        <h1 class="login-title">电商管理后台</h1>
        <p class="login-subtitle">欢迎登录管理系统</p>
      </div>
      
      <el-form
        ref="loginFormRef"
        :model="loginForm"
        :rules="loginRules"
        class="login-form"
        size="large"
        @submit.prevent="handleLogin"
      >
        <el-form-item prop="username">
          <el-input
            v-model="loginForm.username"
            placeholder="请输入用户名"
            prefix-icon="User"
            clearable
            @keyup.enter="handleLogin"
          />
        </el-form-item>
        
        <el-form-item prop="password">
          <el-input
            v-model="loginForm.password"
            type="password"
            placeholder="请输入密码"
            prefix-icon="Lock"
            show-password
            clearable
            @keyup.enter="handleLogin"
          />
        </el-form-item>
        
        <el-form-item>
          <el-button
            type="primary"
            class="login-button"
            :loading="loading"
            @click="handleLogin"
          >
            {{ loading ? '登录中...' : '登录' }}
          </el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, type FormInstance, type FormRules } from 'element-plus'
import { useAuthStore } from '@/stores/auth'
import type { LoginRequest } from '@/types'

// 路由实例
const router = useRouter()

// 认证状态管理
const authStore = useAuthStore()

// 表单引用
const loginFormRef = ref<FormInstance>()

// 加载状态
const loading = ref(false)

// 登录表单数据
const loginForm = reactive<LoginRequest>({
  username: '',
  password: ''
})

// 表单验证规则
const loginRules: FormRules = {
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { min: 2, max: 50, message: '用户名长度在 2 到 50 个字符', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, max: 100, message: '密码长度在 6 到 100 个字符', trigger: 'blur' }
  ]
}

// 登录处理函数
const handleLogin = async () => {
  if (!loginFormRef.value) return
  
  try {
    // 验证表单
    const valid = await loginFormRef.value.validate()
    if (!valid) return
    
    loading.value = true
    
    // 调用认证状态管理的登录方法
    await authStore.login({
      username: loginForm.username,
      password: loginForm.password
    })
    
    // 登录成功提示
    ElMessage.success('登录成功')
    
    // 重定向到仪表板
    await router.push('/dashboard')
    
  } catch (error: any) {
    console.error('登录失败:', error)
    
    // 显示错误信息
    const errorMessage = error?.response?.data?.message || error?.message || '登录失败，请检查用户名和密码'
    ElMessage.error(errorMessage)
    
  } finally {
    loading.value = false
  }
}
</script>

<style lang="scss" scoped>
.login-view {
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: var(--spacing-md);
}

.login-container {
  width: 100%;
  max-width: 400px;
  background: var(--bg-color);
  border-radius: var(--border-radius-large);
  box-shadow: var(--box-shadow-light);
  padding: var(--spacing-xl);
}

.login-header {
  text-align: center;
  margin-bottom: var(--spacing-xl);
}

.login-title {
  font-size: 28px;
  font-weight: 600;
  color: var(--text-primary);
  margin: 0 0 var(--spacing-sm) 0;
}

.login-subtitle {
  font-size: 14px;
  color: var(--text-secondary);
  margin: 0;
}

.login-form {
  .el-form-item {
    margin-bottom: var(--spacing-lg);
    
    &:last-child {
      margin-bottom: 0;
    }
  }
}

.login-button {
  width: 100%;
  height: 48px;
  font-size: 16px;
  font-weight: 500;
}

// 响应式设计
@media (max-width: 768px) {
  .login-container {
    margin: var(--spacing-md);
    padding: var(--spacing-lg);
  }
  
  .login-title {
    font-size: 24px;
  }
}
</style>
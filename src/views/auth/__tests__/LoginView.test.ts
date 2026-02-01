import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import { createRouter, createWebHistory } from 'vue-router'
import LoginView from '../LoginView.vue'

// Mock Element Plus components
const mockComponents = {
  'el-form': {
    template: '<form><slot /></form>'
  },
  'el-form-item': {
    template: '<div class="form-item"><slot /></div>'
  },
  'el-input': {
    template: '<input :placeholder="placeholder" :type="type" />',
    props: ['placeholder', 'type', 'prefixIcon', 'showPassword', 'clearable']
  },
  'el-button': {
    template: '<button class="login-button" :disabled="loading"><slot /></button>',
    props: ['type', 'loading']
  }
}

// Mock Element Plus message
vi.mock('element-plus', async () => {
  const actual = await vi.importActual('element-plus')
  return {
    ...actual,
    ElMessage: {
      success: vi.fn(),
      error: vi.fn(),
      info: vi.fn()
    }
  }
})

// Mock auth store
vi.mock('@/stores/auth', () => ({
  useAuthStore: () => ({
    login: vi.fn(),
    isAuthenticated: false
  })
}))

describe('LoginView', () => {
  let router: any
  let pinia: any

  beforeEach(() => {
    // Create fresh pinia instance
    pinia = createPinia()
    setActivePinia(pinia)

    // Create router instance
    router = createRouter({
      history: createWebHistory(),
      routes: [
        { path: '/', component: { template: '<div>Home</div>' } },
        { path: '/login', component: LoginView },
        { path: '/dashboard', component: { template: '<div>Dashboard</div>' } }
      ]
    })
  })

  it('should render login form correctly', () => {
    const wrapper = mount(LoginView, {
      global: {
        plugins: [pinia, router],
        components: mockComponents
      }
    })

    // Check if main elements are rendered
    expect(wrapper.find('.login-view').exists()).toBe(true)
    expect(wrapper.find('.login-container').exists()).toBe(true)
    expect(wrapper.find('.login-title').text()).toBe('电商管理后台')
    expect(wrapper.find('.login-subtitle').text()).toBe('欢迎登录管理系统')
  })

  it('should have form inputs for username and password', () => {
    const wrapper = mount(LoginView, {
      global: {
        plugins: [pinia, router],
        components: mockComponents
      }
    })

    // Check if form inputs exist
    const inputs = wrapper.findAll('input')
    expect(inputs.length).toBeGreaterThanOrEqual(2)
    
    // Check placeholders
    const placeholders = inputs.map(input => input.attributes('placeholder'))
    expect(placeholders).toContain('请输入用户名')
    expect(placeholders).toContain('请输入密码')
  })

  it('should have login button', () => {
    const wrapper = mount(LoginView, {
      global: {
        plugins: [pinia, router],
        components: mockComponents
      }
    })

    const loginButton = wrapper.find('.login-button')
    expect(loginButton.exists()).toBe(true)
    expect(loginButton.text()).toBe('登录')
  })
})
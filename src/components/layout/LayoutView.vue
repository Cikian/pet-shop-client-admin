<template>
  <div class="layout-container">
    <!-- 头部导航 -->
    <header class="layout-header">
      <div class="header-left">
        <el-button
          :icon="Expand"
          @click="toggleSidebar"
          class="sidebar-toggle"
          text
          v-if="isMobile"
        />
        <h1 class="header-title">电商管理后台</h1>
      </div>
      
      <div class="header-right">
        <div class="header-actions">
          <theme-switcher />
        </div>
        
        <el-dropdown @command="handleUserCommand">
          <span class="user-dropdown">
            <el-avatar :size="32" :src="userAvatar" />
            <span class="username">{{ currentUser?.username || '管理员' }}</span>
            <el-icon><ArrowDown /></el-icon>
          </span>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item command="profile">个人资料</el-dropdown-item>
              <el-dropdown-item command="settings">系统设置</el-dropdown-item>
              <el-dropdown-item divided command="logout">退出登录</el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div>
    </header>
    
    <!-- 主体内容 -->
    <div class="layout-body">
      <!-- 侧边栏 -->
      <aside 
        class="layout-sidebar"
        :class="{ 'is-collapse': isCollapse, 'is-mobile': isMobile }"
      >
        <div class="sidebar-content">
          <navigation-menu :is-collapse="isCollapse" />
        </div>
      </aside>
      
      <!-- 侧边栏遮罩层（移动端） -->
      <div 
        v-if="isMobile && !isCollapse"
        class="sidebar-mask"
        @click="closeSidebar"
      />
      
      <!-- 主内容区 -->
      <main class="layout-main">
        <div class="main-content">
          <router-view />
        </div>
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useRouter } from 'vue-router'
import { useTheme } from '@/composables/useTheme'
import { Expand, ArrowDown } from '@element-plus/icons-vue'
import NavigationMenu from './NavigationMenu.vue'
import ThemeSwitcher from '@/components/common/ThemeSwitcher.vue'

const authStore = useAuthStore()
const router = useRouter()
const { initTheme } = useTheme()

// 响应式状态
const isCollapse = ref(false)
const screenWidth = ref(window.innerWidth)

// 计算属性
const isMobile = computed(() => screenWidth.value < 768)
const currentUser = computed(() => authStore.user)
const userAvatar = computed(() => currentUser.value?.avatar || '')

// 侧边栏控制
const toggleSidebar = () => {
  isCollapse.value = !isCollapse.value
}

const closeSidebar = () => {
  if (isMobile.value) {
    isCollapse.value = true
  }
}

// 用户操作处理
const handleUserCommand = (command: string) => {
  switch (command) {
    case 'profile':
      // TODO: 跳转到个人资料页面
      console.log('跳转到个人资料')
      break
    case 'settings':
      // TODO: 跳转到系统设置页面
      console.log('跳转到系统设置')
      break
    case 'logout':
      logout()
      break
  }
}

const logout = () => {
  authStore.logout()
  router.push('/login')
}

// 窗口大小监听
const handleResize = () => {
  screenWidth.value = window.innerWidth
  // 移动端自动收起侧边栏
  if (isMobile.value) {
    isCollapse.value = true
  }
}

onMounted(() => {
  window.addEventListener('resize', handleResize)
  // 初始化时检查是否为移动端
  if (isMobile.value) {
    isCollapse.value = true
  }
  // 初始化主题
  initTheme()
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
})
</script>

<style scoped lang="scss">
.layout-container {
  height: 100vh;
  display: flex;
  flex-direction: column;
  background: var(--bg-color-page);
}

.layout-header {
  height: 60px;
  background: var(--bg-color);
  border-bottom: 1px solid var(--border-light);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 var(--spacing-lg);
  position: relative;
  z-index: 1001;
  
  .header-left {
    display: flex;
    align-items: center;
    gap: var(--spacing-md);
    
    .sidebar-toggle {
      font-size: 18px;
      color: var(--text-regular);
    }
    
    .header-title {
      margin: 0;
      font-size: 20px;
      font-weight: 600;
      color: var(--text-primary);
      
      @media (max-width: 767px) {
        font-size: 16px;
      }
    }
  }
  
  .header-right {
    display: flex;
    align-items: center;
    gap: var(--spacing-md);
    
    .header-actions {
      display: flex;
      align-items: center;
      gap: var(--spacing-sm);
    }
    
    .user-dropdown {
      display: flex;
      align-items: center;
      gap: var(--spacing-sm);
      cursor: pointer;
      padding: var(--spacing-sm);
      border-radius: var(--border-radius-base);
      transition: background-color 0.3s;
      
      &:hover {
        background: var(--bg-color-page);
      }
      
      .username {
        font-size: 14px;
        color: var(--text-regular);
        
        @media (max-width: 767px) {
          display: none;
        }
      }
    }
  }
}

.layout-body {
  flex: 1;
  display: flex;
  overflow: hidden;
  position: relative;
}

.layout-sidebar {
  width: 240px;
  background: var(--bg-color);
  border-right: 1px solid var(--border-light);
  transition: all 0.3s ease;
  position: relative;
  z-index: 1000;
  
  &.is-collapse {
    width: 64px;
    
    @media (max-width: 767px) {
      width: 0;
      border-right: none;
    }
  }
  
  &.is-mobile {
    position: fixed;
    top: 60px;
    left: 0;
    bottom: 0;
    width: 240px;
    box-shadow: var(--box-shadow-light);
    
    &.is-collapse {
      transform: translateX(-100%);
    }
  }
  
  .sidebar-content {
    height: 100%;
    overflow-y: auto;
    overflow-x: hidden;
    
    // 自定义滚动条样式
    &::-webkit-scrollbar {
      width: 4px;
    }
    
    &::-webkit-scrollbar-track {
      background: transparent;
    }
    
    &::-webkit-scrollbar-thumb {
      background: var(--border-base);
      border-radius: 2px;
      
      &:hover {
        background: var(--text-placeholder);
      }
    }
  }
}

.sidebar-mask {
  position: fixed;
  top: 60px;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.3);
  z-index: 999;
}

.layout-main {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  
  .main-content {
    flex: 1;
    padding: var(--spacing-lg);
    overflow-y: auto;
    
    @media (max-width: 767px) {
      padding: var(--spacing-md);
    }
    
    // 自定义滚动条样式
    &::-webkit-scrollbar {
      width: 6px;
    }
    
    &::-webkit-scrollbar-track {
      background: var(--bg-color-page);
    }
    
    &::-webkit-scrollbar-thumb {
      background: var(--border-base);
      border-radius: 3px;
      
      &:hover {
        background: var(--text-placeholder);
      }
    }
  }
}

// 响应式设计
@media (max-width: 767px) {
  .layout-header {
    padding: 0 var(--spacing-md);
  }
}

// 动画效果
.layout-sidebar,
.sidebar-mask {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}
</style>
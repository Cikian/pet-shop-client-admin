<template>
  <el-dropdown 
    @command="handleThemeChange"
    trigger="click"
    class="theme-switcher"
  >
    <el-button 
      :icon="currentIcon" 
      circle 
      text
      class="theme-button"
      :title="currentThemeOption.label"
    />
    <template #dropdown>
      <el-dropdown-menu>
        <el-dropdown-item 
          v-for="option in themeOptions"
          :key="option.value"
          :command="option.value"
          :class="{ 'is-active': mode === option.value }"
        >
          <el-icon class="theme-icon">
            <component :is="getIcon(option.icon)" />
          </el-icon>
          <span>{{ option.label }}</span>
          <el-icon v-if="mode === option.value" class="check-icon">
            <Check />
          </el-icon>
        </el-dropdown-item>
      </el-dropdown-menu>
    </template>
  </el-dropdown>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useTheme } from '@/composables/useTheme'
import { 
  Sunny, 
  Moon, 
  Monitor,
  Check
} from '@element-plus/icons-vue'
import type { ThemeMode } from '@/stores/theme'

const { 
  mode, 
  themeOptions, 
  currentThemeOption, 
  setTheme 
} = useTheme()

// 图标映射
const iconMap = {
  Sunny,
  Moon,
  Monitor
}

// 获取图标组件
const getIcon = (iconName: string) => {
  return iconMap[iconName as keyof typeof iconMap] || Sunny
}

// 当前图标
const currentIcon = computed(() => {
  return getIcon(currentThemeOption.value.icon)
})

// 处理主题切换
const handleThemeChange = (command: ThemeMode) => {
  setTheme(command)
}
</script>

<style scoped lang="scss">
.theme-switcher {
  .theme-button {
    color: var(--text-regular);
    
    &:hover {
      color: var(--text-primary);
      background-color: var(--bg-color-page);
    }
  }
}

:deep(.el-dropdown-menu__item) {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  
  .theme-icon {
    font-size: 16px;
    color: var(--text-regular);
  }
  
  .check-icon {
    margin-left: auto;
    color: var(--primary-color);
    font-size: 14px;
  }
  
  &.is-active {
    color: var(--primary-color);
    
    .theme-icon {
      color: var(--primary-color);
    }
  }
  
  &:hover {
    background-color: var(--bg-color-page);
  }
}
</style>
import { computed } from 'vue'
import { useThemeStore } from '@/stores/theme'
import type { ThemeMode } from '@/stores/theme'

export const useTheme = () => {
  const themeStore = useThemeStore()

  // 计算属性
  const isDark = computed(() => themeStore.isDark)
  const mode = computed(() => themeStore.mode)
  
  // 主题选项
  const themeOptions = [
    { value: 'light', label: '浅色主题', icon: 'Sunny' },
    { value: 'dark', label: '深色主题', icon: 'Moon' },
    { value: 'auto', label: '跟随系统', icon: 'Monitor' }
  ] as const

  // 获取当前主题选项
  const currentThemeOption = computed(() => {
    return themeOptions.find(option => option.value === mode.value) || themeOptions[0]
  })

  // 方法
  const setTheme = (newMode: ThemeMode) => {
    themeStore.setTheme(newMode)
  }

  const toggleTheme = () => {
    themeStore.toggleTheme()
  }

  // 初始化主题
  const initTheme = () => {
    themeStore.loadTheme()
    return themeStore.setupSystemThemeListener()
  }

  return {
    isDark,
    mode,
    themeOptions,
    currentThemeOption,
    setTheme,
    toggleTheme,
    initTheme
  }
}
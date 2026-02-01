import { defineStore } from 'pinia'
import { ref, watch } from 'vue'

export type ThemeMode = 'light' | 'dark' | 'auto'

export const useThemeStore = defineStore('theme', () => {
  // 状态
  const mode = ref<ThemeMode>('light')
  const isDark = ref(false)

  // 从本地存储加载主题设置
  const loadTheme = () => {
    const savedTheme = localStorage.getItem('theme-mode') as ThemeMode
    if (savedTheme && ['light', 'dark', 'auto'].includes(savedTheme)) {
      mode.value = savedTheme
    }
    updateTheme()
  }

  // 更新主题
  const updateTheme = () => {
    let shouldBeDark = false

    if (mode.value === 'dark') {
      shouldBeDark = true
    } else if (mode.value === 'auto') {
      // 检查系统主题偏好
      shouldBeDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    }

    isDark.value = shouldBeDark
    
    // 更新HTML类名
    const html = document.documentElement
    if (shouldBeDark) {
      html.classList.add('dark')
    } else {
      html.classList.remove('dark')
    }

    // 保存到本地存储
    localStorage.setItem('theme-mode', mode.value)
  }

  // 切换主题模式
  const setTheme = (newMode: ThemeMode) => {
    mode.value = newMode
    updateTheme()
  }

  // 切换深色/浅色主题
  const toggleTheme = () => {
    const newMode = isDark.value ? 'light' : 'dark'
    setTheme(newMode)
  }

  // 监听系统主题变化
  const setupSystemThemeListener = () => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    
    const handleChange = () => {
      if (mode.value === 'auto') {
        updateTheme()
      }
    }

    mediaQuery.addEventListener('change', handleChange)
    
    // 返回清理函数
    return () => {
      mediaQuery.removeEventListener('change', handleChange)
    }
  }

  // 监听模式变化
  watch(mode, updateTheme)

  return {
    mode,
    isDark,
    loadTheme,
    setTheme,
    toggleTheme,
    setupSystemThemeListener,
    updateTheme
  }
})
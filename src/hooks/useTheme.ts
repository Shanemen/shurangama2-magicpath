import { useState, useEffect, useCallback } from 'react'

export type ThemeMode = 'light' | 'dark'

interface UseThemeReturn {
  themeMode: ThemeMode
  isDarkMode: boolean
  setThemeMode: (mode: ThemeMode) => void
  toggleTheme: () => void
}

export function useTheme(): UseThemeReturn {
  // 获取系统主题偏好
  const getSystemPreference = useCallback((): boolean => {
    if (typeof window === 'undefined') return false
    return window.matchMedia('(prefers-color-scheme: dark)').matches
  }, [])

  // 从 localStorage 读取保存的主题设置，如果没有则使用系统偏好
  const [themeMode, setThemeModeState] = useState<ThemeMode>(() => {
    if (typeof window === 'undefined') return 'dark'
    
    const saved = localStorage.getItem('theme-mode')
    if (saved && ['light', 'dark'].includes(saved)) {
      return saved as ThemeMode
    }
    
    // 如果没有保存的设置，使用系统偏好
    return getSystemPreference() ? 'dark' : 'light'
  })

  // 计算当前是否应该使用暗色模式
  const isDarkMode = themeMode === 'dark'

  // 更新主题模式
  const setThemeMode = useCallback((mode: ThemeMode) => {
    setThemeModeState(mode)
    
    // 保存到 localStorage
    localStorage.setItem('theme-mode', mode)
  }, [])

  // 在dark和light之间切换
  const toggleTheme = useCallback(() => {
    setThemeMode(themeMode === 'dark' ? 'light' : 'dark')
  }, [themeMode, setThemeMode])

  return {
    themeMode,
    isDarkMode,
    setThemeMode,
    toggleTheme
  }
} 
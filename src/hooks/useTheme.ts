import { useState, useEffect, useCallback } from 'react'

export type ThemeMode = 'system' | 'light' | 'dark'

interface UseThemeReturn {
  themeMode: ThemeMode
  isDarkMode: boolean
  setThemeMode: (mode: ThemeMode) => void
  toggleTheme: () => void
}

export function useTheme(): UseThemeReturn {
  // 从 localStorage 读取保存的主题设置，默认为 'system'
  const [themeMode, setThemeModeState] = useState<ThemeMode>(() => {
    if (typeof window === 'undefined') return 'system'
    
    const saved = localStorage.getItem('theme-mode')
    if (saved && ['system', 'light', 'dark'].includes(saved)) {
      return saved as ThemeMode
    }
    return 'system'
  })

  // 获取系统主题偏好
  const getSystemPreference = useCallback((): boolean => {
    if (typeof window === 'undefined') return false
    return window.matchMedia('(prefers-color-scheme: dark)').matches
  }, [])

  // 计算当前是否应该使用暗色模式
  const [isDarkMode, setIsDarkMode] = useState(() => {
    if (themeMode === 'system') {
      return getSystemPreference()
    }
    return themeMode === 'dark'
  })

  // 监听系统主题变化
  useEffect(() => {
    if (typeof window === 'undefined') return

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    
    const handleChange = (e: MediaQueryListEvent) => {
      if (themeMode === 'system') {
        setIsDarkMode(e.matches)
      }
    }

    // 添加监听器
    mediaQuery.addEventListener('change', handleChange)

    // 清理监听器
    return () => mediaQuery.removeEventListener('change', handleChange)
  }, [themeMode])

  // 更新主题模式
  const setThemeMode = useCallback((mode: ThemeMode) => {
    setThemeModeState(mode)
    
    // 保存到 localStorage
    localStorage.setItem('theme-mode', mode)
    
    // 立即更新 isDarkMode
    if (mode === 'system') {
      setIsDarkMode(getSystemPreference())
    } else {
      setIsDarkMode(mode === 'dark')
    }
  }, [getSystemPreference])

  // 循环切换主题：system -> light -> dark -> system
  const toggleTheme = useCallback(() => {
    const modes: ThemeMode[] = ['system', 'light', 'dark']
    const currentIndex = modes.indexOf(themeMode)
    const nextIndex = (currentIndex + 1) % modes.length
    setThemeMode(modes[nextIndex])
  }, [themeMode, setThemeMode])

  // 初始化时根据 themeMode 设置 isDarkMode
  useEffect(() => {
    if (themeMode === 'system') {
      setIsDarkMode(getSystemPreference())
    } else {
      setIsDarkMode(themeMode === 'dark')
    }
  }, [themeMode, getSystemPreference])

  return {
    themeMode,
    isDarkMode,
    setThemeMode,
    toggleTheme
  }
} 
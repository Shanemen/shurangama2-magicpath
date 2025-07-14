import React, { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'
import { type ScriptureContent } from '@/lib/supabase'

interface ScriptureContentProps {
  content: ScriptureContent | null
  nodeTitle?: string
  isVisible: boolean
  onClose: () => void
  className?: string
}

export default function ScriptureContentDisplay({
  content,
  nodeTitle,
  isVisible,
  onClose,
  className
}: ScriptureContentProps) {
  const [position, setPosition] = useState({ x: 400, y: 100 })

  // 计算显示位置 - 基于屏幕右侧
  useEffect(() => {
    if (isVisible) {
      const windowWidth = window.innerWidth
      const windowHeight = window.innerHeight
      const cardWidth = 320 // w-80 = 320px
      const cardHeight = 384 // max-h-96 = 384px
      
      // 默认显示在右侧，留出一些边距
      const defaultX = windowWidth - cardWidth - 40
      const defaultY = Math.max(20, (windowHeight - cardHeight) / 2)
      
      setPosition({ x: defaultX, y: defaultY })
    }
  }, [isVisible])

  return (
    <AnimatePresence>
      {content && isVisible && (
        <motion.div
          initial={{ opacity: 0, x: 20, scale: 0.95 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          exit={{ opacity: 0, x: 20, scale: 0.95 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className={cn(
            "fixed z-50 w-80 max-h-96 overflow-y-auto",
            // 与节点相同的视觉风格 - 琥珀色主题
            "bg-gradient-to-br from-amber-50/95 to-orange-50/95",
            "dark:from-amber-950/95 dark:to-orange-950/95",
            "backdrop-blur-sm shadow-xl",
            "rounded-xl p-5",
            // 无边框设计，但保持优雅的视觉层次
            "border-0",
            // 添加微妙的内阴影效果
            "shadow-inner",
            className
          )}
          style={{
            left: position.x,
            top: position.y,
          }}
        >
          {/* 连接线指示器 - 指向左侧 */}
          <div className="absolute -left-3 top-6 w-3 h-0.5 bg-amber-400 dark:bg-amber-500 rounded-full"></div>
          
          {/* 经文内容 */}
          <div className="space-y-4">
            {/* 标题（可选） */}
            {nodeTitle && (
              <div className="text-sm font-medium text-amber-800 dark:text-amber-200 opacity-90 pb-2 border-b border-amber-200/50 dark:border-amber-700/50">
                {nodeTitle}
              </div>
            )}
            
            {/* 原文显示区域 */}
            <div className="relative">
              {/* 装饰性引号 - 更精致的样式 */}
              <div className="absolute -top-2 -left-2 text-3xl text-amber-300/70 dark:text-amber-600/70 font-serif leading-none">
                "
              </div>
              <div className="absolute -bottom-3 -right-2 text-3xl text-amber-300/70 dark:text-amber-600/70 font-serif leading-none">
                "
              </div>
              
              {/* 原文内容 */}
              <div className="relative bg-white/30 dark:bg-amber-900/20 rounded-lg p-4">
                <p className="text-base leading-relaxed text-amber-900 dark:text-amber-100 font-serif px-2">
                  {content.original_text}
                </p>
              </div>
            </div>
            
            {/* 底部信息 */}
            <div className="flex justify-between items-center text-xs text-amber-600/80 dark:text-amber-400/80 pt-3 border-t border-amber-200/30 dark:border-amber-700/30">
              <span>序号: {content.content_order}</span>
              <span className="opacity-60">
                {new Date(content.created_at).toLocaleDateString('zh-CN')}
              </span>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
} 
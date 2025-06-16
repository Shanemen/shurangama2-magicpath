import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'
import { ScrollText, BookOpen, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
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
  return (
    <AnimatePresence>
      {content && isVisible && (
        <>
          {/* 背景遮罩 */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
            onClick={onClose}
          />
          
          {/* 弹窗内容 */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className={cn(
              "fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2",
              "w-full max-w-2xl max-h-[80vh] overflow-hidden",
              "bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950 dark:to-orange-950",
              "border-2 border-amber-200 dark:border-amber-800",
              "rounded-2xl shadow-2xl backdrop-blur-sm",
              "z-50",
              className
            )}
          >

        {/* 头部 */}
        <div className="flex items-center justify-between p-6 border-b border-amber-200 dark:border-amber-800">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-amber-100 dark:bg-amber-900 rounded-lg">
              <ScrollText className="h-5 w-5 text-amber-600 dark:text-amber-400" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-amber-900 dark:text-amber-100">
                经文内容
              </h3>
              {nodeTitle && (
                <p className="text-sm text-amber-700 dark:text-amber-300">
                  {nodeTitle}
                </p>
              )}
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="text-amber-600 hover:text-amber-800 hover:bg-amber-100 dark:text-amber-400 dark:hover:text-amber-200 dark:hover:bg-amber-900"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* 经文内容 */}
        <div className="p-6 overflow-y-auto max-h-[60vh]">
          <div className="space-y-4">
            {/* 原文 */}
            <div className="relative">
              <div className="flex items-center gap-2 mb-3">
                <BookOpen className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                <span className="text-sm font-medium text-amber-800 dark:text-amber-200">
                  原文
                </span>
              </div>
              <div className="relative p-4 bg-white/50 dark:bg-amber-950/50 rounded-lg border border-amber-200 dark:border-amber-800">
                {/* 装饰性引号 */}
                <div className="absolute top-2 left-2 text-3xl text-amber-300 dark:text-amber-700 font-serif">
                  "
                </div>
                <div className="absolute bottom-2 right-2 text-3xl text-amber-300 dark:text-amber-700 font-serif">
                  "
                </div>
                
                <p className="text-lg leading-relaxed text-amber-900 dark:text-amber-100 font-serif px-6 py-2">
                  {content.original_text}
                </p>
              </div>
            </div>

            {/* 白话文（如果有的话） */}
            {content.simplified_text && (
              <div className="relative">
                <div className="flex items-center gap-2 mb-3">
                  <BookOpen className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                  <span className="text-sm font-medium text-amber-800 dark:text-amber-200">
                    白话文
                  </span>
                </div>
                <div className="p-4 bg-amber-100/50 dark:bg-amber-900/30 rounded-lg border border-amber-200 dark:border-amber-800">
                  <p className="text-base leading-relaxed text-amber-800 dark:text-amber-200">
                    {content.simplified_text}
                  </p>
                </div>
              </div>
            )}

            {/* 内容信息 */}
            <div className="flex items-center justify-between pt-4 border-t border-amber-200 dark:border-amber-800">
              <div className="text-xs text-amber-600 dark:text-amber-400">
                内容序号: {content.content_order}
              </div>
              <div className="text-xs text-amber-600 dark:text-amber-400">
                {new Date(content.created_at).toLocaleDateString('zh-CN')}
              </div>
            </div>
          </div>
        </div>

        {/* 底部操作区 */}
        <div className="flex justify-end gap-3 p-6 border-t border-amber-200 dark:border-amber-800 bg-amber-50/50 dark:bg-amber-950/50">
          <Button
            variant="outline"
            onClick={onClose}
            className="border-amber-300 text-amber-700 hover:bg-amber-100 dark:border-amber-700 dark:text-amber-300 dark:hover:bg-amber-900"
          >
            关闭
          </Button>
        </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
} 
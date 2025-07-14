import { createClient } from '@supabase/supabase-js'

// 使用环境变量而不是硬编码凭据
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// 如果环境变量不存在，创建一个虚拟的客户端（仅用于类型安全）
// 实际的数据获取逻辑会在useScriptureData中检查环境变量
export const supabase = supabaseUrl && supabaseAnonKey 
  ? createClient(supabaseUrl, supabaseAnonKey)
  : createClient('https://dummy.supabase.co', 'dummy-key')

// 数据库类型定义
export interface ScriptureNode {
  id: string
  parent_id: string | null
  title: string
  description: string | null
  order_index: number
  has_content: boolean
  created_at: string
  updated_at: string
}

export interface ScriptureContent {
  id: string
  node_id: string
  original_text: string
  simplified_text: string | null
  content_order: number
  created_at: string
}

export interface Commentary {
  id: string
  node_id: string
  content: string
  author: '圆瑛法师' | 'Claude'
  commentary_type: 'interpretation' | 'ai_analysis'
  created_at: string
}

// 转换为前端使用的MindMapNode格式
export interface MindMapNodeWithContent {
  id: string
  title: string
  pageRef?: string
  lectureNumber?: number
  children?: MindMapNodeWithContent[]
  isExpanded?: boolean
  content?: {
    original_text: string
    simplified_text?: string
  }
  commentaries?: Commentary[]
  isScriptureNode?: boolean // 标识是否为经文节点
} 
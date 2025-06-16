import { useState, useEffect, useCallback } from 'react'
import { supabase, type ScriptureNode, type ScriptureContent, type Commentary, type MindMapNodeWithContent } from '../lib/supabase'

interface UseScriptureDataReturn {
  // 核心数据
  data: MindMapNodeWithContent[]
  loading: boolean
  error: string | null
  
  // 节点联动 - 当前选中的节点详情
  selectedNode: MindMapNodeWithContent | null
  selectedNodeContent: ScriptureContent | null
  selectedNodeCommentaries: Commentary[]
  loadingCommentaries: boolean
  
  // 搜索功能
  searchResults: MindMapNodeWithContent[]
  searchLoading: boolean
  
  // 操作函数
  refetch: () => void
  selectNode: (nodeId: string) => void
  loadNodeCommentaries: (nodeId: string) => Promise<void>
  searchNodes: (query: string) => Promise<void>
  clearSearch: () => void
}

export function useScriptureData(): UseScriptureDataReturn {
  // 核心状态
  const [data, setData] = useState<MindMapNodeWithContent[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  // 节点选择状态
  const [selectedNode, setSelectedNode] = useState<MindMapNodeWithContent | null>(null)
  const [selectedNodeContent, setSelectedNodeContent] = useState<ScriptureContent | null>(null)
  const [selectedNodeCommentaries, setSelectedNodeCommentaries] = useState<Commentary[]>([])
  const [loadingCommentaries, setLoadingCommentaries] = useState(false)
  
  // 搜索状态
  const [searchResults, setSearchResults] = useState<MindMapNodeWithContent[]>([])
  const [searchLoading, setSearchLoading] = useState(false)
  
  // 保存所有节点的扁平映射，便于查找
  const [nodeMap, setNodeMap] = useState<Map<string, MindMapNodeWithContent>>(new Map())

  // 将扁平的数据库记录转换为树形结构
  const buildTree = useCallback((nodes: ScriptureNode[], contents: ScriptureContent[]): MindMapNodeWithContent[] => {
    // 创建内容查找映射
    const contentMap = new Map<string, ScriptureContent>()
    contents.forEach(content => {
      // 只保存主要内容 (content_order = 1)
      if (content.content_order === 1) {
        contentMap.set(content.node_id, content)
      }
    })

    // 递归构建树
    const buildNodeTree = (parentId: string | null): MindMapNodeWithContent[] => {
      return nodes
        .filter(node => node.parent_id === parentId)
        .sort((a, b) => a.order_index - b.order_index)
        .map(node => {
          const content = contentMap.get(node.id)
          
          const mindMapNode: MindMapNodeWithContent = {
            id: node.id,
            title: node.title,
            // 只有有内容的节点才显示页码和讲次
            pageRef: node.has_content && content ? `P.${Math.floor(Math.random() * 500) + 1}` : undefined,
            lectureNumber: node.has_content && content ? Math.floor(Math.random() * 50) + 1 : undefined,
            children: buildNodeTree(node.id),
            isExpanded: !node.parent_id, // 只有根节点默认展开
            content: content ? {
              original_text: content.original_text,
              simplified_text: content.simplified_text || undefined
            } : undefined
          }

          return mindMapNode
        })
    }

    const tree = buildNodeTree(null)
    
    // 同时建立扁平映射便于搜索和查找
    const flatMap = new Map<string, MindMapNodeWithContent>()
    const flattenTree = (nodes: MindMapNodeWithContent[]) => {
      nodes.forEach(node => {
        flatMap.set(node.id, node)
        if (node.children) {
          flattenTree(node.children)
        }
      })
    }
    flattenTree(tree)
    setNodeMap(flatMap)

    return tree
  }, [])

  // 获取数据的函数
  const fetchData = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)

      console.log('🔍 开始获取楞严经数据...')

      // 并行获取节点和内容数据
      const [nodesResult, contentsResult] = await Promise.all([
        supabase
          .from('scripture_nodes')
          .select('*')
          .order('order_index'),
        supabase
          .from('scripture_content')
          .select('*')
          .order('content_order')
      ])

      if (nodesResult.error) throw nodesResult.error
      if (contentsResult.error) throw contentsResult.error

      const nodes = nodesResult.data || []
      const contents = contentsResult.data || []

      console.log(`📊 获取到 ${nodes.length} 个节点，${contents.length} 段内容`)

      // 构建树形结构
      const treeData = buildTree(nodes, contents)
      setData(treeData)

      console.log('✅ 数据处理完成！', treeData)

    } catch (err) {
      console.error('❌ 获取数据失败:', err)
      setError(err instanceof Error ? err.message : '获取数据失败')
    } finally {
      setLoading(false)
    }
  }, [buildTree])

  // 选择节点 - 如果节点有内容，同时获取内容详情
  const selectNode = useCallback(async (nodeId: string) => {
    console.log('🎯 selectNode 被调用，nodeId:', nodeId)
    const node = nodeMap.get(nodeId)
    if (!node) {
      console.log('❌ 找不到节点:', nodeId)
      return
    }

    console.log('🎯 选择节点:', node.title, '有内容:', !!node.content)
    console.log('🔍 节点详情:', node)
    
    setSelectedNode(node)
    setSelectedNodeCommentaries([]) // 清空之前的注解

    // 如果节点有内容，获取完整的内容信息
    if (node.content) {
      console.log('📖 节点有内容，开始获取详细内容...')
      try {
        const { data: content, error } = await supabase
          .from('scripture_content')
          .select('*')
          .eq('node_id', nodeId)
          .eq('content_order', 1)
          .single()

        if (error) {
          console.error('❌ 数据库查询错误:', error)
          throw error
        }
        
        console.log('📖 获取到经文内容:', content)
        console.log('📖 设置 selectedNodeContent...')
        setSelectedNodeContent(content)
        console.log('✅ selectedNodeContent 已设置')
      } catch (err) {
        console.error('❌ 获取节点内容失败:', err)
        setSelectedNodeContent(null)
      }
    } else {
      console.log('📝 节点无内容，清空 selectedNodeContent')
      setSelectedNodeContent(null)
    }
  }, [nodeMap])

  // 加载节点注解 - 只有用户点击"解释"时才调用
  const loadNodeCommentaries = useCallback(async (nodeId: string) => {
    try {
      setLoadingCommentaries(true)
      
      const { data: commentaries, error } = await supabase
        .from('commentaries')
        .select('*')
        .eq('node_id', nodeId)
        .order('created_at')

      if (error) throw error
      
      setSelectedNodeCommentaries(commentaries || [])
      console.log(`📝 加载了 ${commentaries?.length || 0} 条注解`)
      
    } catch (err) {
      console.error('❌ 加载注解失败:', err)
      setSelectedNodeCommentaries([])
    } finally {
      setLoadingCommentaries(false)
    }
  }, [])

  // 搜索节点 - 支持标题和内容搜索
  const searchNodes = useCallback(async (query: string) => {
    if (!query.trim()) {
      setSearchResults([])
      return
    }

    try {
      setSearchLoading(true)
      
      // 在节点标题中搜索
      const { data: matchingNodes, error: nodesError } = await supabase
        .from('scripture_nodes')
        .select('*')
        .ilike('title', `%${query}%`)

      if (nodesError) throw nodesError

      // 在经文内容中搜索
      const { data: matchingContents, error: contentsError } = await supabase
        .from('scripture_content')
        .select('node_id, original_text')
        .ilike('original_text', `%${query}%`)

      if (contentsError) throw contentsError

      // 合并搜索结果
      const matchingNodeIds = new Set([
        ...(matchingNodes || []).map(n => n.id),
        ...(matchingContents || []).map(c => c.node_id)
      ])

      // 从缓存的nodeMap中获取对应的节点
      const results = Array.from(matchingNodeIds)
        .map(id => nodeMap.get(id))
        .filter((node): node is MindMapNodeWithContent => node !== undefined)

      setSearchResults(results)
      console.log(`🔍 找到 ${results.length} 个匹配结果`)

    } catch (err) {
      console.error('❌ 搜索失败:', err)
      setSearchResults([])
    } finally {
      setSearchLoading(false)
    }
  }, [nodeMap])

  // 清空搜索
  const clearSearch = useCallback(() => {
    setSearchResults([])
  }, [])

  // refetch函数
  const refetch = useCallback(() => {
    fetchData()
  }, [fetchData])

  // 组件挂载时获取数据
  useEffect(() => {
    fetchData()
  }, [fetchData])

  // 调试：监听 selectedNodeContent 变化
  useEffect(() => {
    console.log('🔄 selectedNodeContent 状态变化:', selectedNodeContent)
  }, [selectedNodeContent])

  return {
    // 核心数据
    data,
    loading,
    error,
    
    // 节点联动
    selectedNode,
    selectedNodeContent,
    selectedNodeCommentaries,
    loadingCommentaries,
    
    // 搜索功能
    searchResults,
    searchLoading,
    
    // 操作函数
    refetch,
    selectNode,
    loadNodeCommentaries,
    searchNodes,
    clearSearch
  }
} 
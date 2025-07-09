// 楞严经数据导入脚本
// 将JSON结构化数据批量导入到Supabase

import { createClient } from '@supabase/supabase-js'
import fs from 'fs'
import path from 'path'

// Supabase配置 - 请替换为您的实际配置
const supabaseUrl = 'YOUR_SUPABASE_URL'
const supabaseKey = 'YOUR_SUPABASE_ANON_KEY'
const supabase = createClient(supabaseUrl, supabaseKey)

// 读取JSON数据
const dataPath = path.join(process.cwd(), 'scripture-data-sample.json')
const scriptureData = JSON.parse(fs.readFileSync(dataPath, 'utf8'))

/**
 * 递归导入节点数据
 * @param {Object} nodeData - 节点数据
 * @param {string|null} parentId - 父节点ID
 * @returns {Promise<string>} 返回创建的节点ID
 */
async function importNode(nodeData, parentId = null) {
  try {
    // 1. 创建节点
    const { data: node, error: nodeError } = await supabase
      .from('scripture_nodes')
      .insert({
        title: nodeData.title,
        description: nodeData.description,
        order_index: nodeData.order_index,
        has_content: nodeData.has_content || false,
        parent_id: parentId
      })
      .select()
      .single()

    if (nodeError) {
      console.error('节点创建失败:', nodeError)
      throw nodeError
    }

    console.log(`✅ 创建节点: ${nodeData.title} (ID: ${node.id})`)

    // 2. 如果有经文内容，创建内容记录
    if (nodeData.has_content && nodeData.content) {
      const { error: contentError } = await supabase
        .from('scripture_content')
        .insert({
          node_id: node.id,
          original_text: nodeData.content.original_text,
          simplified_text: nodeData.content.simplified_text || null,
          content_order: 1
        })

      if (contentError) {
        console.error('内容创建失败:', contentError)
        throw contentError
      }

      console.log(`📝 添加经文内容: ${nodeData.content.original_text.substring(0, 20)}...`)
    }

    // 3. 递归导入子节点
    if (nodeData.children && nodeData.children.length > 0) {
      for (const child of nodeData.children) {
        await importNode(child, node.id)
      }
    }

    return node.id

  } catch (error) {
    console.error(`❌ 导入节点失败: ${nodeData.title}`, error)
    throw error
  }
}

/**
 * 清理现有数据（可选）
 */
async function clearExistingData() {
  const confirm = process.argv.includes('--clear')
  
  if (confirm) {
    console.log('🗑️ 清理现有数据...')
    
    // 按依赖顺序删除
    await supabase.from('user_progress').delete().neq('id', '00000000-0000-0000-0000-000000000000')
    await supabase.from('commentaries').delete().neq('id', '00000000-0000-0000-0000-000000000000')
    await supabase.from('scripture_content').delete().neq('id', '00000000-0000-0000-0000-000000000000')
    await supabase.from('scripture_nodes').delete().neq('id', '00000000-0000-0000-0000-000000000000')
    
    console.log('✅ 数据清理完成')
  }
}

/**
 * 主导入函数
 */
async function main() {
  try {
    console.log('🚀 开始导入楞严经数据...')
    console.log('=' * 50)
    
    // 可选：清理现有数据
    await clearExistingData()
    
    // 导入数据
    const rootId = await importNode(scriptureData)
    
    console.log('=' * 50)
    console.log(`🎉 导入完成！根节点ID: ${rootId}`)
    
    // 验证导入结果
    const { data: nodeCount } = await supabase
      .from('scripture_nodes')
      .select('id', { count: 'exact' })
    
    const { data: contentCount } = await supabase
      .from('scripture_content')
      .select('id', { count: 'exact' })
    
    console.log(`📊 统计: ${nodeCount?.length || 0} 个节点, ${contentCount?.length || 0} 段经文`)
    
  } catch (error) {
    console.error('❌ 导入失败:', error)
    process.exit(1)
  }
}

// 执行导入
main()

// 使用说明
console.log(`
📋 使用说明:
1. 修改脚本中的 Supabase 配置
2. 运行: node import-scripture-data.js
3. 清理重新导入: node import-scripture-data.js --clear

⚠️  注意: 
- 确保已在 Supabase 中执行了 schema SQL
- --clear 选项会删除所有现有数据
`)
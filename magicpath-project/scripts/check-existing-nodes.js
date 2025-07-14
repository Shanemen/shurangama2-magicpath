import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

// 加载环境变量
dotenv.config({ path: '.env.local' })

const supabaseUrl = process.env.VITE_SUPABASE_URL
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ 缺少 Supabase 环境变量')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

async function checkExistingNodes() {
  try {
    console.log('🔍 检查现有节点数据...\n')
    
    // 获取所有节点
    const { data: nodes, error } = await supabase
      .from('scripture_nodes')
      .select('*')
      .order('parent_id', { nullsFirst: true })
      .order('order_index')
    
    if (error) throw error
    
    console.log(`📊 总共找到 ${nodes.length} 个节点\n`)
    
    // 按 parent_id 分组显示
    const groupedNodes = {}
    nodes.forEach(node => {
      const parentKey = node.parent_id || 'ROOT'
      if (!groupedNodes[parentKey]) {
        groupedNodes[parentKey] = []
      }
      groupedNodes[parentKey].push(node)
    })
    
    // 显示每个父节点下的子节点
    Object.keys(groupedNodes).forEach(parentId => {
      const children = groupedNodes[parentId]
      console.log(`📁 Parent ID: ${parentId}`)
      children.forEach(child => {
        console.log(`   ├── ${child.title} (id: ${child.id}, order: ${child.order_index})`)
      })
      console.log()
    })
    
    // 检查是否有重复的 parent_id + order_index 组合
    console.log('🔍 检查重复的 parent_id + order_index 组合...')
    const combinations = new Map()
    let hasDuplicates = false
    
    nodes.forEach(node => {
      const key = `${node.parent_id || 'null'}_${node.order_index}`
      if (combinations.has(key)) {
        console.log(`❌ 发现重复: parent_id=${node.parent_id}, order_index=${node.order_index}`)
        console.log(`   节点1: ${combinations.get(key).title}`)
        console.log(`   节点2: ${node.title}`)
        hasDuplicates = true
      } else {
        combinations.set(key, node)
      }
    })
    
    if (!hasDuplicates) {
      console.log('✅ 没有发现重复的组合')
    }
    
    // 显示根节点的 ID，方便添加子节点
    const rootNode = nodes.find(n => n.parent_id === null)
    if (rootNode) {
      console.log(`\n📌 根节点信息:`)
      console.log(`   ID: ${rootNode.id}`)
      console.log(`   标题: ${rootNode.title}`)
      console.log(`\n💡 添加子节点时，请使用 parent_id: "${rootNode.id}"`)
    }
    
  } catch (error) {
    console.error('❌ 检查失败:', error.message)
  }
}

checkExistingNodes() 
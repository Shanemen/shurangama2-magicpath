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

async function checkData() {
  try {
    console.log('🔍 检查数据库状态...\n')
    
    // 检查节点数据
    const { data: nodes, error: nodesError } = await supabase
      .from('scripture_nodes')
      .select('*')
      .order('parent_id', { nullsFirst: true })
      .order('order_index')
    
    if (nodesError) throw nodesError
    
    console.log(`📊 节点数据: ${nodes.length} 个节点`)
    nodes.forEach(node => {
      console.log(`  - ${node.title} (ID: ${node.id.substring(0, 8)}..., parent: ${node.parent_id ? node.parent_id.substring(0, 8) + '...' : 'null'}, has_content: ${node.has_content})`)
    })
    
    // 检查经文内容数据
    const { data: contents, error: contentsError } = await supabase
      .from('scripture_content')
      .select('*')
      .order('content_order')
    
    if (contentsError) throw contentsError
    
    console.log(`\n📖 经文内容: ${contents.length} 条记录`)
    contents.forEach(content => {
      console.log(`  - 节点ID: ${content.node_id.substring(0, 8)}..., 内容: "${content.original_text.substring(0, 30)}..."`)
    })
    
    // 检查节点和内容的关联
    console.log('\n🔗 节点与内容关联检查:')
    for (const node of nodes) {
      if (node.has_content) {
        const nodeContent = contents.find(c => c.node_id === node.id)
        if (nodeContent) {
          console.log(`  ✅ ${node.title} 有对应的经文内容`)
        } else {
          console.log(`  ❌ ${node.title} 标记有内容但找不到对应的经文记录`)
        }
      }
    }
    
  } catch (error) {
    console.error('❌ 检查失败:', error.message)
  }
}

checkData() 
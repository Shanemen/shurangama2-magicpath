import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

dotenv.config({ path: '.env.local' })

const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY)

async function testDataLoading() {
  console.log('🔍 测试数据加载功能...\n')

  try {
    // 1. 测试节点数据加载
    console.log('1️⃣ 测试节点数据加载...')
    const { data: nodes, error: nodesError } = await supabase
      .from('scripture_nodes')
      .select('*')
      .order('order_index')
    
    if (nodesError) throw nodesError
    
    console.log(`✅ 加载了 ${nodes.length} 个节点`)
    const contentNodes = nodes.filter(n => n.has_content)
    console.log(`📖 其中 ${contentNodes.length} 个节点有内容:`)
    contentNodes.forEach(node => {
      console.log(`   - ${node.title} (ID: ${node.id})`)
    })

    // 2. 测试经文内容加载
    console.log('\n2️⃣ 测试经文内容加载...')
    const { data: contents, error: contentsError } = await supabase
      .from('scripture_content')
      .select('*')
      .order('content_order')
    
    if (contentsError) throw contentsError
    
    console.log(`✅ 加载了 ${contents.length} 条经文内容`)
    contents.forEach(content => {
      console.log(`   - 节点ID: ${content.node_id.substring(0, 8)}...`)
      console.log(`     内容: "${content.original_text.substring(0, 50)}..."`)
    })

    // 3. 测试注释数据加载
    console.log('\n3️⃣ 测试注释数据加载...')
    const { data: commentaries, error: commentariesError } = await supabase
      .from('commentaries')
      .select('*')
      .order('created_at')
    
    if (commentariesError) throw commentariesError
    
    console.log(`✅ 加载了 ${commentaries.length} 条注释`)
    commentaries.forEach(commentary => {
      console.log(`   - 作者: ${commentary.author}`)
      console.log(`     节点ID: ${commentary.node_id.substring(0, 8)}...`)
      console.log(`     内容: "${commentary.content.substring(0, 50)}..."`)
      console.log('')
    })

    // 4. 测试完整的数据联动
    console.log('4️⃣ 测试完整的数据联动...')
    if (contentNodes.length > 0) {
      const testNodeId = contentNodes[0].id
      console.log(`🎯 测试节点: ${contentNodes[0].title} (${testNodeId})`)
      
      // 获取节点的经文内容
      const { data: nodeContent, error: nodeContentError } = await supabase
        .from('scripture_content')
        .select('*')
        .eq('node_id', testNodeId)
        .eq('content_order', 1)
        .single()
      
      if (nodeContentError) {
        console.log(`❌ 获取节点内容失败: ${nodeContentError.message}`)
      } else {
        console.log(`✅ 获取节点内容成功: "${nodeContent.original_text.substring(0, 50)}..."`)
      }
      
      // 获取节点的注释
      const { data: nodeCommentaries, error: nodeCommentariesError } = await supabase
        .from('commentaries')
        .select('*')
        .eq('node_id', testNodeId)
        .order('created_at')
      
      if (nodeCommentariesError) {
        console.log(`❌ 获取注释失败: ${nodeCommentariesError.message}`)
      } else {
        console.log(`✅ 获取注释成功: ${nodeCommentaries.length} 条`)
        nodeCommentaries.forEach(commentary => {
          console.log(`   - ${commentary.author}: "${commentary.content.substring(0, 30)}..."`)
        })
      }
    }

    console.log('\n🎉 数据加载测试完成！')
    console.log('\n📖 现在你可以在应用中测试功能:')
    console.log('1. 在浏览器中访问 http://localhost:5173')
    console.log('2. 点击"先明五義"节点')
    console.log('3. 点击经文子节点旁边的💡灯泡图标')
    console.log('4. 查看右侧边栏的注释内容')

  } catch (error) {
    console.error('❌ 测试失败:', error.message)
  }
}

testDataLoading() 
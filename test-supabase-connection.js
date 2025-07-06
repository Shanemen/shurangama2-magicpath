// 测试 Supabase 连接
import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

// 加载环境变量
dotenv.config({ path: '.env.local' })

console.log('🔍 测试 Supabase 连接...\n')

// 显示环境变量
console.log('=== 环境变量检查 ===')
console.log('VITE_SUPABASE_URL:', process.env.VITE_SUPABASE_URL)
console.log('VITE_SUPABASE_ANON_KEY:', process.env.VITE_SUPABASE_ANON_KEY ? '已设置 (长度: ' + process.env.VITE_SUPABASE_ANON_KEY.length + ')' : '未设置')
console.log()

const supabaseUrl = process.env.VITE_SUPABASE_URL
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ 环境变量缺失！')
  console.error('请确保 .env.local 文件包含正确的 VITE_SUPABASE_URL 和 VITE_SUPABASE_ANON_KEY')
  process.exit(1)
}

// 创建客户端
console.log('📡 创建 Supabase 客户端...')
const supabase = createClient(supabaseUrl, supabaseAnonKey)

// 测试连接
async function testConnection() {
  console.log('🔌 测试基本连接...')
  
  try {
    // 测试 1: 检查 scripture_nodes 表
    console.log('1️⃣ 检查 scripture_nodes 表...')
    const { data: nodes, error: nodesError } = await supabase
      .from('scripture_nodes')
      .select('id, title, parent_id')
      .limit(5)
    
    if (nodesError) {
      console.error('❌ 查询 scripture_nodes 失败:', nodesError.message)
      console.error('📋 错误详情:', nodesError)
      return false
    }
    
    console.log('✅ scripture_nodes 表查询成功!')
    console.log('📊 前5个节点:', nodes.map(n => `${n.title} (${n.id})`).join(', '))
    
    // 测试 2: 统计数据
    console.log('\n2️⃣ 统计数据...')
    const { count: nodeCount, error: nodeCountError } = await supabase
      .from('scripture_nodes')
      .select('*', { count: 'exact', head: true })
    
    if (nodeCountError) {
      console.error('❌ 统计节点数量失败:', nodeCountError.message)
    } else {
      console.log(`📊 总节点数: ${nodeCount}`)
    }
    
    console.log('\n🎉 所有测试通过！数据库连接正常！')
    return true
    
  } catch (error) {
    console.error('❌ 连接测试失败:', error)
    return false
  }
}

// 运行测试
testConnection().then(success => {
  if (success) {
    console.log('\n✅ 连接测试完成，数据库工作正常！')
    console.log('🤔 如果应用程序仍然无法连接，可能是浏览器环境变量加载问题')
  } else {
    console.log('\n❌ 连接测试失败！')
    console.log('请检查网络连接和权限设置')
  }
}).catch(console.error) 
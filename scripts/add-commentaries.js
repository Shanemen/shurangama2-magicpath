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

// 示例注解数据
const commentariesData = [
  {
    // 为"先明五義"节点添加圆瑛法师注解
    node_id: 'b8c72921-03f5-44ae-bd9d-db5e81a45f92', // 请替换为实际的节点ID
    content: `「如是我聞，一時，佛在室羅筏城，祇桓精舍」此为证信序，表明阿难亲闻佛说。「如是」二字指所闻之法，「我聞」表阿难亲自听闻。「一時」者，机感相投之時也。「室羅筏城」即舍卫国都城，「祇桓精舍」乃祇陀太子与给孤独长者共建之精舍。

此段开示佛说法之时地人物，建立信心，令后学者知此经非虚构，乃佛亲口所说，阿难亲耳所闻，因缘具足时方说此妙法。学者当以恭敬心受持读诵，方能获得法益。`,
    author: '圆瑛法师',
    commentary_type: 'interpretation'
  },
  {
    // 为"先明五義"节点添加Claude AI分析
    node_id: 'b8c72921-03f5-44ae-bd9d-db5e81a45f92', // 请替换为实际的节点ID
    content: `这段经文采用佛经标准的"六种成就"开头格式，建立了说法的权威性和可信度：

**结构分析：**
- **信成就**："如是" - 确立法的真实性
- **闻成就**："我闻" - 证明传承的可靠性  
- **时成就**："一时" - 表示机缘成熟
- **主成就**："佛" - 说法者的圆满
- **处成就**："室罗筏城，祇桓精舍" - 具体的地理位置

**文学特征：**
经文语言简洁庄重，每个词都承载深层含义。"一时"的使用体现了佛法中时间的相对性概念，暗示了说法时机的重要性。

**修行指导：**
这不仅是历史记录，更是修行的指南 - 提醒我们在合适的时间、地点、以正确的心态来接受法教。`,
    author: 'Claude',
    commentary_type: 'ai_analysis'
  }
];

async function addCommentaries() {
  try {
    console.log('🔍 开始添加注解数据...\n')
    
    // 首先获取有内容的节点ID
    const { data: nodes, error: nodesError } = await supabase
      .from('scripture_nodes')
      .select('id, title')
      .eq('has_content', true)
    
    if (nodesError) throw nodesError
    
    if (nodes.length === 0) {
      console.log('❌ 没有找到有内容的节点，请先添加经文内容')
      return
    }
    
    console.log('📊 找到以下有内容的节点:')
    nodes.forEach(node => {
      console.log(`  - ${node.title} (ID: ${node.id})`)
    })
    
    // 更新注解数据中的node_id为实际的节点ID
    const actualNodeId = nodes[0].id // 使用第一个有内容的节点
    const updatedCommentaries = commentariesData.map(commentary => ({
      ...commentary,
      node_id: actualNodeId
    }))
    
    console.log(`\n💡 将为节点"${nodes[0].title}"添加注解...`)
    
    // 插入注解数据
    const { data, error } = await supabase
      .from('commentaries')
      .insert(updatedCommentaries)
      .select()
    
    if (error) throw error
    
    console.log(`\n✅ 成功添加 ${data.length} 条注解:`)
    data.forEach(commentary => {
      console.log(`  - ${commentary.author}: ${commentary.content.substring(0, 50)}...`)
    })
    
    // 验证数据
    console.log('\n🔍 验证添加的数据...')
    const { data: verifyData, error: verifyError } = await supabase
      .from('commentaries')
      .select('*')
      .eq('node_id', actualNodeId)
    
    if (verifyError) throw verifyError
    
    console.log(`📖 节点"${nodes[0].title}"现在有 ${verifyData.length} 条注解:`)
    verifyData.forEach(commentary => {
      console.log(`  - ${commentary.author} (${commentary.commentary_type})`)
    })
    
  } catch (error) {
    console.error('❌ 添加注解失败:', error.message)
  }
}

// 添加更多节点的注解数据的函数
async function addMoreCommentaries() {
  // 这里可以添加更多节点的注解数据
  // 例如：为其他有内容的节点添加注解
  
  const moreCommentaries = [
    // 可以在这里添加更多注解数据
    // {
    //   node_id: '其他节点ID',
    //   content: '其他注解内容...',
    //   author: '圆瑛法师',
    //   commentary_type: 'interpretation'
    // }
  ];
  
  if (moreCommentaries.length > 0) {
    const { data, error } = await supabase
      .from('commentaries')
      .insert(moreCommentaries)
      .select()
    
    if (error) throw error
    console.log(`✅ 添加了 ${data.length} 条额外注解`)
  }
}

// 执行脚本
addCommentaries() 
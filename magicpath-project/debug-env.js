// 调试环境变量
console.log('=== 环境变量调试 ===')
console.log('VITE_SUPABASE_URL:', import.meta.env.VITE_SUPABASE_URL)
console.log('VITE_SUPABASE_ANON_KEY:', import.meta.env.VITE_SUPABASE_ANON_KEY ? '已设置' : '未设置')
console.log('NODE_ENV:', import.meta.env.NODE_ENV)
console.log('DEV:', import.meta.env.DEV)

// 检查.env.local文件内容
import fs from 'fs'
try {
  const envContent = fs.readFileSync('.env.local', 'utf8')
  console.log('=== .env.local 文件内容 ===')
  console.log(envContent)
} catch (err) {
  console.log('❌ 无法读取 .env.local 文件:', err.message)
} 
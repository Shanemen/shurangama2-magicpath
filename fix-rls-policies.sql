-- 修复 RLS 策略和权限设置
-- 在 Supabase SQL Editor 中执行

-- 1. 启用行级安全
ALTER TABLE scripture_nodes ENABLE ROW LEVEL SECURITY;
ALTER TABLE scripture_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE commentaries ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE search_index ENABLE ROW LEVEL SECURITY;

-- 2. 删除现有策略（如果存在）
DROP POLICY IF EXISTS "Public read scripture nodes" ON scripture_nodes;
DROP POLICY IF EXISTS "Public read scripture content" ON scripture_content;
DROP POLICY IF EXISTS "Public read commentaries" ON commentaries;
DROP POLICY IF EXISTS "Public read search index" ON search_index;
DROP POLICY IF EXISTS "Users manage own progress" ON user_progress;

-- 3. 创建公开读取策略 - 所有经文内容对公众开放
CREATE POLICY "Public read scripture nodes" ON scripture_nodes 
  FOR SELECT USING (true);

CREATE POLICY "Public read scripture content" ON scripture_content 
  FOR SELECT USING (true);

CREATE POLICY "Public read commentaries" ON commentaries 
  FOR SELECT USING (true);

CREATE POLICY "Public read search index" ON search_index 
  FOR SELECT USING (true);

-- 4. 用户只能管理自己的学习进度
CREATE POLICY "Users manage own progress" ON user_progress 
  FOR ALL USING (auth.uid() = user_id);

-- 5. 验证策略是否生效
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual 
FROM pg_policies 
WHERE schemaname = 'public' 
AND tablename IN ('scripture_nodes', 'scripture_content', 'commentaries', 'search_index', 'user_progress'); 
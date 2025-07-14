-- 修复commentaries表的RLS策略
-- 允许公开插入和更新commentaries数据

-- 添加公开插入策略
CREATE POLICY "Public insert commentaries" ON commentaries 
  FOR INSERT 
  WITH CHECK (true);

-- 添加公开更新策略  
CREATE POLICY "Public update commentaries" ON commentaries 
  FOR UPDATE 
  USING (true) 
  WITH CHECK (true);

-- 添加公开删除策略（可选）
CREATE POLICY "Public delete commentaries" ON commentaries 
  FOR DELETE 
  USING (true);

-- 查看当前的策略
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual, with_check
FROM pg_policies 
WHERE tablename = 'commentaries'; 
-- 楞严经科判数据库结构 - 最终版
-- 基于宽谦法师科判体系，圆瑛法师注解，Claude AI分析

-- 1. 科判节点表 (支持无限层级)
CREATE TABLE scripture_nodes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  parent_id UUID REFERENCES scripture_nodes(id) ON DELETE CASCADE,
  
  -- 科判信息
  title TEXT NOT NULL, -- 科判标题，如"序分"、"证信序"、"广列听众"
  description TEXT, -- 可选说明，如"广泛列举在场的听众"
  
  -- 结构信息
  order_index INTEGER NOT NULL, -- 同级排序
  has_content BOOLEAN DEFAULT false, -- 该节点是否包含经文内容
  
  -- 元数据
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- 确保同级节点顺序唯一
  UNIQUE(parent_id, order_index)
);

-- 2. 经文内容表 (挂载在有内容的节点上)
CREATE TABLE scripture_content (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  node_id UUID REFERENCES scripture_nodes(id) ON DELETE CASCADE,
  
  -- 经文内容
  original_text TEXT NOT NULL, -- 原文经文，如"如是我闻，一时，佛在室罗筏城"
  simplified_text TEXT, -- 白话文解释
  
  -- 内容顺序(如果一个节点有多段经文)
  content_order INTEGER DEFAULT 1,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  UNIQUE(node_id, content_order)
);

-- 3. 注释解释表
CREATE TABLE commentaries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  node_id UUID REFERENCES scripture_nodes(id) ON DELETE CASCADE,
  
  -- 注释内容
  content TEXT NOT NULL,
  
  -- 作者分工 (只有两位)
  author TEXT NOT NULL CHECK (author IN ('圆瑛法师', 'Claude')),
  
  -- 注释类型
  commentary_type TEXT DEFAULT 'explanation' CHECK (commentary_type IN (
    'interpretation', -- 圆瑛法师的经文注解
    'ai_analysis'     -- Claude的AI分析
  )),
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. 用户学习进度表
CREATE TABLE user_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID, 
  node_id UUID REFERENCES scripture_nodes(id) ON DELETE CASCADE,
  
  -- 学习状态
  is_read BOOLEAN DEFAULT false,
  is_bookmarked BOOLEAN DEFAULT false,
  
  -- 用户笔记
  personal_notes TEXT,
  
  -- 时间追踪
  last_accessed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  PRIMARY KEY (user_id, node_id)
);

-- 5. 搜索索引表
CREATE TABLE search_index (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  node_id UUID REFERENCES scripture_nodes(id) ON DELETE CASCADE,
  
  -- 搜索内容 (标题 + 说明 + 经文内容 + 注释内容)
  searchable_text TEXT NOT NULL,
  
  -- 全文搜索向量
  search_vector tsvector GENERATED ALWAYS AS (
    to_tsvector('chinese', searchable_text)
  ) STORED
);

-- 性能优化索引
CREATE INDEX idx_nodes_parent ON scripture_nodes(parent_id);
CREATE INDEX idx_nodes_order ON scripture_nodes(parent_id, order_index);
CREATE INDEX idx_nodes_has_content ON scripture_nodes(has_content) WHERE has_content = true;
CREATE INDEX idx_content_node ON scripture_content(node_id);
CREATE INDEX idx_commentaries_node ON commentaries(node_id);
CREATE INDEX idx_commentaries_author ON commentaries(author);
CREATE INDEX idx_commentaries_type ON commentaries(commentary_type);
CREATE INDEX idx_search_vector ON search_index USING GIN(search_vector);
CREATE INDEX idx_user_progress_user ON user_progress(user_id);

-- 辅助函数：计算节点层级
CREATE OR REPLACE FUNCTION get_node_level(node_uuid UUID)
RETURNS INTEGER AS $$
DECLARE
    level_count INTEGER := 0;
    current_parent UUID;
BEGIN
    current_parent := (SELECT parent_id FROM scripture_nodes WHERE id = node_uuid);
    
    WHILE current_parent IS NOT NULL LOOP
        level_count := level_count + 1;
        current_parent := (SELECT parent_id FROM scripture_nodes WHERE id = current_parent);
    END LOOP;
    
    RETURN level_count;
END;
$$ LANGUAGE plpgsql;

-- 辅助函数：获取节点完整路径
CREATE OR REPLACE FUNCTION get_node_path(node_uuid UUID)
RETURNS TEXT[] AS $$
DECLARE
    path_array TEXT[] := '{}';
    current_node UUID := node_uuid;
    current_title TEXT;
BEGIN
    WHILE current_node IS NOT NULL LOOP
        current_title := (SELECT title FROM scripture_nodes WHERE id = current_node);
        path_array := array_prepend(current_title, path_array);
        current_node := (SELECT parent_id FROM scripture_nodes WHERE id = current_node);
    END LOOP;
    
    RETURN path_array;
END;
$$ LANGUAGE plpgsql;

-- 辅助视图：获取节点的完整信息(包含层级和路径)
CREATE VIEW scripture_nodes_with_metadata AS
SELECT 
    n.*,
    get_node_level(n.id) as level,
    get_node_path(n.id) as path_array,
    array_to_string(get_node_path(n.id), ' > ') as path_string
FROM scripture_nodes n;

-- 辅助视图：获取有内容的节点及其经文
CREATE VIEW nodes_with_content AS
SELECT 
    n.id,
    n.title,
    n.description,
    n.order_index,
    get_node_level(n.id) as level,
    array_to_string(get_node_path(n.id), ' > ') as path_string,
    c.original_text,
    c.simplified_text,
    c.content_order
FROM scripture_nodes n
JOIN scripture_content c ON n.id = c.node_id
WHERE n.has_content = true
ORDER BY n.id, c.content_order;

-- 启用行级安全
ALTER TABLE scripture_nodes ENABLE ROW LEVEL SECURITY;
ALTER TABLE scripture_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE commentaries ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_progress ENABLE ROW LEVEL SECURITY;

-- 公开读取策略 - 所有经文内容对公众开放
CREATE POLICY "Public read scripture nodes" ON scripture_nodes FOR SELECT USING (true);
CREATE POLICY "Public read scripture content" ON scripture_content FOR SELECT USING (true);
CREATE POLICY "Public read commentaries" ON commentaries FOR SELECT USING (true);

-- 用户只能管理自己的学习进度
CREATE POLICY "Users manage own progress" ON user_progress 
  FOR ALL USING (auth.uid() = user_id);

-- 创建初始根节点的函数
CREATE OR REPLACE FUNCTION create_root_node()
RETURNS UUID AS $$
DECLARE
    root_id UUID;
BEGIN
    INSERT INTO scripture_nodes (title, description, order_index, parent_id)
    VALUES ('大佛顶首楞严经', '本经的根节点', 1, NULL)
    RETURNING id INTO root_id;
    
    RETURN root_id;
END;
$$ LANGUAGE plpgsql;
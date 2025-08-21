import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Calendar, Tag, Rose, Sun, Moon, Home, Bird, Search } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Input } from '../ui/input';
import { useTheme } from '@/hooks/useTheme';
import { cn } from '@/lib/utils';

// 模拟博客数据
const mockBlogPosts = [
  {
    id: '1',
    title: '楞严咒的修持心得',
    excerpt: '经过多年的诵持楞严咒，我深深体会到这部咒语的不可思议威力。在日常修行中，楞严咒如同明灯，指引着修行的方向...',
    content: `经过多年的诵持楞严咒，我深深体会到这部咒语的不可思议威力。

在日常修行中，楞严咒如同明灯，指引着修行的方向。每当心境浮躁时，持诵楞严咒能够迅速安定内心，回归清净本性。

## 修持要点

1. **恭敬心** - 以虔诚恭敬的心持诵
2. **专注力** - 保持注意力集中，不让心散乱
3. **持续性** - 每日定时定量，培养习惯

## 个人体悟

持咒过程中，我逐渐明白了楞严经中所说的"狂心若歇，歇即菩提"的深义。真正的修行不在于外相，而在于内心的转化。`,
    topic: '修持心得',
    created_at: '2024-01-15',
    updated_at: '2024-01-15'
  },
  {
    id: '2', 
    title: '五蕴皆空的现代理解',
    excerpt: '色受想行识五蕴，在现代生活中如何理解和应用？通过科学的角度重新审视这一佛教核心概念...',
    content: `色受想行识五蕴，在现代生活中如何理解和应用？

## 现代科学视角

从认知科学的角度看，五蕴的构成正对应了人类意识的不同层面：

- **色蕴** - 物质身体，神经系统的物理基础
- **受蕴** - 感受反应，情绪的神经化学反应
- **想蕴** - 概念思维，大脑皮层的认知处理
- **行蕴** - 意志行为，前额叶的决策机制  
- **识蕴** - 基础意识，整体的意识状态

## 实践应用

在日常生活中观察五蕴的运作，有助于我们：
1. 减少对自我的执著
2. 理解痛苦的根源
3. 培养智慧观照`,
    topic: '智慧开解',
    created_at: '2024-01-10',
    updated_at: '2024-01-10'
  },
  {
    id: '3',
    title: '楞严经中的禅定次第',
    excerpt: '楞严经详细阐述了禅定的不同阶段和修持方法。从初禅到四禅，每个阶段都有其特定的境界和体验...',
    content: `楞严经详细阐述了禅定的不同阶段和修持方法。

## 禅定的重要性

禅定是修行的核心，正如经中所说："若不修禅定，智慧不现前。"

## 修持次第

### 初禅
- 离欲恶不善法
- 心生喜乐
- 有寻有伺

### 二禅  
- 内心寂静
- 无寻无伺
- 定生喜乐

### 三禅
- 离喜妙乐
- 正念正知
- 身心轻安

### 四禅
- 舍念清净
- 不苦不乐
- 心如明镜

## 现代修持建议

1. 从数息开始，培养基础定力
2. 观察身心变化，不执著境界
3. 保持恒心，循序渐进`,
    topic: '禅定修持',
    created_at: '2024-01-05',
    updated_at: '2024-01-05'
  }
];

export default function BlogPage() {
  const navigate = useNavigate();
  const { themeMode, isDarkMode, toggleTheme } = useTheme();
  const [selectedPost, setSelectedPost] = useState<string | null>(null);
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");

  // Apply theme to document - same as main page
  useEffect(() => {
    const root = document.documentElement;
    if (isDarkMode) {
      // DARK MODE
      root.style.setProperty('--background', 'oklch(0.18 0.03 260)');
      root.style.setProperty('--foreground', 'oklch(0.98 0.01 260)');
      root.style.setProperty('--card', 'oklch(0.22 0.03 260)');
      root.style.setProperty('--card-foreground', 'oklch(0.98 0.01 260)');
      root.style.setProperty('--popover', 'oklch(0.22 0.03 260)');
      root.style.setProperty('--popover-foreground', 'oklch(0.98 0.01 260)');
      root.style.setProperty('--primary', 'oklch(0.72 0.16 160)');
      root.style.setProperty('--primary-foreground', 'oklch(0.18 0.03 260)');
      root.style.setProperty('--secondary', 'oklch(0.28 0.02 260)');
      root.style.setProperty('--secondary-foreground', 'oklch(0.98 0.01 260)');
      root.style.setProperty('--muted', 'oklch(0.28 0.02 260)');
      root.style.setProperty('--muted-foreground', 'oklch(0.7 0.01 260)');
      root.style.setProperty('--accent', 'oklch(0.28 0.02 260)');
      root.style.setProperty('--accent-foreground', 'oklch(0.98 0.01 260)');
      root.style.setProperty('--destructive', 'oklch(0.65 0.18 25)');
      root.style.setProperty('--destructive-foreground', 'oklch(0.98 0.01 260)');
      root.style.setProperty('--border', 'oklch(1 0 0 / 12%)');
      root.style.setProperty('--input', 'oklch(1 0 0 / 18%)');
      root.style.setProperty('--ring', 'oklch(0.6 0.01 260)');
      root.classList.add('dark');
    } else {
      // LIGHT MODE
      root.style.setProperty('--background', 'oklch(0.98 0.01 260)');
      root.style.setProperty('--foreground', 'oklch(0.18 0.03 260)');
      root.style.setProperty('--card', 'oklch(1 0 0)');
      root.style.setProperty('--card-foreground', 'oklch(0.18 0.03 260)');
      root.style.setProperty('--popover', 'oklch(1 0 0)');
      root.style.setProperty('--popover-foreground', 'oklch(0.18 0.03 260)');
      root.style.setProperty('--primary', 'oklch(0.72 0.16 160)');
      root.style.setProperty('--primary-foreground', 'oklch(0.98 0.01 260)');
      root.style.setProperty('--secondary', 'oklch(0.96 0.01 260)');
      root.style.setProperty('--secondary-foreground', 'oklch(0.18 0.03 260)');
      root.style.setProperty('--muted', 'oklch(0.96 0.01 260)');
      root.style.setProperty('--muted-foreground', 'oklch(0.5 0.01 260)');
      root.style.setProperty('--accent', 'oklch(0.96 0.01 260)');
      root.style.setProperty('--accent-foreground', 'oklch(0.18 0.03 260)');
      root.style.setProperty('--destructive', 'oklch(0.7 0.19 25)');
      root.style.setProperty('--destructive-foreground', 'oklch(0.98 0.01 260)');
      root.style.setProperty('--border', 'oklch(0.92 0.01 260)');
      root.style.setProperty('--input', 'oklch(0.92 0.01 260)');
      root.style.setProperty('--ring', 'oklch(0.7 0.01 260)');
      root.classList.remove('dark');
    }
  }, [isDarkMode]);

  const selectedPostData = selectedPost 
    ? mockBlogPosts.find(post => post.id === selectedPost)
    : null;

  // 获取所有主题
  const topics = Array.from(new Set(mockBlogPosts.map(post => post.topic)));

  // 筛选文章
  const filteredPosts = selectedTopic 
    ? mockBlogPosts.filter(post => post.topic === selectedTopic)
    : mockBlogPosts;

  // 如果选中了文章，显示文章详情
  if (selectedPostData) {
    return (
      <div className="min-h-screen bg-background">
        <div className="max-w-4xl mx-auto p-6">
          {/* 返回按钮 */}
          <Button 
            variant="ghost" 
            onClick={() => setSelectedPost(null)}
            className="mb-6 flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            返回文章列表
          </Button>

          {/* 文章内容 */}
          <article className="space-y-6">
            <header className="space-y-4">
              <h1 className="text-3xl font-bold" style={{ fontFamily: "var(--font-title)" }}>
                {selectedPostData.title}
              </h1>
              
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  {selectedPostData.created_at}
                </div>
                <div className="flex items-center gap-1">
                  <Tag className="h-4 w-4" />
                  <Badge variant="secondary">{selectedPostData.topic}</Badge>
                </div>
              </div>
            </header>

            <div className="prose prose-lg max-w-none dark:prose-invert">
              <div className="whitespace-pre-line text-foreground leading-relaxed">
                {selectedPostData.content}
              </div>
            </div>
          </article>
        </div>
      </div>
    );
  }

  // 搜索功能
  const filteredPostsBySearch = searchQuery.trim() 
    ? filteredPosts.filter(post => 
        post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.topic.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : filteredPosts;

  // 显示文章列表
  return (
    <div className="min-h-screen bg-background">
      {/* Top Navigation - same as main page */}
      <motion.header 
        className={cn(
          "w-full h-16 px-4 md:px-6 flex items-center justify-between",
          "bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60",
          "border-b border-border"
        )}
        initial={{
          opacity: 0,
          y: -20
        }}
        animate={{
          opacity: 1,
          y: 0
        }}
        transition={{
          duration: 0.3
        }}
      >
        {/* Platform Title */}
        <div className="flex items-center gap-3">
          <motion.div
            whileHover={{ scale: 1.1, rotate: 5 }}
            transition={{ duration: 0.2 }}
          >
            <Rose className="h-6 w-6 md:h-7 md:w-7 text-primary" />
          </motion.div>
          <motion.h1 
            className="text-xl md:text-2xl font-bold text-foreground" 
            style={{
              fontFamily: "var(--font-title)"
            }} 
            whileHover={{
              scale: 1.02
            }} 
            transition={{
              duration: 0.2
            }}
          >
            学习笔记分享
          </motion.h1>
        </div>

        {/* Search Bar */}
        <div className="flex-1 max-w-md mx-4 md:mx-8 relative">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input 
              type="text" 
              placeholder="搜索文章内容..." 
              value={searchQuery} 
              onChange={(e) => setSearchQuery(e.target.value)}
              className={cn(
                "pl-10 pr-4 h-10 w-full",
                "transition-all duration-200",
                "focus:!ring-1 focus:!ring-primary/30 focus:!border-primary",
                "focus-visible:!ring-1 focus-visible:!ring-primary/30 focus-visible:!border-primary",
                "hover:border-primary/50"
              )}
              aria-label="搜索文章内容"
            />
          </div>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-2">
          {/* Theme Toggle */}
          <motion.div whileHover={{
            scale: 1.05
          }} whileTap={{
            scale: 0.95
          }}>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={toggleTheme} 
              className={cn(
                "h-10 w-10 rounded-full", 
                "transition-all duration-300", 
                "hover:bg-accent hover:text-accent-foreground", 
                "focus:ring-2 focus:ring-primary/20"
              )} 
              aria-label={themeMode === 'light' ? "當前：淺色模式，點擊切換到深色模式" : "當前：深色模式，點擊切換到淺色模式"}
            >
              <AnimatePresence mode="wait">
                {themeMode === 'light' ? 
                  <motion.div 
                    key="sun" 
                    initial={{
                      rotate: -90,
                      opacity: 0
                    }} 
                    animate={{
                      rotate: 0,
                      opacity: 1
                    }} 
                    exit={{
                      rotate: 90,
                      opacity: 0
                    }} 
                    transition={{
                      duration: 0.3
                    }}
                  >
                    <Sun className="h-5 w-5" />
                  </motion.div> : 
                  <motion.div 
                    key="moon" 
                    initial={{
                      rotate: 90,
                      opacity: 0
                    }} 
                    animate={{
                      rotate: 0,
                      opacity: 1
                    }} 
                    exit={{
                      rotate: -90,
                      opacity: 0
                    }} 
                    transition={{
                      duration: 0.3
                    }}
                  >
                    <Moon className="h-5 w-5" />
                  </motion.div>
                }
              </AnimatePresence>
            </Button>
          </motion.div>

          {/* Home Button */}
          <motion.div whileHover={{
            scale: 1.05
          }} whileTap={{
            scale: 0.95
          }}>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => navigate('/')} 
              className={cn(
                "h-10 w-10 rounded-full", 
                "transition-all duration-300", 
                "hover:bg-accent hover:text-accent-foreground", 
                "focus:ring-2 focus:ring-primary/20"
              )} 
              aria-label="返回主页"
            >
              <Home className="h-5 w-5" />
            </Button>
          </motion.div>
        </div>
      </motion.header>

      <div className="max-w-7xl mx-auto p-6">

          {/* 主要内容区域 - 左右布局 */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* 左侧文章区域 - 2/3 */}
            <div className="lg:col-span-2 space-y-6">
              {/* Latest Blog Post 标题 */}
              <div className="mb-6">
                <h2 className="text-xl font-semibold text-foreground">Latest Blog Post</h2>
              </div>

              {/* 文章列表 */}
              <div className="space-y-6">
                {filteredPostsBySearch.map(post => (
                  <Card 
                    key={post.id} 
                    className="cursor-pointer transition-transform duration-200 hover:-translate-y-1"
                    onClick={() => setSelectedPost(post.id)}
                  >
                    <CardContent className="p-6">
                      <div className="space-y-3">
                        <div className="flex items-center gap-2">
                          <Badge variant="secondary" className="text-xs">
                            {post.topic}
                          </Badge>
                        </div>
                        
                        <h3 className="text-xl font-semibold leading-tight text-primary hover:text-foreground transition-colors">
                          {post.title}
                        </h3>
                        
                        <p className="text-sm text-muted-foreground leading-relaxed">
                          {post.excerpt}
                        </p>
                        
                        <div className="flex items-center gap-4 text-xs text-muted-foreground pt-2">
                          <div className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {post.created_at}
                          </div>
                          <span>• 3 min</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {filteredPostsBySearch.length === 0 && (
                <div className="text-center text-muted-foreground mt-12">
                  <p>
                    {searchQuery.trim() 
                      ? `未找到包含 "${searchQuery}" 的文章` 
                      : "暂无相关文章"
                    }
                  </p>
                </div>
              )}
            </div>

            {/* 右侧边栏 - 1/3 */}
            <div className="space-y-8">
              {/* Sources 部分 */}
              <div>
                <h3 className="text-lg text-muted-foreground font-semibold mb-4">Sources</h3>
                <div className="flex justify-between items-center">
                  {/* 圆瑛法师 */}
                  <div className="flex flex-col items-center space-y-2">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-800 dark:to-blue-900 flex items-center justify-center shadow-sm border border-blue-300 dark:border-blue-600 overflow-hidden">
                      <div className="w-full h-full rounded-full bg-muted flex items-center justify-center">
                        <span className="text-lg text-muted-foreground">圆</span>
                      </div>
                    </div>
                    <span className="text-xs text-center text-muted-foreground font-medium">圆瑛法师</span>
                  </div>
                  
                  {/* 宽谦法师 */}
                  <div className="flex flex-col items-center space-y-2">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-green-100 to-green-200 dark:from-green-800 dark:to-green-900 flex items-center justify-center shadow-sm border border-green-300 dark:border-green-600 overflow-hidden">
                      <div className="w-full h-full rounded-full bg-muted flex items-center justify-center">
                        <span className="text-lg text-muted-foreground">宽</span>
                      </div>
                    </div>
                    <span className="text-xs text-center text-muted-foreground font-medium">宽谦法师</span>
                  </div>
                  
                  {/* 杨宁老师 */}
                  <div className="flex flex-col items-center space-y-2">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-100 to-purple-200 dark:from-purple-800 dark:to-purple-900 flex items-center justify-center shadow-sm border border-purple-300 dark:border-purple-600 overflow-hidden">
                      <div className="w-full h-full rounded-full bg-muted flex items-center justify-center">
                        <span className="text-lg text-muted-foreground">杨</span>
                      </div>
                    </div>
                    <span className="text-xs text-center text-muted-foreground font-medium">杨宁老师</span>
                  </div>
                </div>
              </div>

              {/* Topics 部分 */}
              <div>
                <h3 className="text-lg text-muted-foreground font-semibold mb-3">Topics</h3>
                <div className="space-y-2">
                  {topics.map(topic => (
                                              <div
                            key={topic}
                            className="cursor-pointer transition-transform duration-200 hover:-translate-y-1 bg-card rounded-lg shadow-sm border border-border flex items-center overflow-hidden"
                            onClick={() => setSelectedTopic(selectedTopic === topic ? null : topic)}
                          >
                            {/* 左侧灰色区域 */}
                            <div className="w-16 h-12 bg-muted flex items-center justify-center flex-shrink-0">
                              {topic === '修持心得' && <span className="text-sm text-muted-foreground">🧘</span>}
                              {topic === '智慧开解' && <span className="text-sm text-muted-foreground">💡</span>}
                              {topic === '禅定修持' && <span className="text-sm text-muted-foreground">⚡</span>}
                            </div>

                            {/* 右侧文字区域 */}
                            <div className="flex-1 px-4 py-3 bg-card">
                              <span className={`text-sm font-medium transition-colors ${selectedTopic === topic ? 'text-primary' : 'text-foreground hover:text-primary'}`}>
                                {topic}
                              </span>
                            </div>
                          </div>
                  ))}
                </div>
              </div>

              {/* Tags 部分 */}
              <div>
                <h3 className="text-lg text-muted-foreground font-semibold mb-4">Tags</h3>
                <div className="flex flex-wrap gap-3">
                  {['#楞严咒', '#五蕴', '#禅定', '#智慧', '#修行', '#经文', '#佛法', '#心得'].map(tag => (
                    <div
                      key={tag}
                      className="cursor-pointer bg-card transition-all duration-200 hover:-translate-y-1 hover:text-primary px-4 py-2 rounded-lg shadow-sm border border-border text-sm font-medium text-foreground"
                      onClick={() => setSelectedTag(selectedTag === tag ? null : tag)}
                    >
                      {tag}
                    </div>
                  ))}
                </div>
              </div>

              {/* Let's Talk 部分 */}
              <div>
                <h3 className="text-lg text-muted-foreground font-semibold mb-4">Let's Talk</h3>
                <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
                  有任何修行疑问或想要分享心得？欢迎与我交流讨论。
                </p>
                <Button variant="outline" size="sm" className="w-full">
                  联系讨论
                </Button>
              </div>
            </div>
          </div>
      </div>
    </div>
  );
}

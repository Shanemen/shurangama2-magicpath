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
    title: '楞嚴咒的修持心得',
    excerpt: '經過多年的誦持楞嚴咒，我深深體會到這部咒語的不可思議威力。在日常修行中，楞嚴咒如同明燈，指引著修行的方向。每當心境浮躁時，持誦楞嚴咒能夠迅速安定內心，回歸清淨本性。通過持續的修持，我逐漸明白了楞嚴經中所說的「狂心若歇，歇即菩提」的深義...',
    content: `經過多年的誦持楞嚴咒，我深深體會到這部咒語的不可思議威力。

在日常修行中，楞嚴咒如同明燈，指引著修行的方向。每當心境浮躁時，持誦楞嚴咒能夠迅速安定內心，回歸清淨本性。

## 修持要點

1. **恭敬心** - 以虔誠恭敬的心持誦
2. **專注力** - 保持注意力集中，不讓心散亂
3. **持續性** - 每日定時定量，培養習慣

## 個人體悟

持咒過程中，我逐漸明白了楞嚴經中所說的「狂心若歇，歇即菩提」的深義。真正的修行不在於外相，而在於內心的轉化。`,
    topic: '修持心得',
    created_at: '2024-01-15',
    updated_at: '2024-01-15'
  },
    {
    id: '2',
    title: '五蘊皆空的現代理解',
    excerpt: '色受想行識五蘊，在現代生活中如何理解和應用？通過科學的角度重新審視這一佛教核心概念。從認知科學的角度看，五蘊的構成正對應了人類意識的不同層面。在日常生活中觀察五蘊的運作，有助於我們減少對自我的執著，理解痛苦的根源，培養智慧觀照...',
    content: `色受想行識五蘊，在現代生活中如何理解和應用？

## 現代科學視角

從認知科學的角度看，五蘊的構成正對應了人類意識的不同層面：

- **色蘊** - 物質身體，神經系統的物理基礎
- **受蘊** - 感受反應，情緒的神經化學反應
- **想蘊** - 概念思維，大腦皮層的認知處理
- **行蘊** - 意志行為，前額葉的決策機制  
- **識蘊** - 基礎意識，整體的意識狀態

## 實踐應用

在日常生活中觀察五蘊的運作，有助於我們：
1. 減少對自我的執著
2. 理解痛苦的根源
3. 培養智慧觀照`,
    topic: '智慧開解',
    created_at: '2024-01-10',
    updated_at: '2024-01-10'
  },
  {
    id: '3',
    title: '楞嚴經中的禪定次第',
    excerpt: '楞嚴經詳細闡述了禪定的不同階段和修持方法。從初禪到四禪，每個階段都有其特定的境界和體驗。禪定是修行的核心，正如經中所說：「若不修禪定，智慧不現前。」通過系統的修持次第，從數息開始培養基礎定力，觀察身心變化而不執著境界...',
    content: `楞嚴經詳細闡述了禪定的不同階段和修持方法。

## 禪定的重要性

禪定是修行的核心，正如經中所說：「若不修禪定，智慧不現前。」

## 修持次第

### 初禪
- 離欲惡不善法
- 心生喜樂
- 有尋有伺

### 二禪  
- 內心寂靜
- 無尋無伺
- 定生喜樂

### 三禪
- 離喜妙樂
- 正念正知
- 身心輕安

### 四禪
- 捨念清淨
- 不苦不樂
- 心如明鏡

## 現代修持建議

1. 從數息開始，培養基礎定力
2. 觀察身心變化，不執著境界
3. 保持恆心，循序漸進`,
    topic: '禪定修持',
    created_at: '2024-01-05',
    updated_at: '2024-01-05'
  }
];

export default function BlogPage() {
  const navigate = useNavigate();
  const { themeMode, isDarkMode, toggleTheme, setThemeMode } = useTheme();
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
        {/* Top Navigation - same as blog page */}
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
              學習筆記分享
            </motion.h1>
          </div>

          {/* Navigation Controls */}
          <div className="flex items-center gap-2">
            {/* Theme Toggle - Left */}
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
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
                aria-label={themeMode === 'light' ? "切換到深色模式" : "切換到淺色模式"}
              >
                <AnimatePresence mode="wait">
                  {themeMode === 'light' ? 
                    <motion.div 
                      key="sun"
                      initial={{ opacity: 0, rotate: -90, scale: 0.8 }}
                      animate={{ opacity: 1, rotate: 0, scale: 1 }}
                      exit={{ opacity: 0, rotate: 90, scale: 0.8 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Sun className="h-4 w-4" />
                    </motion.div>
                  : 
                    <motion.div 
                      key="moon"
                      initial={{ opacity: 0, rotate: 90, scale: 0.8 }}
                      animate={{ opacity: 1, rotate: 0, scale: 1 }}
                      exit={{ opacity: 0, rotate: -90, scale: 0.8 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Moon className="h-4 w-4" />
                    </motion.div>
                  }
                </AnimatePresence>
              </Button>
            </motion.div>

            {/* Home Button - Right */}
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
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
                aria-label="返回主頁"
              >
                <Home className="h-4 w-4" />
              </Button>
            </motion.div>
          </div>
        </motion.header>

        {/* Main Content */}
        <div className="max-w-6xl mx-auto p-6">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Left Sidebar - Back Button Area */}
            <div className="lg:col-span-1">
              <motion.div 
                className="sticky top-6 space-y-4"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: 0.1 }}
              >
                <Button 
                  variant="outline" 
                  onClick={() => setSelectedPost(null)}
                  className="w-full flex items-center gap-2 h-12"
                >
                  <ArrowLeft className="h-5 w-5" />
                  Back
                </Button>
                
                {/* Article Meta Info */}
                <Card className="p-4 space-y-3">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Calendar className="h-4 w-4" />
                      {selectedPostData.created_at}
                    </div>
                    <div className="flex items-center gap-2">
                      <Tag className="h-4 w-4 text-muted-foreground" />
                      <Badge variant="secondary">{selectedPostData.topic}</Badge>
                    </div>
                  </div>
                </Card>
              </motion.div>
            </div>

            {/* Main Article Content */}
            <div className="lg:col-span-3">
              <motion.article 
                className="space-y-8"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.2 }}
              >
                {/* Article Header */}
                <header className="space-y-6 pb-6 border-b border-border">
                  <h1 className="text-4xl md:text-5xl font-bold leading-tight text-foreground" 
                      style={{ fontFamily: "var(--font-title)" }}>
                    {selectedPostData.title}
                  </h1>
                  
                  <p className="text-xl text-muted-foreground leading-relaxed">
                    {selectedPostData.excerpt}
                  </p>
                </header>

                {/* Article Body */}
                <div className="prose prose-lg max-w-none dark:prose-invert">
                  <div className="text-foreground leading-relaxed space-y-6 text-base md:text-lg">
                    {selectedPostData.content.split('\n\n').map((paragraph, index) => {
                      // Handle markdown-style headers
                      if (paragraph.startsWith('## ')) {
                        return (
                          <h2 key={index} className="text-2xl md:text-3xl font-bold mt-12 mb-6 text-foreground" 
                              style={{ fontFamily: "var(--font-title)" }}>
                            {paragraph.replace('## ', '')}
                          </h2>
                        );
                      }
                      
                      // Handle markdown-style subheaders  
                      if (paragraph.startsWith('### ')) {
                        return (
                          <h3 key={index} className="text-xl md:text-2xl font-semibold mt-8 mb-4 text-foreground">
                            {paragraph.replace('### ', '')}
                          </h3>
                        );
                      }
                      
                      // Handle lists
                      if (paragraph.includes('\n- ') || paragraph.startsWith('- ')) {
                        const listItems = paragraph.split('\n').filter(line => line.startsWith('- '));
                        return (
                          <ul key={index} className="space-y-2 my-6">
                            {listItems.map((item, itemIndex) => (
                              <li key={itemIndex} className="flex items-start gap-3">
                                <span className="w-2 h-2 bg-primary rounded-full mt-3 flex-shrink-0"></span>
                                <span>{item.replace('- ', '').replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')}</span>
                              </li>
                            ))}
                          </ul>
                        );
                      }
                      
                      // Handle numbered lists
                      if (paragraph.match(/^\d+\./)) {
                        const listItems = paragraph.split('\n').filter(line => line.match(/^\d+\./));
                        return (
                          <ol key={index} className="space-y-2 my-6">
                            {listItems.map((item, itemIndex) => (
                              <li key={itemIndex} className="flex items-start gap-3">
                                <span className="w-6 h-6 bg-primary/10 text-primary rounded-full flex items-center justify-center text-sm font-semibold flex-shrink-0 mt-1">
                                  {itemIndex + 1}
                                </span>
                                <span>{item.replace(/^\d+\.\s*/, '')}</span>
                              </li>
                            ))}
                          </ol>
                        );
                      }
                      
                      // Regular paragraphs
                      if (paragraph.trim()) {
                        return (
                          <p key={index} className="leading-relaxed">
                            {paragraph}
                          </p>
                        );
                      }
                      
                      return null;
                    })}
                  </div>
                </div>

                {/* Article Footer */}
                <footer className="pt-8 mt-12 border-t border-border">
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-muted-foreground">
                      最後更新: {selectedPostData.updated_at}
                    </div>
                    <div className="text-sm text-muted-foreground italic">
                      梵小包日誌
                    </div>
                  </div>
                </footer>
              </motion.article>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 搜尋功能
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
              placeholder="搜尋文章內容..." 
              value={searchQuery} 
              onChange={(e) => setSearchQuery(e.target.value)}
              className={cn(
                "pl-10 pr-4 h-10 w-full",
                "transition-all duration-200",
                "focus:!ring-1 focus:!ring-primary/30 focus:!border-primary",
                "focus-visible:!ring-1 focus-visible:!ring-primary/30 focus-visible:!border-primary",
                "hover:border-primary/50"
              )}
              aria-label="搜尋文章內容"
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
              <div className="space-y-4">
                {filteredPostsBySearch.map(post => (
                  <Card 
                    key={post.id} 
                    className="cursor-pointer transition-transform duration-200 hover:-translate-y-1"
                    onClick={() => setSelectedPost(post.id)}
                  >
                    <CardContent className="p-4">
                      <div className="space-y-3">
                        <div className="flex items-center gap-2">
                          <Badge variant="secondary" className="text-xs">
                            {post.topic}
                          </Badge>
                        </div>
                        
                        <h3 className="text-xl font-semibold leading-tight text-primary hover:text-foreground transition-colors">
                          {post.title}
                        </h3>
                        
                        <p className="text-sm text-muted-foreground leading-relaxed" style={{
                          display: '-webkit-box',
                          WebkitLineClamp: 3,
                          WebkitBoxOrient: 'vertical',
                          overflow: 'hidden'
                        }}>
                          {post.excerpt}
                        </p>
                        
                        <div className="flex items-center gap-4 text-xs text-muted-foreground pt-1">
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
                      : "暫無相關文章"
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
                  {/* 圓瑛法師 */}
                  <div className="flex flex-col items-center space-y-2">
                    <div 
                      className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-800 dark:to-blue-900 flex items-center justify-center shadow-sm border border-blue-300 dark:border-blue-600 overflow-hidden cursor-pointer transition-transform duration-200 hover:scale-110 hover:shadow-md"
                      onClick={() => window.open('https://github.com/yuqianyi1001/awesome-buddhist-dharma/blob/main/%E5%A4%A7%E4%BD%9B%E9%A1%B6%E9%A6%96%E6%A5%9E%E4%B8%A5%E7%BB%8F%E8%AE%B2%E4%B9%89(%E5%9C%86%E7%91%9B%E6%B3%95%E5%B8%88).pdf', '_blank', 'noopener,noreferrer')}
                    >
                      <div className="w-full h-full rounded-full bg-muted flex items-center justify-center">
                        <span className="text-lg text-muted-foreground">圓</span>
                      </div>
                    </div>
                    <span className="text-xs text-center text-muted-foreground font-medium">圓瑛法師</span>
                  </div>
                  
                  {/* 寬謙法師 */}
                  <div className="flex flex-col items-center space-y-2">
                    <div 
                      className="w-16 h-16 rounded-full bg-gradient-to-br from-green-100 to-green-200 dark:from-green-800 dark:to-green-900 flex items-center justify-center shadow-sm border border-green-300 dark:border-green-600 overflow-hidden cursor-pointer transition-transform duration-200 hover:scale-110 hover:shadow-md"
                      onClick={() => window.open('https://www.youtube.com/watch?v=69MEBUbfY9U&list=PLOZUHRr4_koUM6VbplL8PxVSBffOA5R-v', '_blank', 'noopener,noreferrer')}
                    >
                      <div className="w-full h-full rounded-full bg-muted flex items-center justify-center">
                        <span className="text-lg text-muted-foreground">寬</span>
                      </div>
                    </div>
                    <span className="text-xs text-center text-muted-foreground font-medium">寬謙法師</span>
                  </div>
                  
                  {/* 楊寧老師 */}
                  <div className="flex flex-col items-center space-y-2">
                    <div 
                      className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-100 to-purple-200 dark:from-purple-800 dark:to-purple-900 flex items-center justify-center shadow-sm border border-purple-300 dark:border-purple-600 overflow-hidden cursor-pointer transition-transform duration-200 hover:scale-110 hover:shadow-md"
                      onClick={() => window.open('https://ziguijia.com/', '_blank', 'noopener,noreferrer')}
                    >
                      <div className="w-full h-full rounded-full bg-muted flex items-center justify-center">
                        <span className="text-lg text-muted-foreground">寧</span>
                      </div>
                    </div>
                    <span className="text-xs text-center text-muted-foreground font-medium">楊寧老師</span>
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
                              {topic === '智慧開解' && <span className="text-sm text-muted-foreground">💡</span>}
                              {topic === '禪定修持' && <span className="text-sm text-muted-foreground">⚡</span>}
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
                  {['#楞嚴咒', '#五蘊', '#禪定', '#智慧', '#修行', '#經文', '#佛法', '#心得'].map(tag => (
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
                  有任何修行疑問或想要分享心得？歡迎與我交流討論。
                </p>
                <Button variant="outline" size="sm" className="w-full">
                  聯繫討論
                </Button>
              </div>
            </div>
          </div>
      </div>
    </div>
  );
}

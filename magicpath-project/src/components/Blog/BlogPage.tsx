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
import { useBlogPosts, type BlogPost } from '@/hooks/useBlogPosts';



export default function BlogPage() {
  const navigate = useNavigate();
  const { themeMode, isDarkMode, toggleTheme, setThemeMode } = useTheme();
  const [selectedPost, setSelectedPost] = useState<string | null>(null);
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");
  
  // 使用真實的博客數據
  const { 
    posts, 
    loading, 
    error, 
    getPostById, 
    getTopics, 
    getTags,
    searchPosts 
  } = useBlogPosts();

  // 為主題自動分配emoji的函數
  const getTopicEmoji = (topic: string): string => {
    // 預定義的主題emoji映射
    const topicEmojiMap: { [key: string]: string } = {
      '修持心得': '🧘',
      '智慧開解': '💡',
      '禪定修持': '⚡',
      '讀經感悟': '💡',
      '读经感悟': '💡',
      '佛學思辨': '🤔',
      '佛学思辨': '🤔',
      '生活感悟': '🌸',
      '修行日記': '📝',
      '修行日记': '📝',
      '經典解讀': '📜',
      '经典解读': '📜',
      '心靈成長': '🌱',
      '心灵成长': '🌱',
      '禪修體驗': '🕉️',
      '禅修体验': '🕉️'
    };

    // 如果有預定義的emoji，使用它
    if (topicEmojiMap[topic]) {
      return topicEmojiMap[topic];
    }

    // 否則根據主題內容智能分配emoji
    if (topic.includes('修') || topic.includes('禪') || topic.includes('禅')) return '🧘';
    if (topic.includes('智慧') || topic.includes('開解') || topic.includes('开解')) return '💡';
    if (topic.includes('經') || topic.includes('经') || topic.includes('感悟')) return '📖';
    if (topic.includes('思辨') || topic.includes('思考')) return '🤔';
    if (topic.includes('生活') || topic.includes('日常')) return '🌸';
    if (topic.includes('日記') || topic.includes('日记') || topic.includes('記錄') || topic.includes('记录')) return '📝';
    if (topic.includes('成長') || topic.includes('成长') || topic.includes('心靈') || topic.includes('心灵')) return '🌱';
    
    // 默認emoji
    return '📚';
  };


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

  // 獲取選中的文章數據
  const [selectedPostData, setSelectedPostData] = useState<BlogPost | null>(null);
  const [topics, setTopics] = useState<string[]>([]);
  const [availableTags, setAvailableTags] = useState<string[]>([]);

  // 載入選中的文章數據
  useEffect(() => {
    if (selectedPost) {
      getPostById(selectedPost).then(setSelectedPostData);
    } else {
      setSelectedPostData(null);
    }
  }, [selectedPost, getPostById]);

  // 載入主題和標籤 - 只在posts第一次加载完成后获取一次
  useEffect(() => {
    if (posts.length > 0 && topics.length === 0) {
      getTopics().then(setTopics);
    }
    if (posts.length > 0 && availableTags.length === 0) {
      getTags().then(setAvailableTags);
    }
  }, [posts.length, topics.length, availableTags.length, getTopics, getTags]);

  // 篩選文章
  const filteredPosts = selectedTopic 
    ? posts.filter(post => post.topic === selectedTopic)
    : posts;

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
                      {new Date(selectedPostData.journal_date).toLocaleDateString('zh-TW')}
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

                {/* Featured Image */}
                {selectedPostData.featured_image && (
                  <div className="w-full overflow-hidden rounded-lg my-8">
                    <img 
                      src={selectedPostData.featured_image} 
                      alt={selectedPostData.title}
                      className="w-full h-auto object-contain"
                    />
                  </div>
                )}

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
    ? searchPosts(searchQuery).filter(post => 
        selectedTopic ? post.topic === selectedTopic : true
      )
    : filteredPosts;

  // 顯示加載狀態
  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="text-muted-foreground">載入中...</p>
        </div>
      </div>
    );
  }

  // 顯示錯誤狀態
  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <p className="text-red-500">載入失敗: {error}</p>
          <Button onClick={() => window.location.reload()}>重試</Button>
        </div>
      </div>
    );
  }

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
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical',
                          overflow: 'hidden'
                        }}>
                          {/* 显示文章内容的前两行，去除markdown标记 */}
                          {post.content
                            .replace(/^#{1,6}\s+/gm, '') // 去除标题标记
                            .replace(/\*\*(.*?)\*\*/g, '$1') // 去除粗体标记
                            .replace(/^-\s+/gm, '') // 去除列表标记
                            .replace(/\n{2,}/g, ' ') // 将多个换行符替换为空格
                            .substring(0, 200) // 增加字符限制，让内容足够填满两行
                          }...</p>
                        
                        <div className="flex items-center gap-4 text-xs text-muted-foreground pt-1">
                          <div className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {new Date(post.journal_date).toLocaleDateString('zh-TW')}
                          </div>
                          <span>• {post.reading_time_minutes} 分鐘</span>
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
                              <span className="text-lg text-muted-foreground">{getTopicEmoji(topic)}</span>
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
                  {availableTags.map(tag => (
                    <div
                      key={tag}
                      className="cursor-pointer bg-card transition-all duration-200 hover:-translate-y-1 hover:text-primary px-4 py-2 rounded-lg shadow-sm border border-border text-sm font-medium text-foreground"
                      onClick={() => setSelectedTag(selectedTag === tag ? null : tag)}
                    >
                      #{tag}
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

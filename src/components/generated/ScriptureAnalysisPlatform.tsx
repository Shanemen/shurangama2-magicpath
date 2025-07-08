"use client";

import * as React from "react";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { BookImage } from "lucide-react";
import MindMapCanvas from "./MindMapCanvas";
import ContentPanel from "./ContentPanel";
import TopToolbar from "./TopToolbar";
// import ScriptureContentDisplay from "../ScriptureContent"; // 不再需要浮动经文组件
import { useScriptureData } from "@/hooks/useScriptureData";
export interface ScriptureAnalysisPlatformProps {
  className?: string;
}
export default function ScriptureAnalysisPlatform({
  className
}: ScriptureAnalysisPlatformProps) {
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [isMobile, setIsMobile] = useState(false);
  // const [showScriptureContent, setShowScriptureContent] = useState(false); // 不再需要
  
  // 侧边面板状态管理
  const [sidebarExpanded, setSidebarExpanded] = useState(false);
  const [selectedCommentaryNodeId, setSelectedCommentaryNodeId] = useState<string | null>(null);
  
  // 使用经文数据hook
  const { 
    data, 
    loading, 
    error, 
    selectedNode, 
    selectedNodeContent, 
    selectedNodeCommentaries,
    loadingCommentaries,
    selectNode,
    loadNodeCommentaries
  } = useScriptureData();

  // 构建用于侧边栏的经文数据
  const sidebarScriptureData = React.useMemo(() => {
    if (!selectedNodeContent || !selectedNode) {
      return undefined;
    }
    
    return {
      title: selectedNode!.title || "楞嚴經",
      text: selectedNodeContent!.original_text,
      // 暂时不显示随机生成的页码和讲次信息
      // chapter: selectedNode!.pageRef,
      // verse: selectedNode!.lectureNumber ? `講次 ${selectedNode!.lectureNumber}` : undefined
    };
  }, [selectedNodeContent, selectedNode]);

  // 构建用于侧边栏的法师开示数据
  const sidebarCommentaryData = React.useMemo(() => {
    const masterCommentary = selectedNodeCommentaries.find(c => c.author === '圆瑛法师');
    if (!masterCommentary) return undefined;
    
    return {
      title: "圆瑛法师注解",
      text: masterCommentary.content,
      author: "圆瑛法师",
      source: "《大佛頂首楞嚴經講義》"
    };
  }, [selectedNodeCommentaries]);

  // 构建用于侧边栏的AI翻译数据
  const sidebarAITranslationData = React.useMemo(() => {
    const claudeCommentary = selectedNodeCommentaries.find(c => c.author === 'Claude');
    if (!claudeCommentary) return undefined;
    
    return {
      id: "claude-translation",
      title: "AI Analysis",
      content: claudeCommentary.content
    };
  }, [selectedNodeCommentaries]);

  // 🔍 DEBUG: 打印关键状态信息
  console.log('🔍 ScriptureAnalysisPlatform Debug:', {
    isMobile,
    loading,
    error,
    dataLength: data?.length,
    selectedNode: selectedNode?.title,
    selectedNodeContent: selectedNodeContent?.original_text?.substring(0, 50) + '...',
    selectedNodeCommentaries: selectedNodeCommentaries.map(c => `${c.author}: ${c.content.substring(0, 30)}...`),
    loadingCommentaries,
    sidebarExpanded,
    sidebarScriptureData,
    sidebarCommentaryData,
    sidebarAITranslationData
  });

  // Handle responsive breakpoints
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Apply theme to document
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
      root.style.setProperty('--chart-1', 'oklch(0.52 0.22 265)');
      root.style.setProperty('--chart-2', 'oklch(0.68 0.15 160)');
      root.style.setProperty('--chart-3', 'oklch(0.75 0.18 70)');
      root.style.setProperty('--chart-4', 'oklch(0.62 0.22 300)');
      root.style.setProperty('--chart-5', 'oklch(0.62 0.19 20)');
      root.style.setProperty('--sidebar', 'oklch(0.22 0.03 260)');
      root.style.setProperty('--sidebar-foreground', 'oklch(0.98 0.01 260)');
      root.style.setProperty('--sidebar-primary', 'oklch(0.52 0.22 265)');
      root.style.setProperty('--sidebar-primary-foreground', 'oklch(0.98 0.01 260)');
      root.style.setProperty('--sidebar-accent', 'oklch(0.28 0.02 260)');
      root.style.setProperty('--sidebar-accent-foreground', 'oklch(0.98 0.01 260)');
      root.style.setProperty('--sidebar-border', 'oklch(1 0 0 / 12%)');
      root.style.setProperty('--sidebar-ring', 'oklch(0.6 0.01 260)');
      root.style.setProperty('--font-sans', "'Poppins', system-ui, sans-serif");
      root.style.setProperty('--font-serif', "'Lora', serif");
      root.style.setProperty('--font-mono', "'Fira Code', monospace");
      root.style.setProperty('--radius', '0.75rem');
      root.style.setProperty('--shadow-xs', '0 1px 2px 0 oklch(0 0 0 / 0.04)');
      root.style.setProperty('--shadow-sm', '0 1.5px 4px 0 oklch(0 0 0 / 0.08)');
      root.style.setProperty('--shadow-md', '0 4px 12px 0 oklch(0 0 0 / 0.12)');
      root.style.setProperty('--shadow-lg', '0 8px 24px 0 oklch(0 0 0 / 0.16)');
      root.style.setProperty('--shadow-xl', '0 16px 48px 0 oklch(0 0 0 / 0.20)');
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
      root.style.setProperty('--chart-1', 'oklch(0.62 0.21 40)');
      root.style.setProperty('--chart-2', 'oklch(0.58 0.12 185)');
      root.style.setProperty('--chart-3', 'oklch(0.39 0.07 230)');
      root.style.setProperty('--chart-4', 'oklch(0.82 0.18 85)');
      root.style.setProperty('--chart-5', 'oklch(0.76 0.18 70)');
      root.style.setProperty('--sidebar', 'oklch(0.99 0 0)');
      root.style.setProperty('--sidebar-foreground', 'oklch(0.18 0.03 260)');
      root.style.setProperty('--sidebar-primary', 'oklch(0.22 0.03 260)');
      root.style.setProperty('--sidebar-primary-foreground', 'oklch(0.98 0.01 260)');
      root.style.setProperty('--sidebar-accent', 'oklch(0.96 0.01 260)');
      root.style.setProperty('--sidebar-accent-foreground', 'oklch(0.18 0.03 260)');
      root.style.setProperty('--sidebar-border', 'oklch(0.92 0.01 260)');
      root.style.setProperty('--sidebar-ring', 'oklch(0.7 0.01 260)');
      root.style.setProperty('--font-sans', "'Poppins', system-ui, sans-serif");
      root.style.setProperty('--font-serif', "'Lora', serif");
      root.style.setProperty('--font-mono', "'Fira Code', monospace");
      root.style.setProperty('--radius', '0.75rem');
      root.style.setProperty('--shadow-xs', '0 1px 2px 0 oklch(0 0 0 / 0.03)');
      root.style.setProperty('--shadow-sm', '0 2px 8px 0 oklch(0 0 0 / 0.06)');
      root.style.setProperty('--shadow-md', '0 6px 24px 0 oklch(0 0 0 / 0.10)');
      root.style.setProperty('--shadow-lg', '0 12px 48px 0 oklch(0 0 0 / 0.14)');
      root.style.setProperty('--shadow-xl', '0 24px 96px 0 oklch(0 0 0 / 0.18)');
      root.classList.remove('dark');
    }
  }, [isDarkMode]);
  const handleThemeToggle = () => {
    setIsDarkMode(!isDarkMode);
  };
  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  // 处理节点选择 - 如果节点有内容则显示经文
  const handleNodeSelect = (nodeId: string) => {
    selectNode(nodeId)
  };

  // 处理注释请求 - 灯泡图标点击
  const handleCommentaryRequest = async (nodeId: string) => {
    // 首先选择节点以获取其内容
    selectNode(nodeId);
    setSelectedCommentaryNodeId(nodeId);
    setSidebarExpanded(true);
    
    // 加载该节点的注释数据
    await loadNodeCommentaries(nodeId);
    
    console.log('📖 请求显示注释，节点ID:', nodeId);
  };

  // 经文现在作为子节点显示，不再需要浮动组件
  // useEffect(() => {
  //   if (selectedNodeContent) {
  //     setShowScriptureContent(true);
  //   }
  // }, [selectedNodeContent, selectedNode, showScriptureContent]);

  // 经文显示相关函数不再需要
  // const handleCloseScriptureContent = () => {
  //   setShowScriptureContent(false);
  //   // 可选：清空选中的内容，这样下次点击同一个节点时会重新显示
  //   // 如果你希望保持选中状态，可以注释掉下面这行
  //   // setSelectedNodeContent(null);
  // };
  return <motion.div className={cn("min-h-screen w-full bg-background text-foreground transition-colors duration-300", "font-sans antialiased", className)} style={{
    fontFamily: "'DM Sans', system-ui, sans-serif"
  }} initial={{
    opacity: 0
  }} animate={{
    opacity: 1
  }} transition={{
    duration: 0.3
  }}>
      {/* Top Toolbar */}
      <header className="sticky top-0 z-50 w-full bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <TopToolbar isDarkMode={isDarkMode} onThemeToggle={handleThemeToggle} searchQuery={searchQuery} onSearchChange={handleSearch} />
      </header>

      {/* Main Content Area */}
      <main className="flex-1 w-full bg-blue-100 dark:bg-blue-900 min-h-[calc(100vh-4rem)]">
        <AnimatePresence mode="wait">
          {false ? // 暂时强制使用桌面布局进行调试
        // Mobile Layout - Vertical Stack
        <motion.div key="mobile" className="flex flex-col min-h-[calc(100vh-4rem)]" initial={{
          opacity: 0,
          y: 20
        }} animate={{
          opacity: 1,
          y: 0
        }} exit={{
          opacity: 0,
          y: -20
        }} transition={{
          duration: 0.3
        }}>
              {/* Mind Map Section - Collapsible on Mobile */}
              <section className="w-full h-80 border-b border-border" aria-label="Scripture Mind Map">
                <MindMapCanvas 
                  searchQuery={searchQuery} 
                  onNodeSelect={handleNodeSelect}
                  onCommentaryRequest={handleCommentaryRequest}
                  data={data}
                  loading={loading}
                  error={error}
                  sidebarExpanded={sidebarExpanded}
                  selectedCommentaryNodeId={selectedCommentaryNodeId}
                />
              </section>

              {/* Content Panel Section */}
              <aside className="flex-1 w-full p-4" aria-label="Scripture Analysis Content">
                <ContentPanel 
                  searchQuery={searchQuery}
                  scripture={sidebarScriptureData}
                  commentary={sidebarCommentaryData}
                  aiTranslation={sidebarAITranslationData}
                />
              </aside>
            </motion.div> :
        // Desktop/Tablet Layout - Split Screen with Expandable Sidebar
        <motion.div key="desktop" className="relative min-h-[calc(100vh-4rem)] h-[calc(100vh-4rem)]" initial={{
          opacity: 0,
          scale: 0.98
        }} animate={{
          opacity: 1,
          scale: 1
        }} exit={{
          opacity: 0,
          scale: 0.98
        }} transition={{
          duration: 0.3
        }}>
              {/* Main Content - Mind Map */}
              <section className="relative w-full h-full overflow-hidden bg-red-100 dark:bg-red-900" aria-label="Scripture Mind Map">
                <div className="absolute inset-0 bg-green-100 dark:bg-green-900">
                                <MindMapCanvas 
                searchQuery={searchQuery} 
                onNodeSelect={handleNodeSelect}
                onCommentaryRequest={handleCommentaryRequest}
                data={data}
                loading={loading}
                error={error}
                sidebarExpanded={sidebarExpanded}
                selectedCommentaryNodeId={selectedCommentaryNodeId}
              />
                </div>
              </section>

              {/* Expandable Commentary Sidebar */}
              <AnimatePresence mode="wait">
                {sidebarExpanded && (
                  <motion.aside 
                    className="absolute top-0 right-0 w-96 h-full bg-background/95 backdrop-blur-sm border-l border-border shadow-xl z-40 flex flex-col"
                    initial={{ x: '100%', opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    exit={{ x: '100%', opacity: 0 }}
                    transition={{ duration: 0.3, ease: 'easeInOut' }}
                    aria-label="Commentary Sidebar"
                  >
                    {/* Sidebar Header */}
                    <div className="flex items-center justify-between p-4 border-b border-border flex-shrink-0">
                      <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
                        <BookImage className="h-5 w-5 text-primary" />
                        经文注释
                      </h2>
                      <button
                        onClick={() => setSidebarExpanded(false)}
                        className="p-2 rounded-md hover:bg-muted transition-colors"
                        aria-label="关闭侧边栏"
                      >
                        ✕
                      </button>
                    </div>
                    
                    {/* Sidebar Content */}
                    <div className="flex-1 overflow-hidden">
                      <ContentPanel 
                        searchQuery={searchQuery}
                        className="h-full"
                        scripture={sidebarScriptureData}
                        commentary={sidebarCommentaryData}
                        aiTranslation={sidebarAITranslationData}
                      />
                    </div>
                  </motion.aside>
                )}
              </AnimatePresence>
            </motion.div>}
        </AnimatePresence>
      </main>

      {/* Focus Management for Accessibility */}
      <div className="sr-only" role="status" aria-live="polite" aria-atomic="true">
        {searchQuery && `Searching for: ${searchQuery}`}
        {isDarkMode ? "Dark mode enabled" : "Light mode enabled"}
      </div>

      {/* 经文内容现在通过子节点显示，不再需要浮动组件 */}
      {/* <ScriptureContentDisplay
        content={selectedNodeContent}
        nodeTitle={selectedNode?.title}
        isVisible={showScriptureContent}
        onClose={handleCloseScriptureContent}
      /> */}


    </motion.div>;
}
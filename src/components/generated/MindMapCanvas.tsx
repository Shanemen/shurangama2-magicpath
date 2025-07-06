"use client";

import * as React from "react";
import { useState, useRef, useEffect, useCallback, useMemo } from "react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ZoomIn, ZoomOut, RotateCcw, Maximize2, Lightbulb } from "lucide-react";
import { useScriptureData } from "@/hooks/useScriptureData";
import { type MindMapNodeWithContent } from "@/lib/supabase";

export interface MindMapCanvasProps {
  searchQuery?: string;
  onNodeSelect?: (nodeId: string) => void;
  className?: string;
  data?: MindMapNodeWithContent[];
  loading?: boolean;
  error?: string | null;
  onCommentaryRequest?: (nodeId: string) => void;
}

export default function MindMapCanvas({
  searchQuery = "",
  onNodeSelect,
  className,
  data: propData,
  loading: propLoading,
  error: propError,
  onCommentaryRequest
}: MindMapCanvasProps) {
  // 如果没有传入数据，则使用hook获取
  const hookData = useScriptureData();
  const data = propData || hookData.data;
  const loading = propLoading !== undefined ? propLoading : hookData.loading;
  const error = propError !== undefined ? propError : hookData.error;
  
  // 🔍 DEBUG: 打印MindMapCanvas状态
  console.log('🔍 MindMapCanvas Debug:', {
    loading,
    error, 
    dataLength: data?.length,
    data: data,
    propData: propData,
    hookData: hookData.data
  });

  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [nodes, setNodes] = useState<MindMapNodeWithContent[]>(data);
  const [transform, setTransform] = useState({
    x: 0,
    y: 0,
    scale: 1
  });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({
    x: 0,
    y: 0
  });
  const [focusedNodeId, setFocusedNodeId] = useState<string | null>(null);

  // Node layout calculations
  const nodeWidth = 200;
  const nodeHeight = 80;
  const levelSpacing = 280;
  const siblingSpacing = 150;

  // Memoized calculation of subtree height to avoid recalculation
  const calculateSubtreeHeight = useMemo(() => {
    const memoizedCalc = (node: MindMapNodeWithContent): number => {
      if (!node.isExpanded || !node.children || node.children.length === 0) {
        return nodeHeight;
      }
      
      // Calculate total height needed by all children and their subtrees
      let totalChildrenHeight = 0;
      node.children.forEach(child => {
        totalChildrenHeight += memoizedCalc(child);
      });
      
      // Add spacing between children
      const childSpacing = (node.children.length - 1) * siblingSpacing;
      const childrenTotalHeight = totalChildrenHeight + childSpacing;
      
      // Return the maximum of node height and children total height
      return Math.max(nodeHeight, childrenTotalHeight);
    };
    
    return memoizedCalc;
  }, [nodeHeight, siblingSpacing]);

  // Memoized layout calculation - only recalculate when nodes change
  const nodePositions = useMemo(() => {
    const calculateLayout = (nodeList: MindMapNodeWithContent[], level = 0, startY = 0): Array<{
      node: MindMapNodeWithContent;
      x: number;
      y: number;
      level: number;
    }> => {
      const positions: Array<{
        node: MindMapNodeWithContent;
        x: number;
        y: number;
        level: number;
      }> = [];
      
      let currentY = startY;
      
      nodeList.forEach((node, index) => {
        const x = level * levelSpacing + 50;
        const subtreeHeight = calculateSubtreeHeight(node);
        
        // Position this node at the center of its allocated subtree space
        const nodeY = currentY + subtreeHeight / 2 - nodeHeight / 2;
        
        positions.push({
          node,
          x,
          y: nodeY,
          level
        });
        
        // If node is expanded, layout its children
        if (node.isExpanded && node.children && node.children.length > 0) {
          // Calculate space for children - center them within the subtree
          let totalChildrenHeight = 0;
          node.children.forEach(child => {
            totalChildrenHeight += calculateSubtreeHeight(child);
          });
          const childSpacing = (node.children.length - 1) * siblingSpacing;
          const childrenTotalHeight = totalChildrenHeight + childSpacing;
          
          // Start children layout from the top of their allocated space
          const childrenStartY = nodeY + nodeHeight / 2 - childrenTotalHeight / 2;
          const childPositions = calculateLayout(node.children, level + 1, childrenStartY);
          positions.push(...childPositions);
        }
        
        // Move to next sibling position
        currentY += subtreeHeight + siblingSpacing;
      });
      
      return positions;
    };
    
    return calculateLayout(nodes);
  }, [nodes, calculateSubtreeHeight, nodeHeight, levelSpacing, siblingSpacing]);

  // Memoized viewport adjustment calculation
  const viewportAdjustment = useMemo(() => {
    if (nodePositions.length === 0) return null;
    
    const minX = Math.min(...nodePositions.map(p => p.x));
    const maxX = Math.max(...nodePositions.map(p => p.x)) + nodeWidth;
    const minY = Math.min(...nodePositions.map(p => p.y));
    const maxY = Math.max(...nodePositions.map(p => p.y)) + nodeHeight;
    
    const contentWidth = maxX - minX + 100;
    const contentHeight = maxY - minY + 100;
    
    return {
      minX,
      maxX,
      minY,
      maxY,
      contentWidth,
      contentHeight
    };
  }, [nodePositions, nodeWidth, nodeHeight]);

  // 监听data变化更新本地nodes状态
  useEffect(() => {
    setNodes(data);
  }, [data]);

  // 处理搜索 - 现在由父组件处理
  // useEffect(() => {
  //   if (searchQuery) {
  //     searchNodes(searchQuery);
  //   }
  // }, [searchQuery, searchNodes]);

  // Toggle node expansion - optimized to avoid expensive recalculations
  const toggleNode = useCallback((nodeId: string) => {
    const updateNodes = (nodeList: MindMapNodeWithContent[]): MindMapNodeWithContent[] => {
      return nodeList.map(node => {
        if (node.id === nodeId) {
          return {
            ...node,
            isExpanded: !node.isExpanded
          };
        }
        if (node.children) {
          return {
            ...node,
            children: updateNodes(node.children)
          };
        }
        return node;
      });
    };
    
    setNodes(updateNodes(nodes));
  }, [nodes]);

  // Optimized viewport adjustment that uses memoized calculations
  const adjustViewport = useCallback(() => {
    if (!containerRef.current || !viewportAdjustment) return;
    
    const bounds = containerRef.current.getBoundingClientRect();
    const { minX, minY, contentWidth, contentHeight } = viewportAdjustment;
    
    const scaleX = bounds.width / contentWidth;
    const scaleY = bounds.height / contentHeight;
    const newScale = Math.min(scaleX, scaleY, 1);
    
    // Center the content in the viewport
    const centerX = bounds.width / 2 - (contentWidth * newScale) / 2;
    const centerY = bounds.height / 2 - (contentHeight * newScale) / 2;
    
    setTransform({
      x: centerX - minX * newScale,
      y: centerY - minY * newScale,
      scale: newScale
    });
  }, [viewportAdjustment]);

  // Trigger viewport adjustment after node changes
  useEffect(() => {
    const timer = setTimeout(() => {
      adjustViewport();
    }, 100);
    
    return () => clearTimeout(timer);
  }, [adjustViewport]);

  // 处理节点点击 - 选择节点、添加经文子节点并通知父组件
  const handleNodeClick = useCallback((nodeId: string) => {
    onNodeSelect?.(nodeId);
    
    // 查找被点击的节点
    const findNode = (nodeList: MindMapNodeWithContent[], targetId: string): MindMapNodeWithContent | null => {
      for (const node of nodeList) {
        if (node.id === targetId) return node;
        if (node.children) {
          const found = findNode(node.children, targetId);
          if (found) return found;
        }
      }
      return null;
    };

    const clickedNode = findNode(nodes, nodeId);
    
    // 如果节点有内容且还没有经文子节点，则添加经文子节点
    if (clickedNode && clickedNode.content && !clickedNode.children?.some(child => child.isScriptureNode)) {
      const updateNodes = (nodeList: MindMapNodeWithContent[]): MindMapNodeWithContent[] => {
        return nodeList.map(node => {
          if (node.id === nodeId) {
            // 创建经文子节点
            const scriptureChild: MindMapNodeWithContent = {
              id: `scripture_${nodeId}`,
              title: clickedNode.content!.original_text,
              isScriptureNode: true,
              isExpanded: false
            };
            
            return {
              ...node,
              isExpanded: true,
              children: [...(node.children || []), scriptureChild]
            };
          }
          if (node.children) {
            return {
              ...node,
              children: updateNodes(node.children)
            };
          }
          return node;
        });
      };
      
      setNodes(updateNodes(nodes));
    } else {
      // 普通的展开/收缩逻辑
      toggleNode(nodeId);
    }
  }, [onNodeSelect, toggleNode, nodes]);

  // 处理灯泡点击 - 请求显示注释
  const handleCommentaryClick = useCallback((nodeId: string, e: React.MouseEvent) => {
    e.stopPropagation(); // 阻止事件冒泡到节点点击
    onCommentaryRequest?.(nodeId);
  }, [onCommentaryRequest]);

  // 显示loading状态
  if (loading) {
    return (
      <div className={cn("relative w-full h-full overflow-hidden bg-background flex items-center justify-center", className)}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">正在加载楞严经数据...</p>
        </div>
      </div>
    );
  }

  // 显示错误状态
  if (error) {
    return (
      <div className={cn("relative w-full h-full overflow-hidden bg-background flex items-center justify-center", className)}>
        <div className="text-center">
          <p className="text-destructive mb-2">❌ 加载失败</p>
          <p className="text-muted-foreground text-sm">{error}</p>
        </div>
      </div>
    );
  }

  // Pan and zoom handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button === 0) {
      setIsDragging(true);
      setDragStart({
        x: e.clientX - transform.x,
        y: e.clientY - transform.y
      });
    }
  };
  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging) {
      setTransform(prev => ({
        ...prev,
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y
      }));
    }
  };
  const handleMouseUp = () => {
    setIsDragging(false);
  };
  const handleWheel = (e: React.WheelEvent) => {
    // 不使用preventDefault，而是通过其他方式防止默认滚动
    const delta = e.deltaY > 0 ? 0.9 : 1.1;
    const newScale = Math.max(0.1, Math.min(3, transform.scale * delta));
    setTransform(prev => ({
      ...prev,
      scale: newScale
    }));
  };

  // Keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!focusedNodeId) return;
    switch (e.key) {
      case 'Enter':
      case ' ':
        e.preventDefault();
        toggleNode(focusedNodeId);
        break;
      case 'ArrowLeft':
        e.preventDefault();
        setTransform(prev => ({
          ...prev,
          x: prev.x + 20
        }));
        break;
      case 'ArrowRight':
        e.preventDefault();
        setTransform(prev => ({
          ...prev,
          x: prev.x - 20
        }));
        break;
      case 'ArrowUp':
        e.preventDefault();
        setTransform(prev => ({
          ...prev,
          y: prev.y + 20
        }));
        break;
      case 'ArrowDown':
        e.preventDefault();
        setTransform(prev => ({
          ...prev,
          y: prev.y - 20
        }));
        break;
      case '+':
      case '=':
        e.preventDefault();
        setTransform(prev => ({
          ...prev,
          scale: Math.min(3, prev.scale * 1.1)
        }));
        break;
      case '-':
        e.preventDefault();
        setTransform(prev => ({
          ...prev,
          scale: Math.max(0.1, prev.scale * 0.9)
        }));
        break;
    }
  };

  // Control functions
  const zoomIn = () => setTransform(prev => ({
    ...prev,
    scale: Math.min(3, prev.scale * 1.2)
  }));
  const zoomOut = () => setTransform(prev => ({
    ...prev,
    scale: Math.max(0.1, prev.scale * 0.8)
  }));
  const resetView = () => setTransform({
    x: 0,
    y: 0,
    scale: 1
  });
  const fitToScreen = () => {
    if (!containerRef.current) return;
    const bounds = containerRef.current.getBoundingClientRect();
    const contentWidth = Math.max(...nodePositions.map(p => p.x)) + nodeWidth + 100;
    const contentHeight = Math.max(...nodePositions.map(p => Math.abs(p.y))) * 2 + nodeHeight + 100;
    const scaleX = bounds.width / contentWidth;
    const scaleY = bounds.height / contentHeight;
    const scale = Math.min(scaleX, scaleY, 1);
    setTransform({
      x: 50,
      y: bounds.height / 2,
      scale
    });
  };

  // Generate curved "noodle" path between nodes (inspired by jsMind)
  const generatePath = (x1: number, y1: number, x2: number, y2: number) => {
    const startX = x1 + nodeWidth;
    const startY = y1 + nodeHeight / 2;
    const endX = x2;
    const endY = y2 + nodeHeight / 2;
    
    const deltaX = endX - startX;
    const deltaY = endY - startY;
    
    // More subtle, jsMind-inspired curve calculations
    const controlDistance = Math.min(Math.abs(deltaX) * 0.5, 120); // Cap max curve distance
    const verticalOffset = Math.abs(deltaY) * 0.1; // Reduced vertical offset for subtlety
    
    // Smoother control points with better proportions
    const cp1X = startX + controlDistance;
    const cp1Y = startY + (deltaY > 0 ? verticalOffset : -verticalOffset);
    
    // More balanced second control point
    const cp2X = endX - controlDistance * 0.4;
    const cp2Y = endY - (deltaY > 0 ? verticalOffset * 0.5 : -verticalOffset * 0.5);
    
    return `M ${startX} ${startY} C ${cp1X} ${cp1Y} ${cp2X} ${cp2Y} ${endX} ${endY}`;
  };

  // Check if node matches search query
  const isHighlighted = (node: MindMapNodeWithContent) => {
    if (!searchQuery) return false;
    return node.title.toLowerCase().includes(searchQuery.toLowerCase()) || node.pageRef?.toLowerCase().includes(searchQuery.toLowerCase());
  };
  return <div 
    ref={containerRef} 
    className={cn("relative w-full h-full overflow-hidden bg-background", className)}
    style={{
      backgroundImage: `radial-gradient(circle, rgba(99, 102, 241, 0.3) 1px, transparent 1px)`,
      backgroundSize: '16px 16px',
      touchAction: 'none'
    }}
    role="application" 
    aria-label="Shurangama Sutra Mind Map"
  >
      <svg ref={svgRef} className="w-full h-full cursor-grab active:cursor-grabbing bg-transparent" onMouseDown={handleMouseDown} onMouseMove={handleMouseMove} onMouseUp={handleMouseUp} onMouseLeave={handleMouseUp} onWheel={handleWheel} onKeyDown={handleKeyDown} tabIndex={0} role="img" aria-describedby="mindmap-description" style={{ touchAction: 'none' }} onClick={(e) => {
        // Only handle clicks on the SVG background, not on nodes
        if (e.target === e.currentTarget) {
          // This is a background click, do nothing for now
        }
      }}>
        <defs>
          <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="2" dy="4" stdDeviation="3" floodOpacity="0.1" />
          </filter>
        </defs>
        
        <g transform={`translate(${transform.x}, ${transform.y}) scale(${transform.scale})`}>
          {/* Render connections */}
          {nodePositions.map(({
          node,
          x,
          y,
          level
        }) => {
          if (!node.children || !node.isExpanded) return null;
          return node.children.map(child => {
            const childPos = nodePositions.find(p => p.node.id === child.id);
            if (!childPos) return null;
            const opacity = level === 0 ? 1 : level === 1 ? 0.8 : 0.6;
            return <motion.path key={`${node.id}-${child.id}`} d={generatePath(x, y, childPos.x, childPos.y)} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" opacity={opacity} className="stroke-primary" initial={{
              pathLength: 0
            }} animate={{
              pathLength: 1
            }} transition={{
              duration: 0.5,
              ease: "easeInOut"
            }} />;
          });
        })}
          
          {/* Render nodes */}
          {nodePositions.map(({
          node,
          x,
          y,
          level
        }) => {
          const opacity = 1; // All nodes now have full opacity for accessibility
          const highlighted = isHighlighted(node);
          const isFocused = focusedNodeId === node.id;
          return <motion.g key={node.id} initial={{
            opacity: 0,
            scale: 0.8
          }} animate={{
            opacity,
            scale: 1
          }} transition={{
            duration: 0.3
          }} style={{
            opacity
          }}>
                <motion.rect x={x} y={y} width={nodeWidth} height={nodeHeight} rx="12" strokeWidth={isFocused ? "3" : "1"} filter="url(#shadow)" className={cn("cursor-pointer transition-all duration-200", highlighted ? "fill-primary stroke-primary" : node.isScriptureNode ? "fill-card stroke-transparent" : "fill-card stroke-border", isFocused && "stroke-primary")} onClick={(e) => {
                  e.stopPropagation();
                  handleNodeClick(node.id);
                }} onFocus={() => setFocusedNodeId(node.id)} tabIndex={0} role="button" aria-expanded={node.isExpanded} aria-label={`${node.title}, ${node.pageRef || ''}, Lecture ${node.lectureNumber || ''}`} whileHover={{
              scale: 1.02
            }} whileTap={{
              scale: 0.98
            }} />
                
                {/* Node title */}
                {node.isScriptureNode ? (
                  // 经文节点支持多行显示
                  <foreignObject x={x + 8} y={y + 8} width={nodeWidth - 16} height={nodeHeight - 16}>
                    <div className={cn("text-sm font-medium leading-tight p-2 h-full flex items-center", highlighted ? "text-primary-foreground" : "text-card-foreground")} style={{ fontFamily: "'Lora', serif" }}>
                      {node.title.length > 60 ? `${node.title.substring(0, 60)}...` : node.title}
                    </div>
                  </foreignObject>
                ) : (
                  <text x={x + 16} y={y + 24} fontSize="14" fontWeight="600" fontFamily="'Lora', serif" className={cn("pointer-events-none select-none", highlighted ? "fill-primary-foreground" : "fill-card-foreground")}>
                    {node.title.length > 20 ? `${node.title.substring(0, 20)}...` : node.title}
                  </text>
                )}

                {/* Commentary Lightbulb Icon - 只对经文节点显示 */}
                {node.isScriptureNode && (
                  <g
                    style={{ transformOrigin: `${x + nodeWidth + 40}px ${y + nodeHeight / 2}px` }}
                    className="hover:scale-110 transition-transform duration-200 cursor-pointer"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleCommentaryClick(node.id, e);
                    }}
                  >
                    <circle 
                      cx={x + nodeWidth + 40} 
                      cy={y + nodeHeight / 2} 
                      r="16" 
                      className="fill-white dark:fill-white"
                      stroke="#22c55e"
                      strokeWidth="2"
                      filter="url(#shadow)"
                    />
                    <foreignObject
                      x={x + nodeWidth + 40 - 8}
                      y={y + nodeHeight / 2 - 8}
                      width="16"
                      height="16"
                    >
                      <Lightbulb 
                        size={16} 
                        className="pointer-events-none text-gray-600 dark:text-gray-400"
                      />
                    </foreignObject>
                  </g>
                )}
                
                {/* Page reference - 只对非经文节点显示 */}
                {!node.isScriptureNode && node.pageRef && <text x={x + 16} y={y + 44} fontSize="12" className={cn("pointer-events-none select-none", highlighted ? "fill-primary-foreground" : "fill-foreground")}>
                    {node.pageRef}
                  </text>}
                
                {/* Lecture number badge - 只对非经文节点显示 */}
                {!node.isScriptureNode && node.lectureNumber && <g>
                    <circle cx={x + nodeWidth - 24} cy={y + 20} r="12" className="pointer-events-none fill-primary" />
                    <text x={x + nodeWidth - 24} y={y + 25} fontSize="10" fontWeight="600" textAnchor="middle" className="pointer-events-none select-none fill-primary-foreground">
                      {node.lectureNumber}
                    </text>
                  </g>}
                
                {/* Expansion indicator */}
                {node.children && node.children.length > 0 && <motion.text x={x + nodeWidth - 16} y={y + nodeHeight - 12} fontSize="16" textAnchor="middle" className="pointer-events-none select-none fill-foreground" animate={{
              rotate: node.isExpanded ? 90 : 0
            }} transition={{
              duration: 0.2
            }}>
                    ▶
                  </motion.text>}
              </motion.g>;
        })}
        </g>
      </svg>
      
      {/* Floating Controls */}
      <motion.div className="absolute bottom-4 right-4 flex flex-col gap-2" initial={{
      opacity: 0,
      y: 20
    }} animate={{
      opacity: 1,
      y: 0
    }} transition={{
      delay: 0.5
    }}>
        <Button size="icon" variant="secondary" onClick={zoomIn} aria-label="Zoom in" className="shadow-lg backdrop-blur-sm bg-background/80">
          <ZoomIn className="h-4 w-4" />
        </Button>
        <Button size="icon" variant="secondary" onClick={zoomOut} aria-label="Zoom out" className="shadow-lg backdrop-blur-sm bg-background/80">
          <ZoomOut className="h-4 w-4" />
        </Button>
        <Button size="icon" variant="secondary" onClick={fitToScreen} aria-label="Fit to screen" className="shadow-lg backdrop-blur-sm bg-background/80">
          <Maximize2 className="h-4 w-4" />
        </Button>
        <Button size="icon" variant="secondary" onClick={resetView} aria-label="Reset view" className="shadow-lg backdrop-blur-sm bg-background/80">
          <RotateCcw className="h-4 w-4" />
        </Button>
      </motion.div>
      
      {/* Screen reader description */}
      <div id="mindmap-description" className="sr-only">
        Interactive mind map of the Shurangama Sutra. Use arrow keys to pan, plus and minus to zoom, 
        Enter or Space to expand/collapse nodes. Tab to navigate between nodes.
      </div>
      
      {/* Search results announcement */}
      {searchQuery && <div className="sr-only" role="status" aria-live="polite">
          {nodePositions.filter(({
        node
      }) => isHighlighted(node)).length} nodes match "{searchQuery}"
        </div>}
    </div>;
}
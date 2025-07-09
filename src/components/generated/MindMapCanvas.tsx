"use client";

import * as React from "react";
import { useState, useRef, useEffect, useCallback, useMemo } from "react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";
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
  sidebarExpanded?: boolean;
  selectedCommentaryNodeId?: string | null;
}

export default function MindMapCanvas({
  searchQuery = "",
  onNodeSelect,
  className,
  data: propData,
  loading: propLoading,
  error: propError,
  onCommentaryRequest,
  sidebarExpanded = false,
  selectedCommentaryNodeId = null
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
  const [enableTransition, setEnableTransition] = useState(false);

  // Node layout calculations
  const nodeWidth = 200;
  const nodeHeight = 80;
  const levelSpacing = 280;
  const siblingSpacing = 150;

  // 经文节点动态尺寸计算 - 只针对经文节点
  const calculateScriptureNodeDimensions = useCallback((text: string): { width: number; height: number } => {
    const charWidth = 14;
    const lineHeight = 24;
    const padding = 32; // 左右各16px
    const minWidth = 200;
    const maxWidth = 400;
    const minHeight = 80;
    const maxHeight = 160;
    
    // 真正的动态计算：基于实际文字长度
    const contentWidth = text.length * charWidth + padding;
    const finalWidth = Math.min(maxWidth, Math.max(minWidth, contentWidth));
    
    // 基于实际换行计算高度
    const maxCharsPerLine = Math.floor((finalWidth - padding) / charWidth);
    const estimatedLines = Math.ceil(text.length / maxCharsPerLine);
    const finalHeight = Math.min(maxHeight, Math.max(minHeight, estimatedLines * lineHeight + padding));
    
    // 调试输出
    console.log(`🔍 动态计算 "${text.substring(0, 15)}...": 长度=${text.length}, 内容宽度=${contentWidth}px, 最终宽度=${finalWidth}px, 高度=${finalHeight}px`);
    
    return { width: finalWidth, height: finalHeight };
  }, []);

  // 获取节点尺寸 - 经文节点使用动态尺寸，普通节点使用固定尺寸
  const getNodeDimensions = useCallback((node: MindMapNodeWithContent) => {
    if (node.isScriptureNode) {
      const dimensions = calculateScriptureNodeDimensions(node.title);
      console.log(`📏 经文节点 "${node.title.substring(0, 10)}...": ${dimensions.width}x${dimensions.height}`);
      return dimensions;
    }
    console.log(`📏 普通节点 "${node.title}": ${nodeWidth}x${nodeHeight}`);
    return { width: nodeWidth, height: nodeHeight };
  }, [calculateScriptureNodeDimensions, nodeWidth, nodeHeight]);

  // Memoized calculation of subtree height to avoid recalculation
  const calculateSubtreeHeight = useMemo(() => {
    const memoizedCalc = (node: MindMapNodeWithContent): number => {
      const { height: currentNodeHeight } = getNodeDimensions(node);
      
      if (!node.isExpanded || !node.children || node.children.length === 0) {
        return currentNodeHeight;
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
      return Math.max(currentNodeHeight, childrenTotalHeight);
    };
    
    return memoizedCalc;
  }, [getNodeDimensions, siblingSpacing]);

  // Memoized layout calculation - only recalculate when nodes change
  const nodePositions = useMemo(() => {
    const calculateLayout = (nodeList: MindMapNodeWithContent[], level = 0, startY = 0): Array<{
      node: MindMapNodeWithContent;
      x: number;
      y: number;
      level: number;
      width: number;
      height: number;
    }> => {
      const positions: Array<{
        node: MindMapNodeWithContent;
        x: number;
        y: number;
        level: number;
        width: number;
        height: number;
      }> = [];
      
      let currentY = startY;
      
      nodeList.forEach((node, index) => {
        const x = level * levelSpacing;
        const { width: currentNodeWidth, height: currentNodeHeight } = getNodeDimensions(node);
        const subtreeHeight = calculateSubtreeHeight(node);
        
        // Position this node at the center of its allocated subtree space
        const nodeY = currentY + subtreeHeight / 2 - currentNodeHeight / 2;
        
        positions.push({
          node,
          x,
          y: nodeY,
          level,
          width: currentNodeWidth,
          height: currentNodeHeight
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
          const childrenStartY = nodeY + currentNodeHeight / 2 - childrenTotalHeight / 2;
          const childPositions = calculateLayout(node.children, level + 1, childrenStartY);
          positions.push(...childPositions);
        }
        
        // Move to next sibling position
        currentY += subtreeHeight + siblingSpacing;
      });
      
      return positions;
    };
    
    return calculateLayout(nodes);
  }, [nodes, calculateSubtreeHeight, getNodeDimensions, levelSpacing, siblingSpacing]);

  // Memoized viewport adjustment calculation
  const viewportAdjustment = useMemo(() => {
    if (nodePositions.length === 0) return null;
    
    const minX = Math.min(...nodePositions.map(p => p.x));
    const maxX = Math.max(...nodePositions.map(p => p.x + p.width));
    const minY = Math.min(...nodePositions.map(p => p.y));
    const maxY = Math.max(...nodePositions.map(p => p.y + p.height));
    
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
  }, [nodePositions]);

  // 更新数据
  useEffect(() => {
    if (!data) return;
    setNodes(data);
  }, [data]);

  // 监听侧边栏展开状态，自动调整视图位置避免遮挡
  useEffect(() => {
    if (!containerRef.current || nodePositions.length === 0) return;
    
    const bounds = containerRef.current.getBoundingClientRect();
    const sidebarWidth = 384; // w-96 = 384px
    const padding = 40; // 额外的边距
    
    // 如果侧边栏展开且有选中的注释节点
    if (sidebarExpanded && selectedCommentaryNodeId) {
      // 找到被选中的节点位置
      const targetNodePosition = nodePositions.find(
        pos => pos.node.id === selectedCommentaryNodeId
      );
      
      if (targetNodePosition) {
        const nodeScreenX = targetNodePosition.x * transform.scale + transform.x;
        // 智能计算lightbulb icon空间：根据节点宽度动态调整
        const baseOffset = 12;
        const dynamicOffset = Math.min(28, Math.max(4, (targetNodePosition.width - 200) * 0.15));
        const lightbulbOffset = baseOffset + dynamicOffset;
        const lightbulbIconSpace = lightbulbOffset + 16; // 偏移 + 圆形半径
        const nodeWithIconRight = nodeScreenX + (targetNodePosition.width + lightbulbIconSpace) * transform.scale;
        
        // 计算被侧边栏遮挡的区域
        const sidebarLeft = bounds.width - sidebarWidth;
        
        // 如果节点（包括lightbulb icon）被遮挡，调整视图位置
        if (nodeWithIconRight > sidebarLeft - padding) {
          const requiredOffset = nodeWithIconRight - (sidebarLeft - padding);
          
          // 启用过渡效果
          setEnableTransition(true);
          
          // 使用平滑的过渡效果
          setTransform(prev => ({
            ...prev,
            x: prev.x - requiredOffset
          }));
          
          console.log('🎯 自动调整视图位置，避免节点被侧边栏遮挡');
          
          // 过渡完成后禁用过渡效果
          setTimeout(() => {
            setEnableTransition(false);
          }, 300);
        }
      }
          }
      // 侧边栏收起时保持当前位置，用户可以手动使用"适应屏幕"按钮重新居中
    }, [sidebarExpanded, selectedCommentaryNodeId, nodePositions, transform.scale]);

  // Initial centering - only run once when data first loads
  const [hasInitialized, setHasInitialized] = useState(false);
  
  useEffect(() => {
    if (!hasInitialized && data && data.length > 0 && nodePositions.length > 0) {
      // Auto-center content on initial load
      setTimeout(() => {
        if (containerRef.current) {
          const bounds = containerRef.current.getBoundingClientRect();
          const { minX, maxX, minY, maxY, contentWidth, contentHeight } = viewportAdjustment || {};
          
          if (contentWidth && contentHeight) {
            const scaleX = bounds.width / contentWidth;
            const scaleY = bounds.height / contentHeight;
            const newScale = Math.min(scaleX, scaleY, 1);
            
            // Align horizontally with logo (approximately 20px from left edge)
            // Keep vertical centering
            const logoAlignX = 20; // Approximate logo position
            const centerY = bounds.height / 2 - (contentHeight * newScale) / 2;
            
            setTransform({
              x: logoAlignX - (minX || 0) * newScale,
              y: centerY - (minY || 0) * newScale,
              scale: newScale
            });
          }
        }
        setHasInitialized(true);
      }, 100);
    }
  }, [data, nodePositions, viewportAdjustment, hasInitialized]);

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

  // Intelligent viewport adjustment - centers content and optimizes space usage
  const smartAdjustViewport = useCallback((expandedNodeId?: string) => {
    if (!containerRef.current) return;
    
    const bounds = containerRef.current.getBoundingClientRect();
    
    // If a specific node was expanded, focus on that node and its children
    if (expandedNodeId) {
      console.log("🔍 Smart adjust for node:", expandedNodeId);
      console.log("🔍 Available nodePositions:", nodePositions.length);
      
      const expandedNodePos = nodePositions.find(pos => pos.node.id === expandedNodeId);
      if (!expandedNodePos) {
        console.log("❌ Expanded node not found in positions");
        return;
      }
      
      // Recursive function to find all relevant expanded nodes
      const findRelevantNodeIds = (nodeId: string, nodeList: MindMapNodeWithContent[]): string[] => {
        const relevantIds: string[] = [];
        
        const findNode = (nodes: MindMapNodeWithContent[], targetId: string): MindMapNodeWithContent | null => {
          for (const node of nodes) {
            if (node.id === targetId) return node;
            if (node.children) {
              const found = findNode(node.children, targetId);
              if (found) return found;
            }
          }
          return null;
        };
        
        const collectExpandedNodes = (currentNodeId: string) => {
          relevantIds.push(currentNodeId);
          
          const node = findNode(nodeList, currentNodeId);
          if (node && node.children) {
            // Include all visible children (either already expanded or will be expanded)
            for (const child of node.children) {
              // Always include the child itself
              relevantIds.push(child.id);
              
              // If the child is expanded, recursively include its children
              if (child.isExpanded) {
                collectExpandedNodes(child.id);
              }
            }
          }
          
          // Also include any scripture children (they are often added dynamically)
          const scriptureChildId = `scripture_${currentNodeId}`;
          const scriptureChild = findNode(nodeList, scriptureChildId);
          if (scriptureChild) {
            relevantIds.push(scriptureChildId);
            // If scripture child is expanded, include its children too
            if (scriptureChild.isExpanded && scriptureChild.children) {
              for (const child of scriptureChild.children) {
                collectExpandedNodes(child.id);
              }
            }
          }
        };
        
        collectExpandedNodes(nodeId);
        return [...new Set(relevantIds)]; // Remove duplicates
      };
      
      // Get all relevant node IDs recursively
      const relevantNodeIds = findRelevantNodeIds(expandedNodeId, nodes);
      console.log("🔍 Relevant node IDs:", relevantNodeIds);
      
      // Find all relevant positions
      const relevantPositions = nodePositions.filter(pos => 
        relevantNodeIds.includes(pos.node.id)
      );
      
      console.log("🔍 Found relevant positions:", relevantPositions.length);
      
      if (relevantPositions.length === 0) {
        console.log("❌ No relevant positions found");
        return;
      }
      
      // Calculate bounds for the expanded content
      const nodeMinX = Math.min(...relevantPositions.map(p => p.x));
      const nodeMaxX = Math.max(...relevantPositions.map(p => p.x)) + expandedNodePos.width;
      const nodeMinY = Math.min(...relevantPositions.map(p => p.y));
      const nodeMaxY = Math.max(...relevantPositions.map(p => p.y)) + expandedNodePos.height;
      
      // Calculate current viewport bounds
      const currentViewLeft = -transform.x / transform.scale;
      const currentViewTop = -transform.y / transform.scale;
      const currentViewRight = currentViewLeft + bounds.width / transform.scale;
      const currentViewBottom = currentViewTop + bounds.height / transform.scale;
      
              // Calculate overall content bounds for intelligent positioning
        const allMinX = Math.min(...nodePositions.map(p => p.x));
        const allMaxX = Math.max(...nodePositions.map(p => p.x + p.width));
        const allMinY = Math.min(...nodePositions.map(p => p.y));
        const allMaxY = Math.max(...nodePositions.map(p => p.y + p.height));
      
      console.log("🔍 Expanded content bounds:", { nodeMinX, nodeMaxX, nodeMinY, nodeMaxY });
      console.log("🔍 All content bounds:", { allMinX, allMaxX, allMinY, allMaxY });
      console.log("🔍 Viewport bounds:", { currentViewLeft, currentViewRight, currentViewTop, currentViewBottom });
      
      // Check if adjustment is needed
      const isNodeOutsideView = 
        nodeMinX < currentViewLeft || 
        nodeMaxX > currentViewRight || 
        nodeMinY < currentViewTop || 
        nodeMaxY > currentViewBottom;
      
      console.log("🔍 Content outside view?", isNodeOutsideView);
      
      if (isNodeOutsideView) {
        let adjustX = 0;
        let adjustY = 0;
        
        const padding = 50;
        const viewportWidth = bounds.width / transform.scale;
        const viewportHeight = bounds.height / transform.scale;
        
        // Intelligent X-axis adjustment
        const expandedContentWidth = nodeMaxX - nodeMinX;
        const expandedContentCenterX = (nodeMinX + nodeMaxX) / 2;
        
        if (nodeMinX < currentViewLeft || nodeMaxX > currentViewRight) {
          // Check if we can center the expanded content
          if (expandedContentWidth + padding * 2 <= viewportWidth) {
            // We can center it - but also consider overall layout balance
            const idealCenterX = expandedContentCenterX;
            const idealViewportLeft = idealCenterX - viewportWidth / 2;
            
            // Constrain to reasonable bounds relative to all content
            const minViewportLeft = Math.max(allMinX - padding, idealViewportLeft);
            const maxViewportLeft = Math.min(allMaxX - viewportWidth + padding, idealViewportLeft);
            const optimalViewportLeft = Math.min(maxViewportLeft, Math.max(minViewportLeft, idealViewportLeft));
            
            adjustX = (currentViewLeft - optimalViewportLeft) * transform.scale;
            console.log("🔧 Centering horizontally, adjust:", adjustX);
          } else {
            // Content too wide, just make it visible
            if (nodeMinX < currentViewLeft) {
              adjustX = (currentViewLeft - nodeMinX + padding) * transform.scale;
            } else if (nodeMaxX > currentViewRight) {
              adjustX = -(nodeMaxX - currentViewRight + padding) * transform.scale;
            }
            console.log("🔧 Making visible horizontally, adjust:", adjustX);
          }
        }
        
        // Intelligent Y-axis adjustment
        const expandedContentHeight = nodeMaxY - nodeMinY;
        const expandedContentCenterY = (nodeMinY + nodeMaxY) / 2;
        
        if (nodeMinY < currentViewTop || nodeMaxY > currentViewBottom) {
          // Check if we can center the expanded content
          if (expandedContentHeight + padding * 2 <= viewportHeight) {
            // We can center it vertically
            const idealCenterY = expandedContentCenterY;
            const idealViewportTop = idealCenterY - viewportHeight / 2;
            
            // Constrain to reasonable bounds
            const minViewportTop = Math.max(allMinY - padding, idealViewportTop);
            const maxViewportTop = Math.min(allMaxY - viewportHeight + padding, idealViewportTop);
            const optimalViewportTop = Math.min(maxViewportTop, Math.max(minViewportTop, idealViewportTop));
            
            adjustY = (currentViewTop - optimalViewportTop) * transform.scale;
            console.log("🔧 Centering vertically, adjust:", adjustY);
          } else {
            // Content too tall, just make it visible
            if (nodeMinY < currentViewTop) {
              adjustY = (currentViewTop - nodeMinY + padding) * transform.scale;
            } else if (nodeMaxY > currentViewBottom) {
              adjustY = -(nodeMaxY - currentViewBottom + padding) * transform.scale;
            }
            console.log("🔧 Making visible vertically, adjust:", adjustY);
          }
        }
        
        console.log("🔧 Final intelligent adjustment:", { adjustX, adjustY });
        
        // Apply the adjustment
        setTransform(prev => ({
          ...prev,
          x: prev.x + adjustX,
          y: prev.y + adjustY
        }));
      } else {
        console.log("✅ Content already visible, no adjustment needed");
              }
      }
    }, [nodePositions, transform]);

  // Remove automatic viewport adjustment on every layout change
  // Instead, users can manually use fitToScreen when needed
  
  // Track nodes that need viewport adjustment after layout update
  const [pendingViewportAdjustment, setPendingViewportAdjustment] = useState<string | null>(null);

  // Add optional smart adjustment for specific cases
  const handleNodeToggle = useCallback((nodeId: string, shouldAdjust: boolean = false) => {
    toggleNode(nodeId);
    
    // Only adjust viewport if specifically requested or if it's the first expansion
    if (shouldAdjust) {
      setPendingViewportAdjustment(nodeId);
    }
  }, [toggleNode]);

  // Execute viewport adjustment after nodePositions update
  useEffect(() => {
    if (pendingViewportAdjustment && nodePositions.length > 0) {
      setTimeout(() => {
        smartAdjustViewport(pendingViewportAdjustment);
        setPendingViewportAdjustment(null);
      }, 100); // Shorter delay since positions are already calculated
    }
  }, [nodePositions, pendingViewportAdjustment, smartAdjustViewport]);

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
      
      // Smart adjust for new scripture content
      setPendingViewportAdjustment(nodeId);
    } else {
      // 普通的展开/收缩逻辑 - 也使用智能调整
      toggleNode(nodeId);
      
      // Apply smart adjustment for regular node expansions too
      setPendingViewportAdjustment(nodeId);
    }
  }, [onNodeSelect, toggleNode, smartAdjustViewport, nodes]);

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
      setEnableTransition(false); // 拖拽时禁用过渡效果
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
    setEnableTransition(false); // 缩放时禁用过渡效果
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
        // Use smart adjustment for keyboard navigation
        handleNodeToggle(focusedNodeId, true);
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
  const zoomIn = () => {
    setEnableTransition(false);
    setTransform(prev => ({
      ...prev,
      scale: Math.min(3, prev.scale * 1.2)
    }));
  };
  const zoomOut = () => {
    setEnableTransition(false);
    setTransform(prev => ({
      ...prev,
      scale: Math.max(0.1, prev.scale * 0.8)
    }));
  };
  const resetView = () => {
    // Reset to original data state (with original isExpanded values)
    if (data && data.length > 0) {
      const resetNodes = (originalList: MindMapNodeWithContent[]): MindMapNodeWithContent[] => {
        return originalList.map(node => ({
          ...node,
          isExpanded: false, // Reset all to collapsed
          children: node.children ? resetNodes(node.children) : undefined
        }));
      };
      
      // Reset to original data structure but with all nodes collapsed
      setNodes(resetNodes(data));
      
      // Reset view to initial centered position after brief delay
      setTimeout(() => {
        if (!containerRef.current) return;
        
        const bounds = containerRef.current.getBoundingClientRect();
        
        // Use the same alignment logic as initial load
        setEnableTransition(false);
        setTransform({
          x: 20, // Align with logo position
          y: bounds.height / 2,
          scale: 1
        });
        
        // Trigger initial auto-centering after reset
        setHasInitialized(false);
      }, 100);
    }
  };
  const fitToScreen = () => {
    if (!containerRef.current || nodePositions.length === 0) return;
    
    const bounds = containerRef.current.getBoundingClientRect();
    
    // Calculate actual content bounds
    const minX = Math.min(...nodePositions.map(p => p.x));
    const maxX = Math.max(...nodePositions.map(p => p.x + p.width));
    const minY = Math.min(...nodePositions.map(p => p.y));
    const maxY = Math.max(...nodePositions.map(p => p.y + p.height));
    
    const contentWidth = maxX - minX;
    const contentHeight = maxY - minY;
    
    // Add uniform padding (margin)
    const padding = 80;
    const availableWidth = bounds.width - padding * 2;
    const availableHeight = bounds.height - padding * 2;
    
    // Calculate scale to fit both dimensions with padding
    const scaleX = availableWidth / contentWidth;
    const scaleY = availableHeight / contentHeight;
    const newScale = Math.min(scaleX, scaleY, 1); // Don't zoom in, only fit
    
    // Calculate content center points
    const contentCenterY = (minY + maxY) / 2;
    
    // Calculate viewport center points
    const viewportCenterY = bounds.height / 2;
    
    // Align horizontally with logo (approximately 20px from left edge)
    // Keep vertical centering
    const logoAlignX = 20; // Approximate logo position
    const offsetX = logoAlignX - minX * newScale;
    const offsetY = viewportCenterY - contentCenterY * newScale;
    
    setEnableTransition(false);
    setTransform({
      x: offsetX,
      y: offsetY,
      scale: newScale
    });
  };

  // Generate curved "noodle" path between nodes (inspired by jsMind)
  const generatePath = (x1: number, y1: number, x2: number, y2: number, height1: number, height2: number, width1: number) => {
    const startX = x1 + width1;
    const startY = y1 + height1 / 2;
    const endX = x2;
    const endY = y2 + height2 / 2;
    
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

      <svg ref={svgRef} className="w-full h-full cursor-grab active:cursor-grabbing bg-transparent focus:outline-none" onMouseDown={handleMouseDown} onMouseMove={handleMouseMove} onMouseUp={handleMouseUp} onMouseLeave={handleMouseUp} onWheel={handleWheel} onKeyDown={handleKeyDown} tabIndex={0} role="img" aria-describedby="mindmap-description" style={{ touchAction: 'none', outline: 'none' }} onClick={(e) => {
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
        
        <g 
          transform={`translate(${transform.x}, ${transform.y}) scale(${transform.scale})`}
          style={{
            transition: enableTransition ? 'transform 0.3s ease-out' : 'none'
          }}
        >
          {/* Render connections */}
          {nodePositions.map(({
          node,
          x,
          y,
          level,
          width,
          height
        }) => {
          if (!node.children || !node.isExpanded) return null;
          return node.children.map(child => {
            const childPos = nodePositions.find(p => p.node.id === child.id);
            if (!childPos) return null;
            const opacity = level === 0 ? 1 : level === 1 ? 0.8 : 0.6;
            return <motion.path key={`${node.id}-${child.id}`} d={generatePath(x, y, childPos.x, childPos.y, height, childPos.height, width)} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" opacity={opacity} className="stroke-primary" initial={{
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
          level,
          width,
          height
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
                {/* 节点背景 - 经文节点和普通节点区分样式 */}
                <motion.rect 
                  x={x} 
                  y={y} 
                  width={width} 
                  height={height} 
                  rx={node.isScriptureNode ? "0" : "12"} 
                  strokeWidth={isFocused ? "3" : node.isScriptureNode ? "0" : "1"} 
                  filter={node.isScriptureNode ? "none" : "url(#shadow)"} 
                  className={cn(
                    "cursor-pointer transition-all duration-200 focus:outline-none",
                    node.isScriptureNode ? "fill-transparent stroke-transparent" : 
                    (highlighted ? "fill-primary stroke-primary" : "fill-card stroke-border"),
                    isFocused && !node.isScriptureNode && "stroke-primary"
                  )} 
                  style={{ outline: 'none' }} 
                  onClick={(e) => {
                    e.stopPropagation();
                    handleNodeClick(node.id);
                  }} 
                  onFocus={() => setFocusedNodeId(node.id)} 
                  tabIndex={0} 
                  role="button" 
                  aria-expanded={node.isExpanded} 
                  aria-label={`${node.title}, ${node.pageRef || ''}, Lecture ${node.lectureNumber || ''}`} 
                  whileHover={{
                    scale: 1.02
                  }} 
                  whileTap={{
                    scale: 0.98
                  }} 
                />
                
                {/* Node title */}
                {node.isScriptureNode ? (
                  // 经文节点 - 完整显示内容，使用绿色文字
                  <foreignObject x={x + 8} y={y + 8} width={width - 16} height={height - 16}>
                    <div className="text-sm font-medium leading-relaxed p-2 h-full flex items-start justify-center flex-col text-green-600" style={{ fontFamily: "'Lora', serif" }}>
                      {node.title}
                    </div>
                  </foreignObject>
                ) : (
                  // 普通节点 - 保持原有样式
                  <text x={x + 16} y={y + 24} fontSize="14" fontWeight="600" fontFamily="'Lora', serif" className={cn("pointer-events-none select-none", highlighted ? "fill-primary-foreground" : "fill-card-foreground")}>
                    {node.title.length > 20 ? `${node.title.substring(0, 20)}...` : node.title}
                  </text>
                )}

                {/* Commentary Lightbulb Icon - 只对经文节点显示 */}
                {node.isScriptureNode && (() => {
                  // 使用节点右边界 + 一致的偏移量
                  const CONSISTENT_OFFSET_VALUE = 20; // 统一的偏移距离
                  const lightbulbX = x + width + CONSISTENT_OFFSET_VALUE;
                  const lightbulbY = y + height / 2;
                  
                  // 调试信息：验证宽度计算
                  console.log(`💡 灯泡位置 "${node.title.substring(0, 20)}...": 文本长度=${node.title.length}, 容器宽度=${width}px, 灯泡X=${lightbulbX}px`);
                  
                  return (
                    <g
                      style={{ transformOrigin: `${lightbulbX}px ${lightbulbY}px` }}
                      className="hover:scale-110 transition-transform duration-200 cursor-pointer"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleCommentaryClick(node.id, e);
                      }}
                    >
                      <circle 
                        cx={lightbulbX} 
                        cy={lightbulbY} 
                        r="16" 
                        className="fill-white dark:fill-white"
                        stroke="#22c55e"
                        strokeWidth="2"
                        filter="url(#shadow)"
                      />
                      <foreignObject
                        x={lightbulbX - 8}
                        y={lightbulbY - 8}
                        width="16"
                        height="16"
                      >
                        <Lightbulb 
                          size={16} 
                          className="pointer-events-none text-gray-600 dark:text-gray-400"
                        />
                      </foreignObject>
                    </g>
                  );
                })()}
                

                
                {/* Expansion indicator */}
                {node.children && node.children.length > 0 && <motion.text x={x + width - 16} y={y + height - 12} fontSize="16" textAnchor="middle" className="pointer-events-none select-none fill-foreground" animate={{
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
      <motion.div 
        className="absolute bottom-4 flex flex-col gap-1 p-1 rounded-xl bg-background/80 backdrop-blur-sm shadow-lg border border-border/50" 
        initial={{
          opacity: 0,
          y: 20
        }} 
        animate={{
          opacity: 1,
          y: 0,
          x: sidebarExpanded ? -400 : 0 // 当侧边栏展开时向左移动400px (侧边栏宽度384px + 额外边距)
        }} 
        transition={{
          delay: 0.5,
          x: { duration: 0.3, ease: 'easeInOut' } // 为水平移动添加过渡效果
        }}
        style={{
          right: '1rem' // 替换 right-4 class
        }}
      >
        <Tooltip>
          <TooltipTrigger asChild>
            <Button size="icon" variant="ghost" onClick={zoomIn} aria-label="Zoom in 放大" className="hover:bg-muted/50 transition-colors">
              <ZoomIn className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="left" sideOffset={8}>
            Zoom in 放大
          </TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button size="icon" variant="ghost" onClick={zoomOut} aria-label="Zoom out 缩小" className="hover:bg-muted/50 transition-colors">
              <ZoomOut className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="left" sideOffset={8}>
            Zoom out 缩小
          </TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button size="icon" variant="ghost" onClick={fitToScreen} aria-label="Fit to screen 全屏" className="hover:bg-muted/50 transition-colors">
              <Maximize2 className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="left" sideOffset={8}>
            Fit to screen 全屏
          </TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button size="icon" variant="ghost" onClick={resetView} aria-label="Reset 重置" className="hover:bg-muted/50 transition-colors">
              <RotateCcw className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="left" sideOffset={8}>
            Reset 重置
          </TooltipContent>
        </Tooltip>
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
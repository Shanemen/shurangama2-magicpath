"use client";

import * as React from "react";
import { useState, useRef, useEffect, useCallback } from "react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ZoomIn, ZoomOut, RotateCcw, Maximize2 } from "lucide-react";
export interface MindMapNode {
  id: string;
  title: string;
  pageRef?: string;
  lectureNumber?: number;
  children?: MindMapNode[];
  isExpanded?: boolean;
}
export interface MindMapCanvasProps {
  searchQuery?: string;
  data?: MindMapNode[];
  className?: string;
}

// Default data structure for the Shurangama Sutra
const defaultData: MindMapNode[] = [{
  id: "root",
  title: "楞嚴經",
  pageRef: "P.1",
  lectureNumber: 1,
  isExpanded: true,
  children: [{
    id: "chapter1",
    title: "第一章 - 七處徵心",
    pageRef: "P.15",
    lectureNumber: 2,
    isExpanded: false,
    children: [{
      id: "section1-1",
      title: "阿難示墮",
      pageRef: "P.18",
      lectureNumber: 3,
      children: []
    }, {
      id: "section1-2",
      title: "佛問心目",
      pageRef: "P.25",
      lectureNumber: 4,
      children: []
    }]
  }, {
    id: "chapter2",
    title: "第二章 - 十番顯見",
    pageRef: "P.89",
    lectureNumber: 8,
    isExpanded: false,
    children: [{
      id: "section2-1",
      title: "顯見不動",
      pageRef: "P.95",
      lectureNumber: 9,
      children: []
    }, {
      id: "section2-2",
      title: "顯見不滅",
      pageRef: "P.108",
      lectureNumber: 10,
      children: []
    }]
  }, {
    id: "chapter3",
    title: "第三章 - 辨識真妄",
    pageRef: "P.159",
    lectureNumber: 15,
    isExpanded: false,
    children: [{
      id: "section3-1",
      title: "識精元明",
      pageRef: "P.165",
      lectureNumber: 16,
      children: []
    }]
  }]
}];
export default function MindMapCanvas({
  searchQuery = "",
  data = defaultData,
  className
}: MindMapCanvasProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [nodes, setNodes] = useState<MindMapNode[]>(data);
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
  const siblingSpacing = 100;

  // Calculate node positions
  const calculateLayout = useCallback((nodeList: MindMapNode[], level = 0, parentY = 0): Array<{
    node: MindMapNode;
    x: number;
    y: number;
    level: number;
  }> => {
    const positions: Array<{
      node: MindMapNode;
      x: number;
      y: number;
      level: number;
    }> = [];
    nodeList.forEach((node, index) => {
      const x = level * levelSpacing + 50;
      const y = parentY + (index - (nodeList.length - 1) / 2) * (nodeHeight + siblingSpacing);
      positions.push({
        node,
        x,
        y,
        level
      });
      if (node.isExpanded && node.children && node.children.length > 0) {
        const childPositions = calculateLayout(node.children, level + 1, y);
        positions.push(...childPositions);
      }
    });
    return positions;
  }, []);
  const nodePositions = calculateLayout(nodes);

  // Toggle node expansion
  const toggleNode = useCallback((nodeId: string) => {
    const updateNodes = (nodeList: MindMapNode[]): MindMapNode[] => {
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
    e.preventDefault();
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

  // Generate curved path between nodes
  const generatePath = (x1: number, y1: number, x2: number, y2: number) => {
    const midX = (x1 + x2) / 2;
    return `M ${x1 + nodeWidth} ${y1 + nodeHeight / 2} C ${midX} ${y1 + nodeHeight / 2} ${midX} ${y2 + nodeHeight / 2} ${x2} ${y2 + nodeHeight / 2}`;
  };

  // Check if node matches search query
  const isHighlighted = (node: MindMapNode) => {
    if (!searchQuery) return false;
    return node.title.toLowerCase().includes(searchQuery.toLowerCase()) || node.pageRef?.toLowerCase().includes(searchQuery.toLowerCase());
  };
  return <div ref={containerRef} className={cn("relative w-full h-full overflow-hidden bg-background", className)} role="application" aria-label="Shurangama Sutra Mind Map">
      <svg ref={svgRef} className="w-full h-full cursor-grab active:cursor-grabbing" onMouseDown={handleMouseDown} onMouseMove={handleMouseMove} onMouseUp={handleMouseUp} onMouseLeave={handleMouseUp} onWheel={handleWheel} onKeyDown={handleKeyDown} tabIndex={0} role="img" aria-describedby="mindmap-description">
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
            const opacity = level === 0 ? 1 : level === 1 ? 0.7 : 0.4;
            return <motion.path key={`${node.id}-${child.id}`} d={generatePath(x, y, childPos.x, childPos.y)} stroke="hsl(var(--primary))" strokeWidth="2" fill="none" opacity={opacity} initial={{
              pathLength: 0
            }} animate={{
              pathLength: 1
            }} transition={{
              duration: 0.3,
              ease: "easeOut"
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
          const opacity = level === 0 ? 1 : level === 1 ? 0.7 : 0.4;
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
                <motion.rect x={x} y={y} width={nodeWidth} height={nodeHeight} rx="12" fill={highlighted ? "hsl(var(--primary))" : "hsl(var(--card))"} stroke={isFocused ? "hsl(var(--primary))" : "hsl(var(--border))"} strokeWidth={isFocused ? "3" : "1"} filter="url(#shadow)" className="cursor-pointer transition-all duration-200" onClick={() => toggleNode(node.id)} onFocus={() => setFocusedNodeId(node.id)} tabIndex={0} role="button" aria-expanded={node.isExpanded} aria-label={`${node.title}, ${node.pageRef || ''}, Lecture ${node.lectureNumber || ''}`} whileHover={{
              scale: 1.02
            }} whileTap={{
              scale: 0.98
            }} />
                
                {/* Node title */}
                <text x={x + 16} y={y + 24} fill={highlighted ? "hsl(var(--primary-foreground))" : "hsl(var(--card-foreground))"} fontSize="14" fontWeight="600" fontFamily="'Lora', serif" className="pointer-events-none select-none">
                  {node.title.length > 20 ? `${node.title.substring(0, 20)}...` : node.title}
                </text>
                
                {/* Page reference */}
                {node.pageRef && <text x={x + 16} y={y + 44} fill={highlighted ? "hsl(var(--primary-foreground))" : "hsl(var(--muted-foreground))"} fontSize="12" className="pointer-events-none select-none">
                    {node.pageRef}
                  </text>}
                
                {/* Lecture number badge */}
                {node.lectureNumber && <g>
                    <circle cx={x + nodeWidth - 24} cy={y + 20} r="12" fill="hsl(var(--primary))" className="pointer-events-none" />
                    <text x={x + nodeWidth - 24} y={y + 25} fill="hsl(var(--primary-foreground))" fontSize="10" fontWeight="600" textAnchor="middle" className="pointer-events-none select-none">
                      {node.lectureNumber}
                    </text>
                  </g>}
                
                {/* Expansion indicator */}
                {node.children && node.children.length > 0 && <motion.text x={x + nodeWidth - 16} y={y + nodeHeight - 12} fill="hsl(var(--muted-foreground))" fontSize="16" textAnchor="middle" className="pointer-events-none select-none" animate={{
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
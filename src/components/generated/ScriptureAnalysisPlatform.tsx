"use client";

import * as React from "react";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import MindMapCanvas from "./MindMapCanvas";
import ContentPanel from "./ContentPanel";
import TopToolbar from "./TopToolbar";
export interface ScriptureAnalysisPlatformProps {
  className?: string;
}
export default function ScriptureAnalysisPlatform({
  className
}: ScriptureAnalysisPlatformProps) {
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [isMobile, setIsMobile] = useState(false);

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
      root.style.setProperty('--background', 'oklch(0.21 0.04 265.75)');
      root.style.setProperty('--foreground', 'oklch(0.95 0.02 265.75)');
      root.style.setProperty('--primary', 'oklch(0.77 0.15 163.22)');
      root.style.setProperty('--primary-foreground', 'oklch(0.15 0.04 265.75)');
      root.style.setProperty('--card', 'oklch(0.25 0.04 265.75)');
      root.style.setProperty('--card-foreground', 'oklch(0.92 0.02 265.75)');
      root.style.setProperty('--muted', 'oklch(0.3 0.04 265.75)');
      root.style.setProperty('--muted-foreground', 'oklch(0.7 0.02 265.75)');
      root.style.setProperty('--border', 'oklch(0.35 0.04 265.75)');
      root.classList.add('dark');
    } else {
      root.style.setProperty('--background', 'oklch(0.98 0.01 265.75)');
      root.style.setProperty('--foreground', 'oklch(0.15 0.04 265.75)');
      root.style.setProperty('--primary', 'oklch(0.77 0.15 163.22)');
      root.style.setProperty('--primary-foreground', 'oklch(0.98 0.01 265.75)');
      root.style.setProperty('--card', 'oklch(1 0 0)');
      root.style.setProperty('--card-foreground', 'oklch(0.15 0.04 265.75)');
      root.style.setProperty('--muted', 'oklch(0.95 0.01 265.75)');
      root.style.setProperty('--muted-foreground', 'oklch(0.5 0.02 265.75)');
      root.style.setProperty('--border', 'oklch(0.9 0.01 265.75)');
      root.classList.remove('dark');
    }
  }, [isDarkMode]);
  const handleThemeToggle = () => {
    setIsDarkMode(!isDarkMode);
  };
  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };
  return <motion.div className={cn("min-h-screen w-full bg-background text-foreground transition-colors duration-300", "font-sans antialiased", className)} style={{
    fontFamily: "'DM Sans', system-ui, sans-serif"
  }} initial={{
    opacity: 0
  }} animate={{
    opacity: 1
  }} transition={{
    duration: 0.3
  }} data-magicpath-id="0" data-magicpath-path="ScriptureAnalysisPlatform.tsx">
      {/* Top Toolbar */}
      <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60" data-magicpath-id="1" data-magicpath-path="ScriptureAnalysisPlatform.tsx">
        <TopToolbar isDarkMode={isDarkMode} onThemeToggle={handleThemeToggle} searchQuery={searchQuery} onSearchChange={handleSearch} data-magicpath-id="2" data-magicpath-path="ScriptureAnalysisPlatform.tsx" />
      </header>

      {/* Main Content Area */}
      <main className="flex-1 w-full" data-magicpath-id="3" data-magicpath-path="ScriptureAnalysisPlatform.tsx">
        <AnimatePresence mode="wait" data-magicpath-id="4" data-magicpath-path="ScriptureAnalysisPlatform.tsx">
          {isMobile ?
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
        }} data-magicpath-id="5" data-magicpath-path="ScriptureAnalysisPlatform.tsx">
              {/* Mind Map Section - Collapsible on Mobile */}
              <section className="w-full h-80 border-b border-border" aria-label="Scripture Mind Map" data-magicpath-id="6" data-magicpath-path="ScriptureAnalysisPlatform.tsx">
                <MindMapCanvas searchQuery={searchQuery} data-magicpath-id="7" data-magicpath-path="ScriptureAnalysisPlatform.tsx" />
              </section>

              {/* Content Panel Section */}
              <aside className="flex-1 w-full p-4" aria-label="Scripture Analysis Content" data-magicpath-id="8" data-magicpath-path="ScriptureAnalysisPlatform.tsx">
                <ContentPanel searchQuery={searchQuery} data-magicpath-id="9" data-magicpath-path="ScriptureAnalysisPlatform.tsx" />
              </aside>
            </motion.div> :
        // Desktop/Tablet Layout - Split Screen
        <motion.div key="desktop" className="grid grid-cols-[3fr_2fr] min-h-[calc(100vh-4rem)]" initial={{
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
        }} data-magicpath-id="10" data-magicpath-path="ScriptureAnalysisPlatform.tsx">
              {/* Left Panel - Mind Map (60%) */}
              <section className="relative border-r border-border overflow-hidden" aria-label="Scripture Mind Map" data-magicpath-id="11" data-magicpath-path="ScriptureAnalysisPlatform.tsx">
                <div className="absolute inset-0" data-magicpath-id="12" data-magicpath-path="ScriptureAnalysisPlatform.tsx">
                  <MindMapCanvas searchQuery={searchQuery} data-magicpath-id="13" data-magicpath-path="ScriptureAnalysisPlatform.tsx" />
                </div>
              </section>

              {/* Right Panel - Content Cards (40%) */}
              <aside className="relative overflow-hidden" aria-label="Scripture Analysis Content" data-magicpath-id="14" data-magicpath-path="ScriptureAnalysisPlatform.tsx">
                <div className="absolute inset-0 p-6" data-magicpath-id="15" data-magicpath-path="ScriptureAnalysisPlatform.tsx">
                  <ContentPanel searchQuery={searchQuery} data-magicpath-id="16" data-magicpath-path="ScriptureAnalysisPlatform.tsx" />
                </div>
              </aside>
            </motion.div>}
        </AnimatePresence>
      </main>

      {/* Focus Management for Accessibility */}
      <div className="sr-only" role="status" aria-live="polite" aria-atomic="true" data-magicpath-id="17" data-magicpath-path="ScriptureAnalysisPlatform.tsx">
        {searchQuery && `Searching for: ${searchQuery}`}
        {isDarkMode ? "Dark mode enabled" : "Light mode enabled"}
      </div>
    </motion.div>;
}
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
                <section className="absolute inset-0 flex flex-col items-center justify-center px-4 py-8 sm:px-8 lg:px-12 xl:px-16" aria-label="Scripture Analysis Content" data-magicpath-id="15" data-magicpath-path="ScriptureAnalysisPlatform.tsx">
                  <ContentPanel searchQuery={searchQuery} data-magicpath-id="16" data-magicpath-path="ScriptureAnalysisPlatform.tsx" />
                </section>
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
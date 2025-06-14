"use client";

import * as React from "react";
import { useState, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Sun, Moon, Info, Search } from "lucide-react";
export interface TopToolbarProps {
  isDarkMode?: boolean;
  onThemeToggle?: () => void;
  searchQuery?: string;
  onSearchChange?: (query: string) => void;
  suggestions?: string[];
  className?: string;
}
const defaultSuggestions = ["七處徵心", "十番顯見", "辨識真妄", "阿難示墮", "佛問心目", "顯見不動", "顯見不滅", "識精元明", "楞嚴經", "宣化上人"];
export default function TopToolbar({
  isDarkMode = true,
  onThemeToggle,
  searchQuery = "",
  onSearchChange,
  suggestions = defaultSuggestions,
  className
}: TopToolbarProps) {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [filteredSuggestions, setFilteredSuggestions] = useState<string[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const [aboutOpen, setAboutOpen] = useState(false);

  // Filter suggestions based on search query
  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredSuggestions([]);
      setSelectedIndex(-1);
      return;
    }
    const filtered = suggestions.filter(suggestion => suggestion.toLowerCase().includes(searchQuery.toLowerCase())).slice(0, 8); // Limit to 8 suggestions

    setFilteredSuggestions(filtered);
    setSelectedIndex(-1);
  }, [searchQuery, suggestions]);

  // Handle search input change
  const handleSearchChange = (value: string) => {
    onSearchChange?.(value);
    setIsSearchOpen(value.length > 0);
  };

  // Handle keyboard navigation in search
  const handleSearchKeyDown = (e: React.KeyboardEvent) => {
    if (!isSearchOpen || filteredSuggestions.length === 0) return;
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prev => prev < filteredSuggestions.length - 1 ? prev + 1 : 0);
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev => prev > 0 ? prev - 1 : filteredSuggestions.length - 1);
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedIndex >= 0 && selectedIndex < filteredSuggestions.length) {
          const selectedSuggestion = filteredSuggestions[selectedIndex];
          onSearchChange?.(selectedSuggestion);
          setIsSearchOpen(false);
          searchInputRef.current?.blur();
        }
        break;
      case 'Escape':
        e.preventDefault();
        setIsSearchOpen(false);
        setSelectedIndex(-1);
        break;
    }
  };

  // Handle suggestion selection
  const handleSuggestionSelect = (suggestion: string) => {
    onSearchChange?.(suggestion);
    setIsSearchOpen(false);
    searchInputRef.current?.focus();
  };
  return <motion.header className={cn("w-full h-16 px-4 md:px-6 flex items-center justify-between", "bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60", "border-b border-border", className)} initial={{
    opacity: 0,
    y: -20
  }} animate={{
    opacity: 1,
    y: 0
  }} transition={{
    duration: 0.3
  }}>
      {/* Platform Title */}
      <div className="flex items-center">
        <motion.h1 className="text-xl md:text-2xl font-bold text-foreground" style={{
        fontFamily: "'DM Sans', system-ui, sans-serif"
      }} whileHover={{
        scale: 1.02
      }} transition={{
        duration: 0.2
      }}>
          楞嚴經智慧平台
        </motion.h1>
      </div>

      {/* Search Bar */}
      <div className="flex-1 max-w-md mx-4 md:mx-8 relative">
        <Popover open={isSearchOpen} onOpenChange={setIsSearchOpen}>
          <PopoverTrigger asChild>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input ref={searchInputRef} type="text" placeholder="搜尋經文內容..." value={searchQuery} onChange={e => handleSearchChange(e.target.value)} onKeyDown={handleSearchKeyDown} onFocus={() => setIsSearchOpen(searchQuery.length > 0)} className={cn("pl-10 pr-4 h-10 w-full", "transition-all duration-200", "focus:ring-2 focus:ring-primary/20 focus:border-primary", "hover:border-primary/50")} aria-label="搜尋經文內容" aria-expanded={isSearchOpen} aria-haspopup="listbox" role="combobox" />
            </div>
          </PopoverTrigger>
          
          <AnimatePresence>
            {isSearchOpen && filteredSuggestions.length > 0 && <PopoverContent className="w-full p-0 mt-1" align="start" side="bottom" asChild>
                <motion.div initial={{
              opacity: 0,
              y: -10,
              scale: 0.95
            }} animate={{
              opacity: 1,
              y: 0,
              scale: 1
            }} exit={{
              opacity: 0,
              y: -10,
              scale: 0.95
            }} transition={{
              duration: 0.2
            }}>
                  <Command>
                    <CommandList>
                      <CommandEmpty>沒有找到相關結果</CommandEmpty>
                      <CommandGroup>
                        {filteredSuggestions.map((suggestion, index) => <CommandItem key={suggestion} value={suggestion} onSelect={() => handleSuggestionSelect(suggestion)} className={cn("cursor-pointer transition-colors duration-150", selectedIndex === index && "bg-accent")} aria-selected={selectedIndex === index}>
                            <Search className="mr-2 h-4 w-4 text-muted-foreground" />
                            {suggestion}
                          </CommandItem>)}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </motion.div>
              </PopoverContent>}
          </AnimatePresence>
        </Popover>

        {/* Search results announcement for screen readers */}
        <div className="sr-only" role="status" aria-live="polite" aria-atomic="true">
          {isSearchOpen && filteredSuggestions.length > 0 && `找到 ${filteredSuggestions.length} 個建議`}
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
          <Button variant="ghost" size="icon" onClick={onThemeToggle} className={cn("h-10 w-10 rounded-full", "transition-all duration-300", "hover:bg-accent hover:text-accent-foreground", "focus:ring-2 focus:ring-primary/20")} aria-label={isDarkMode ? "切換到淺色模式" : "切換到深色模式"}>
            <AnimatePresence mode="wait">
              {isDarkMode ? <motion.div key="sun" initial={{
              rotate: -90,
              opacity: 0
            }} animate={{
              rotate: 0,
              opacity: 1
            }} exit={{
              rotate: 90,
              opacity: 0
            }} transition={{
              duration: 0.3
            }}>
                  <Sun className="h-5 w-5" />
                </motion.div> : <motion.div key="moon" initial={{
              rotate: 90,
              opacity: 0
            }} animate={{
              rotate: 0,
              opacity: 1
            }} exit={{
              rotate: -90,
              opacity: 0
            }} transition={{
              duration: 0.3
            }}>
                  <Moon className="h-5 w-5" />
                </motion.div>}
            </AnimatePresence>
          </Button>
        </motion.div>

        {/* About Button */}
        <Dialog open={aboutOpen} onOpenChange={setAboutOpen}>
          <DialogTrigger asChild>
            <motion.div whileHover={{
            scale: 1.05
          }} whileTap={{
            scale: 0.95
          }}>
              <Button variant="ghost" size="icon" className={cn("h-10 w-10 rounded-full", "transition-all duration-300", "hover:bg-accent hover:text-accent-foreground", "focus:ring-2 focus:ring-primary/20")} aria-label="關於平台">
                <Info className="h-5 w-5" />
              </Button>
            </motion.div>
          </DialogTrigger>
          
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="text-xl font-bold" style={{
              fontFamily: "'DM Sans', system-ui, sans-serif"
            }}>
                關於楞嚴經智慧平台
              </DialogTitle>
            </DialogHeader>
            
            <div className="space-y-4 py-4">
              <p className="text-sm text-muted-foreground leading-relaxed">
                本平台致力於提供現代化的佛經學習體驗，結合傳統經典與現代科技，
                幫助學習者更深入地理解楞嚴經的智慧。
              </p>
              
              <div className="space-y-2">
                <h4 className="font-semibold text-sm">主要功能</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• 互動式心智圖導覽</li>
                  <li>• 原文與註釋對照</li>
                  <li>• AI 智能分析解讀</li>
                  <li>• 全文搜尋功能</li>
                </ul>
              </div>
              
              <div className="pt-4 border-t">
                <p className="text-xs text-muted-foreground">
                  版本 1.0.0 | 開發團隊製作
                </p>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </motion.header>;
}
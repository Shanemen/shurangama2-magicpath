"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Sparkles, ExternalLink } from "lucide-react";

export interface ScriptureContent {
  title: string;
  text: string;
  chapter?: string;
  verse?: string;
}

export interface Commentary {
  title: string;
  text: string;
  author: string;
  source?: string;
}

export interface AITranslation {
  id: string;
  title: string;
  content: string;
}

export interface ContentPanelProps {
  searchQuery?: string;
  scripture?: ScriptureContent;
  commentary?: Commentary;
  aiTranslation?: AITranslation;
  className?: string;
}

// Default content
const defaultScripture: ScriptureContent = {
  title: "楞嚴經第一章",
  text: "爾時世尊。從肉髻中。涌百寶光。光中涌出。千葉寶蓮。有化如來。坐寶華中。頂放十道。百寶光明。一一光明。皆遍示現。十恆河沙。金剛密跡。擎山持杵。遍虛空界。大眾仰觀。畏愛兼抱。求佛哀祐。一心聽佛。無見頂相。放光如來。宣說神咒。",
  chapter: "第一章",
  verse: "七處徵心"
};

const defaultCommentary: Commentary = {
  title: "圆瑛法师注解",
  text: "這一段經文是說，佛陀從肉髻中放出百寶光明，在光明中又涌出千葉寶蓮，有化身如來坐在寶華當中。這表示佛的神通力不可思議，能夠在一念之間示現種種莊嚴相。我們學佛的人，要明白這不是神話，而是真實的境界。當我們的心清淨到極點時，也能見到這種不可思議的境界。",
  author: "圆瑛法师",
  source: "《大佛顶首楞严经讲义》"
};

const defaultAITranslation: AITranslation = {
  id: "claude-translation",
  title: "AI Analysis",
  content: "此段經文採用層層遞進的敘述結構，從「肉髻中」到「百寶光」，再到「千葉寶蓮」，最後到「化如來」，展現了佛陀神通力的逐步顯現。這種敘述手法在佛經中常見，用以表達超越凡俗認知的神聖境界。經文描述了佛陀在說法時所顯現的瑞相，表示即將宣說重要法義。"
};

export default function ContentPanel({
  searchQuery = "",
  scripture = defaultScripture,
  commentary = defaultCommentary,
  aiTranslation = defaultAITranslation,
  className
}: ContentPanelProps) {
  // Highlight search terms in text
  const highlightText = (text: string, query: string) => {
    if (!query.trim()) return text;
    const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
    const parts = text.split(regex);
    return parts.map((part, index) => 
      regex.test(part) ? (
        <mark key={index} className="bg-primary/20 text-primary-foreground px-1 rounded">
          {part}
        </mark>
      ) : part
    );
  };

  return (
    <ScrollArea className={cn("h-full w-full", className)}>
      <div className="space-y-6 p-4">
        {/* Original Scripture Section */}
        <motion.section 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ duration: 0.3, delay: 0.1 }}
          className="space-y-3"
        >
          <h3 className="text-xl font-bold text-foreground" style={{ fontFamily: "var(--font-title)" }}>
            {highlightText(scripture.title, searchQuery)}
          </h3>
          {scripture.chapter && (
            <div className="flex gap-2">
              <Badge variant="outline">{scripture.chapter}</Badge>
              {scripture.verse && <Badge variant="outline">{scripture.verse}</Badge>}
            </div>
          )}
          <blockquote 
            className="text-lg leading-relaxed font-bold text-foreground max-w-[70ch]" 
            style={{ fontFamily: "var(--font-sans)" }} 
            lang="zh-Hant"
          >
            {highlightText(scripture.text, searchQuery)}
          </blockquote>
        </motion.section>

        {/* Divider */}
        <div className="border-t border-border/40"></div>

        {/* Master's Commentary Section */}
        <motion.section 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ duration: 0.3, delay: 0.2 }}
          className="space-y-3 border-l-4 border-blue-500 pl-4"
        >
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-foreground" 
              style={{ fontFamily: 'Outfit, var(--font-sans)' }}
            >
              {highlightText(commentary.title, searchQuery)}
            </h3>
            <Badge className="flex items-center gap-1 bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300">
              <ExternalLink className="h-4 w-4" />
              <span 
                onClick={() => window.open('https://github.com/yuqianyi1001/awesome-buddhist-dharma/blob/main/%E5%A4%A7%E4%BD%9B%E9%A1%B6%E9%A6%96%E6%A5%9E%E4%B8%A5%E7%BB%8F%E8%AE%B2%E4%B9%89(%E5%9C%86%E7%91%9B%E6%B3%95%E5%B8%88).pdf', '_blank', 'noopener,noreferrer')}
                className="cursor-pointer"
              >
                讲义原文
              </span>
            </Badge>
          </div>
          {commentary.source && (
            <div className="text-sm text-foreground/80">
              <span className="font-normal">
                {commentary.source}
              </span>
            </div>
          )}
          <p className="text-base leading-relaxed text-foreground max-w-[70ch]" style={{ fontFamily: "var(--font-sans)" }}>
            {highlightText(commentary.text, searchQuery)}
          </p>
        </motion.section>

        {/* Divider */}
        <div className="border-t border-border/40"></div>

        {/* Claude AI Analysis Section */}
        <motion.section 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ duration: 0.3, delay: 0.3 }}
          className="space-y-3 border-l-4 border-orange-500 pl-4"
        >
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-foreground">
              {highlightText(aiTranslation.title, searchQuery)}
            </h3>
            <Badge className="flex items-center gap-1 bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300">
              <Sparkles className="h-4 w-4" />
              Claude
            </Badge>
          </div>
          <p className="text-base leading-relaxed text-foreground max-w-[70ch]" style={{ fontFamily: "var(--font-sans)" }}>
            {highlightText(aiTranslation.content, searchQuery)}
          </p>
        </motion.section>
      </div>
    </ScrollArea>
  );
}
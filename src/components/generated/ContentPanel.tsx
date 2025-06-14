"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Bot, User, Sparkles } from "lucide-react";
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
export interface AIAnalysis {
  id: string;
  name: "Claude" | "GPT" | "DeepSeek";
  title: string;
  content: string;
  insights?: string[];
}
export interface ContentPanelProps {
  searchQuery?: string;
  scripture?: ScriptureContent;
  commentary?: Commentary;
  aiAnalyses?: AIAnalysis[];
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
  title: "宣化上人開示",
  text: "這一段經文是說，佛陀從肉髻中放出百寶光明，在光明中又涌出千葉寶蓮，有化身如來坐在寶華當中。這表示佛的神通力不可思議，能夠在一念之間示現種種莊嚴相。我們學佛的人，要明白這不是神話，而是真實的境界。當我們的心清淨到極點時，也能見到這種不可思議的境界。",
  author: "宣化上人",
  source: "楞嚴經淺釋"
};
const defaultAIAnalyses: AIAnalysis[] = [{
  id: "claude",
  name: "Claude",
  title: "文本結構分析",
  content: "此段經文採用層層遞進的敘述結構，從「肉髻中」到「百寶光」，再到「千葉寶蓮」，最後到「化如來」，展現了佛陀神通力的逐步顯現。這種敘述手法在佛經中常見，用以表達超越凡俗認知的神聖境界。",
  insights: ["層次性敘述結構", "神聖空間的建構", "視覺意象的運用"]
}, {
  id: "gpt",
  name: "GPT",
  title: "象徵意義解讀",
  content: "「肉髻」象徵佛陀的智慧圓滿，「百寶光」代表無量功德，「千葉寶蓮」寓意清淨無染的覺性。整段描述實際上是在說明開悟境界的特徵：從內在智慧（肉髻）生起無量光明（功德），最終顯現清淨覺性（蓮華）。",
  insights: ["內在智慧的外顯", "功德與覺性的關係", "開悟境界的象徵"]
}, {
  id: "deepseek",
  name: "DeepSeek",
  title: "修行指導意義",
  content: "從修行角度看，此段經文指出了禪定中可能出現的境界。「百寶光明」可能對應禪定中的光明相，「千葉寶蓮」對應清淨心的顯現。修行者應當了解這些境界的本質，既不執著也不排斥，保持正念繼續深入。",
  insights: ["禪定境界的認知", "修行中的正確態度", "境界與本質的區別"]
}];
export default function ContentPanel({
  searchQuery = "",
  scripture = defaultScripture,
  commentary = defaultCommentary,
  aiAnalyses = defaultAIAnalyses,
  className
}: ContentPanelProps) {
  // Highlight search terms in text
  const highlightText = (text: string, query: string) => {
    if (!query.trim()) return text;
    const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
    const parts = text.split(regex);
    return parts.map((part, index) => regex.test(part) ? <mark key={index} className="bg-primary/20 text-primary-foreground px-1 rounded">
          {part}
        </mark> : part);
  };

  // Get AI icon and colors
  const getAIStyle = (name: string) => {
    switch (name) {
      case "Claude":
        return {
          icon: <Sparkles className="h-4 w-4" />,
          accent: "border-l-orange-500",
          bg: "bg-orange-50 dark:bg-orange-950/20",
          badge: "bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300"
        };
      case "GPT":
        return {
          icon: <Bot className="h-4 w-4" />,
          accent: "border-l-green-500",
          bg: "bg-green-50 dark:bg-green-950/20",
          badge: "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300"
        };
      case "DeepSeek":
        return {
          icon: <User className="h-4 w-4" />,
          accent: "border-l-blue-500",
          bg: "bg-blue-50 dark:bg-blue-950/20",
          badge: "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300"
        };
      default:
        return {
          icon: <Bot className="h-4 w-4" />,
          accent: "border-l-gray-500",
          bg: "bg-gray-50 dark:bg-gray-950/20",
          badge: "bg-gray-100 text-gray-700 dark:bg-gray-900 dark:text-gray-300"
        };
    }
  };
  return <ScrollArea className={cn("h-full w-full", className)}>
      <div className="space-y-4 p-1">
        {/* Original Scripture Card */}
        <motion.section initial={{
        opacity: 0,
        y: 20
      }} animate={{
        opacity: 1,
        y: 0
      }} transition={{
        duration: 0.3,
        delay: 0.1
      }}>
          <Card className="transition-all duration-300 hover:shadow-lg focus-within:shadow-lg focus-within:ring-2 focus-within:ring-primary/20">
            <CardHeader className="pb-4">
              <CardTitle className="text-xl font-bold text-foreground" style={{
              fontFamily: "'Lora', serif"
            }}>
                {highlightText(scripture.title, searchQuery)}
              </CardTitle>
              {scripture.chapter && <div className="flex gap-2">
                  <Badge variant="outline">{scripture.chapter}</Badge>
                  {scripture.verse && <Badge variant="outline">{scripture.verse}</Badge>}
                </div>}
            </CardHeader>
            <CardContent className="pt-0">
              <blockquote className="text-lg leading-relaxed font-bold text-foreground max-w-[70ch]" style={{
              fontFamily: "'Lora', serif"
            }} lang="zh-Hant">
                {highlightText(scripture.text, searchQuery)}
              </blockquote>
            </CardContent>
          </Card>
        </motion.section>

        {/* Master's Commentary Card */}
        <motion.section initial={{
        opacity: 0,
        y: 20
      }} animate={{
        opacity: 1,
        y: 0
      }} transition={{
        duration: 0.3,
        delay: 0.2
      }}>
          <Card className="border-none shadow-none bg-card/80 dark:bg-card/60 rounded-2xl px-0 py-0 md:p-0 transition-all duration-300 focus-within:ring-2 focus-within:ring-primary/20" style={{
          boxShadow: '0 2px 24px 0 oklch(0.1649 0.0352 281.8285 / 0.08), 0 1.5px 4px 0 oklch(0.1649 0.0352 281.8285 / 0.04)'
        }}>
            <CardHeader className="pb-2 pt-6 px-6 md:px-8">
              <CardTitle className="text-lg md:text-xl font-semibold text-foreground tracking-tight mb-1 flex items-center gap-2" style={{
              fontFamily: 'Outfit, var(--font-sans)'
            }}>
                {highlightText(commentary.title, searchQuery)}
              </CardTitle>
              <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground mt-1 mb-0.5">
                <span className="font-medium text-sidebar-primary">
                  {commentary.author}
                </span>
                {commentary.source && <>
                    <span aria-hidden="true" className="mx-1 opacity-60">
                      &bull;
                    </span>
                    <span className="text-xs md:text-sm text-muted-foreground/80">
                      {commentary.source}
                    </span>
                  </>}
              </div>
            </CardHeader>
            <CardContent className="pt-0 pb-6 px-6 md:px-8">
              <blockquote className="text-base md:text-lg leading-relaxed text-foreground max-w-[60ch] border-l-4 border-sidebar-accent/60 pl-6 italic bg-muted/30 rounded-lg py-3 px-0" style={{
              fontFamily: 'Outfit, var(--font-sans)'
            }}>
                {highlightText(commentary.text, searchQuery)}
              </blockquote>
            </CardContent>
          </Card>
        </motion.section>

        {/* AI Analysis Cards */}
        {aiAnalyses.map((analysis, index) => {
        const style = getAIStyle(analysis.name);
        return <motion.section key={analysis.id} initial={{
          opacity: 0,
          y: 20
        }} animate={{
          opacity: 1,
          y: 0
        }} transition={{
          duration: 0.3,
          delay: 0.3 + index * 0.1
        }}>
              <Card className={cn("border-l-4 transition-all duration-300 hover:shadow-lg focus-within:shadow-lg focus-within:ring-2 focus-within:ring-primary/20", style.accent, style.bg)}>
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg font-semibold text-foreground">
                      {highlightText(analysis.title, searchQuery)}
                    </CardTitle>
                    <Badge className={cn("flex items-center gap-1", style.badge)}>
                      {style.icon}
                      {analysis.name}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="pt-0 space-y-4">
                  <p className="text-base leading-relaxed text-foreground max-w-[70ch]">
                    {highlightText(analysis.content, searchQuery)}
                  </p>
                  
                  {analysis.insights && analysis.insights.length > 0 && <div>
                      <h4 className="text-sm font-medium text-muted-foreground mb-2">
                        關鍵洞察
                      </h4>
                      <ul className="space-y-1">
                        {analysis.insights.map((insight, idx) => <li key={idx} className="text-sm text-muted-foreground flex items-center gap-2">
                            <span className="w-1 h-1 bg-primary rounded-full flex-shrink-0" />
                            {highlightText(insight, searchQuery)}
                          </li>)}
                      </ul>
                    </div>}
                </CardContent>
              </Card>
            </motion.section>;
      })}
      </div>
    </ScrollArea>;
}
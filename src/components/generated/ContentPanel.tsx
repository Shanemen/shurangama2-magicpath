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
    return parts.map((part, index) => regex.test(part) ? <mark key={index} className="bg-primary/20 text-primary-foreground px-1 rounded" data-magicpath-id="0" data-magicpath-path="ContentPanel.tsx">
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
          icon: <Bot className="h-4 w-4" data-magicpath-id="1" data-magicpath-path="ContentPanel.tsx" />,
          accent: "border-l-green-500",
          bg: "bg-green-50 dark:bg-green-950/20",
          badge: "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300"
        };
      case "DeepSeek":
        return {
          icon: <User className="h-4 w-4" data-magicpath-id="2" data-magicpath-path="ContentPanel.tsx" />,
          accent: "border-l-blue-500",
          bg: "bg-blue-50 dark:bg-blue-950/20",
          badge: "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300"
        };
      default:
        return {
          icon: <Bot className="h-4 w-4" data-magicpath-id="3" data-magicpath-path="ContentPanel.tsx" />,
          accent: "border-l-gray-500",
          bg: "bg-gray-50 dark:bg-gray-950/20",
          badge: "bg-gray-100 text-gray-700 dark:bg-gray-900 dark:text-gray-300"
        };
    }
  };
  return <ScrollArea className={cn("h-full w-full", className)} data-magicpath-id="4" data-magicpath-path="ContentPanel.tsx">
      <div className="space-y-4 p-1" data-magicpath-id="5" data-magicpath-path="ContentPanel.tsx">
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
      }} data-magicpath-id="6" data-magicpath-path="ContentPanel.tsx">
          <Card className="transition-all duration-300 hover:shadow-lg focus-within:shadow-lg focus-within:ring-2 focus-within:ring-primary/20" data-magicpath-id="7" data-magicpath-path="ContentPanel.tsx">
            <CardHeader className="pb-4" data-magicpath-id="8" data-magicpath-path="ContentPanel.tsx">
              <CardTitle className="text-xl font-bold text-foreground" style={{
              fontFamily: "'Lora', serif"
            }} data-magicpath-id="9" data-magicpath-path="ContentPanel.tsx">
                {highlightText(scripture.title, searchQuery)}
              </CardTitle>
              {scripture.chapter && <div className="flex gap-2" data-magicpath-id="10" data-magicpath-path="ContentPanel.tsx">
                  <Badge variant="outline" data-magicpath-id="11" data-magicpath-path="ContentPanel.tsx">{scripture.chapter}</Badge>
                  {scripture.verse && <Badge variant="outline" data-magicpath-id="12" data-magicpath-path="ContentPanel.tsx">{scripture.verse}</Badge>}
                </div>}
            </CardHeader>
            <CardContent className="pt-0" data-magicpath-id="13" data-magicpath-path="ContentPanel.tsx">
              <blockquote className="text-lg leading-relaxed font-bold text-foreground max-w-[70ch]" style={{
              fontFamily: "'Lora', serif"
            }} lang="zh-Hant" data-magicpath-id="14" data-magicpath-path="ContentPanel.tsx">
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
      }} data-magicpath-id="15" data-magicpath-path="ContentPanel.tsx">
          <Card className="border-none shadow-none bg-card/80 dark:bg-card/60 rounded-2xl px-0 py-0 md:p-0 transition-all duration-300 focus-within:ring-2 focus-within:ring-primary/20" style={{
          boxShadow: '0 2px 24px 0 oklch(0.1649 0.0352 281.8285 / 0.08), 0 1.5px 4px 0 oklch(0.1649 0.0352 281.8285 / 0.04)'
        }} data-magicpath-id="16" data-magicpath-path="ContentPanel.tsx">
            <CardHeader className="pb-2 pt-6 px-6 md:px-8" data-magicpath-id="17" data-magicpath-path="ContentPanel.tsx">
              <CardTitle className="text-lg md:text-xl font-semibold text-foreground tracking-tight mb-1 flex items-center gap-2" style={{
              fontFamily: 'Outfit, var(--font-sans)'
            }} data-magicpath-id="18" data-magicpath-path="ContentPanel.tsx">
                {highlightText(commentary.title, searchQuery)}
              </CardTitle>
              <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground mt-1 mb-0.5" data-magicpath-id="19" data-magicpath-path="ContentPanel.tsx">
                <span className="font-medium text-sidebar-primary" data-magicpath-id="20" data-magicpath-path="ContentPanel.tsx">
                  {commentary.author}
                </span>
                {commentary.source && <>
                    <span aria-hidden="true" className="mx-1 opacity-60" data-magicpath-id="21" data-magicpath-path="ContentPanel.tsx">
                      &bull;
                    </span>
                    <span className="text-xs md:text-sm text-muted-foreground/80" data-magicpath-id="22" data-magicpath-path="ContentPanel.tsx">
                      {commentary.source}
                    </span>
                  </>}
              </div>
            </CardHeader>
            <CardContent className="pt-0 pb-6 px-6 md:px-8" data-magicpath-id="23" data-magicpath-path="ContentPanel.tsx">
              <blockquote className="text-base md:text-lg leading-relaxed text-foreground max-w-[60ch] border-l-4 border-sidebar-accent/60 pl-6 italic bg-muted/30 rounded-lg py-3 px-0" style={{
              fontFamily: 'Outfit, var(--font-sans)'
            }} data-magicpath-id="24" data-magicpath-path="ContentPanel.tsx">
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
        }} data-magicpath-id="25" data-magicpath-path="ContentPanel.tsx">
              <Card className={cn("border-l-4 transition-all duration-300 hover:shadow-lg focus-within:shadow-lg focus-within:ring-2 focus-within:ring-primary/20", style.accent, style.bg)} data-magicpath-id="26" data-magicpath-path="ContentPanel.tsx">
                <CardHeader className="pb-4" data-magicpath-id="27" data-magicpath-path="ContentPanel.tsx">
                  <div className="flex items-center justify-between" data-magicpath-id="28" data-magicpath-path="ContentPanel.tsx">
                    <CardTitle className="text-lg font-semibold text-foreground" data-magicpath-id="29" data-magicpath-path="ContentPanel.tsx">
                      {highlightText(analysis.title, searchQuery)}
                    </CardTitle>
                    <Badge className={cn("flex items-center gap-1", style.badge)} data-magicpath-id="30" data-magicpath-path="ContentPanel.tsx">
                      {style.icon}
                      {analysis.name}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="pt-0 space-y-4" data-magicpath-id="31" data-magicpath-path="ContentPanel.tsx">
                  <p className="text-base leading-relaxed text-foreground max-w-[70ch]" data-magicpath-id="32" data-magicpath-path="ContentPanel.tsx">
                    {highlightText(analysis.content, searchQuery)}
                  </p>
                  
                  {analysis.insights && analysis.insights.length > 0 && <div data-magicpath-id="33" data-magicpath-path="ContentPanel.tsx">
                      <h4 className="text-sm font-medium text-muted-foreground mb-2" data-magicpath-id="34" data-magicpath-path="ContentPanel.tsx">
                        關鍵洞察
                      </h4>
                      <ul className="space-y-1" data-magicpath-id="35" data-magicpath-path="ContentPanel.tsx">
                        {analysis.insights.map((insight, idx) => <li key={idx} className="text-sm text-muted-foreground flex items-center gap-2" data-magicpath-id="36" data-magicpath-path="ContentPanel.tsx">
                            <span className="w-1 h-1 bg-primary rounded-full flex-shrink-0" data-magicpath-id="37" data-magicpath-path="ContentPanel.tsx" />
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
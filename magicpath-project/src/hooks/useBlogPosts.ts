import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

export interface BlogPost {
  id: string;
  title: string;
  content: string;
  excerpt: string;
  topic: string;
  tags: string[];
  journal_date: string;
  reading_time_minutes: number;
  is_published: boolean;
  author: string;
  created_at: string;
  updated_at: string;
  slug: string;
  featured_image?: string;
  image_gallery?: string[];
}

export interface CreateBlogPost {
  title: string;
  content: string;
  excerpt?: string;
  topic: string;
  tags: string[];
  journal_date: string;
  is_published?: boolean;
  featured_image?: string;
  image_gallery?: string[];
}

export interface UpdateBlogPost extends Partial<CreateBlogPost> {
  id: string;
}

export function useBlogPosts() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 獲取所有已發布的文章
  const fetchPosts = async () => {
    try {
      setLoading(true);
      setError(null);

      const { data, error: fetchError } = await supabase
        .from('blog_posts')
        .select('*')
        .eq('is_published', true)
        .order('journal_date', { ascending: false });

      if (fetchError) throw fetchError;

      setPosts(data || []);
    } catch (err) {
      console.error('Error fetching blog posts:', err);
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  // 根據ID獲取單篇文章
  const getPostById = async (id: string): Promise<BlogPost | null> => {
    try {
      const { data, error: fetchError } = await supabase
        .from('blog_posts')
        .select('*')
        .eq('id', id)
        .eq('is_published', true)
        .single();

      if (fetchError) throw fetchError;
      return data;
    } catch (err) {
      console.error('Error fetching blog post:', err);
      return null;
    }
  };

  // 根據slug獲取文章
  const getPostBySlug = async (slug: string): Promise<BlogPost | null> => {
    try {
      const { data, error: fetchError } = await supabase
        .from('blog_posts')
        .select('*')
        .eq('slug', slug)
        .eq('is_published', true)
        .single();

      if (fetchError) throw fetchError;
      return data;
    } catch (err) {
      console.error('Error fetching blog post by slug:', err);
      return null;
    }
  };

  // 創建新文章
  const createPost = async (postData: CreateBlogPost): Promise<BlogPost | null> => {
    try {
      const { data, error: createError } = await supabase
        .from('blog_posts')
        .insert([postData])
        .select()
        .single();

      if (createError) throw createError;

      // 刷新文章列表
      fetchPosts();
      return data;
    } catch (err) {
      console.error('Error creating blog post:', err);
      setError(err instanceof Error ? err.message : 'Failed to create post');
      return null;
    }
  };

  // 更新文章
  const updatePost = async (postData: UpdateBlogPost): Promise<BlogPost | null> => {
    try {
      const { id, ...updateData } = postData;
      const { data, error: updateError } = await supabase
        .from('blog_posts')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();

      if (updateError) throw updateError;

      // 刷新文章列表
      fetchPosts();
      return data;
    } catch (err) {
      console.error('Error updating blog post:', err);
      setError(err instanceof Error ? err.message : 'Failed to update post');
      return null;
    }
  };

  // 刪除文章
  const deletePost = async (id: string): Promise<boolean> => {
    try {
      const { error: deleteError } = await supabase
        .from('blog_posts')
        .delete()
        .eq('id', id);

      if (deleteError) throw deleteError;

      // 刷新文章列表
      fetchPosts();
      return true;
    } catch (err) {
      console.error('Error deleting blog post:', err);
      setError(err instanceof Error ? err.message : 'Failed to delete post');
      return false;
    }
  };

  // 獲取所有使用過的主題
  const getTopics = async (): Promise<string[]> => {
    try {
      const { data, error: fetchError } = await supabase
        .from('blog_posts')
        .select('topic')
        .eq('is_published', true);

      if (fetchError) throw fetchError;

      const topics = [...new Set(data?.map(item => item.topic) || [])];
      return topics.sort();
    } catch (err) {
      console.error('Error fetching topics:', err);
      return [];
    }
  };

  // 獲取所有使用過的標籤
  const getTags = async (): Promise<string[]> => {
    try {
      const { data, error: fetchError } = await supabase
        .from('blog_posts')
        .select('tags')
        .eq('is_published', true);

      if (fetchError) throw fetchError;

      const allTags = data?.flatMap(item => item.tags || []) || [];
      const uniqueTags = [...new Set(allTags)];
      return uniqueTags.sort();
    } catch (err) {
      console.error('Error fetching tags:', err);
      return [];
    }
  };

  // 根據主題過濾文章
  const getPostsByTopic = (topic: string): BlogPost[] => {
    return posts.filter(post => post.topic === topic);
  };

  // 根據標籤過濾文章
  const getPostsByTag = (tag: string): BlogPost[] => {
    return posts.filter(post => post.tags.includes(tag));
  };

  // 搜索文章
  const searchPosts = (query: string): BlogPost[] => {
    if (!query.trim()) return posts;
    
    const lowerQuery = query.toLowerCase();
    return posts.filter(post => 
      post.title.toLowerCase().includes(lowerQuery) ||
      post.content.toLowerCase().includes(lowerQuery) ||
      post.excerpt.toLowerCase().includes(lowerQuery) ||
      post.topic.toLowerCase().includes(lowerQuery) ||
      post.tags.some(tag => tag.toLowerCase().includes(lowerQuery))
    );
  };

  // 計算閱讀時間的工具函數
  const calculateReadingTime = (content: string): number => {
    const chineseCharCount = (content.match(/[\u4e00-\u9fff]/g) || []).length;
    const wordsPerMinute = 225; // 中文字符每分鐘
    return Math.max(1, Math.ceil(chineseCharCount / wordsPerMinute));
  };

  // 生成摘要的工具函數
  const generateExcerpt = (content: string, maxLength: number = 200): string => {
    if (!content || content.trim().length === 0) return '';
    
    if (content.length <= maxLength) return content;
    return content.substring(0, maxLength) + '...';
  };

  // 初始加載
  useEffect(() => {
    fetchPosts();
  }, []);

  return {
    // 數據
    posts,
    loading,
    error,
    
    // 操作函數
    fetchPosts,
    getPostById,
    getPostBySlug,
    createPost,
    updatePost,
    deletePost,
    
    // 輔助函數
    getTopics,
    getTags,
    getPostsByTopic,
    getPostsByTag,
    searchPosts,
    calculateReadingTime,
    generateExcerpt,
  };
}

export default useBlogPosts;

import { useState } from 'react';
import { supabase } from '@/lib/supabase';

export function useImageUpload() {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const uploadImage = async (file: File): Promise<string | null> => {
    try {
      setUploading(true);
      setError(null);

      // 验证文件类型
      if (!file.type.startsWith('image/')) {
        throw new Error('请选择图片文件');
      }

      // 验证文件大小 (10MB)
      if (file.size > 10 * 1024 * 1024) {
        throw new Error('图片大小不能超过10MB');
      }

      // 生成唯一文件名
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `blog-images/${fileName}`;

      // 上传文件到Supabase Storage
      const { data, error: uploadError } = await supabase.storage
        .from('blog-images')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      // 获取公共URL
      const { data: { publicUrl } } = supabase.storage
        .from('blog-images')
        .getPublicUrl(filePath);

      return publicUrl;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Upload failed';
      setError(errorMessage);
      console.error('Error uploading image:', err);
      return null;
    } finally {
      setUploading(false);
    }
  };

  const deleteImage = async (url: string): Promise<boolean> => {
    try {
      // 从URL中提取文件路径
      const urlParts = url.split('/');
      const fileName = urlParts[urlParts.length - 1];
      const filePath = `blog-images/${fileName}`;

      const { error: deleteError } = await supabase.storage
        .from('blog-images')
        .remove([filePath]);

      if (deleteError) throw deleteError;
      return true;
    } catch (err) {
      console.error('Error deleting image:', err);
      return false;
    }
  };

  return {
    uploadImage,
    deleteImage,
    uploading,
    error,
  };
}

export default useImageUpload;

import React, { useRef, useState } from 'react';
import { Upload, X, Image as ImageIcon } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { useImageUpload } from '@/hooks/useImageUpload';

interface ImageUploadProps {
  onImageUploaded: (url: string) => void;
  currentImage?: string;
  onImageRemoved?: () => void;
  className?: string;
}

export function ImageUpload({ 
  onImageUploaded, 
  currentImage, 
  onImageRemoved,
  className = "" 
}: ImageUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragOver, setDragOver] = useState(false);
  const { uploadImage, uploading, error } = useImageUpload();

  const handleFileSelect = async (file: File) => {
    const url = await uploadImage(file);
    if (url) {
      onImageUploaded(url);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
      handleFileSelect(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = () => {
    setDragOver(false);
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {/* 当前图片预览 */}
      {currentImage && (
        <Card className="relative">
          <CardContent className="p-4">
            <div className="relative">
              <img 
                src={currentImage} 
                alt="Current featured image" 
                className="w-full h-48 object-cover rounded-lg"
              />
              {onImageRemoved && (
                <Button
                  variant="destructive"
                  size="icon"
                  className="absolute top-2 right-2 h-8 w-8"
                  onClick={onImageRemoved}
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* 上传区域 */}
      <Card 
        className={`border-2 border-dashed transition-colors cursor-pointer ${
          dragOver ? 'border-primary bg-primary/5' : 'border-muted-foreground/25'
        }`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={() => fileInputRef.current?.click()}
      >
        <CardContent className="p-8 text-center">
          <div className="space-y-4">
            <div className="mx-auto h-12 w-12 text-muted-foreground">
              {uploading ? (
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
              ) : (
                <ImageIcon className="h-12 w-12" />
              )}
            </div>
            
            <div className="space-y-2">
              <p className="text-lg font-medium">
                {uploading ? '上传中...' : '上传图片'}
              </p>
              <p className="text-sm text-muted-foreground">
                拖拽图片到这里，或点击选择文件
              </p>
              <p className="text-xs text-muted-foreground">
                支持 PNG, JPG, WebP, GIF (最大 10MB)
              </p>
            </div>

            {!uploading && (
              <Button variant="secondary" size="sm">
                <Upload className="h-4 w-4 mr-2" />
                选择文件
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* 错误显示 */}
      {error && (
        <div className="text-sm text-red-500 bg-red-50 p-3 rounded-lg">
          {error}
        </div>
      )}

      {/* 隐藏的文件输入 */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileInputChange}
        className="hidden"
      />
    </div>
  );
}

export default ImageUpload;

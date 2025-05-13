'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';

export default function AddNote() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const category = searchParams.get('category') || '';
  
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [tags, setTags] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // 验证表单
  const validateForm = () => {
    if (!title.trim()) {
      setError('请输入笔记标题');
      return false;
    }
    if (!content.trim()) {
      setError('请输入笔记内容');
      return false;
    }
    return true;
  };

  // 创建笔记文件名（基于标题的 slug）
  const createSlug = (text: string) => {
    return text
      .toLowerCase()
      .replace(/[^\w\u4e00-\u9fa5]+/g, '-')
      .replace(/^-+|-+$/g, '');
  };

  // 处理表单提交
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setLoading(true);
    setError('');

    try {
      // 准备笔记元数据
      const today = new Date();
      const formattedDate = today.toISOString().split('T')[0];
      const slug = createSlug(title);
      
      // 准备笔记内容
      const tagsList = tags
        .split(',')
        .map(tag => tag.trim())
        .filter(tag => tag);
      
      const noteContent = `---
title: "${title}"
date: "${formattedDate}"
category: "${category}"
tags: [${tagsList.map(tag => `"${tag}"`).join(', ')}]
summary: "${content.slice(0, 150)}${content.length > 150 ? '...' : ''}"
---

${content}
`;

      // 在实际应用中，这里应该与后端API通信保存笔记
      // 但由于这是前端演示，我们只显示成功信息并重定向
      alert(`笔记已创建成功！\n标题: ${title}\n分类: ${category}\n注意：在实际应用中，这里会将笔记保存到服务器。`);
      
      // 重定向到笔记列表页
      router.push('/notes');
    } catch (err) {
      console.error('创建笔记失败:', err);
      setError('创建笔记失败，请重试');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="py-8 px-4 max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div className="relative">
          <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-600">
            添加笔记到 {category} 分类
          </h1>
          <div className="absolute -inset-1 blur-sm opacity-30 bg-gradient-to-r from-blue-400 to-purple-500 rounded-lg -z-10"></div>
        </div>
        <Link 
          href="/notes" 
          className="px-4 py-2 bg-gray-100 dark:bg-gray-800 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
        >
          返回笔记
        </Link>
      </div>

      <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-lg shadow-md border border-gray-200 dark:border-gray-700 p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 p-3 rounded-md">
              {error}
            </div>
          )}
          
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              笔记标题 <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              placeholder="输入笔记标题"
              required
            />
          </div>
          
          <div>
            <label htmlFor="content" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              笔记内容 <span className="text-red-500">*</span>
            </label>
            <textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white min-h-[200px]"
              placeholder="输入笔记内容 (支持 Markdown 格式)"
              required
            />
          </div>
          
          <div>
            <label htmlFor="tags" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              标签 (可选，用逗号分隔)
            </label>
            <input
              type="text"
              id="tags"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              placeholder="例如: javascript, react, tutorial"
            />
          </div>
          
          <div className="flex items-center justify-between pt-4">
            <div className="text-sm text-gray-500">
              <span className="text-red-500">*</span> 表示必填字段
            </div>
            <div className="flex space-x-2">
              <Link 
                href="/notes"
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
              >
                取消
              </Link>
              <button
                type="submit"
                disabled={loading}
                className={`px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
              >
                {loading ? '保存中...' : '保存笔记'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </main>
  );
} 
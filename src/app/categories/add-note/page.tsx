'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import AdminRoute from '@/components/AdminRoute';

// 定义笔记类型接口
interface Note {
  slug: string;
  title: string;
  date: string;
  summary: string;
  content: string;
  tags: string[];
  category: string;
}

// 新建一个内部组件来包含原有的逻辑
function AddNoteContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const category = searchParams.get('category') || '';
  
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [tags, setTags] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [textareaHeight, setTextareaHeight] = useState('200px'); // 初始高度

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

  // 处理文本框内容变化，自动调整高度
  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setContent(e.target.value);
    // 调整文本框高度
    const scrollHeight = e.target.scrollHeight;
    const minHeight = 200; // 最小高度 200px
    const newHeight = Math.max(scrollHeight, minHeight);
    setTextareaHeight(`${newHeight}px`);
  };

  // 将笔记保存到localStorage
  const saveNoteToLocalStorage = (note: Note) => {
    if (typeof window !== 'undefined') {
      // 获取现有笔记
      const storedNotes = localStorage.getItem('user_notes');
      let notes: Note[] = [];
      
      if (storedNotes) {
        notes = JSON.parse(storedNotes);
      }
      
      // 检查是否已存在同slug的笔记
      const existingNoteIndex = notes.findIndex(n => n.slug === note.slug);
      if (existingNoteIndex >= 0) {
        // 更新现有笔记
        notes[existingNoteIndex] = note;
      } else {
        // 添加新笔记
        notes.push(note);
      }
      
      // 保存回localStorage
      localStorage.setItem('user_notes', JSON.stringify(notes));
      
      // 触发自定义事件，通知侧边栏更新数据
      const event = new Event('noteDataChanged');
      window.dispatchEvent(event);
    }
  };

  // 将笔记保存到文件系统
  const saveNoteToFileSystem = async (note: Note): Promise<boolean> => {
    try {
      const response = await fetch('/api/notes/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(note)
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || '保存到文件系统失败');
      }
      
      return true;
    } catch (err) {
      console.error('保存到文件系统失败:', err);
      return false;
    }
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
      
      // 创建笔记对象
      const noteObj: Note = {
        slug,
        title,
        date: formattedDate,
        summary: content.slice(0, 150) + (content.length > 150 ? '...' : ''),
        content,
        tags: tagsList,
        category
      };
      
      // 将笔记保存到localStorage
      saveNoteToLocalStorage(noteObj);
      
      // 同时保存到文件系统
      try {
        await saveNoteToFileSystem(noteObj);
        // 显示成功信息
        alert(`笔记已创建成功！\n标题: ${title}\n分类: ${category}\n笔记已同时保存到本地存储和文件系统。`);
      } catch (fsError) {
        console.error('保存到文件系统失败:', fsError);
        alert(`笔记已创建成功！\n标题: ${title}\n分类: ${category}\n笔记已保存到本地存储，但保存到文件系统失败。`);
      }
      
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
    <AdminRoute>
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
                onChange={handleContentChange}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                placeholder="输入笔记内容 (支持 Markdown 格式)"
                style={{ height: textareaHeight, minHeight: '200px', resize: 'vertical' }}
                required
              />
              <div className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                支持 Markdown 格式，文本框将随内容自动增加高度
              </div>
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
                  className={`px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all ${loading ? 'opacity-50 pointer-events-none' : ''}`}
                  tabIndex={loading ? -1 : 0}
                  aria-disabled={loading}
                >
                  取消
                </Link>
                <button
                  type="submit"
                  disabled={loading}
                  className={`px-6 py-2 text-white rounded-md transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-gray-900 flex items-center justify-center space-x-2
                    ${loading 
                      ? 'bg-gray-400 dark:bg-gray-600 cursor-not-allowed' 
                      : 'bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 focus:ring-blue-500 dark:focus:ring-purple-600'}
                  `}
                >
                  {loading && (
                    <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                  )}
                  {loading ? '创建中...' : '创建笔记'}
                </button>
              </div>
            </div>
          </form>
        </div>
      </main>
    </AdminRoute>
  );
}

// 原始页面组件现在只负责渲染 Suspense 和内部组件
export default function AddNotePage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <AddNoteContent />
    </Suspense>
  );
} 
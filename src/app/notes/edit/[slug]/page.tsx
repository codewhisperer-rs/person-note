'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
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

export default function EditNote() {
  const params = useParams();
  const router = useRouter();
  const slug = Array.isArray(params.slug) ? params.slug[0] : params.slug;
  
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('');
  const [tags, setTags] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [defaultCategories, setDefaultCategories] = useState<string[]>(['C++', 'Rust', 'Pytorch', 'CUDA', 'Uncategorized']);
  const [customCategories, setCustomCategories] = useState<string[]>([]);
  const [textareaHeight, setTextareaHeight] = useState('300px'); // 初始高度

  // 处理文本框内容变化，自动调整高度
  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setContent(e.target.value);
    // 调整文本框高度
    const scrollHeight = e.target.scrollHeight;
    const minHeight = 300; // 最小高度 300px
    const newHeight = Math.max(scrollHeight, minHeight);
    setTextareaHeight(`${newHeight}px`);
  };

  // 从localStorage获取笔记数据
  const getNoteFromLocalStorage = (noteSlug: string) => {
    try {
      const storedNotes = localStorage.getItem('user_notes');
      if (storedNotes) {
        const notes: Note[] = JSON.parse(storedNotes);
        return notes.find(note => note.slug === noteSlug);
      }
      return null;
    } catch (err) {
      console.error('获取笔记失败:', err);
      return null;
    }
  };

  // 加载笔记数据
  useEffect(() => {
    const fetchNote = async () => {
      if (!slug) return;
      try {
        const note = getNoteFromLocalStorage(slug);
        
        if (note) {
          setTitle(note.title);
          setContent(note.content);
          setCategory(note.category);
          setTags(note.tags.join(', '));
          
          // 设置文本框初始高度
          setTimeout(() => {
            const textarea = document.getElementById('content') as HTMLTextAreaElement;
            if (textarea) {
              const scrollHeight = textarea.scrollHeight;
              const minHeight = 300;
              const newHeight = Math.max(scrollHeight, minHeight);
              setTextareaHeight(`${newHeight}px`);
            }
          }, 0);
        } else {
          setError('找不到此笔记');
        }
        
        setLoading(false);
      } catch (err) {
        console.error('加载笔记失败:', err);
        setError('无法加载笔记内容');
        setLoading(false);
      }
    };

    // 加载自定义分类
    const loadCustomCategories = () => {
      try {
        const storedCategories = localStorage.getItem('custom_categories');
        if (storedCategories) {
          setCustomCategories(JSON.parse(storedCategories));
        }
      } catch (error) {
        console.error('加载自定义分类失败:', error);
      }
    };

    fetchNote();
    loadCustomCategories();
  }, [slug]);

  // 将更新后的笔记保存到localStorage
  const saveNoteToLocalStorage = (updatedNote: Note) => {
    try {
      const storedNotes = localStorage.getItem('user_notes');
      if (storedNotes) {
        const notes: Note[] = JSON.parse(storedNotes);
        
        // 查找并更新笔记
        const updatedNotes = notes.map(note => 
          note.slug === updatedNote.slug ? updatedNote : note
        );
        
        localStorage.setItem('user_notes', JSON.stringify(updatedNotes));
        
        // 触发自定义事件，通知侧边栏更新数据
        const event = new Event('noteDataChanged');
        window.dispatchEvent(event);
        
        return true;
      }
      return false;
    } catch (err) {
      console.error('保存笔记失败:', err);
      return false;
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
    
    if (!title.trim() || !content.trim()) {
      setError('标题和内容不能为空');
      return;
    }
    
    setSaving(true);
    setError('');

    try {
      // 准备笔记数据
      const tagsList = tags
        .split(',')
        .map(tag => tag.trim())
        .filter(tag => tag);
      
      // 创建更新后的笔记对象
      const currentNote = getNoteFromLocalStorage(slug);
      if (!currentNote) {
        throw new Error('找不到原始笔记');
      }

      const updatedNote: Note = {
        ...currentNote,
        title,
        content,
        category,
        tags: tagsList,
        summary: content.slice(0, 150) + (content.length > 150 ? '...' : '')
      };

      // 保存到localStorage
      const success = saveNoteToLocalStorage(updatedNote);
      
      // 保存到文件系统
      try {
        await saveNoteToFileSystem(updatedNote);
        if (success) {
          alert('笔记已成功更新，并同步到文件系统！');
          router.push(`/notes/${slug}`);
        } else {
          throw new Error('保存笔记失败');
        }
      } catch (fsError) {
        console.error('保存到文件系统失败:', fsError);
        
        // 本地存储成功但文件系统失败
        if (success) {
          alert('笔记已更新到本地存储，但同步到文件系统失败。');
          router.push(`/notes/${slug}`);
        } else {
          throw new Error('保存笔记失败');
        }
      }
    } catch (err) {
      console.error('更新笔记失败:', err);
      setError('更新笔记失败，请重试');
      setSaving(false);
    }
  };

  return (
    <AdminRoute>
      <main className="py-8 px-4 max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div className="relative">
            <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-600">
              编辑笔记
            </h1>
            <div className="absolute -inset-1 blur-sm opacity-30 bg-gradient-to-r from-blue-400 to-purple-500 rounded-lg -z-10"></div>
          </div>
          <Link 
            href={`/notes/${slug}`} 
            className="px-4 py-2 bg-gray-100 dark:bg-gray-800 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
          >
            取消
          </Link>
        </div>

        {loading ? (
          <div className="animate-pulse">
            <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded w-full mb-6"></div>
            <div className="h-60 bg-gray-200 dark:bg-gray-700 rounded w-full mb-4"></div>
            <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
          </div>
        ) : (
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
                <label htmlFor="category" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  分类
                </label>
                <select
                  id="category"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                >
                  {[...defaultCategories, ...customCategories].map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
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
                  style={{ height: textareaHeight, minHeight: '300px', resize: 'vertical' }}
                  required
                />
                <div className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                  支持 Markdown 格式，文本框将随内容自动增加高度
                </div>
              </div>
              
              <div>
                <label htmlFor="tags" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  标签 (用逗号分隔)
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
                    href={`/notes/${slug}`}
                    className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
                  >
                    取消
                  </Link>
                  <button
                    type="submit"
                    disabled={saving}
                    className={`px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors ${saving ? 'opacity-70 cursor-not-allowed' : ''}`}
                  >
                    {saving ? '保存中...' : '保存更改'}
                  </button>
                </div>
              </div>
            </form>
          </div>
        )}
      </main>
    </AdminRoute>
  );
}
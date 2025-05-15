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

// 辅助函数：从API获取笔记，与查看页面逻辑类似
const fetchNoteDataFromApi = async (slug: string): Promise<Note | null> => {
  try {
    const response = await fetch(`/api/notes/${slug}`);
    if (response.ok) {
      const note = await response.json();
      if (note && note.slug) {
        return note;
      }
    }
    // 对于404或其他错误，这里不直接抛出，而是返回null，让调用者决定如何处理
    console.warn(`API fetch for note ${slug} returned status: ${response.status}`);
    return null;
  } catch (apiError: any) {
    console.error('API获取笔记数据失败 (编辑模式):', apiError.message);
    return null;
  }
};

export default function EditNote() {
  const params = useParams();
  const router = useRouter();
  const slug = Array.isArray(params.slug) ? params.slug[0] : params.slug;
  
  // 如果没有 slug，立即重定向到笔记列表
  useEffect(() => {
    if (!slug) {
      router.push('/notes');
    }
  }, [slug, router]);
  
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
  const [originalDate, setOriginalDate] = useState<string | null>(null); // 新增状态来保存原始日期

  // 处理文本框内容变化，自动调整高度
  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setContent(e.target.value);
    // 调整文本框高度
    const scrollHeight = e.target.scrollHeight;
    const minHeight = 300; // 最小高度 300px
    const newHeight = Math.max(scrollHeight, minHeight);
    setTextareaHeight(`${newHeight}px`);
  };

  // 从localStorage获取笔记数据 (作为备用)
  const getNoteFromLocalStorage = (noteSlug: string | undefined): Note | null => {
    if (!noteSlug) return null;
    try {
      const storedNotes = localStorage.getItem('user_notes');
      if (storedNotes) {
        const notes: Note[] = JSON.parse(storedNotes);
        return notes.find(note => note.slug === noteSlug) || null;
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
      if (!slug) {
        setLoading(false);
        setError('无效的笔记标识');
        return;
      }
      setLoading(true);
      let noteData = await fetchNoteDataFromApi(slug);

      if (!noteData && typeof window !== 'undefined') { 
        console.warn(`API未能获取笔记 ${slug}，尝试从 localStorage 加载。`);
        noteData = getNoteFromLocalStorage(slug);
      }
      
      if (noteData) {
        setTitle(noteData.title);
        setContent(noteData.content);
        setCategory(noteData.category);
        setTags(noteData.tags.join(', '));
        setOriginalDate(noteData.date); // 保存原始日期
        
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
        setError('');
      } else {
        setError('找不到此笔记，或无法从任何来源加载。');
      }
      setLoading(false);
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
    
    if (!slug) {
        setError('笔记标识丢失，无法保存。');
        setSaving(false); // 确保重置 saving 状态
        return;
    }

    // 检查 originalDate 是否已加载。如果为 null，可能意味着笔记是全新的或加载失败。
    // 对于"编辑"操作，我们通常期望 originalDate 是存在的。
    // 如果 originalDate 为 null，且我们确定这不是一个"创建新笔记"的场景，则应报错。
    if (originalDate === null) {
        // 这里我们假设编辑的笔记必须是已存在的，因此 originalDate 必须有值
        // 如果逻辑允许通过编辑页面创建新笔记，则这里的处理会不同
        setError('无法获取原始笔记的创建日期，保存操作中止。请确保笔记已正确加载。');
        setSaving(false);
        return;
    }

    setSaving(true);
    setError('');

    try {
      const tagsList = tags
        .split(',')
        .map(tag => tag.trim())
        .filter(tag => tag);
      
      const updatedNote: Note = {
        slug: slug,
        title,
        date: originalDate, // 强制使用加载时获取的 originalDate
        summary: content.slice(0, 150) + (content.length > 150 ? '...' : ''),
        content,
        tags: tagsList,
        category
      };

      // 首先尝试保存到文件系统，因为这是权威数据源
      try {
        await saveNoteToFileSystem(updatedNote);
        // 文件系统保存成功后，再尝试更新 localStorage
        const localStorageSuccess = saveNoteToLocalStorage(updatedNote);
        
        if (localStorageSuccess) {
          alert('笔记已成功更新，并同步到文件系统及本地存储！');
        } else {
          alert('笔记已同步到文件系统，但本地存储更新失败。');
        }
        router.push(`/notes/${slug}`); // 无论 localStorage 如何，文件系统成功就跳转

      } catch (fsError: any) {
        console.error('保存到文件系统失败:', fsError.message);
        setError(`保存到文件系统失败: ${fsError.message}。本地更改尚未同步。`);
        setSaving(false); // 允许用户再次尝试或进行其他操作
        // 注意：这里没有尝试更新 localStorage，因为权威源失败了
      }
    } catch (err: any) { 
      console.error('构建更新数据或执行保存前发生意外错误:', err.message);
      setError(`更新笔记时发生意外错误: ${err.message}`);
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
                    className={`px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-all relative ${saving ? 'opacity-70 cursor-not-allowed pl-8' : ''}`}
                  >
                    {saving && (
                      <span className="absolute left-2 top-1/2 -translate-y-1/2 inline-block w-5 h-5">
                        <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                      </span>
                    )}
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
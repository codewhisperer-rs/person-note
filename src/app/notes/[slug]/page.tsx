'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/components/AuthProvider';

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

// 定义标题结构接口
interface Heading {
  id: string;
  text: string;
  level: number;
}

// 获取指定笔记
const getNoteBySlug = async (slug: string): Promise<Note> => {
  if (typeof window === 'undefined') {
    throw new Error('笔记未找到');
  }
  
  // 先尝试从localStorage获取
  const storedNotes = localStorage.getItem('user_notes');
  let localNote = null;
  
  if (storedNotes) {
    try {
      const notes: Note[] = JSON.parse(storedNotes);
      localNote = notes.find(n => n.slug === slug);
    } catch (err) {
      console.error('解析本地笔记数据失败:', err);
    }
  }
  
  if (localNote) {
    return localNote;
  }
  
  // 如果localStorage中没有，则尝试从文件系统获取
  try {
    const response = await fetch(`/api/notes`);
    if (!response.ok) {
      throw new Error('获取笔记失败');
    }
    
    const notes: Note[] = await response.json();
    const note = notes.find(n => n.slug === slug);
    
    if (!note) {
      throw new Error('笔记未找到');
    }
    
    return note;
  } catch (err) {
    console.error('获取笔记失败:', err);
    throw new Error('笔记未找到');
  }
};

export default function NotePage() {
  const params = useParams();
  const router = useRouter();
  const { isAuthenticated, checkAuth } = useAuth();
  const slug = Array.isArray(params.slug) ? params.slug[0] : params.slug;
  
  const [note, setNote] = useState<Note | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [headings, setHeadings] = useState<Heading[]>([]);
  const [showToc, setShowToc] = useState(true);

  // 提取标题函数
  const extractHeadings = (content: string) => {
    const headingRegex = /^(#{1,3})\s+(.+)$/gm;
    const matches = [...content.matchAll(headingRegex)];
    
    return matches.map((match, index) => {
      const level = match[1].length;
      const text = match[2].trim();
      const id = `heading-${index}`;
      
      return { id, text, level };
    });
  };

  // 加载笔记数据
  useEffect(() => {
    const fetchNote = async () => {
      try {
        if (!slug) {
          throw new Error('无效的笔记标识');
        }
        const noteData = await getNoteBySlug(slug);
        setNote(noteData);
        
        // 提取标题生成目录
        const extractedHeadings = extractHeadings(noteData.content);
        setHeadings(extractedHeadings);
        
        // 如果没有标题，隐藏目录
        if (extractedHeadings.length === 0) {
          setShowToc(false);
        }
      } catch (err) {
        console.error('Failed to fetch note:', err);
        setError('无法找到此笔记');
      } finally {
        setLoading(false);
      }
    };

    fetchNote();
    // 检查用户认证状态
    checkAuth();
  }, [slug, checkAuth]);

  // 从文件系统删除笔记
  const deleteNoteFromFileSystem = async (noteSlug: string): Promise<boolean> => {
    try {
      const response = await fetch(`/api/notes/delete?slug=${encodeURIComponent(noteSlug)}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' }
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || '从文件系统删除笔记失败');
      }
      
      return true;
    } catch (err) {
      console.error('从文件系统删除笔记失败:', err);
      return false;
    }
  };

  // 处理笔记删除
  const handleDelete = async () => {
    if (!isAuthenticated) {
      alert('您需要登录才能删除笔记');
      return;
    }

    if (!window.confirm('确定要删除此笔记吗？此操作无法撤销。')) {
      return;
    }

    setIsDeleting(true);

    try {
      // 从localStorage删除笔记
      const storedNotes = localStorage.getItem('user_notes');
      if (storedNotes) {
        const notes: Note[] = JSON.parse(storedNotes);
        const updatedNotes = notes.filter(note => note.slug !== slug);
        localStorage.setItem('user_notes', JSON.stringify(updatedNotes));
        
        // 触发自定义事件，通知侧边栏更新数据
        const event = new Event('noteDataChanged');
        window.dispatchEvent(event);
      }
      
      // 同时从文件系统删除笔记
      if (slug) {
        try {
          await deleteNoteFromFileSystem(slug);
          console.log('笔记已从文件系统删除');
        } catch (fsError) {
          console.error('从文件系统删除笔记失败:', fsError);
          // 继续执行，因为已经从localStorage删除了
        }
      }
      
      alert('笔记已成功删除！');
      router.push('/notes');
    } catch (err) {
      console.error('删除笔记失败:', err);
      setError('删除笔记失败，请重试');
      setIsDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="py-8 px-4 max-w-4xl mx-auto">
        <div className="animate-pulse">
          <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-6"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4 mb-8"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full mb-2"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full mb-2"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-8 px-4 max-w-4xl mx-auto">
        <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 text-yellow-700 dark:text-yellow-400 p-6 rounded-md">
          <h2 className="text-xl font-semibold mb-3">未找到笔记</h2>
          <p className="mb-4">{error}</p>
          <p className="text-sm mb-4">您可以尝试以下操作：</p>
          <ul className="list-disc pl-5 mb-4 space-y-1 text-sm">
            <li>确认您输入的 URL 是否正确</li>
            <li>返回笔记列表查看所有可用笔记</li>
            {isAuthenticated && <li>创建一个新的笔记</li>}
          </ul>
          <div className="flex space-x-3 mt-6">
            <Link 
              href="/notes" 
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              返回笔记列表
            </Link>
            {isAuthenticated && (
              <Link 
                href="/categories/add-note" 
                className="px-4 py-2 border border-blue-600 text-blue-600 rounded-md hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors"
              >
                创建笔记
              </Link>
            )}
          </div>
        </div>
      </div>
    );
  }

  if (!note) {
    return (
      <div className="py-8 px-4 max-w-4xl mx-auto">
        <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 text-yellow-700 dark:text-yellow-400 p-4 rounded-md">
          <h2 className="text-lg font-semibold mb-2">未找到笔记</h2>
          <p>无法找到请求的笔记。</p>
          <Link href="/notes" className="text-blue-600 dark:text-blue-400 hover:underline mt-4 inline-block">
            返回笔记列表
          </Link>
        </div>
      </div>
    );
  }

  // 将 Markdown 内容转换为 HTML（简单实现）
  const renderMarkdown = (content: string) => {
    // 对内容中的标题添加ID，以支持锚点跳转
    let processedContent = content;
    headings.forEach((heading, index) => {
      const hashes = '#'.repeat(heading.level);
      const headingText = heading.text;
      const headingRegex = new RegExp(`^${hashes}\\s+${escapeRegExp(headingText)}$`, 'm');
      processedContent = processedContent.replace(
        headingRegex,
        `${hashes} <a id="${heading.id}" class="anchor-heading"></a>${headingText}`
      );
    });
    
    // 这里只做了非常简单的转换，实际应用中应使用专业的 Markdown 解析库
    let html = processedContent
      // 转换标题
      .replace(/## <a id="(.*?)" class="anchor-heading"><\/a>(.*)/g, '<h2 id="$1" class="text-2xl font-bold my-4">$2</h2>')
      .replace(/# <a id="(.*?)" class="anchor-heading"><\/a>(.*)/g, '<h1 id="$1" class="text-3xl font-bold my-4">$2</h1>')
      .replace(/### <a id="(.*?)" class="anchor-heading"><\/a>(.*)/g, '<h3 id="$1" class="text-xl font-bold my-4">$2</h3>')
      // 转换粗体
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      // 转换斜体
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      // 转换代码块
      .replace(/```([\s\S]*?)```/g, '<pre class="bg-gray-100 dark:bg-gray-800 p-4 rounded-md overflow-x-auto my-4"><code>$1</code></pre>')
      // 转换行内代码
      .replace(/`(.*?)`/g, '<code class="bg-gray-100 dark:bg-gray-800 px-1 py-0.5 rounded">$1</code>')
      // 转换段落
      .split('\n\n')
      .map(p => `<p class="mb-4">${p}</p>`)
      .join('');
    
    return { __html: html };
  };
  
  // 辅助函数：转义正则表达式中的特殊字符
  function escapeRegExp(string: string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }
  
  // 切换目录显示
  const toggleToc = () => {
    setShowToc(!showToc);
  };

  return (
    <div className="py-8 px-4 max-w-5xl mx-auto">
      {/* 笔记头部 */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-2">
          <div className="flex items-center">
            <span className="bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 text-xs px-2 py-1 rounded mr-2">
              {note.category}
            </span>
            <span className="text-gray-500 dark:text-gray-400 text-sm">
              {new Date(note.date).toLocaleDateString('zh-CN')}
            </span>
          </div>

          {/* 只对已登录用户显示的编辑/删除按钮 */}
          {isAuthenticated && (
            <div className="flex space-x-2">
              <Link
                href={`/notes/edit/${slug}`}
                className="px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm"
              >
                编辑
              </Link>
              <button
                onClick={handleDelete}
                disabled={isDeleting}
                className={`px-3 py-1 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors text-sm relative ${isDeleting ? 'opacity-70 cursor-not-allowed pl-7' : ''}`}
              >
                {isDeleting && (
                  <span className="absolute left-1.5 top-1/2 -translate-y-1/2 inline-block w-4 h-4">
                    <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                  </span>
                )}
                {isDeleting ? '删除中...' : '删除'}
              </button>
            </div>
          )}
        </div>

        <h1 className="text-3xl font-bold mb-4">{note.title}</h1>

        {note.tags && note.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-6">
            {note.tags.map((tag: string, index: number) => (
              <span
                key={index}
                className="bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 text-xs px-2 py-1 rounded"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* 改为两栏布局：内容区和侧边目录 */}
      <div className="flex flex-col lg:flex-row gap-8">
        {/* 笔记内容 - 左侧区域 */}
        <div className="lg:w-3/4 order-2 lg:order-1">
          <div className="prose dark:prose-invert max-w-none">
            <div dangerouslySetInnerHTML={renderMarkdown(note.content)} />
          </div>
          
          {/* 底部导航 */}
          <div className="mt-12 pt-6 border-t border-gray-200 dark:border-gray-700">
            <Link
              href="/notes"
              className="text-blue-600 dark:text-blue-400 hover:underline flex items-center"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              返回笔记列表
            </Link>
          </div>
        </div>
        
        {/* 侧边目录 - 右侧区域 */}
      {headings.length > 0 && (
          <div className="lg:w-1/4 order-1 lg:order-2">
            <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-200 dark:border-gray-700 p-4 sticky top-4">
              <div className="flex justify-between items-center mb-3">
                <h2 className="text-lg font-semibold">目录</h2>
                <button 
                  onClick={toggleToc}
                  className="text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 text-sm"
                >
                  {showToc ? '隐藏' : '显示'}
                </button>
              </div>
              
              {showToc && (
                <nav className="toc">
                  <ul className="space-y-2 pl-0 text-sm">
              {headings.map((heading) => (
                      <li 
                        key={heading.id} 
                        style={{ paddingLeft: `${(heading.level - 1) * 0.75}rem` }}
                        className={`hover:text-blue-600 dark:hover:text-blue-400 transition-colors line-clamp-1 ${
                          heading.level === 1 ? 'font-medium' : 'text-gray-700 dark:text-gray-300'
                        }`}
                      >
                        <a 
                          href={`#${heading.id}`} 
                          className="block py-1"
                  >
                    {heading.text}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
              )}
            </div>
          </div>
      )}
      </div>
    </div>
  );
}

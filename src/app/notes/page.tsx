'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Tag from '@/components/Tag'; // Import the Tag component

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

// 从localStorage获取用户笔记
const getUserNotes = (): Note[] => {
  if (typeof window === 'undefined') {
    return [];
  }
  
  const storedNotes = localStorage.getItem('user_notes');
  if (storedNotes) {
    try {
      return JSON.parse(storedNotes);
    } catch (err) {
      console.error('解析笔记数据失败:', err);
      return [];
    }
  }
  
  return [];
};

export default function NotesList() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const [groupedNotes, setGroupedNotes] = useState<{[category: string]: Note[]}>({});

  useEffect(() => {
    // 短暂延迟以模拟加载
    const timer = setTimeout(() => {
      const allNotes = getUserNotes();
      setNotes(allNotes);
      
      // 按分类对笔记进行分组
      const grouped = allNotes.reduce((acc, note) => {
        if (!acc[note.category]) {
          acc[note.category] = [];
        }
        acc[note.category].push(note);
        return acc;
      }, {} as {[category: string]: Note[]});
      
      setGroupedNotes(grouped);
      setLoading(false);
    }, 300);

    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div className="mi-fade-in">
        <header className="mb-8">
          <h1 className="text-3xl font-bold mi-gradient-text">
            我的学习笔记
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-2">探索知识，记录成长</p>
        </header>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4].map((item) => (
            <div key={item} className="mi-card p-6">
              <div className="animate-pulse">
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4 mb-4"></div>
                <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-4"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full mb-2"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full mb-2"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-2/3 mb-4"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4 mt-4"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="mi-fade-in">
      <header className="mb-8">
        <h1 className="text-3xl font-bold mi-gradient-text">
          我的学习笔记
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mt-2">探索知识，记录成长</p>
      </header>
      
      {/* 按分类分组显示笔记 */}
      {Object.keys(groupedNotes).length > 0 ? (
        Object.entries(groupedNotes).map(([category, categoryNotes]) => (
          <div key={category} className="mb-12 mi-slide-up">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-medium text-gray-800 dark:text-gray-200 flex items-center">
                <span className="w-1 h-5 bg-[var(--mi-orange)] rounded mr-2"></span>
                {category}
              </h2>
              <span className="mi-tag mi-tag-gray">
                {categoryNotes.length} 篇笔记
              </span>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {categoryNotes.map((note) => (
                <div key={note.slug} className="mi-card p-5 hover:border-[var(--mi-orange)] transition-all duration-300">
                  <div className="flex justify-between items-start mb-3">
                    <span className="mi-tag mi-tag-orange">
                      {new Date(note.date).toLocaleDateString('zh-CN')}
                    </span>
                  </div>
                  
                  <Link href={`/notes/${note.slug}`} className="block">
                    <h3 className="text-lg font-medium mb-3 text-gray-900 dark:text-white hover:text-[var(--mi-orange)] dark:hover:text-[var(--mi-orange)] transition-colors">
                      {note.title}
                    </h3>
                  </Link>
                  
                  {note.summary && (
                    <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 line-clamp-3">
                      {note.summary}
                    </p>
                  )}
                  
                  {note.tags && note.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-4">
                      {note.tags.map((tag) => (
                        <Tag key={tag} text={tag} />
                      ))}
                    </div>
                  )}
                  
                  <div className="pt-3 border-t border-gray-100 dark:border-gray-700">
                    <Link 
                      href={`/notes/${note.slug}`} 
                      className="inline-flex items-center text-sm font-medium text-[var(--mi-orange)]"
                    >
                      阅读全文
                      <svg className="ml-1 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
                      </svg>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))
      ) : (
        <div className="mi-card p-12 text-center">
          <p className="text-gray-500 dark:text-gray-400 mb-4">暂无笔记内容</p>
          <Link href="/categories/add-note" className="mi-btn-primary">
            创建第一篇笔记
          </Link>
        </div>
      )}
    </div>
  );
}

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
      <main className="container mx-auto py-8 px-4">
        <div className="relative mb-6">
          <h1 className="text-3xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-600">
            我的学习笔记
          </h1>
          <div className="absolute -inset-1 blur-sm opacity-30 bg-gradient-to-r from-blue-400 to-purple-500 rounded-lg -z-10"></div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4].map((item) => (
            <div key={item} className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-lg shadow-md border border-gray-200 dark:border-gray-700 p-6">
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
      </main>
    );
  }

  return (
    <main className="container mx-auto py-8 px-4">
      <div className="relative mb-6">
        <h1 className="text-3xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-600">
          我的学习笔记
        </h1>
        <div className="absolute -inset-1 blur-sm opacity-30 bg-gradient-to-r from-blue-400 to-purple-500 rounded-lg -z-10"></div>
      </div>
      
      {/* 按分类分组显示笔记 */}
      {Object.keys(groupedNotes).length > 0 ? (
        Object.entries(groupedNotes).map(([category, categoryNotes]) => (
          <div key={category} className="mb-12">
            <h2 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-gray-200">
              {category}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {categoryNotes.map((note) => (
                <div key={note.slug} className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-lg shadow-md border border-gray-200 dark:border-gray-700 p-6 transition-all duration-300 tech-hover">
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex space-x-2">
                      <span className="bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 text-xs px-2 py-1 rounded">
                        {new Date(note.date).toLocaleDateString('zh-CN')}
                      </span>
                    </div>
                    <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></div>
                  </div>
                  
                  <Link href={`/notes/${note.slug}`} className="block">
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                      {note.title}
                    </h2>
                  </Link>
                  
                  {note.summary && (
                    <p className="text-gray-700 dark:text-gray-300 text-sm mb-4 line-clamp-3">
                      {note.summary}
                    </p>
                  )}
                  
                  {note.tags && note.tags.length > 0 && (
                    <div className="mt-auto flex flex-wrap gap-1">
                      {note.tags.map((tag) => (
                        <Tag key={tag} text={tag} />
                      ))}
                    </div>
                  )}
                  
                  <div className="mt-4 pt-3 border-t border-gray-100 dark:border-gray-700">
                    <Link href={`/notes/${note.slug}`} className="inline-flex items-center text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300">
                      阅读更多
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
        <div className="text-center py-12">
          <p className="text-gray-500 dark:text-gray-400">暂无笔记内容</p>
        </div>
      )}
    </main>
  );
}

'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

interface NoteDataForSidebar {
  slug: string;
  title: string;
  category?: string;
}

interface GroupedNotesForSidebar {
  [category: string]: NoteDataForSidebar[];
}

interface SidebarProps {
  groupedNotes: GroupedNotesForSidebar;
}

// Sidebar component now receives data as a prop
const Sidebar: React.FC<SidebarProps> = ({ groupedNotes }) => {
  // 添加状态来存储自定义分类
  const [customCategories, setCustomCategories] = useState<string[]>([]);
  
  // 从本地存储加载自定义分类
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedCategories = localStorage.getItem('custom_categories');
      if (storedCategories) {
        setCustomCategories(JSON.parse(storedCategories));
      }
    }
  }, []);
  
  // 确保默认分类始终存在（即使没有笔记）
  const defaultCategories = ['C++', 'Rust', 'Pytorch', 'CUDA'];
  const allCategories = [...new Set([...Object.keys(groupedNotes), ...defaultCategories, ...customCategories])].sort();
  
  // 将英文分类名转换为中文
  const categoryTranslation: {[key: string]: string} = {
    'Uncategorized': '未分类',
    'General': '常规',
    'C++': 'C++',
    'Rust': 'Rust',
    'Pytorch': 'Pytorch',
    'CUDA': 'CUDA'
  };

  return (
    <nav className="flex flex-col space-y-6">
      {allCategories.map(category => (
        <div key={category}>
          <h3 className="text-sm font-semibold mb-2 text-gray-700 dark:text-gray-300 uppercase tracking-wide">
            {categoryTranslation[category] || category}
          </h3>
          <ul className="flex flex-col space-y-1">
            {/* 显示分类下的笔记，如果没有则显示空列表 */}
            {groupedNotes[category]?.map((note) => (
              <li key={note.slug}>
                <Link
                  href={`/notes/${note.slug}`}
                  className="block text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors text-sm"
                >
                  {note.title}
                </Link>
              </li>
            )) || (
              <li className="text-gray-400 dark:text-gray-500 text-xs italic">
                暂无笔记
              </li>
            )}
            {/* 添加到此分类的链接 */}
            <li>
              <Link
                href={`/categories/add-note?category=${encodeURIComponent(category)}`}
                className="text-blue-500 dark:text-blue-400 text-xs hover:underline mt-1 inline-flex items-center"
              >
                <span className="mr-1">+</span> 添加笔记
              </Link>
            </li>
          </ul>
        </div>
      ))}

      <div className="border-t border-gray-200 dark:border-gray-700 pt-4 mt-2">
        <Link 
          href="/categories/manage" 
          className="text-blue-600 dark:text-blue-400 hover:underline flex items-center text-sm"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          管理分类
        </Link>
      </div>

      {/* Optional: Add other non-note links here if not grouped */}
       <div>
         <h3 className="text-sm font-semibold mb-2 text-gray-700 dark:text-gray-300 uppercase tracking-wide">常规</h3>
         <ul className="flex flex-col space-y-1">
            <li>
                <Link href="/about" className="block text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors text-sm">
                关于我
                </Link>
            </li>
             <li>
                <Link href="/" className="block text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors text-sm">
                首页
                </Link>
            </li>
         </ul>
       </div>

    </nav>
  );
};

export default Sidebar;

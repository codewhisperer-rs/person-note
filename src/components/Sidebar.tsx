'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from './AuthProvider';

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
  // 使用认证上下文
  const { isAuthenticated, checkAuth } = useAuth();
  // 添加状态来跟踪每个分类的展开/收起状态
  const [expandedCategories, setExpandedCategories] = useState<{[key: string]: boolean}>({});
  
  // 从本地存储加载自定义分类
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedCategories = localStorage.getItem('custom_categories');
      if (storedCategories) {
        setCustomCategories(JSON.parse(storedCategories));
      }
      
      // 初始化所有分类为展开状态
      const storedExpandState = localStorage.getItem('expanded_categories');
      if (storedExpandState) {
        setExpandedCategories(JSON.parse(storedExpandState));
      }
    }
    // 检查认证状态
    checkAuth();
  }, [checkAuth]);
  
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
  
  // 切换分类的展开/收起状态
  const toggleCategory = (category: string) => {
    const newState = {
      ...expandedCategories,
      [category]: !expandedCategories[category]
    };
    setExpandedCategories(newState);
    
    // 保存展开状态到本地存储
    if (typeof window !== 'undefined') {
      localStorage.setItem('expanded_categories', JSON.stringify(newState));
    }
  };
  
  // 获取分类是否展开
  const isCategoryExpanded = (category: string) => {
    // 如果没有明确设置，默认为展开
    return expandedCategories[category] !== false;
  };

  return (
    <nav className="flex flex-col space-y-4 tech-corners tech-border p-2 rounded-lg">
      {/* <div className="font-medium text-lg mb-3 text-center flex items-center justify-center">
        <div className="mr-2 w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse"></div>
        <h2>我的笔记分类</h2>
        <div className="ml-2 w-1.5 h-1.5 bg-purple-500 rounded-full animate-pulse" style={{animationDelay: '0.5s'}}></div>
      </div> */}
      {allCategories.map(category => (
        <div key={category} className="border-b border-gray-100/50 dark:border-gray-800/50 pb-3 relative">
          <div className="absolute left-0 bottom-0 w-0 h-0.5 bg-gradient-to-r from-blue-500 to-transparent group-hover:w-full transition-all duration-300"></div>
          <div 
            className="flex justify-between items-center cursor-pointer group mb-2"
            onClick={() => toggleCategory(category)}
          >
            <h3 className="mi-sidebar-item flex items-center py-1.5 px-2 rounded-md w-full bg-gradient-to-r hover:from-blue-50/10 hover:to-transparent">
              <span className="text-blue-500 dark:text-blue-400 mr-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d={isCategoryExpanded(category) 
                      ? "M19 9l-7 7-7-7" 
                      : "M9 5l7 7-7 7"}
                  />
                </svg>
              </span>
              <span className="text-sm font-medium">
                {categoryTranslation[category] || category}
              </span>
            </h3>
          </div>
          
          {isCategoryExpanded(category) && (
            <ul className="space-y-1 pl-7">
              {/* 显示分类下的笔记，如果没有则显示空列表 */}
              {groupedNotes[category]?.map((note) => (
              <li key={note.slug}>
                <Link
                  href={`/notes/${note.slug}`}
                  className="text-gray-600 dark:text-gray-400 hover:text-blue-500 dark:hover:text-blue-400 transition-colors text-sm py-1.5 px-2 rounded-md flex items-center relative group"
                >
                  <span className="w-1.5 h-1.5 bg-blue-400/50 dark:bg-blue-500/50 rounded-full mr-2 group-hover:scale-125 transition-transform"></span>
                  <span className="relative">
                    {note.title}
                    <span className="absolute -bottom-0.5 left-0 w-0 h-px bg-blue-500/50 group-hover:w-full transition-all duration-300"></span>
                  </span>
                </Link>
              </li>
              )) || (
                <li className="text-gray-400 dark:text-gray-500 text-xs italic pl-2 py-1">
                  暂无笔记
                </li>
              )}
              {/* 只对已登录用户显示添加笔记链接 */}
              {isAuthenticated && (
                <li>
                  <Link
                    href={`/categories/add-note?category=${encodeURIComponent(category)}`}
                    className="text-[var(--mi-orange)] text-xs hover:underline mt-1 inline-flex items-center ml-2 py-1"
                  >
                    <span className="mr-1">+</span> 添加笔记
                  </Link>
                </li>
              )}
          </ul>
          )}
        </div>
      ))}

      {/* 只对已登录用户显示管理分类链接 */}
      {isAuthenticated && (
        <div className="border-t border-gray-200 dark:border-gray-700 pt-4 mt-2">
          <Link 
            href="/categories/manage" 
            className="mi-btn-text py-1.5 px-2 text-xs w-full justify-start"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            管理分类
          </Link>
        </div>
      )}

      {/* 常规链接 */}
       <div>
        <div 
          className="flex justify-between items-center cursor-pointer group mb-2"
          onClick={() => toggleCategory('General')}
        >
          <h3 className="mi-sidebar-item flex items-center py-1.5 px-2 rounded-md w-full">
            <span className="text-[var(--mi-orange)] mr-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d={isCategoryExpanded('General') 
                    ? "M19 9l-7 7-7-7" 
                    : "M9 5l7 7-7 7"}
                />
              </svg>
            </span>
            <span className="text-sm font-medium">常规</span>
          </h3>
        </div>
        {isCategoryExpanded('General') && (
          <ul className="space-y-1 pl-7">
            <li>
              <Link 
                href="/about" 
                className="text-gray-600 dark:text-gray-400 hover:text-[var(--mi-orange)] dark:hover:text-[var(--mi-orange)] transition-colors text-sm py-1.5 px-2 rounded-md flex items-center"
              >
                <span className="w-1.5 h-1.5 bg-gray-300 dark:bg-gray-700 rounded-full mr-2"></span>
                关于我
              </Link>
            </li>
            <li>
              <Link 
                href="/" 
                className="text-gray-600 dark:text-gray-400 hover:text-[var(--mi-orange)] dark:hover:text-[var(--mi-orange)] transition-colors text-sm py-1.5 px-2 rounded-md flex items-center"
              >
                <span className="w-1.5 h-1.5 bg-gray-300 dark:bg-gray-700 rounded-full mr-2"></span>
                首页
              </Link>
            </li>
          </ul>
        )}
      </div>
    </nav>
  );
};

export default Sidebar;

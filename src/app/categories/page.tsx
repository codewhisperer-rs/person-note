'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { FumadocsCard, FumadocsCardGrid } from '@/components/FumadocsCard';

export default function CategoriesPage() {
  // 默认分类
  const defaultCategories = ['C++', 'Rust', 'Pytorch', 'CUDA', 'Uncategorized'];
  
  // 状态用于存储所有分类
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  
  // 从本地存储加载自定义分类
  useEffect(() => {
    const storedCategories = localStorage.getItem('custom_categories');
    let customCategories: string[] = [];
    
    if (storedCategories) {
      try {
        customCategories = JSON.parse(storedCategories);
      } catch (error) {
        console.error('Failed to parse custom categories:', error);
      }
    }
    
    // 合并默认分类和自定义分类
    setCategories([...defaultCategories, ...customCategories]);
    setLoading(false);
  }, []);
  
  // 获取每个分类的笔记数量
  const [noteCounts, setNoteCounts] = useState<Record<string, number>>({});
  
  useEffect(() => {
    // 从localStorage获取用户笔记
    const storedNotes = localStorage.getItem('user_notes');
    if (storedNotes) {
      try {
        const notes = JSON.parse(storedNotes);
        const counts: Record<string, number> = {};
        
        // 统计每个分类的笔记数量
        notes.forEach((note: any) => {
          const category = note.category || 'Uncategorized';
          counts[category] = (counts[category] || 0) + 1;
        });
        
        setNoteCounts(counts);
      } catch (error) {
        console.error('解析笔记数据失败:', error);
      }
    }
  }, []);

  if (loading) {
    return (
      <div className="py-8 px-4">
        <h1 className="text-3xl font-bold mb-6 mi-gradient-text">分类浏览</h1>
        <div className="animate-pulse space-y-4">
          <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded w-1/4"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="h-32 bg-gray-200 dark:bg-gray-700 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="py-8 px-4">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold mi-gradient-text">分类浏览</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            按分类查看所有笔记内容
          </p>
        </div>
        
        <Link 
          href="/categories/manage" 
          className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded hover:opacity-90 transition-opacity"
        >
          管理分类
        </Link>
      </div>
      
      <FumadocsCardGrid>
        {categories.map(category => (
          <FumadocsCard 
            key={category}
            title={category} 
            description={`${noteCounts[category] || 0} 篇笔记`} 
            href={`/categories/${category}`}
            icon={<span className="text-xl">📂</span>}
          />
        ))}
      </FumadocsCardGrid>
    </div>
  );
}

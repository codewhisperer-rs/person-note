'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import AdminRoute from '@/components/AdminRoute';

export default function ManageCategories() {
  const router = useRouter();
  const [categories, setCategories] = useState<string[]>([]);
  const [newCategory, setNewCategory] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // 默认分类不允许删除
  const defaultCategories = ['C++', 'Rust', 'Pytorch', 'CUDA', 'Uncategorized'];

  // 从本地存储加载自定义分类
  useEffect(() => {
    const storedCategories = localStorage.getItem('custom_categories');
    if (storedCategories) {
      setCategories(JSON.parse(storedCategories));
    }
  }, []);

  // 保存分类到本地存储
  const saveCategories = (updatedCategories: string[]) => {
    localStorage.setItem('custom_categories', JSON.stringify(updatedCategories));
    setCategories(updatedCategories);
  };

  // 添加新分类
  const handleAddCategory = () => {
    if (!newCategory.trim()) {
      setError('分类名称不能为空');
      return;
    }

    if ([...defaultCategories, ...categories].includes(newCategory)) {
      setError('该分类已存在');
      return;
    }

    const updatedCategories = [...categories, newCategory];
    saveCategories(updatedCategories);
    setNewCategory('');
    setError('');
    setSuccess('分类添加成功！');
    
    setTimeout(() => {
      setSuccess('');
    }, 3000);
  };

  // 删除分类
  const handleDeleteCategory = (category: string) => {
    if (defaultCategories.includes(category)) {
      setError('默认分类不能删除');
      return;
    }

    const updatedCategories = categories.filter(c => c !== category);
    saveCategories(updatedCategories);
    setSuccess('分类删除成功！');
    
    setTimeout(() => {
      setSuccess('');
    }, 3000);
  };

  return (
    <AdminRoute>
      <main className="py-8 px-4 max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div className="relative">
            <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-600">
              管理分类
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

        {/* 添加新分类 */}
        <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-lg shadow-md border border-gray-200 dark:border-gray-700 p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">添加新分类</h2>
          <div className="flex gap-2">
            <input
              type="text"
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
              placeholder="输入分类名称"
              className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
            />
            <button
              onClick={handleAddCategory}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              添加
            </button>
          </div>
          {error && <p className="text-red-500 mt-2">{error}</p>}
          {success && <p className="text-green-500 mt-2">{success}</p>}
        </div>

        {/* 显示所有分类 */}
        <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-lg shadow-md border border-gray-200 dark:border-gray-700 p-6">
          <h2 className="text-xl font-semibold mb-4">所有分类</h2>
          
          <div className="space-y-1">
            <h3 className="font-medium text-gray-700 dark:text-gray-300 mb-2">默认分类</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {defaultCategories.map(category => (
                <div key={category} className="flex items-center justify-between bg-gray-50 dark:bg-gray-900 p-3 rounded-md">
                  <span>{category}</span>
                  <span className="text-xs text-gray-500">(默认)</span>
                </div>
              ))}
            </div>
          </div>

          {categories.length > 0 && (
            <div className="space-y-1 mt-6">
              <h3 className="font-medium text-gray-700 dark:text-gray-300 mb-2">自定义分类</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {categories.map(category => (
                  <div key={category} className="flex items-center justify-between bg-gray-50 dark:bg-gray-900 p-3 rounded-md">
                    <span>{category}</span>
                    <button
                      onClick={() => handleDeleteCategory(category)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>
    </AdminRoute>
  );
} 
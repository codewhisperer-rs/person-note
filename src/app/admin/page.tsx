'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/AuthProvider';

export default function AdminLoginPage() {
  const { isAuthenticated, login } = useAuth();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  
  useEffect(() => {
    // 如果已经登录，重定向到管理页面
    if (isAuthenticated) {
      router.push('/categories/manage');
    }
  }, [isAuthenticated, router]);
  
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    
    const form = e.currentTarget;
    const formData = new FormData(form);
    const username = formData.get('username') as string;
    const password = formData.get('password') as string;
    
    try {
      // 添加延迟以展示加载状态
      await new Promise(resolve => setTimeout(resolve, 800));
      
      const success = await login(username, password);
      if (success) {
        router.push('/categories/manage');
      } else {
        alert('登录失败，请检查用户名和密码');
        setIsLoading(false);
      }
    } catch (error) {
      console.error('登录过程中发生错误:', error);
      alert('登录失败，请稍后再试');
      setIsLoading(false);
    }
  };
  
  return (
    <div className="min-h-[calc(100vh-12rem)] flex items-center justify-center">
      <div className="tech-card tech-corners w-full max-w-md p-8 relative">
        <div className="absolute top-0 right-0 w-16 h-16">
          <div className="absolute top-0 right-0 w-8 h-8 border-r-2 border-t-2 border-blue-400"></div>
        </div>
        <div className="absolute bottom-0 left-0 w-16 h-16">
          <div className="absolute bottom-0 left-0 w-8 h-8 border-l-2 border-b-2 border-blue-400"></div>
        </div>
        
        <h1 className="text-2xl font-bold mb-6 flex items-center">
          <div className="mr-2 w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
          管理员登录
        </h1>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              用户名
            </label>
            <input
              type="text"
              name="username"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm focus:ring-blue-500 focus:border-blue-500 tech-border"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              密码
            </label>
            <input
              type="password"
              name="password"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm focus:ring-blue-500 focus:border-blue-500 tech-border"
              required
            />
          </div>
          
          <div>
            <button
              type="submit"
              disabled={isLoading}
              className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all tech-border relative overflow-hidden ${isLoading ? 'opacity-80 cursor-not-allowed' : ''}`}
            >
              <span className="relative z-10 flex items-center">
                {isLoading && (
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                )}
                {isLoading ? '登录中...' : '登录系统'}
              </span>
              <span className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 opacity-70"></span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

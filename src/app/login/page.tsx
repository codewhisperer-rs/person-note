'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/components/AuthProvider';

export default function Login() {
  const router = useRouter();
  const { isAuthenticated, login, logout } = useAuth();
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  // 检查是否已经登录
  useEffect(() => {
    if (isAuthenticated) {
      router.push('/');
    }
  }, [isAuthenticated, router]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (login(password)) {
      router.push('/');
    } else {
      setError('密码不正确');
    }
  };

  if (isAuthenticated) {
    return (
      <main className="py-8 px-4 max-w-md mx-auto">
        <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-lg shadow-md border border-gray-200 dark:border-gray-700 p-6 text-center">
          <h1 className="text-2xl font-bold mb-4">您已登录</h1>
          <p className="mb-4">您已经成功登录为管理员。</p>
          <button
            onClick={logout}
            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
          >
            退出登录
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="py-8 px-4 max-w-md mx-auto">
      <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-lg shadow-md border border-gray-200 dark:border-gray-700 p-6">
        <div className="relative mb-6">
          <h1 className="text-2xl font-bold text-center text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-600">
            管理员登录
          </h1>
          <div className="absolute -inset-1 blur-sm opacity-30 bg-gradient-to-r from-blue-400 to-purple-500 rounded-lg -z-10"></div>
        </div>
        
        <form onSubmit={handleLogin} className="space-y-4">
          {error && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 p-3 rounded-md">
              {error}
            </div>
          )}
          
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              管理员密码
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              placeholder="请输入密码"
              required
            />
          </div>
          
          <button
            type="submit"
            className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            登录
          </button>
        </form>
        
        <div className="mt-4 text-center">
          <Link
            href="/"
            className="text-blue-600 dark:text-blue-400 hover:underline text-sm"
          >
            返回首页
          </Link>
        </div>
      </div>
    </main>
  );
} 
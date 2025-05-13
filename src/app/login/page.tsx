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
      <main className="py-12 px-4 max-w-md mx-auto mi-fade-in">
        <div className="mi-card p-8 text-center">
          <h1 className="text-2xl font-bold mb-6">您已登录</h1>
          <p className="mb-6 text-gray-600 dark:text-gray-300">您已经成功登录为管理员。</p>
          <button
            onClick={logout}
            className="mi-btn-primary"
          >
            退出登录
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="py-12 px-4 max-w-md mx-auto mi-fade-in">
      <div className="mi-card p-8">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-semibold mi-gradient-text">
            管理员登录
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-2">
            请输入管理员密码以访问完整功能
          </p>
        </div>
        
        <form onSubmit={handleLogin} className="space-y-6">
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
              className="mi-input"
              placeholder="请输入密码"
              required
            />
          </div>
          
          <button
            type="submit"
            className="mi-btn-primary w-full py-2.5"
          >
            登录
          </button>
        </form>
        
        <div className="mt-6 text-center">
          <Link
            href="/"
            className="text-[var(--mi-orange)] hover:underline text-sm"
          >
            返回首页
          </Link>
        </div>
      </div>
    </main>
  );
} 
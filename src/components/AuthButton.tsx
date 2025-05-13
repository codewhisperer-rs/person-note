'use client';

import { useAuth } from './AuthProvider';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

interface AuthButtonProps {
  variant?: 'icon' | 'text';
  className?: string;
}

export default function AuthButton({ variant = 'text', className = '' }: AuthButtonProps) {
  const { isAuthenticated, logout, checkAuth } = useAuth();
  const router = useRouter();
  
  // 将checkAuth移到useEffect中，而不是在渲染期间调用
  useEffect(() => {
    checkAuth();
  }, [checkAuth]);
  
  // 处理登录按钮点击
  const handleLoginClick = () => {
    router.push('/login');
  };
  
  // 处理退出登录按钮点击
  const handleLogoutClick = () => {
    logout();
    router.push('/');
  };
  
  // 图标模式
  if (variant === 'icon') {
    return isAuthenticated ? (
      <button
        onClick={handleLogoutClick}
        className={`p-2 rounded-md text-[var(--mi-orange)] hover:bg-orange-50 dark:hover:bg-gray-800 transition-colors ${className}`}
        title="退出登录"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
        </svg>
      </button>
    ) : (
      <button
        onClick={handleLoginClick}
        className={`p-2 rounded-md text-[var(--mi-orange)] hover:bg-orange-50 dark:hover:bg-gray-800 transition-colors ${className}`}
        title="管理员登录"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
        </svg>
      </button>
    );
  }
  
  // 文本模式（默认）
  return isAuthenticated ? (
    <div className="flex items-center">
      <span className="mi-tag mi-tag-orange text-xs mr-2">已登录</span>
      <button
        onClick={handleLogoutClick}
        className="mi-btn-text py-1 px-2"
      >
        退出
      </button>
    </div>
  ) : (
    <button
      onClick={handleLoginClick}
      className="mi-btn-secondary py-1 px-3 text-sm"
    >
      管理员登录
    </button>
  );
} 
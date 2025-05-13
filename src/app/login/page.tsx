'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/components/AuthProvider';

// 邮箱掩码函数
const maskEmail = (email: string) => {
  const parts = email.split('@');
  if (parts.length !== 2) return email;
  
  const name = parts[0];
  const domain = parts[1];
  
  let maskedName = name;
  if (name.length > 2) {
    maskedName = name.substring(0, 2) + '*'.repeat(name.length - 2);
  }
  
  return `${maskedName}@${domain}`;
};

export default function Login() {
  const router = useRouter();
  const { isAuthenticated, login, logout, resetPassword, getAdminEmail } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [isResetMode, setIsResetMode] = useState(false);

  // 检查是否已经登录
  useEffect(() => {
    if (isAuthenticated) {
      router.push('/');
    }
    
    // 自动填充管理员邮箱
    setEmail(getAdminEmail());
  }, [isAuthenticated, router, getAdminEmail]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (login(email, password)) {
      router.push('/');
    } else {
      setError('邮箱或密码不正确');
    }
  };

  const handleForgotPassword = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setMessage('');

    // 发送重置密码邮件
    if (resetPassword()) {
      setMessage('密码重置邮件已发送，请检查您的邮件客户端');
    } else {
      setError('重置密码失败，请重试');
    }
  };

  const toggleMode = () => {
    setIsResetMode(!isResetMode);
    setError('');
    setMessage('');
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
            {isResetMode ? '重置密码' : '管理员登录'}
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-2">
            {isResetMode ? '点击下方按钮接收密码重置邮件' : '请输入管理员邮箱和密码以访问管理功能'}
          </p>
        </div>
        
        {message && (
          <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 text-green-700 dark:text-green-400 p-3 rounded-md mb-6">
            {message}
          </div>
        )}

        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 p-3 rounded-md mb-6">
            {error}
          </div>
        )}
        
        {isResetMode ? (
          <div className="text-center space-y-6">
            <p className="text-gray-600 dark:text-gray-300">
              点击下方按钮，系统将向管理员邮箱 ({maskEmail(email)}) 发送密码重置信息。
            </p>
            
            <button
              onClick={handleForgotPassword}
              className="mi-btn-primary w-full py-2.5"
            >
              发送重置邮件
            </button>
          </div>
        ) : (
          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                邮箱地址
              </label>
              <input
                type="email"
                id="email"
                value={maskEmail(email)}
                onChange={(e) => setEmail(e.target.value)}
                className="mi-input"
                placeholder="请输入邮箱地址"
                required
                readOnly
              />
              <p className="text-xs text-gray-500 mt-1">管理员邮箱已预设</p>
            </div>
            
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                密码
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
        )}
        
        <div className="mt-6 text-center space-y-3">
          <button 
            onClick={toggleMode} 
            className="text-[var(--mi-orange)] hover:underline text-sm block mx-auto"
          >
            {isResetMode ? '返回登录' : '忘记密码？'}
          </button>
          
          <Link
            href="/"
            className="text-gray-500 hover:underline text-sm block"
          >
            返回首页
          </Link>
        </div>
      </div>
    </main>
  );
} 
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
  const [isLoading, setIsLoading] = useState(false);
  const [isResetting, setIsResetting] = useState(false);

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
    setIsLoading(true);
    
    setTimeout(() => {
      if (login(email, password)) {
        router.push('/');
      } else {
        setError('邮箱或密码不正确');
        setIsLoading(false);
      }
    }, 800); // 添加短暂延迟以显示加载状态
  };

  const handleForgotPassword = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setIsResetting(true);

    // 模拟异步操作
    setTimeout(() => {
      // 发送重置密码邮件
      if (resetPassword()) {
        setMessage('密码重置邮件已发送，请检查您的邮件客户端');
      } else {
        setError('重置密码失败，请重试');
      }
      setIsResetting(false);
    }, 1000);
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
              disabled={isResetting}
              className={`mi-btn-primary w-full py-2.5 relative ${isResetting ? 'opacity-70 cursor-not-allowed' : ''}`}
            >
              {isResetting && (
                <span className="absolute left-1/3 top-1/2 -translate-y-1/2 -translate-x-6 inline-block w-5 h-5">
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                </span>
              )}
              {isResetting ? '处理中...' : '发送重置邮件'}
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
              disabled={isLoading}
              className={`mi-btn-primary w-full py-2.5 relative ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
            >
              {isLoading && (
                <span className="absolute left-1/3 top-1/2 -translate-y-1/2 -translate-x-6 inline-block w-5 h-5">
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                </span>
              )}
              {isLoading ? '登录中...' : '登录'}
            </button>
          </form>
        )}
        
        <div className="mt-6 text-center space-y-3">
          <button 
            onClick={toggleMode} 
            disabled={isLoading || isResetting}
            className={`text-[var(--mi-orange)] hover:underline text-sm block mx-auto ${(isLoading || isResetting) ? 'opacity-50 cursor-not-allowed' : ''}`}
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
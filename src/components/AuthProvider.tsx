'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// 认证上下文接口
interface AuthContextType {
  isAuthenticated: boolean;
  login: (email: string, password: string) => boolean;
  logout: () => void;
  checkAuth: () => boolean;
  resetPassword: () => boolean;
  getAdminEmail: () => string;
}

// 创建认证上下文
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// 认证提供器属性接口
interface AuthProviderProps {
  children: ReactNode;
}

// 硬编码的管理员信息 - 在此处设置您的邮箱
const ADMIN_EMAIL = "admin@example.com"; // 修改为您的邮箱
const ADMIN_PASSWORD = "admin123";

// 认证会话有效期（24小时）
const AUTH_EXPIRY_PERIOD = 24 * 60 * 60 * 1000; // 24小时（毫秒）

// 认证提供器组件
export function AuthProvider({ children }: AuthProviderProps) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // 在组件挂载时检查认证状态
  useEffect(() => {
    checkAuth();
  }, []);

  // 获取管理员邮箱
  const getAdminEmail = (): string => {
    return ADMIN_EMAIL;
  };

  // 验证密码并登录
  const login = (email: string, password: string): boolean => {
    // 验证邮箱和密码
    if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
      localStorage.setItem('isAuthenticated', 'true');
      localStorage.setItem('authTimestamp', Date.now().toString());
      setIsAuthenticated(true);
      return true;
    }
    return false;
  };

  // 重置密码 - 使用mailto链接
  const resetPassword = (): boolean => {
    // 创建mailto链接，用户点击后会打开邮件客户端
    const subject = encodeURIComponent('重置您的笔记系统密码');
    const body = encodeURIComponent(`您的密码是: ${ADMIN_PASSWORD}\n\n请妥善保管。`);
    const mailtoLink = `mailto:${ADMIN_EMAIL}?subject=${subject}&body=${body}`;
    
    // 打开默认邮件客户端
    window.location.href = mailtoLink;
    return true;
  };

  // 退出登录
  const logout = () => {
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('authTimestamp');
    setIsAuthenticated(false);
  };

  // 检查用户是否已认证，以及认证是否过期
  const checkAuth = (): boolean => {
    if (typeof window === 'undefined') return false;
    
    const authStatus = localStorage.getItem('isAuthenticated');
    const authTimestamp = localStorage.getItem('authTimestamp');
    
    if (authStatus !== 'true' || !authTimestamp) {
      setIsAuthenticated(false);
      return false;
    }
    
    // 检查认证是否过期
    const now = Date.now();
    const authTime = parseInt(authTimestamp, 10);
    
    if (now - authTime > AUTH_EXPIRY_PERIOD) {
      // 认证已过期，执行退出操作
      logout();
      return false;
    }
    
    // 刷新认证时间戳
    localStorage.setItem('authTimestamp', now.toString());
    setIsAuthenticated(true);
    return true;
  };

  // 提供认证上下文
  const value = {
    isAuthenticated,
    login,
    logout,
    checkAuth,
    resetPassword,
    getAdminEmail
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

// 自定义钩子，用于访问认证上下文
export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth 必须在 AuthProvider 内部使用');
  }
  return context;
} 
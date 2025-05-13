'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// 认证上下文接口
interface AuthContextType {
  isAuthenticated: boolean;
  login: (password: string) => boolean;
  logout: () => void;
  checkAuth: () => boolean;
}

// 创建认证上下文
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// 认证提供器属性接口
interface AuthProviderProps {
  children: ReactNode;
}

// 认证会话有效期（24小时）
const AUTH_EXPIRY_PERIOD = 24 * 60 * 60 * 1000; // 24小时（毫秒）

// 认证提供器组件
export function AuthProvider({ children }: AuthProviderProps) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // 在组件挂载时检查认证状态
  useEffect(() => {
    checkAuth();
  }, []);

  // 验证密码并登录
  const login = (password: string): boolean => {
    // 简单的密码验证 - 在生产环境中应使用更安全的方法
    if (password === 'admin123') {
      localStorage.setItem('isAuthenticated', 'true');
      localStorage.setItem('authTimestamp', Date.now().toString());
      setIsAuthenticated(true);
      return true;
    }
    return false;
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
    checkAuth
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
'use client';

import { ReactNode, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from './AuthProvider';

interface AdminRouteProps {
  children: ReactNode;
}

export default function AdminRoute({ children }: AdminRouteProps) {
  const { isAuthenticated, checkAuth } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // 验证用户是否已认证
    const isAuth = checkAuth();
    
    if (!isAuth) {
      // 如果未认证，重定向到登录页面
      router.push('/login');
    }
  }, [checkAuth, router]);

  // 如果未认证，不渲染任何内容（避免闪烁）
  if (!isAuthenticated) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // 已认证，渲染子组件
  return <>{children}</>;
} 
import React from 'react';
import Link from 'next/link';

interface FumadocsCardProps {
  title: string;
  description?: string;
  href: string;
  icon?: React.ReactNode;
  className?: string;
}

// 这是一个模仿 Fumadocs UI 卡片样式的组件
export function FumadocsCard({ title, description, href, icon, className = '' }: FumadocsCardProps) {
  return (
    <Link
      href={href}
      className={`group relative overflow-hidden rounded-lg border border-gray-200/50 bg-white/90 backdrop-blur-sm p-5 transition-all hover:border-blue-300 hover:shadow-lg dark:border-gray-800/50 dark:bg-gray-900/80 dark:hover:border-blue-700/70 tech-corners ${className}`}
    >
      <div className="flex items-start gap-3 relative z-10">
        {icon && (
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md border border-gray-200/70 bg-gray-50/80 text-gray-500 dark:border-gray-800/70 dark:bg-gray-800/80 dark:text-gray-400">
            {icon}
          </div>
        )}
        <div className="space-y-1.5">
          <h3 className="font-medium text-gray-950 dark:text-white">{title}</h3>
          {description && <p className="text-sm text-gray-500 dark:text-gray-400">{description}</p>}
        </div>
      </div>
      
      {/* 右上角科技感装饰 */}
      <div className="absolute top-0 right-0 w-6 h-6 opacity-60">
        <div className="absolute top-0 right-0 w-3 h-3 border-r border-t border-blue-400/70"></div>
      </div>
      
      {/* 左下角科技感装饰 */}
      <div className="absolute bottom-0 left-0 w-6 h-6 opacity-60">
        <div className="absolute bottom-0 left-0 w-3 h-3 border-l border-b border-blue-400/70"></div>
      </div>
      
      {/* 悬停效果条 */}
      <div className="absolute bottom-0 left-0 h-1 w-full scale-x-0 transform bg-gradient-to-r from-blue-500 to-purple-500 transition-transform duration-300 group-hover:scale-x-100" />
    </Link>
  );
}

// 卡片网格容器
export function FumadocsCardGrid({ children, className = '' }: { children: React.ReactNode, className?: string }) {
  return (
    <div className={`grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 ${className}`}>
      {children}
    </div>
  );
}

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
      className={`group relative overflow-hidden rounded-lg border border-gray-200 bg-white p-5 transition-all hover:border-gray-300 hover:shadow-lg dark:border-gray-800 dark:bg-gray-950 dark:hover:border-gray-700 ${className}`}
    >
      <div className="flex items-start gap-3">
        {icon && (
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md border border-gray-200 bg-gray-50 text-gray-500 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-400">
            {icon}
          </div>
        )}
        <div className="space-y-1.5">
          <h3 className="font-medium text-gray-950 dark:text-white">{title}</h3>
          {description && <p className="text-sm text-gray-500 dark:text-gray-400">{description}</p>}
        </div>
      </div>
      <div className="absolute bottom-0 left-0 h-1 w-full scale-x-0 transform bg-gradient-to-r from-[var(--mi-orange)] to-orange-500 transition-transform duration-300 group-hover:scale-x-100" />
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

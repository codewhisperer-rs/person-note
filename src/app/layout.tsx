import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Link from 'next/link';
import LayoutWithSidebar from '@/components/LayoutWithSidebar'; // Import the new component
import { AuthProvider } from '@/components/AuthProvider'; // 导入认证提供器
import AuthButton from '@/components/AuthButton'; // 导入认证按钮组件
import { TechGridBackground, ParticlesBackground, TechAnchors } from '@/components/TechElements';
import { CodeBackground, CodeHighlightEffect } from '@/components/CodeBackground';
import { CornerDecorators } from '@/components/CornerDecorators';

// 定义笔记相关类型
interface NoteDataForSidebar {
  slug: string;
  title: string;
  category?: string;
}

interface GroupedNotesForSidebar {
  [category: string]: NoteDataForSidebar[];
}

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "我的个人笔记 | 小米风格",
  description: "一个带有小米设计风格的个人笔记与知识管理系统",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen flex flex-col relative`}
      >
        {/* 添加科技感背景元素 */}
        <TechGridBackground />
        <ParticlesBackground />
        <TechAnchors />
        <CodeBackground />
        <CodeHighlightEffect />
        <CornerDecorators />
        
        <AuthProvider>
          <header className="mi-header backdrop-blur-md bg-white/70 dark:bg-gray-800/70 border-b border-gray-200/50 dark:border-gray-700/50 sticky top-0 z-50 tech-border">
            <div className="mi-container h-16 flex items-center justify-between">
              <Link href="/" className="flex items-center group">
                <span className="text-xl relative overflow-hidden bg-clip-text text-transparent bg-gradient-to-r from-blue-500 via-purple-500 to-green-500">
                  我的笔记
                  <span className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-blue-500 to-purple-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></span>
                </span>
              </Link>
              <nav className="flex items-center space-x-1">
                <Link href="/" className="mi-nav-link tech-hover relative overflow-hidden px-4 py-2">
                  <span className="relative z-10">首页</span>
                  <span className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-500 transform scale-x-0 hover:scale-x-100 transition-transform duration-300"></span>
                </Link>
                <Link href="/about" className="mi-nav-link tech-hover relative overflow-hidden px-4 py-2">
                  <span className="relative z-10">关于我</span>
                  <span className="absolute bottom-0 left-0 w-full h-0.5 bg-purple-500 transform scale-x-0 hover:scale-x-100 transition-transform duration-300"></span>
                </Link>
                <Link href="/notes" className="mi-nav-link tech-hover relative overflow-hidden px-4 py-2">
                  <span className="relative z-10">学习笔记</span>
                  <span className="absolute bottom-0 left-0 w-full h-0.5 bg-green-500 transform scale-x-0 hover:scale-x-100 transition-transform duration-300"></span>
                </Link>
                <Link href="/categories" className="mi-nav-link tech-hover relative overflow-hidden px-4 py-2">
                  <span className="relative z-10">分类</span>
                  <span className="absolute bottom-0 left-0 w-full h-0.5 bg-cyan-500 transform scale-x-0 hover:scale-x-100 transition-transform duration-300"></span>
                </Link>
                {/* 管理员入口已移至 /admin 路由 */}
              </nav>
            </div>
          </header>

          {/* 使用ClientLayoutWithSidebar组件，让其自行处理客户端数据获取 */}
          <LayoutWithSidebar>{children}</LayoutWithSidebar>

          <footer className="mi-footer py-6 text-center mt-auto backdrop-blur-md bg-white/70 dark:bg-gray-800/70 border-t border-gray-200/50 dark:border-gray-700/50">
            <div className="mi-container">
              <div className="flex flex-col items-center justify-center">
                <div className="flex items-center space-x-2 mb-3">
                  <span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></span>
                  <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" style={{animationDelay: '0.5s'}}></span>
                  <span className="w-2 h-2 bg-purple-500 rounded-full animate-pulse" style={{animationDelay: '1s'}}></span>
                </div>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  © {new Date().getFullYear()} 我的个人笔记 · <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-500 via-purple-500 to-green-500">保留所有权利</span>
                </p>
              </div>
            </div>
          </footer>
        </AuthProvider>
      </body>
    </html>
  );
}

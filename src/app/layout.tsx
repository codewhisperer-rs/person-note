import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Link from 'next/link';
import LayoutWithSidebar from '@/components/LayoutWithSidebar'; // Import the new component
import { AuthProvider } from '@/components/AuthProvider'; // 导入认证提供器
import AuthButton from '@/components/AuthButton'; // 导入认证按钮组件

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
        <AuthProvider>
          <header className="mi-header">
            <div className="mi-container h-16 flex items-center justify-between">
              <Link href="/" className="flex items-center">
                <span className="mi-gradient-text text-xl">我的笔记</span>
              </Link>
              <nav className="flex items-center space-x-1">
                <Link href="/" className="mi-nav-link">首页</Link>
                <Link href="/about" className="mi-nav-link">关于我</Link>
                <Link href="/notes" className="mi-nav-link">学习笔记</Link>
                <AuthButton />
              </nav>
            </div>
          </header>

          {/* 使用ClientLayoutWithSidebar组件，让其自行处理客户端数据获取 */}
          <LayoutWithSidebar>{children}</LayoutWithSidebar>

          <footer className="mi-footer py-4 text-center mt-auto">
            <div className="mi-container">
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                © {new Date().getFullYear()} 我的个人笔记 · 保留所有权利
              </p>
            </div>
          </footer>
        </AuthProvider>
      </body>
    </html>
  );
}

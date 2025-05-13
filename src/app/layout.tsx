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
  title: "我的个人网站", // Updated title
  description: "一个包含学习笔记的个人网站", // Updated description
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen flex flex-col`}
      >
        <AuthProvider>
          <nav className="bg-gray-100 dark:bg-gray-800 p-4 shadow-md">
            <div className="container mx-auto flex justify-between">
              <Link href="/" className="text-xl font-bold text-gray-900 dark:text-white">
                我的网站
              </Link>
              <div className="flex items-center">
                <Link href="/" className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 mr-4">
                  首页
                </Link>
                <Link href="/about" className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 mr-4">
                  关于我
                </Link>
                <Link href="/notes" className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 mr-4">
                  学习笔记
                </Link>
                <AuthButton />
              </div>
            </div>
          </nav>

          {/* 使用ClientLayoutWithSidebar组件，让其自行处理客户端数据获取 */}
          <LayoutWithSidebar>{children}</LayoutWithSidebar>

          <footer className="bg-gray-100 dark:bg-gray-800 mt-8 py-4 text-center text-gray-600 dark:text-gray-300 text-sm">
            © {new Date().getFullYear()} 我的个人网站. 保留所有权利.
          </footer>
        </AuthProvider>
      </body>
    </html>
  );
}

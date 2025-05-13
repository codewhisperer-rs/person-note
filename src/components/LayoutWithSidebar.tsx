'use client';

import { useState, useEffect } from 'react';
import Sidebar from '@/components/Sidebar';

interface NoteDataForSidebar {
  slug: string;
  title: string;
  category?: string;
}

interface GroupedNotesForSidebar {
  [category: string]: NoteDataForSidebar[];
}

interface LayoutWithSidebarProps {
  children: React.ReactNode;
}

// 从localStorage获取笔记数据并整理成侧边栏所需格式
const getNotesForSidebar = (): GroupedNotesForSidebar => {
  if (typeof window === 'undefined') {
    return {};
  }
  
  const storedNotes = localStorage.getItem('user_notes');
  if (!storedNotes) {
    return {};
  }
  
  try {
    const notes = JSON.parse(storedNotes);
    const groupedNotes: GroupedNotesForSidebar = {};
    
    notes.forEach((note: any) => {
      const category = note.category || 'Uncategorized';
      if (!groupedNotes[category]) {
        groupedNotes[category] = [];
      }
      
      groupedNotes[category].push({
        slug: note.slug,
        title: note.title,
        category: note.category
      });
    });
    
    return groupedNotes;
  } catch (err) {
    console.error('解析笔记数据失败:', err);
    return {};
  }
};

const LayoutWithSidebar: React.FC<LayoutWithSidebarProps> = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [notesData, setNotesData] = useState<GroupedNotesForSidebar>({});

  useEffect(() => {
    // 获取笔记数据
    const data = getNotesForSidebar();
    setNotesData(data);
    
    // 监听localStorage变化，更新笔记数据
    const handleStorageChange = () => {
      const updatedData = getNotesForSidebar();
      setNotesData(updatedData);
    };
    
    window.addEventListener('storage', handleStorageChange);
    
    // 自定义事件，用于触发笔记数据刷新
    const handleNoteChange = () => {
      const updatedData = getNotesForSidebar();
      setNotesData(updatedData);
    };
    
    window.addEventListener('noteDataChanged', handleNoteChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('noteDataChanged', handleNoteChange);
    };
  }, []);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="flex flex-grow">
      {/* Mobile Sidebar Toggle Button */}
      <button
        className="md:hidden fixed bottom-4 right-4 z-50 p-3 bg-[var(--mi-orange)] text-white rounded-full shadow-lg transition-transform hover:scale-105 active:scale-95"
        onClick={toggleSidebar}
        aria-label="切换侧边栏"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
        </svg>
      </button>

      {/* Sidebar (Mobile overlay and Desktop static) */}
      <aside
        className={`fixed inset-y-0 left-0 w-64 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 shadow-sm z-40 transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:relative md:translate-x-0 md:block transition-transform ease-in-out duration-300`}
      >
        <div className="flex flex-col h-full">
          <div className="p-4 border-b border-gray-200 dark:border-gray-800">
            <div className="text-[var(--mi-orange)] font-medium">我的笔记分类</div>
          </div>
          <div className="flex-1 overflow-y-auto p-4">
            <Sidebar groupedNotes={notesData} />
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-grow p-4 md:p-6 mi-container">
        <div className="mi-fade-in">
          {children}
        </div>
      </main>

      {/* Overlay when sidebar is open on mobile */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-30 md:hidden"
          onClick={toggleSidebar}
          aria-hidden="true"
        ></div>
      )}
    </div>
  );
};

export default LayoutWithSidebar;

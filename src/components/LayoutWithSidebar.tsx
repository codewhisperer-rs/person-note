'use client';

import { useState } from 'react';
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
  notesData: GroupedNotesForSidebar; // Accept notesData as prop
}

const LayoutWithSidebar: React.FC<LayoutWithSidebarProps> = ({ children, notesData }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="flex flex-grow">
      {/* Mobile Sidebar Toggle Button */}
      <button
        className="md:hidden fixed bottom-4 right-4 z-50 p-3 bg-blue-600 text-white rounded-full shadow-lg"
        onClick={toggleSidebar}
        aria-label="切换侧边栏"
      >
        {/* You can use an icon here, e.g., a hamburger icon */}
        菜单
      </button>

      {/* Sidebar (Mobile overlay and Desktop static) */}
      <aside
        className={`fixed inset-y-0 left-0 w-64 bg-gray-50 dark:bg-gray-900 p-4 border-r border-gray-200 dark:border-gray-700 z-40 transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:relative md:translate-x-0 md:block transition-transform ease-in-out duration-300`}
      >
        <Sidebar groupedNotes={notesData} /> {/* Pass notesData to Sidebar */}
      </aside>

      {/* Main Content Area */}
      <main className="flex-grow p-4">
        {children}
      </main>

      {/* Overlay when sidebar is open on mobile */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black opacity-50 z-30 md:hidden"
          onClick={toggleSidebar}
          aria-hidden="true"
        ></div>
      )}
    </div>
  );
};

export default LayoutWithSidebar;

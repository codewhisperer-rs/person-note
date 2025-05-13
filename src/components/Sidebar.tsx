import React from 'react';
import Link from 'next/link';

interface NoteDataForSidebar {
  slug: string;
  title: string;
  category?: string;
}

interface GroupedNotesForSidebar {
  [category: string]: NoteDataForSidebar[];
}

interface SidebarProps {
  groupedNotes: GroupedNotesForSidebar;
}

// Sidebar component now receives data as a prop
const Sidebar: React.FC<SidebarProps> = ({ groupedNotes }) => {
  const sortedCategories = Object.keys(groupedNotes).sort(); // Sort categories alphabetically
  
  // 将英文分类名转换为中文
  const categoryTranslation: {[key: string]: string} = {
    'Uncategorized': '未分类',
    'General': '常规'
  };

  return (
    <nav className="flex flex-col space-y-6">
      {sortedCategories.map(category => (
        <div key={category}>
          <h3 className="text-sm font-semibold mb-2 text-gray-700 dark:text-gray-300 uppercase tracking-wide">
            {categoryTranslation[category] || category}
          </h3>
          <ul className="flex flex-col space-y-1">
            {groupedNotes[category].map((note) => (
              <li key={note.slug}>
                <Link
                  href={`/notes/${note.slug}`}
                  className="block text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors text-sm"
                >
                  {note.title}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      ))}

      {/* Optional: Add other non-note links here if not grouped */}
       <div>
         <h3 className="text-sm font-semibold mb-2 text-gray-700 dark:text-gray-300 uppercase tracking-wide">常规</h3>
         <ul className="flex flex-col space-y-1">
            <li>
                <Link href="/about" className="block text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors text-sm">
                关于我
                </Link>
            </li>
             <li>
                <Link href="/" className="block text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors text-sm">
                首页
                </Link>
            </li>
         </ul>
       </div>

    </nav>
  );
};

export default Sidebar;

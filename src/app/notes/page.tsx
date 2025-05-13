import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import Link from 'next/link';
import Tag from '@/components/Tag'; // Import the Tag component

// Define the directory where your notes are stored
const notesDirectory = path.join(process.cwd(), 'content/notes');

// Function to get data for all notes
function getSortedNotesData() {
  // Get file names under /content/notes
  const fileNames = fs.readdirSync(notesDirectory);

  const allNotesData = fileNames.map((fileName) => {
    // Remove ".mdx" from file name to get id (slug)
    const slug = fileName.replace(/\.mdx$/, '');

    // Read markdown file as string
    const fullPath = path.join(notesDirectory, fileName);
    const fileContents = fs.readFileSync(fullPath, 'utf8');

    // Use gray-matter to parse the post metadata section
    const { data } = matter(fileContents);

    // Combine the data with the slug
    return {
      slug,
      ...(data as { date: string; title: string; summary?: string; tags?: string[] }), // Add tags to the type definition
    };
  });

  // Sort notes by date (latest first)
  return allNotesData.sort((a, b) => {
    if (new Date(a.date) < new Date(b.date)) {
      return 1;
    } else {
      return -1;
    }
  });
}

export default function NotesList() {
  const allNotes = getSortedNotesData();

  return (
    <main className="container mx-auto py-8 px-4">
      <div className="relative mb-6">
        <h1 className="text-3xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-600">
          我的学习笔记
        </h1>
        <div className="absolute -inset-1 blur-sm opacity-30 bg-gradient-to-r from-blue-400 to-purple-500 rounded-lg -z-10"></div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {allNotes.map(({ slug, title, date, summary, tags }) => (
          <div key={slug} className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-lg shadow-md border border-gray-200 dark:border-gray-700 p-6 transition-all duration-300 tech-hover">
            <div className="flex justify-between items-start mb-3">
              <span className="bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 text-xs px-2 py-1 rounded">
                {new Date(date).toLocaleDateString('zh-CN')}
              </span>
              <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></div>
            </div>
            
            <Link href={`/notes/${slug}`} className="block">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                {title}
              </h2>
            </Link>
            
            {summary && (
              <p className="text-gray-700 dark:text-gray-300 text-sm mb-4 line-clamp-3">
                {summary}
              </p>
            )}
            
            {tags && tags.length > 0 && (
              <div className="mt-auto flex flex-wrap gap-1">
                {tags.map((tag) => (
                  <Tag key={tag} text={tag} />
                ))}
              </div>
            )}
            
            <div className="mt-4 pt-3 border-t border-gray-100 dark:border-gray-700">
              <Link href={`/notes/${slug}`} className="inline-flex items-center text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300">
                阅读更多
                <svg className="ml-1 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
                </svg>
              </Link>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}

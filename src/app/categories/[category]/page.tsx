import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import Link from 'next/link';
import Tag from '@/components/Tag';
import { FumadocsCard, FumadocsCardGrid } from '@/components/FumadocsCard';

const notesDirectory = path.join(process.cwd(), 'content/notes');

interface NoteData {
  slug: string;
  title: string;
  date: string;
  summary?: string;
  tags?: string[];
  category?: string; // Include category
}

function getAllNotesData(): NoteData[] {
  const fileNames = fs.readdirSync(notesDirectory);
  const allNotesData = fileNames.map((fileName) => {
    const slug = fileName.replace(/\.mdx$/, '');
    const fullPath = path.join(notesDirectory, fileName);
    const fileContents = fs.readFileSync(fullPath, 'utf8');
    const { data } = matter(fileContents);

    return {
      slug,
      ...(data as { date: string; title: string; summary?: string; tags?: string[]; category?: string }),
    };
  });
  return allNotesData;
}

// Generate possible category pages for static site generation
export async function generateStaticParams() {
  const allNotes = getAllNotesData();
  const categories = new Set<string>();
  allNotes.forEach(note => {
    if (note.category) {
        categories.add(note.category);
    }
  });
  return Array.from(categories).map(category => ({
    category: category,
  }));
}

// Generate metadata for category pages
export async function generateMetadata({ params }: { params: { category: string } }) {
    const categoryName = params.category;
    return {
      title: `分类: "${categoryName}"的笔记`, // Dynamic title
    };
  }

export default function CategoryPage({ params }: { params: { category: string } }) {
  const categoryName = params.category;
  const allNotes = getAllNotesData();

  // Filter notes by category
  const filteredNotes = allNotes.filter(note => note.category === categoryName);

  // Sort filtered notes by date (latest first)
  filteredNotes.sort((a, b) => {
    if (new Date(a.date) < new Date(b.date)) {
      return 1;
    } else {
      return -1;
    }
  });

  return (
    <main className="container mx-auto py-8 px-4">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold mi-gradient-text">分类: "{categoryName}"</h1>
        <Link 
          href="/categories" 
          className="px-4 py-2 bg-gray-100 dark:bg-gray-800 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
        >
          返回所有分类
        </Link>
      </div>
      <FumadocsCardGrid>
        {filteredNotes.map(({ slug, title, date, summary, tags }) => (
          <div key={slug} className="group relative overflow-hidden rounded-lg border border-gray-200 bg-white p-5 transition-all hover:border-gray-300 hover:shadow-lg dark:border-gray-800 dark:bg-gray-950 dark:hover:border-gray-700">
            <div className="mb-3">
              <span className="inline-block px-2 py-1 text-xs font-medium rounded-full bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300">
                {new Date(date).toLocaleDateString()}
              </span>
            </div>
            
            <Link href={`/notes/${slug}`} className="block">
              <h2 className="text-lg font-medium mb-3 text-gray-950 dark:text-white group-hover:text-[var(--mi-orange)] dark:group-hover:text-[var(--mi-orange)] transition-colors">
                {title}
              </h2>
            </Link>
            
            {summary && (
              <p className="text-gray-500 dark:text-gray-400 text-sm mb-4 line-clamp-3">
                {summary}
              </p>
            )}
            
            {tags && tags.length > 0 && (
              <div className="flex flex-wrap gap-1 mb-4">
                {tags.map((tag) => (
                  <Tag key={tag} text={tag} />
                ))}
              </div>
            )}
            
            <div className="pt-3 border-t border-gray-100 dark:border-gray-800">
              <Link 
                href={`/notes/${slug}`} 
                className="inline-flex items-center text-sm font-medium text-[var(--mi-orange)]"
              >
                阅读全文
                <svg className="ml-1 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
                </svg>
              </Link>
            </div>
            
            <div className="absolute bottom-0 left-0 h-1 w-full scale-x-0 transform bg-gradient-to-r from-[var(--mi-orange)] to-orange-500 transition-transform duration-300 group-hover:scale-x-100" />
          </div>
        ))}
      </FumadocsCardGrid>
      {filteredNotes.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-600 dark:text-gray-400 mb-4">该分类下暂无笔记</p>
          <Link href="/categories/add-note" className="mi-btn-primary">
            创建笔记
          </Link>
        </div>
       )}
    </main>
  );
}

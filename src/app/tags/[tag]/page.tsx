import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import Link from 'next/link';
import Tag from '@/components/Tag';

const notesDirectory = path.join(process.cwd(), 'content/notes');

interface NoteData {
  slug: string;
  title: string;
  date: string;
  summary?: string;
  tags?: string[];
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
      ...(data as { date: string; title: string; summary?: string; tags?: string[] }),
    };
  });
  return allNotesData;
}

// Generate possible tag pages for static site generation
export async function generateStaticParams() {
  const allNotes = getAllNotesData();
  const tags = new Set<string>();
  allNotes.forEach(note => {
    note.tags?.forEach(tag => tags.add(tag));
  });
  return Array.from(tags).map(tag => ({
    tag: tag,
  }));
}

// Generate metadata for tag pages
export async function generateMetadata({ params }: { params: { tag: string } }) {
    const tagName = params.tag;
    return {
      title: `Notes tagged with "${tagName}"`, // Dynamic title
    };
  }

export default function TagPage({ params }: { params: { tag: string } }) {
  const tagName = params.tag;
  const allNotes = getAllNotesData();

  // Filter notes by tag
  const filteredNotes = allNotes.filter(note => note.tags?.includes(tagName));

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
      <h1 className="text-3xl font-bold mb-6">Notes Tagged with "{tagName}"</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredNotes.map(({ slug, title, date, summary, tags }) => (
          <div key={slug} className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 transition-transform transform hover:scale-105 hover:shadow-md">
            <Link href={`/notes/${slug}`} className="block">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2 hover:underline">
                {title}
              </h2>
            </Link>
            <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
              {new Date(date).toLocaleDateString()}
            </p>
            {summary && (
              <p className="text-gray-700 dark:text-gray-300 text-sm mb-4">
                {summary}
              </p>
            )}
            {tags && tags.length > 0 && (
              <div className="mt-auto flex flex-wrap">
                {tags.map((tag) => (
                  <Tag key={tag} text={tag} />
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
       {filteredNotes.length === 0 && (
          <p className="text-center text-gray-600 dark:text-gray-400">No notes found with this tag.</p>
       )}
    </main>
  );
}

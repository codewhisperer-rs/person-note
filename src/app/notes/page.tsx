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
      <h1 className="text-3xl font-bold mb-6">My Study Notes</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {allNotes.map(({ slug, title, date, summary, tags }) => (
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
    </main>
  );
}

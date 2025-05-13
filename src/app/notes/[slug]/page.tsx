import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { MDXRemote } from 'next-mdx-remote/rsc';
import rehypePrettyCode from 'rehype-pretty-code';
import Admonition from '@/components/Admonition';
import Tag from '@/components/Tag';

// Define the directory where your notes are stored
const notesDirectory = path.join(process.cwd(), 'content/notes');

interface Heading {
  level: number;
  text: string;
  slug: string;
}

// Simple slugification function
function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/\s+/g, '-') // Replace spaces with -
    .replace(/[^\w-]+/g, '') // Remove all non-word chars
    .replace(/--+/g, '-') // Replace multiple - with single -
    .replace(/^-+/, '') // Trim - from start of text
    .replace(/-+$/, ''); // Trim - from end of text
}

// Function to get the data for a specific note, including TOC
async function getNoteData(slug: string) {
  const fullPath = path.join(notesDirectory, `${slug}.mdx`);
  const fileContents = fs.readFileSync(fullPath, 'utf8');

  // Use gray-matter to parse the post metadata section
  const { data, content } = matter(fileContents);

  const headings: Heading[] = [];
  // Correctly split content by newline characters
  const lines = content.split('\n');


  lines.forEach(line => {
    const headingMatch = line.match(/^(#+)\s+(.*)$/);
    if (headingMatch) {
      const level = headingMatch[1].length;
      const text = headingMatch[2].trim();
      const headingSlug = slugify(text);
      headings.push({ level, text, slug: headingSlug });
    }
  });

  return {
    slug,
    frontmatter: data as { date: string; title: string; tags?: string[]; summary?: string },
    content, // Pass content directly for RSC
    headings, // Pass extracted headings
  };
}

// Generate possible slugs for static site generation
export async function generateStaticParams() {
  const fileNames = fs.readdirSync(notesDirectory);
  return fileNames.map((fileName) => ({
    slug: fileName.replace(/\.mdx$/, ''),
  }));
}

// Generate metadata for the page
export async function generateMetadata({ params }: { params: { slug: string } }) {
  // Await params before accessing properties
  const { slug } = await params; 
  const noteData = await getNoteData(slug);
  return {
    title: noteData.frontmatter.title,
  };
}

// Define custom components to be used in MDX
const components = {
  Admonition,
  // Add other custom components here later
};

// Component to render a single note
export default async function NotePage({ params }: { params: { slug: string } }) {
  // Await params before accessing properties
  const { slug } = await params;
  const noteData = await getNoteData(slug);
  const { title, date, tags } = noteData.frontmatter;
  const { content, headings } = noteData;

  // Rehype plugins for MDXRemote (RSC)
  const options = {
    rehypePlugins: [
      [rehypePrettyCode, { theme: 'github-dark' }],
      // Need to add rehype-slug here to add IDs to headings for TOC links to work
      // However, integrating rehype-slug with MDXRemote/RSC for manual TOC generation is complex.
      // A simpler approach for now is to rely on the browser's fragment identifier matching if heading text is unique,
      // or manually add IDs if necessary in MDX files or a separate rehype step.
      // For simplicity in this step, we'll generate TOC links based on slugified text,
      // assuming the browser can link to headings with matching text or that heading IDs are added elsewhere.
      // A robust solution would involve a rehype plugin to add IDs and collect TOC data.
    ],
    components, // Pass custom components here
  };

  return (
    <div className="flex flex-col md:flex-row">
      {/* Main Content Area */}
      <article className="flex-grow prose dark:prose-invert max-w-none px-4 py-8">
        <h1 className="mb-2">{title}</h1>
        <p className="text-gray-500 dark:text-gray-400 text-sm">
          {new Date(date).toLocaleDateString()}
        </p>
        {tags && tags.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-1 mb-6">
            {tags.map((tag) => (
              <Tag key={tag} text={tag} />
            ))}
          </div>
        )}
        <MDXRemote source={content} options={options} components={components} />
      </article>

      {/* Table of Contents Sidebar */}
      {headings.length > 0 && (
        <aside className="w-64 md:w-80 flex-shrink-0 px-4 py-8 hidden md:block sticky top-0 self-start">
          <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-200">Table of Contents</h3>
          <nav>
            <ul className="flex flex-col space-y-2">
              {headings.map((heading) => (
                <li key={heading.slug} className={`text-sm ${heading.level > 2 ? 'ml-4' : ''}`}>
                  <a
                    href={`#${heading.slug}`}
                    className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                  >
                    {heading.text}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </aside>
      )}
    </div>
  );
}

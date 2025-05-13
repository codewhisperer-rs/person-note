import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Link from 'next/link';
import LayoutWithSidebar from '@/components/LayoutWithSidebar'; // Import the new component

// Import server-side modules
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "My Personal Website", // Updated title
  description: "A personal website with study notes.", // Updated description
};

// Define the directory where your notes are stored
const notesDirectory = path.join(process.cwd(), 'content/notes');

interface NoteDataForSidebar {
  slug: string;
  title: string;
  category?: string;
}

interface GroupedNotesForSidebar {
  [category: string]: NoteDataForSidebar[];
}

// Function to get data for all notes and group by category (Server-side)
function getNotesSidebarData(): GroupedNotesForSidebar {
  const fileNames = fs.readdirSync(notesDirectory);

  const allNotesData: NoteDataForSidebar[] = fileNames.map((fileName) => {
    const slug = fileName.replace(/\.mdx$/, '');
    const fullPath = path.join(notesDirectory, fileName);
    const fileContents = fs.readFileSync(fullPath, 'utf8');
    const { data } = matter(fileContents);

    return {
      slug,
      title: data.title || 'Untitled Note',
      category: data.category || 'Uncategorized',
    };
  });

  const groupedNotes: GroupedNotesForSidebar = {};
  allNotesData.forEach(note => {
    const category = note.category || 'Uncategorized';
    if (!groupedNotes[category]) {
      groupedNotes[category] = [];
    }
    groupedNotes[category].push(note);
  });

  Object.keys(groupedNotes).forEach(category => {
    groupedNotes[category].sort((a, b) => a.title.localeCompare(b.title));
  });

  return groupedNotes;
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Fetch data on the server
  const notesData = getNotesSidebarData();

  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen flex flex-col`}
      >
        <nav className="bg-gray-100 dark:bg-gray-800 p-4 shadow-md">
          <div className="container mx-auto flex justify-between">
            <Link href="/" className="text-xl font-bold text-gray-900 dark:text-white">
              My Website
            </Link>
            <div>
              <Link href="/" className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 mr-4">
                Home
              </Link>
              <Link href="/about" className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 mr-4">
                About Me
              </Link>
              <Link href="/notes" className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400">
                Study Notes
              </Link>
            </div>
          </div>
        </nav>

        {/* Wrap children and pass notesData */}
        <LayoutWithSidebar notesData={notesData}>{children}</LayoutWithSidebar>

        <footer className="bg-gray-100 dark:bg-gray-800 mt-8 py-4 text-center text-gray-600 dark:text-gray-300 text-sm">
          © {new Date().getFullYear()} My Personal Website. All rights reserved.
        </footer>
      </body>
    </html>
  );
}

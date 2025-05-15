import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

// 笔记目录路径
const notesDirectory = path.join(process.cwd(), 'content/notes');

export async function GET(
  request: Request,
  { params }: { params: { slug: string } }
) {
  const slug = params.slug;

  try {
    const filePath = path.join(notesDirectory, `${slug}.md`); // 假设文件是 .md，如果可能是 .mdx 需要调整
    const mdxFilePath = path.join(notesDirectory, `${slug}.mdx`);

    let actualFilePath = '';
    let fileContents = '';

    if (fs.existsSync(filePath)) {
      actualFilePath = filePath;
    } else if (fs.existsSync(mdxFilePath)) {
      actualFilePath = mdxFilePath;
    } else {
      return NextResponse.json({ error: 'Note not found' }, { status: 404 });
    }
    
    fileContents = fs.readFileSync(actualFilePath, 'utf8');
    
    const { data, content } = matter(fileContents);
    
    const note = {
      slug,
      title: data.title || slug,
      date: data.date || new Date().toISOString(),
      summary: data.summary || '',
      content: content,
      tags: data.tags || [],
      category: data.category || 'Uncategorized' // 您可能需要从frontmatter或路径获取更准确的分类
    };
    
    return NextResponse.json(note);
  } catch (error) {
    console.error(`Error loading note ${slug}:`, error);
    return NextResponse.json({ error: 'Failed to load note' }, { status: 500 });
  }
} 
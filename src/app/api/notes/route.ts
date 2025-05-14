import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

// 笔记目录路径
const notesDirectory = path.join(process.cwd(), 'content/notes');

// 获取所有笔记文件
export async function GET() {
  try {
    // 确保目录存在
    if (!fs.existsSync(notesDirectory)) {
      fs.mkdirSync(notesDirectory, { recursive: true });
    }

    // 读取目录中的所有文件
    const fileNames = fs.readdirSync(notesDirectory);
    
    const notes = fileNames
      .filter(filename => filename.endsWith('.mdx') || filename.endsWith('.md'))
      .map(filename => {
        // 读取文件内容
        const filePath = path.join(notesDirectory, filename);
        const fileContents = fs.readFileSync(filePath, 'utf8');
        
        // 使用gray-matter解析frontmatter
        const { data, content } = matter(fileContents);
        
        // 从文件名获取slug
        const slug = filename.replace(/\.mdx?$/, '');
        
        // 返回笔记数据结构
        return {
          slug,
          title: data.title || slug,
          date: data.date || new Date().toISOString(),
          summary: data.summary || '',
          content: content,
          tags: data.tags || [],
          category: data.category || 'Uncategorized'
        };
      });
    
    return NextResponse.json(notes);
  } catch (error) {
    console.error('Error loading notes:', error);
    return NextResponse.json({ error: 'Failed to load notes' }, { status: 500 });
  }
}

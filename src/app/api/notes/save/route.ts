import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

// 笔记目录路径
const notesDirectory = path.join(process.cwd(), 'content/notes');

// 将笔记保存到文件系统
export async function POST(request: NextRequest) {
  try {
    // 确保目录存在
    if (!fs.existsSync(notesDirectory)) {
      fs.mkdirSync(notesDirectory, { recursive: true });
    }

    // 获取请求体数据
    const note = await request.json();
    const { slug, title, date, summary, content, tags, category } = note;

    if (!slug || !title || !content) {
      return NextResponse.json(
        { error: 'Missing required fields: slug, title or content' }, 
        { status: 400 }
      );
    }

    // 创建frontmatter
    const frontmatter = {
      title,
      date: date || new Date().toISOString(),
      tags,
      summary,
      category
    };

    // 使用gray-matter创建文件内容
    const fileContent = matter.stringify(content, frontmatter);
    
    // 文件路径
    const filePath = path.join(notesDirectory, `${slug}.mdx`);
    
    // 写入文件
    fs.writeFileSync(filePath, fileContent, 'utf8');
    
    return NextResponse.json({ success: true, slug });
  } catch (error: any) {
    console.error('Error saving note:', error);
    return NextResponse.json(
      { error: 'Failed to save note', details: error.message }, 
      { status: 500 }
    );
  }
}

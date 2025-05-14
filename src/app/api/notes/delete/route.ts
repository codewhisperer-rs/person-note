import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

// 笔记目录路径
const notesDirectory = path.join(process.cwd(), 'content/notes');

// 从文件系统中删除笔记
export async function DELETE(request: NextRequest) {
  try {
    // 从URL获取slug参数
    const url = new URL(request.url);
    const slug = url.searchParams.get('slug');
    
    if (!slug) {
      return NextResponse.json(
        { error: 'Missing slug parameter' }, 
        { status: 400 }
      );
    }

    // 构建文件路径
    const mdxFilePath = path.join(notesDirectory, `${slug}.mdx`);
    const mdFilePath = path.join(notesDirectory, `${slug}.md`);
    
    // 检查文件是否存在
    let filePath;
    if (fs.existsSync(mdxFilePath)) {
      filePath = mdxFilePath;
    } else if (fs.existsSync(mdFilePath)) {
      filePath = mdFilePath;
    } else {
      return NextResponse.json(
        { error: 'Note file not found' }, 
        { status: 404 }
      );
    }
    
    // 删除文件
    fs.unlinkSync(filePath);
    
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Error deleting note:', error);
    return NextResponse.json(
      { error: 'Failed to delete note', details: error.message }, 
      { status: 500 }
    );
  }
}

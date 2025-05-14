'use client';

import React from 'react';

// 科技感角落装饰元素
export function CornerDecorators() {
  return (
    <div className="fixed inset-0 pointer-events-none z-[1]">
      {/* 左上角 */}
      <div className="absolute top-4 left-4">
        <div className="w-20 h-20 border-t border-l border-blue-500/20 relative">
          <div className="absolute -top-1 -left-1 w-2 h-2 bg-blue-500/50 rounded-full"></div>
          <div className="absolute top-2 left-2 w-1 h-1 bg-purple-500/40 rounded-full animate-pulse"></div>
          <div className="absolute top-6 left-0 w-3 h-px bg-blue-500/30"></div>
          <div className="absolute left-6 top-0 h-3 w-px bg-blue-500/30"></div>
        </div>
      </div>
      
      {/* 右上角 */}
      <div className="absolute top-4 right-4">
        <div className="w-20 h-20 border-t border-r border-blue-500/20 relative">
          <div className="absolute -top-1 -right-1 w-2 h-2 bg-blue-500/50 rounded-full"></div>
          <div className="absolute top-2 right-2 w-1 h-1 bg-green-500/40 rounded-full animate-pulse"></div>
          <div className="absolute top-6 right-0 w-3 h-px bg-blue-500/30"></div>
          <div className="absolute right-6 top-0 h-3 w-px bg-blue-500/30"></div>
        </div>
      </div>
      
      {/* 左下角 */}
      <div className="absolute bottom-4 left-4">
        <div className="w-20 h-20 border-b border-l border-blue-500/20 relative">
          <div className="absolute -bottom-1 -left-1 w-2 h-2 bg-blue-500/50 rounded-full"></div>
          <div className="absolute bottom-2 left-2 w-1 h-1 bg-cyan-500/40 rounded-full animate-pulse"></div>
          <div className="absolute bottom-6 left-0 w-3 h-px bg-blue-500/30"></div>
          <div className="absolute left-6 bottom-0 h-3 w-px bg-blue-500/30"></div>
        </div>
      </div>
      
      {/* 右下角 */}
      <div className="absolute bottom-4 right-4">
        <div className="w-20 h-20 border-b border-r border-blue-500/20 relative">
          <div className="absolute -bottom-1 -right-1 w-2 h-2 bg-blue-500/50 rounded-full"></div>
          <div className="absolute bottom-2 right-2 w-1 h-1 bg-purple-500/40 rounded-full animate-pulse"></div>
          <div className="absolute bottom-6 right-0 w-3 h-px bg-blue-500/30"></div>
          <div className="absolute right-6 bottom-0 h-3 w-px bg-blue-500/30"></div>
        </div>
      </div>
    </div>
  );
}

'use client';

import React, { useEffect, useState } from 'react';

// 代码风格背景组件
export function CodeBackground() {
  const [linesOfCode, setLinesOfCode] = useState<string[]>([]);

  useEffect(() => {
    // 模拟代码行
    const codeSnippets = [
      'import React from "react";',
      'function App() {',
      '  const [data, setData] = useState(null);',
      '  useEffect(() => {',
      '    async function fetchData() {',
      '      const response = await fetch("/api/data");',
      '      const json = await response.json();',
      '      setData(json);',
      '    }',
      '    fetchData();',
      '  }, []);',
      '  return (',
      '    <main className="container">',
      '      {data ? <DataView data={data} /> : <Loading />}',
      '    </main>',
      '  );',
      '}',
      'export default App;',
      'interface DataProps {',
      '  id: string;',
      '  title: string;',
      '  content: string;',
      '}',
      'const navigation = [',
      '  { name: "首页", href: "/" },',
      '  { name: "关于", href: "/about" },',
      '  { name: "文档", href: "/docs" },',
      '  { name: "博客", href: "/blog" },',
      '];',
      'function transformData(input: DataProps[]) {',
      '  return input.map(item => ({',
      '    ...item,',
      '    slug: item.title.toLowerCase().replace(/ /g, "-")',
      '  }));',
      '}'
    ];
    
    // 随机选择代码行并展示
    const generateRandomCode = () => {
      const lines: string[] = [];
      const count = Math.floor(window.innerHeight / 24); // 估计每行高度约24px
      
      for (let i = 0; i < count; i++) {
        const randomIndex = Math.floor(Math.random() * codeSnippets.length);
        const indent = ' '.repeat(Math.floor(Math.random() * 6) * 2);
        const opacity = Math.random() * 0.4 + 0.05; // 0.05-0.45之间的透明度
        lines.push(`${indent}${codeSnippets[randomIndex]}|${opacity}`);
      }
      
      setLinesOfCode(lines);
    };
    
    generateRandomCode();
    
    const handleResize = () => {
      generateRandomCode();
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="fixed inset-0 -z-20 overflow-hidden pointer-events-none font-mono text-xs">
      {linesOfCode.map((line, index) => {
        const [code, opacity] = line.split('|');
        return (
          <div 
            key={index} 
            className="whitespace-pre text-blue-500 dark:text-blue-400"
            style={{ 
              opacity: parseFloat(opacity),
              transform: `translateY(${index * 24}px)` 
            }}
          >
            {code}
          </div>
        );
      })}
    </div>
  );
}

// 添加代码高亮动画效果的组件
export function CodeHighlightEffect() {
  return (
    <div className="fixed inset-0 -z-10 pointer-events-none">
      <div className="h-full w-full bg-gradient-to-b from-transparent via-blue-500/5 to-transparent code-highlight-animation"></div>
    </div>
  );
}

import { FumadocsCard, FumadocsCardGrid } from '@/components/FumadocsCard';

export default function Home() {
  return (
    <main className="flex flex-col items-center justify-center min-h-[calc(100vh-12rem)] text-center px-4">
      <div className="relative mb-10 mi-fade-in">
        <h1 className="text-4xl md:text-6xl font-bold mb-4 mi-gradient-text">
          科技改变生活
        </h1>
        <h2 className="text-2xl md:text-3xl text-gray-600 dark:text-gray-300">
          我的个人知识管理系统
        </h2>
      </div>
      
      <p className="text-xl text-gray-700 dark:text-gray-300 mb-10 max-w-2xl">
        探索技术，分享见解，记录我的<span className="text-[var(--mi-orange)] font-semibold">知识</span>成长之旅。
      </p>
      
      <div className="w-full max-w-4xl mb-12">
        <FumadocsCardGrid>
          <FumadocsCard 
            title="学习笔记" 
            description="浏览我的技术学习记录和心得体会" 
            href="/notes" 
            icon={<span className="text-xl">📝</span>}
          />
          
          <FumadocsCard 
            title="关于我" 
            description="了解我的背景、技能和专业领域" 
            href="/about" 
            icon={<span className="text-xl">👤</span>}
          />
          
          <FumadocsCard 
            title="分类管理" 
            description="按分类查看所有笔记内容" 
            href="/categories" 
            icon={<span className="text-xl">📂</span>}
          />
        </FumadocsCardGrid>
      </div>
      
      <div className="w-full max-w-4xl mi-card bg-white/80 dark:bg-gray-800/80 p-6 backdrop-blur-sm">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-medium">技术栈亮点</h3>
          <span className="mi-tag mi-tag-orange">持续更新</span>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded text-center">
            <div className="font-medium text-[var(--mi-orange)]">Next.js</div>
            <div className="text-xs text-gray-500 dark:text-gray-400">前端框架</div>
          </div>
          <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded text-center">
            <div className="font-medium text-[var(--mi-orange)]">React</div>
            <div className="text-xs text-gray-500 dark:text-gray-400">UI库</div>
          </div>
          <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded text-center">
            <div className="font-medium text-[var(--mi-orange)]">TailwindCSS</div>
            <div className="text-xs text-gray-500 dark:text-gray-400">样式框架</div>
          </div>
          <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded text-center">
            <div className="font-medium text-[var(--mi-orange)]">TypeScript</div>
            <div className="text-xs text-gray-500 dark:text-gray-400">编程语言</div>
          </div>
        </div>
      </div>
    </main>
  );
}
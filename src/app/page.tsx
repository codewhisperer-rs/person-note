import { FumadocsCard, FumadocsCardGrid } from '@/components/FumadocsCard';
import { TechCircleDecoration } from '@/components/TechElements';

export default function Home() {
  return (
    <main className="flex flex-col items-center justify-center min-h-[calc(100vh-12rem)] text-center px-4 overflow-hidden">
      {/* 科技感装饰圆环 */}
      <TechCircleDecoration className="left-[calc(50%-350px)] top-[calc(50%-350px)] opacity-30 hidden lg:block" />
      
      <div className="relative mb-10 mi-fade-in">
        <h1 className="text-4xl md:text-6xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-500 via-purple-500 to-green-500 tech-glow">
          科技改变生活
        </h1>
        <h2 className="text-2xl md:text-3xl text-gray-600 dark:text-gray-300 typing-effect">
          我的个人知识管理系统
        </h2>
        
        <div className="absolute -z-10 -inset-1 rounded-lg blur opacity-30 bg-gradient-to-r from-blue-500 via-purple-600 to-teal-500"></div>
      </div>
      
      <p className="text-xl text-gray-700 dark:text-gray-300 mb-10 max-w-2xl backdrop-blur-sm py-3 px-5 rounded-lg tech-border">
        探索技术，分享见解，记录我的<span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-green-500 font-semibold">知识</span>成长之旅。
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
      
      <div className="w-full max-w-4xl tech-border tech-scanline bg-white/70 dark:bg-gray-800/70 rounded-lg p-6 backdrop-blur-md">
        <div className="flex justify-between items-center mb-6">
          <h3 className="font-medium flex items-center space-x-2">
            <span className="inline-block w-2 h-2 bg-blue-500 rounded-full animate-pulse"></span>
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-green-500 text-lg">技术栈亮点</span>
          </h3>
          <span className="bg-gradient-to-r from-blue-500 to-green-500 text-white text-xs py-1 px-3 rounded-full flex items-center">
            <span className="mr-1 inline-block w-1.5 h-1.5 bg-white rounded-full animate-pulse"></span>
            持续更新
          </span>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-4 bg-gradient-to-br from-white/90 to-gray-50/80 dark:from-gray-800/90 dark:to-gray-700/80 rounded-lg text-center tech-hover border border-gray-200/50 dark:border-gray-700/50">
            <div className="text-lg font-medium bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-cyan-500">Next.js</div>
            <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">前端框架</div>
          </div>
          <div className="p-4 bg-gradient-to-br from-white/90 to-gray-50/80 dark:from-gray-800/90 dark:to-gray-700/80 rounded-lg text-center tech-hover border border-gray-200/50 dark:border-gray-700/50">
            <div className="text-lg font-medium bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-500">React</div>
            <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">UI库</div>
          </div>
          <div className="p-4 bg-gradient-to-br from-white/90 to-gray-50/80 dark:from-gray-800/90 dark:to-gray-700/80 rounded-lg text-center tech-hover border border-gray-200/50 dark:border-gray-700/50">
            <div className="text-lg font-medium bg-clip-text text-transparent bg-gradient-to-r from-cyan-500 to-green-500">TailwindCSS</div>
            <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">样式框架</div>
          </div>
          <div className="p-4 bg-gradient-to-br from-white/90 to-gray-50/80 dark:from-gray-800/90 dark:to-gray-700/80 rounded-lg text-center tech-hover border border-gray-200/50 dark:border-gray-700/50">
            <div className="text-lg font-medium bg-clip-text text-transparent bg-gradient-to-r from-purple-500 to-pink-500">TypeScript</div>
            <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">编程语言</div>
          </div>
        </div>
      </div>
    </main>
  );
}
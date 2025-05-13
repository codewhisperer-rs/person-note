export default function Home() {
  return (
    <main className="flex flex-col items-center justify-center min-h-[calc(100vh-8rem)] text-center">
      <div className="relative mb-8">
        <h1 className="text-4xl md:text-6xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-600">
          欢迎来到我的个人空间
        </h1>
        <div className="absolute -inset-1 blur-sm opacity-30 bg-gradient-to-r from-blue-400 to-purple-500 rounded-lg -z-10"></div>
      </div>
      
      <p className="text-xl text-gray-700 dark:text-gray-300 mb-8 max-w-2xl">
        探索思想，分享知识，记录我的<span className="text-blue-500 font-semibold">科技</span>之旅。
      </p>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-10 w-full max-w-2xl">
        <div className="p-6 border border-gray-200 dark:border-gray-700 rounded-xl shadow-md bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm hover:shadow-lg transition-all duration-300 hover:scale-105">
          <div className="text-blue-500 mb-2 text-2xl">📝</div>
          <h3 className="text-lg font-semibold mb-2">学习笔记</h3>
          <p className="text-sm mb-4">浏览我的技术学习记录和心得体会</p>
          <a href="/notes" className="inline-block px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-300">
            查看笔记
          </a>
        </div>
        
        <div className="p-6 border border-gray-200 dark:border-gray-700 rounded-xl shadow-md bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm hover:shadow-lg transition-all duration-300 hover:scale-105">
          <div className="text-purple-500 mb-2 text-2xl">👤</div>
          <h3 className="text-lg font-semibold mb-2">关于我</h3>
          <p className="text-sm mb-4">了解我的背景、技能和专业领域</p>
          <a href="/about" className="inline-block px-4 py-2 border border-purple-500 text-purple-600 dark:text-purple-400 rounded-lg hover:bg-purple-500 hover:text-white transition-all duration-300">
            个人介绍
          </a>
        </div>
      </div>
      
      <div className="w-full max-w-4xl p-4 bg-gray-50 dark:bg-gray-800/30 rounded-lg border border-gray-200 dark:border-gray-700">
        <div className="flex items-center space-x-2 mb-2">
          <div className="w-3 h-3 rounded-full bg-red-500"></div>
          <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
          <div className="w-3 h-3 rounded-full bg-green-500"></div>
          <div className="text-xs text-gray-500 ml-2">最新动态</div>
        </div>
        <div className="font-mono text-sm text-gray-700 dark:text-gray-300">
          <p className="typing-effect">探索 Next.js 和 React 的前沿技术...</p>
        </div>
      </div>
    </main>
  );
}
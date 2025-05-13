export default function Home() {
  return (
    <main className="flex flex-col items-center justify-center min-h-[calc(100vh-8rem)] text-center">
      <h1 className="text-4xl md:text-6xl font-bold mb-4">
        Welcome to My Personal Website!
      </h1>
      <p className="text-xl text-gray-700 dark:text-gray-300 mb-8">
        Exploring ideas, sharing knowledge, and documenting my journey.
      </p>
      {/* You can add links to recent notes or sections here later */}
      <div className="flex space-x-4">
        <a href="/notes" className="px-6 py-3 bg-blue-600 text-white rounded-lg shadow-lg hover:bg-blue-700 transition duration-300">
          Explore Notes
        </a>
        <a href="/about" className="px-6 py-3 border border-gray-300 dark:border-gray-700 rounded-lg shadow-lg text-gray-800 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition duration-300">
          Learn About Me
        </a>
      </div>
    </main>
  );
}
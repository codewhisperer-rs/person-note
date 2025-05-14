// 空的 Service Worker 文件
// 这个文件是用来处理浏览器可能尝试访问的 Service Worker 请求
// 由于您的应用当前不使用 Service Worker，所以我们创建一个空文件来避免 404 错误

// 如果需要，您可以添加以下代码来取消注册任何现有的 Service Worker
self.addEventListener('install', function(event) {
  self.skipWaiting();
});

self.addEventListener('activate', function(event) {
  event.waitUntil(
    self.registration.unregister()
      .then(function() {
        return self.clients.matchAll();
      })
      .then(function(clients) {
        clients.forEach(client => client.navigate(client.url));
      })
  );
});

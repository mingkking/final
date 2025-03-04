const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function (app) {
  app.use(
    '/budongsanMapData',
    createProxyMiddleware({
      target: 'http://localhost:5000',
      changeOrigin: true,

    })
  );

  app.use(
    '/budongsanAllData',
    createProxyMiddleware({
      target: 'http://localhost:5000',
      changeOrigin: true,

    })
  );

  app.use(
    '/api',
    createProxyMiddleware({
      target: 'http://localhost:8080',
      changeOrigin: true,
      pathRewrite: { '^/api': '' },
      
    })
  );

  app.use(
    '/createRoom',
    createProxyMiddleware({
      target: 'http://localhost:5001',
      changeOrigin: true,
    })
  );
};
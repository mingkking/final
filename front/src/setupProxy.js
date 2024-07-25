const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function (app) {
  app.use(
    '/budongsan',
    createProxyMiddleware({
      target: 'http://localhost:5000',
      changeOrigin: true,

    })
  );

  app.use(
    '/api',
    createProxyMiddleware({
      target: 'http://192.168.0.209:8080',
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

  app.use(
    '/deleteRoom',
    createProxyMiddleware({
      target: 'http://localhost:5001/deleteRoom',
      changeOrigin: true,
    })
  );
};
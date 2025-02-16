const path = require('path');

module.exports = {
  webpack: {
    alias: {
      '@common': path.resolve(__dirname, 'src/components/common'),
      '@components': path.resolve(__dirname, 'src/components'),
      '@constants': path.resolve(__dirname, 'src/constants'),
      '@styles': path.resolve(__dirname, 'src/styles'),
      '@utils': path.resolve(__dirname, 'src/utils'),
      '@hooks': path.resolve(__dirname, 'src/hooks')
    },
  },
  eslint: {
    configure: {
      rules: {
        'import/no-default-export': 'error'
      }
    }
  },
  devServer: {
    setupMiddlewares: (middlewares, devServer) => {
      if (!devServer) {
        throw new Error('webpack-dev-server is not defined');
      }

      devServer.app.get('/service-worker.js', (req, res) => {
        res.set('Content-Type', 'application/javascript');
        res.sendFile(path.join(__dirname, 'public/service-worker.js'));
      });

      return middlewares;
    }
  }
}; 
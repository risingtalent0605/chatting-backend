const path = require('path');

module.exports = {
  // Basic Webpack setup (entry, output, etc.)
  entry: './server.js',  // Adjust as needed for your project
  output: {
    filename: 'bundle.js',  // Output filename
    path: path.resolve(__dirname, 'dist')  // Adjust to your build folder
  },

  resolve: {
    fallback: {
      fs: false,  // Disable polyfill for fs, as it's not needed in the browser
      path: require.resolve('path-browserify'), // Polyfill path module
      os: require.resolve('os-browserify/browser') // Polyfill os module
    }
  },

  node: {
    __dirname: false,  // Don't polyfill __dirname
    __filename: false, // Don't polyfill __filename
    global: false      // If not using global in your code, set this to false
  },

  // Other configuration like module rules, plugins, etc.
};

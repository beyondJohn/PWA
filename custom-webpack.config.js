const exec = require('child_process').exec;

module.exports = {

  // ... other config here ...

  plugins: [

    // ... other plugins here ...

    {
      apply: (compiler) => {
        compiler.hooks.watchClose.tap('AfterEmitPlugin', (compilation) => {
          // exec('../meBloggyPWA/edit-service-worker.js', (err, stdout, stderr) => {
            //C:\Users\owner\projects\meBloggyPWA\custom-webpack.config.js
            exec('C:/Users/owner/projects/meBloggyPWA/custom-webpack.config.js', (err, stdout, stderr) => {
            if (stdout) process.stdout.write(stdout);
            if (stderr) process.stderr.write(stderr);
          });
        });
      }
    }
  ]
};
// const WebpackShellPlugin = require('webpack-shell-plugin');
// const path = require('path');
// module.exports = {
//   plugins: [
//     new WebpackShellPlugin({ onBuildStart: ['echo "Webpack Start"'], onBuildEnd: ['echo "Webpack End"'] })
//   ]
// };
// var plugins = [];
// plugins.push(new WebpackShellPlugin({
//   onBuildStart: ['echo "Starting"'],
//   onBuildEnd: ['node ./edit-service-worker.js && echo "Ending"']
// }));
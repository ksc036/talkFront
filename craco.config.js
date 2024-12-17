const path = require('path');

const CracoEsbuildPlugin = require('craco-esbuild');
const TerserPlugin = require('terser-webpack-plugin');
//use only for speed test
// const SpeedMeasurePlugin = require('speed-measure-webpack-plugin');
// const smp = new SpeedMeasurePlugin();

const cracoWebpackConfig = {
  optimization: {
    minimize: true,
    minimizer: [
      new TerserPlugin({
        parallel: true,
      }),
    ],
  },
};

cracoWebpackConfig.configure = (webpackConfig, { paths }) => {
  webpackConfig.entry = `${paths.appSrc}/index.tsx`;
  paths.appBuild = webpackConfig.output.path = path.join(__dirname, `build`);

  webpackConfig.resolve = {
    alias: {
      '@': path.resolve(__dirname, 'src/'),
      '@types': path.resolve(__dirname, 'src/@types'),
      '@mobile': path.resolve(__dirname, 'src/components/Mobile/'),
      '@desktop': path.resolve(__dirname, 'src/components/Desktop/'),
      react: path.resolve('./node_modules/react'),
      'react-dom': path.resolve('./node_modules/react-dom'),
      mobx: path.resolve('./node_modules/mobx'),
      'mobx-react': path.resolve('./node_modules/mobx-react'),
      'mobx-react-lite': path.resolve('./node_modules/mobx-react-lite'),
      '@wapl/ui': path.resolve('./node_modules/@wapl/ui'),
      '@wapl/core': path.resolve('./node_modules/@wapl/core'),
      'react-router-dom': path.resolve('./node_modules/react-router-dom'),
      '@wapl/auth': path.resolve('./node_modules/@wapl/auth'),
    },
    extensions: ['.ts', '.tsx', '.js', '.jsx'],
  };

  return webpackConfig;
};

module.exports = {
  // webpack: smp.wrap(cracoWebpackConfig), use only for test
  webpack: cracoWebpackConfig,
  babel: {
    presets: [
      '@babel/preset-env',
      [
        '@babel/preset-react',
        {
          runtime: 'automatic',
        },
      ],
      '@babel/preset-typescript',
    ],
    plugins: [
      [
        '@babel/plugin-transform-runtime',
        {
          useESModules: true,
          regenerator: false,
        },
      ],
    ],
    env: {
      test: {
        presets: [
          [
            '@babel/preset-env',
            {
              targets: 'current node',
              loose: true,
            },
          ],
        ],
      },
    },
  },
  plugins: [
    {
      plugin: CracoEsbuildPlugin,
      options: {
        // includePaths: ['/external/dir/with/components'], // Optional. If you want to include components which are not in src folder
        esbuildLoaderOptions: {
          // Optional. Defaults to auto-detect loader.
          loader: 'tsx',
          target: 'es2020',
        },
        esbuildMinimizerOptions: {
          // Optional. Defaults to:
          target: 'es2020',
          css: true, // if true, OptimizeCssAssetsWebpackPlugin will also be replaced by esbuild.
        },
        skipEsbuildJest: false, // Optional. Set to true if you want to use babel for jest tests,
        esbuildJestOptions: {
          loaders: {
            '.ts': 'ts',
            '.tsx': 'tsx',
          },
        },
      },
    },
  ],
};

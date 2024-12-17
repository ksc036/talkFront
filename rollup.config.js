import { babel } from '@rollup/plugin-babel';
import commonjs from '@rollup/plugin-commonjs';
import external from 'rollup-plugin-peer-deps-external';
import nodeResolve from '@rollup/plugin-node-resolve';
import image from '@rollup/plugin-image';
import url from '@rollup/plugin-url';
import json from '@rollup/plugin-json';
import postcss from 'rollup-plugin-postcss';
import alias from '@rollup/plugin-alias';
import svgr from '@svgr/rollup';
import pkg from './package.json';
import typescript from 'rollup-plugin-typescript2';
import del from 'rollup-plugin-delete';
import replace from '@rollup/plugin-replace';

process.env.BABEL_ENV = 'production';

let input;
switch (process.env.REACT_APP_PLATFORM) {
  case 'foodist':
    input = './src/external_foodist.ts';
    break;
  case 'ekr':
    input = './src/external_ekr.ts';
    break;
  case 'seoul_edu':
    input = './src/external_seoul-edu.ts';
    break;
  default:
    input = './src/external.ts';
}

export default {
  input: input,
  output: [
    {
      dir: './dist',
      format: 'cjs',
      entryFileNames: 'index.cjs.js',
    },
  ],
  plugins: [
    json(),
    external(),
    nodeResolve({
      browser: true,
      preferBuiltins: false,
    }),
    postcss(),
    babel({
      exclude: 'node_modules/**',
      plugins: [
        ['@babel/plugin-proposal-decorators', { legacy: true }],
        ['@babel/plugin-proposal-class-properties', { loose: true }],
      ],
      presets: ['@babel/preset-react'],
    }),
    commonjs({
      include: 'node_modules/**',
      requireReturnsDefault: 'auto',
    }),
    typescript({
      useTsconfigDeclarationDir: true,
      tsconfig: './tsconfig.json',
      clean: true,
      exclude: ['**/__tests__', '**/*.test.ts', '**/*.test.tsx'],
    }),
    replace({
      'process.env.REACT_APP_PLATFORM': JSON.stringify(
        process.env.REACT_APP_PLATFORM,
      ),
      'process.env.REACT_APP_ROLLUP': JSON.stringify(
        process.env.REACT_APP_ROLLUP,
      ),
    }),
    image(),
    url(),
    svgr(),
    del({ targets: 'dist/*' }),
    alias({
      entries: [
        { find: '@', replacement: 'src' },
        { find: '@types', replacement: 'src/@types' },
        { find: '@desktop', replacement: 'src/components/Desktop' },
        { find: '@mobile', replacement: 'src/components/Mobile' },
      ],
    }),
  ],
};

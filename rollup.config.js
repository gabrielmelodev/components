import path from 'path';
import alias from '@rollup/plugin-alias';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import babel from '@rollup/plugin-babel';
import external from 'rollup-plugin-peer-deps-external';
import dts from 'rollup-plugin-dts';

const tsConfig = require('./tsconfig.json');
const packageJson = require('./package.json');
const rootDir = path.resolve(__dirname);
const dstDir = path.join(rootDir, "dist");
const extensions = [".ts", ".tsx", ".json"];

export default [
  {
    input: 'lib/components.ts',
    external: id => {
      return /^react|styled-jsx/.test(id);
    },
    output: [
      {
        file: packageJson.main,
        format: 'cjs',
        sourcemap: true,
        name: packageJson.name,
      },
      {
        file: packageJson.module,
        format: 'esm',
        sourcemap: true
      }
    ],
    plugins: [
      external(),
      alias({
        entries: [{
          find: '@lib',
          replacement: (...args) => {
            return path.resolve(__dirname, 'lib');
          },
        }]
      }),
      resolve({
        jsnext: true,
        extensions,
      }),  
      commonjs(),
      babel({
        babelHelpers: 'bundled',
        exclude: "node_modules/**",
        extensions
      }),
    ],
  },
  {
    input: 'types/components.d.ts',
    output: [{ file: packageJson.types, format: "esm" }],
    external: [/\.css$/],
    plugins: [
      alias({
        entries: [{
          find: '@lib',
          replacement: (...args) => {
            return path.resolve(__dirname, 'types/');
          },
        }]
      }),
      dts(),
    ],
  },
]
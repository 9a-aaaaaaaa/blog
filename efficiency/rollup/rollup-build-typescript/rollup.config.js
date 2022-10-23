import json from "rollup-plugin-json";
import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';

export default {
   // input: 'src/app.js',
   input: ['src/app.js','src/app2.js'], // 支持对象的形式
   output: {
      // file: 'dist/bundle.js',
      // format: 'iife'
      dir: 'dist',
      format: "es"
   },
   plugins:[
      // 将结果导入
      json(),
      resolve(),
      commonjs(),
   ]
}

// import dts from 'rollup-plugin-dts'
// import esbuild from 'rollup-plugin-esbuild'

// const name ="aaa" //require('./package.json').main.replace(/\.js$/, '')

// const bundle = config => ({
//   ...config,
//   input: 'src/app.ts',
//   external: id => !/^[./]/.test(id),
// })

// export default [
//   bundle({
//     plugins: [esbuild()],
//     output: [
//       {
//         file: `${name}.js`,
//         format: 'cjs',
//         sourcemap: true,
//       },
//       {
//         file: `${name}.mjs`,
//         format: 'es',
//         sourcemap: true,
//       },
//     ],
//   }),
//   bundle({
//     plugins: [dts()],
//     output: {
//       file: `${name}.d.ts`,
//       format: 'es',
//     },
//   }),
// ]

/* eslint-disable*/
import json from "rollup-plugin-json";
import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import babel from '@rollup/plugin-babel';
import replace from "rollup-plugin-replace";
import { terser } from 'rollup-plugin-terser';
import { eslint } from "rollup-plugin-eslint";

const minifyOptions = {
    compress: {
      warnings: true,
      drop_console: true,
    },
    mangle: true,
  };

export default {
    input: "src/app.js",
    output: [
        {
            file: "dist/js/main.umd.js",
            format: "umd",
            name: 'sdk',
            sourcemap: true,
        },
        {
            file: "dist/js/main.es.js",
            format: "es",
            sourcemap: true,
        },
        {
            file: "dist/js/main.cjs.js",
            format: "cjs",
            sourcemap: true,
        }
    ],
    plugins:[
        // 将结果导入
        eslint({
            fix: true,
            throwOnError: true,
            include: ['src/**'],
            exclude: ['node_modules/**']
    }),
        json(),
        resolve(),
        commonjs(),
        replace({
            exclude: 'node_modules/**',
            "process.env.NODE_ENV": JSON.stringify(process.env.NODE_ENV)
        }),
        // babel({
        //   // 为了避免转译第三方脚本,忽略掉node_modules 
        //     exclude: 'node_modules/**', 
        // }),                     
        process.env.NODE_ENV === "production" && terser(minifyOptions),
     ]
}; 
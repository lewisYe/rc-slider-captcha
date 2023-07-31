import { babel } from "@rollup/plugin-babel";
import { nodeResolve } from '@rollup/plugin-node-resolve';
import commonjs from "@rollup/plugin-commonjs";
import terser from "@rollup/plugin-terser";
import typescript from '@rollup/plugin-typescript';
import postcss from 'rollup-plugin-postcss';
import image from "@rollup/plugin-image";

const extensions = [".js", ".jsx", ".ts", ".tsx"];

export default {
  input: "./src/index.tsx",
  output: [
    {
      file: "./lib/bundle.cjs.js",
      format: "cjs",
      exports: "default",
    },
    {
      file: "./lib/bundle.es.js",
      format: "esm",
    },
    {
      file: "./lib/bundle.umd.js",
      format: "umd",
      name: "StarSliderCaptcha"
    },
  ],
  external: ['react','react-dom'],
  watch: {
    include: "src/**",
  },
  plugins: [
    nodeResolve(),
    commonjs(),
    typescript(), 
    babel({
      babelHelpers: 'bundled',
      exclude: 'node_modules/**',
      presets: [
        "@babel/preset-env",
        '@babel/preset-react'
      ],
      plugins: [
        '@babel/plugin-transform-runtime'
      ]
    }),
    postcss(),
    image(),
    terser(),
  ],
};

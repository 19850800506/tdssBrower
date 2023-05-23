module.exports = {
  // 默认情况下，ESLint会在所有父级组件中寻找配置文件，一直到根目录。ESLint一旦发现配置文件中有   "root": true，它就会停止在父级目录中寻找。
  root: true,
  // 该配置属性定义来一组预定义的全局变量。这些环境并不是互斥的，所以你可以同时定义多个。
  env: {
    browser: true,
    node: true,
  },
  // extends是扩展插件的意思,用来配置vue.js风格
  extends: [
    'plugin:vue/essential', // 全称 eslint-plugin-vue
    'airbnb-base',
    '@vue/prettier', // 全称 eslint-plugin-prettier
  ],
  // ESLint 支持使用第三方插件。在使用插件之前，你必须使用包管理工具安装它。
  // 在配置文件里配置插件时，可以使用 plugins 关键字来存放插件名字的列表。
  // 插件名称可以省略 eslint-plugin- 前缀。
  // plugins: ['vue', 'prettier'],
  plugins: ['vue'],
  // 额外的全局变量。我们使用第三方提供的全局变量的时候（例如：jQuery,AMap 等对象），
  // ESLint 并不能识别他们，总是会报错。这个时候，该配置的作用就出现了。
  // 使用 globals 指出你要使用的全局变量。将变量设置为 true 将允许变量被重写，或 false 将不允许被重写。
  globals: {
    // $: false,
    // jquery: false,
    // AMap: false
    Atomics: 'readonly',
    SharedArrayBuffer: 'readonly',
  },
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: 'module',
  },
  // parserOptions: {
  //   parser: 'babel-eslint',
  // },
  // ESLint 的规则。你可以使用注释或配置文件修改你项目中要使用的规则。
  // rules：开启规则和发生错误时报告的等级，规则的错误等级有三种：
  // 0 或'off'：关闭规则。
  // 1 或'warn'：打开规则，并且作为一个警告（并不会导致检查不通过）。
  // 2 或'error'：打开规则，并且作为一个错误（退出码为1，检查不通过）
  rules: {
    // allow debugger during development
    'vue/html-self-closing': 'off',
    'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'cnpmno-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    // 强制使用单引号
    quotes: [
      'error',
      'single',
      { avoidEscape: true, allowTemplateLiterals: true },
    ],
    // 强制不使用分号结尾
    semi: ['error', 'never'],
    'prettier/prettier': [
      'error',
      {
        eslintIntegration: true, // 让prettier使用eslint的代码格式进行校验
        semi: false, // 是否使用分号, 默认true
        singleQuote: true, // 使用单引号, 默认false(在jsx中配置无效, 默认都是双引号)
      },
    ],
    // 关闭组件命名规则
    'vue/multi-word-component-names': 'off',
    'vue/no-mutating-props': 0,
    'vue/no-side-effects-in-computed-properties': 0,
    // 'vue/html-quotes': ['error', 'single'],
  },
}
// module.exports = {
//   root: true,
//   env: {
//     browser: true,
//     es6: true,
//   },
//   extends: [
//     'plugin:vue/essential',
//     'airbnb-base',
//   ],
//   globals: {
//     Atomics: 'readonly',
//     SharedArrayBuffer: 'readonly',
//   },
//   parserOptions: {
//     ecmaVersion: 2018,
//     sourceType: 'module',
//   },
//   plugins: [
//     'vue',
//   ],
//   rules: {
//     // allow debugger during development
//     'vue/html-self-closing': 'off',
//     'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off',
//     'cnpmno-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
//     // 强制使用单引号
//     quotes: [
//       'error',
//       'single',
//       { avoidEscape: true, allowTemplateLiterals: true },
//     ],
//     // 强制不使用分号结尾
//     semi: ['error', 'never'],
//     'prettier/prettier': [
//       'error',
//       {
//         eslintIntegration: true, // 让prettier使用eslint的代码格式进行校验
//         semi: false, // 是否使用分号, 默认true
//         singleQuote: true, // 使用单引号, 默认false(在jsx中配置无效, 默认都是双引号)
//       },
//     ],
//     // 关闭组件命名规则
//     'vue/multi-word-component-names': 'off',
//     'vue/no-mutating-props': 0,
//     'vue/no-side-effects-in-computed-properties': 0,
//     // 'vue/html-quotes': ['error', 'single'],
//   },
// }

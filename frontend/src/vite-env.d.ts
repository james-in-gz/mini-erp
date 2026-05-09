/// <reference types="vite/client" />

// 告诉 TypeScript 如何理解 CSS 文件
declare module '*.css' {
  const content: any
  export default content
}

declare module '*.module.css' {
  const classes: { readonly [key: string]: string }
  export default classes
}
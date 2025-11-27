/// <reference types="vite/client" />

// CSS modules type declaration
declare module '*.css' {
  const content: { [className: string]: string }
  export default content
}

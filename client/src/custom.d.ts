declare module '*.svg' {
  export const ReactComponent: React.Element;
}

declare module '*.scss' {
  const content: Record<string, string>;
  export default content;
}

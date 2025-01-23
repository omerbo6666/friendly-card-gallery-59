interface Window {
  fs: {
    readFile: (path: string, options: { encoding: string }) => Promise<string>;
  }
}
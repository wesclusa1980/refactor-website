declare module '*.jpg';
declare module '*.jpeg';
declare module '*.png';
declare module '*.svg';
interface ImportMeta {
    readonly env: {
      [key: string]: string;
    };
  }
// global.d.ts
declare global {
  interface Window {
    googleTranslateElementInit: () => void;
  }
}
declare global {
  interface Window {
    google: {
      translate: {
        TranslateElement: any;
      };
    };
  }
}
export {};

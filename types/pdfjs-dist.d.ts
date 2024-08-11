declare module 'pdfjs-dist/webpack' {
    const pdfjsLib: any;
    export = pdfjsLib;
  }
  
  declare module 'pdfjs-dist/build/pdf.worker.entry' {
    const pdfjsWorker: any;
    export = pdfjsWorker;
  }
  
  declare module 'pdfjs-dist' {
    const pdfjsLib: any;
    export = pdfjsLib;
  }
  
  declare module 'pdfjs-dist/build/pdf.worker.entry';
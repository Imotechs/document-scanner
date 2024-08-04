declare module 'jscanify' {
    export default class JScanify {
      detect(image: HTMLImageElement | HTMLCanvasElement): Promise<{ corners: { x: number; y: number }[] }>;
    }
}
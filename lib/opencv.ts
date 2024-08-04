export const loadOpenCV = async (): Promise<void> => {
    if (typeof window !== 'undefined') {
      if (!window.cv) {
        return new Promise((resolve, reject) => {
          const scriptId = 'opencv-js';
          if (document.getElementById(scriptId)) {
            resolve();
            return;
          }
  
          const script = document.createElement('script');
          script.id = scriptId;
          script.src = 'https://docs.opencv.org/4.x/opencv.js';
          script.async = true;
          script.onload = () => {
            if (window.cv) {
              resolve();
            } else {
              reject(new Error('Failed to load OpenCV.js'));
            }
          };
          script.onerror = () => reject(new Error('Failed to load OpenCV.js'));
          document.body.appendChild(script);
        });
      } else {
        return Promise.resolve();
      }
    } else {
      return Promise.reject(new Error('Window is undefined'));
    }
};
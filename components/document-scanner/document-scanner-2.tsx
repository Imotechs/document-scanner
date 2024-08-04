"use client"

import { useEffect, useRef, useState } from 'react';
import JScanify from 'jscanify';

const images = [{ src: '/images/sample-001.jpg' }];

export const DocumentScanner2 = () => {
    // const containerRef = useRef(null);
    // const openCvURL = 'https://docs.opencv.org/4.7.0/opencv.js';

    // const [loadedOpenCV, setLoadedOpenCV] = useState(false);
    // const [selectedImage, setSelectedImage] = useState(undefined);    

    // useEffect(() => {
    //     // eslint-disable-next-line no-undef
    //     const scanner = new JScanify();
    //     loadOpenCv(() => {
    //       if (selectedImage) {
    //         containerRef.current.innerHTML = '';
    //         const newImg = document.createElement('img');
    //         newImg.src = selectedImage.src;

    //         newImg.onload = function () {
    //           const resultCanvas = scanner.extractPaper(newImg, 386, 500);
    //           containerRef.current.append(resultCanvas);

    //           const highlightedCanvas = scanner.highlightPaper(newImg);
    //           containerRef.current.append(highlightedCanvas);
    //         };
    //       }
    //     });
    //     // eslint-disable-next-line react-hooks/exhaustive-deps
    // }, [selectedImage]);

    // const loadOpenCv = (onComplete:any) => {
    //     const isScriptPresent = !!document.getElementById('open-cv');
    //     if (isScriptPresent || loadedOpenCV) {
    //       setLoadedOpenCV(true);
    //       onComplete();
    //     } else {
    //       const script = document.createElement('script');
    //       script.id = 'open-cv';
    //       script.src = openCvURL;

    //       script.onload = function () {
    //         setTimeout(function () {
    //           onComplete();
    //         }, 1000);
    //         setLoadedOpenCV(true);
    //       };
    //       document.body.appendChild(script);
    //     }
    // };

    const containerRef = useRef<HTMLDivElement>(null);
    const openCvURL = 'https://docs.opencv.org/4.7.0/opencv.js';

    const [loadedOpenCV, setLoadedOpenCV] = useState(false);
    const [selectedImage, setSelectedImage] = useState<{ src: string } | undefined>(undefined);

    useEffect(() => {
        const scanner = new JScanify();
        loadOpenCv(() => {
            if (selectedImage && containerRef.current) {
                containerRef.current.innerHTML = '';
                const newImg = document.createElement('img');
                newImg.src = selectedImage.src;

                newImg.onload = function () {
                    const cornerPoints = scanner.detect(newImg)
                    console.log(cornerPoints)
                    // const resultCanvas = scanner.extractPaper(newImg, 386, 500);
                    // if (resultCanvas) {
                    //     containerRef.current?.append(resultCanvas);
                    // }

                    // const highlightedCanvas = scanner.highlightPaper(newImg);
                    // if (highlightedCanvas) {
                    //     containerRef.current?.append(highlightedCanvas);
                    // }
                };
            }
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedImage]);

    const loadOpenCv = (onComplete: () => void) => {
        const isScriptPresent = !!document.getElementById('open-cv');
        if (isScriptPresent || loadedOpenCV) {
            setLoadedOpenCV(true);
            onComplete();
        } else {
            const script = document.createElement('script');
            script.id = 'open-cv';
            script.src = openCvURL;

            script.onload = function () {
                setTimeout(function () {
                    onComplete();
                }, 1000);
                setLoadedOpenCV(true);
            };
            document.body.appendChild(script);
        }
    };

    return (
        <>
            <div className="scanner-container">
                <div>
                    {!loadedOpenCV && (
                        <div>
                            <h2>Loading OpenCV...</h2>
                        </div>
                    )}
                    {images.map((image, index) => (
                        <img
                            key={index}
                            className={selectedImage && selectedImage.src === image.src ? 'selected' : ''}
                            src={image.src}
                            onClick={() => setSelectedImage(image)}
                            alt={`Document ${index + 1}`}
                        />
                    ))}
                </div>
                <div ref={containerRef} id="result-container"></div>
            </div>
        </>
    );
}

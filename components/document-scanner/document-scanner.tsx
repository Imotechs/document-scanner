"use client"

import React, { useRef, useEffect, useState } from 'react';

// import library
import { loadOpenCV } from '@/lib/opencv';

export const DocumentScanner = () => {
    const [opencvLoaded, setOpencvLoaded] = useState(false);
    const [cornerPoints, setCornerPoints] = useState<Point[]>([]);
    

    const imageRef = useRef<HTMLImageElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const load = async () => {
            try {
                await loadOpenCV();
                setOpencvLoaded(true);
            } catch (err) {
                console.error(err);
            }
        };

        load();
    }, []);


    const onHandleProcessImage = () => {
        console.log("clicked")
        if (opencvLoaded) {
            console.log("OpenCV status is fine")

            const cv = window.cv;
            console.log("cv loaded - ", cv)

            const image = imageRef.current;
            const canvas = canvasRef.current;
            console.log("image - ", image)
            console.log("canvas - ", canvas)

            const src = cv.imread(image);
            console.log("image src - ", src)

            const dst = new cv.Mat();
            console.log("dst - ", dst)

            // render image in canvas
            cv.cvtColor(src, dst, cv.COLOR_RGBA2GRAY);
            cv.imshow(canvas, dst);


            // detect points
            if(image && canvas){
            
                const ctx = canvas.getContext('2d');
                if (ctx) {
                    const points = detect(image, ctx);
                    console.log("Detected Points: ", points);
                    setCornerPoints(points);
                }                
            }
            


            src.delete();
            dst.delete();
        }
    }


    const onHandleCropImage = () => {
        const cv = window.cv;
        const canvas = canvasRef.current;
        const ctx = canvas?.getContext('2d');
        if (canvas && ctx && cornerPoints.length === 4) {
            const src = cv.imread(imageRef.current);
            const dst = new cv.Mat();
            const pts1 = cv.matFromArray(4, 1, cv.CV_32FC2, [
                cornerPoints[0].x, cornerPoints[0].y,
                cornerPoints[1].x, cornerPoints[1].y,
                cornerPoints[2].x, cornerPoints[2].y,
                cornerPoints[3].x, cornerPoints[3].y
            ]);
            const width = Math.max(
                getDistance(cornerPoints[0], cornerPoints[1]),
                getDistance(cornerPoints[2], cornerPoints[3])
            );
            const height = Math.max(
                getDistance(cornerPoints[0], cornerPoints[3]),
                getDistance(cornerPoints[1], cornerPoints[2])
            );
            const pts2 = cv.matFromArray(4, 1, cv.CV_32FC2, [
                0, 0,
                width, 0,
                width, height,
                0, height
            ]);
            const M = cv.getPerspectiveTransform(pts1, pts2);
            cv.warpPerspective(src, dst, M, new cv.Size(width, height));
            cv.imshow(canvas, dst);
            src.delete();
            dst.delete();
            pts1.delete();
            pts2.delete();
            M.delete();
        }
    }    

   

    return (
        <>
            <div>DocumentScanner</div>
            <div>opencv status - {opencvLoaded ? "Loaded" : "Not loaded"}</div>
            <div>
                <img ref={imageRef} src="/images/sample-001.jpg" alt="Input" />
            </div>
            <button onClick={(e) => onHandleProcessImage()} >detect corners</button>
            <button onClick={(e) => onHandleCropImage()} >Crop image</button>

            <canvas ref={canvasRef}></canvas> 

      </>      
    )
}

export interface Point {
    x: number;
    y: number;
}

const detect = (source:HTMLImageElement|HTMLCanvasElement, ctx: CanvasRenderingContext2D):Point[] => {
    const cv = window.cv;
    // let cv = this.cv;
    const img = cv.imread(source);
    const gray = new cv.Mat();
    cv.cvtColor(img, gray, cv.COLOR_RGBA2GRAY);
    const blur = new cv.Mat();
    cv.GaussianBlur(gray,blur,new cv.Size(5, 5),0,0,cv.BORDER_DEFAULT);
    const thresh = new cv.Mat();
    cv.threshold(blur,thresh,0,255,cv.THRESH_BINARY + cv.THRESH_OTSU);
    let contours = new cv.MatVector();
    let hierarchy = new cv.Mat();

    cv.findContours(thresh,contours,hierarchy,cv.RETR_CCOMP,
      cv.CHAIN_APPROX_SIMPLE);

    let maxArea = 0;
    let maxContourIndex = -1;
    for (let i = 0; i < contours.size(); ++i) {
      let contourArea = cv.contourArea(contours.get(i));
      if (contourArea > maxArea) {
        maxArea = contourArea;
        maxContourIndex = i;
      }
    }

    const maxContour = contours.get(maxContourIndex);
    console.log(maxContour)
    const points = getCornerPoints(maxContour)
    console.log(points)


    // // Draw detected points on the canvas
    // ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    // ctx.drawImage(source, 0, 0);
    // ctx.fillStyle = 'red';
    // points.forEach(point => {
    //     ctx.beginPath();
    //     ctx.arc(point.x, point.y, 5, 0, 2 * Math.PI);
    //     ctx.fill();
    // });


    // Draw detected points and lines on the canvas
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    ctx.drawImage(source, 0, 0);
    ctx.fillStyle = 'red';
    points.forEach(point => {
        ctx.beginPath();
        ctx.arc(point.x, point.y, 5, 0, 2 * Math.PI);
        ctx.fill();
    });

    ctx.strokeStyle = 'blue';
    ctx.lineWidth = 2;
    if (points.length === 4) {
        ctx.beginPath();
        ctx.moveTo(points[0].x, points[0].y);
        for (let i = 1; i < points.length; i++) {
            ctx.lineTo(points[i].x, points[i].y);
        }
        ctx.closePath();
        ctx.stroke();
    }


    img.delete();
    gray.delete();
    blur.delete();
    thresh.delete();
    contours.delete();
    hierarchy.delete();
    return points;
    // return [{ "x":10, "y":30}]

}

const getCornerPoints = (contour:any):Point[] => {
    const cv = window.cv;

    let points:Point[] = [];
    let rect = cv.minAreaRect(contour);
    const center = rect.center;

    let topLeftPoint;
    let topLeftDistance = 0;

    let topRightPoint;
    let topRightDistance = 0;

    let bottomLeftPoint;
    let bottomLeftDistance = 0;

    let bottomRightPoint;
    let bottomRightDistance = 0;

    for (let i = 0; i < contour.data32S.length; i += 2) {
      const point = { x: contour.data32S[i], y: contour.data32S[i + 1] };
      const distance = getDistance(point, center);
      if (point.x < center.x && point.y < center.y) {
        if (distance > topLeftDistance) {
          topLeftPoint = point;
          topLeftDistance = distance;
        }
      } else if (point.x > center.x && point.y < center.y) {
        if (distance > topRightDistance) {
          topRightPoint = point;
          topRightDistance = distance;
        }
      } else if (point.x < center.x && point.y > center.y) {
        if (distance > bottomLeftDistance) {
          bottomLeftPoint = point;
          bottomLeftDistance = distance;
        }
      } else if (point.x > center.x && point.y > center.y) {
        if (distance > bottomRightDistance) {
          bottomRightPoint = point;
          bottomRightDistance = distance;
        }
      }
    }
    points.push(topLeftPoint as Point);
    points.push(topRightPoint as Point);
    points.push(bottomRightPoint as Point);
    points.push(bottomLeftPoint as Point);
    return points;
}

const getDistance = (p1:Point, p2:Point) => {
    return Math.hypot(p1.x - p2.x, p1.y - p2.y);
}
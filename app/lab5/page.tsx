"use client"

import React, { useRef, useEffect, useState } from 'react';
import Draggable from 'react-draggable';

const Lab5Page = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [circles, setCircles] = useState<{ x: number; y: number; radius: number }[]>([]);

    useEffect(() => {
        const canvas = canvasRef.current;

        if (canvas) {
            // Initialize the canvas
            canvas.width = 600;
            canvas.height = 500;

            const ctx = canvas.getContext('2d');
            if (ctx) {
                ctx.fillStyle = '#f0f0f0'; // Light grey background
                ctx.fillRect(0, 0, canvas.width, canvas.height); // Fill canvas with background color
            }
        }
    }, []);

    const handleDrawCircles = () => {
        const initialCircles = [
            { x: 100, y: 100, radius: 5 },
            { x: 300, y: 100, radius: 5 },
            { x: 100, y: 300, radius: 5 },
            { x: 300, y: 300, radius: 5 },
        ];
        setCircles(initialCircles);
    };
    const drawCirclesAndLines = (circles: { x: number; y: number; radius: number }[]) => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // Clear canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Redraw background
        // ctx.fillStyle = '#f0f0f0';
        // ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Draw lines between circles
        ctx.strokeStyle = 'blue';
        ctx.lineWidth = 2;
        for (let i = 0; i < circles.length; i++) {
            const nextIndex = (i + 1) % circles.length;
            ctx.beginPath();
            ctx.moveTo(circles[i].x, circles[i].y);
            ctx.lineTo(circles[nextIndex].x, circles[nextIndex].y);
            ctx.stroke();
        }

        // Draw circles
        circles.forEach(circle => {
            ctx.fillStyle = 'red';
            ctx.beginPath();
            ctx.arc(circle.x, circle.y, circle.radius, 0, 2 * Math.PI);
            ctx.fill();
        });
    };

    const handleDrag = (index: number, e: any, data: any) => {
        const updatedCircles = circles.map((circle, i) => {
            if (i === index) {
                return { ...circle, x: data.x + circle.radius, y: data.y + circle.radius };
            }
            return circle;
        });
        setCircles(updatedCircles);
        drawCirclesAndLines(updatedCircles);
    };
    return (
        <div style={{ textAlign: 'center', marginTop: '20px' }}>
            <h1>600x500 Blank Canvas</h1>
            <div
                style={{
                    position: 'relative',
                    width: '600px',
                    height: '500px',
                    border: '2px solid red',
                    margin: '20px auto',
                }}
            >
                <canvas
                    ref={canvasRef} 
                    style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '600px',
                        height: '500px',
                        border: '1px solid black'
                    }}                    
                    // onMouseDown={handleMouseDown}
                    // onMouseMove={handleMouseMove}
                    // onMouseUp={handleMouseUp}
                    // onMouseLeave={handleMouseUp} // Handle case when mouse leaves canvas while dragging

                />
                {circles.map((circle, index) => (
                    <Draggable
                        key={index}
                        defaultPosition={{ x: circle.x - circle.radius, y: circle.y - circle.radius }}
                        onDrag={(e, data) => handleDrag(index, e, data)}
                        bounds="parent"
                    >
                        <div
                            style={{
                                position: 'absolute',
                                width: circle.radius * 2,
                                height: circle.radius * 2,
                                borderRadius: '50%',
                                backgroundColor: 'red',
                                cursor: 'pointer',
                                top: 0,
                                left: 0,
                            }}
                        />
                    </Draggable>
                ))}



            </div>




            <div style={{ marginTop: '20px' }}>

                <button onClick={handleDrawCircles} style={{ padding: '10px 20px', fontSize: '16px' }}>
                    Draw Circles
                </button>
            </div>

        </div>
    )
}

export default Lab5Page



class CircleDrawer {
    private canvas: HTMLCanvasElement;
    private ctx: CanvasRenderingContext2D;

    constructor(canvas: HTMLCanvasElement) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
    }

    clearCanvas(): void {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }

    drawCircle(x: number, y: number, radius: number, color: string = 'red'): void {
        this.ctx.fillStyle = color;
        this.ctx.beginPath();
        this.ctx.arc(x, y, radius, 0, 2 * Math.PI);
        this.ctx.fill();
    }

    drawCircles(circles: { x: number; y: number; radius: number }[]): void {
        this.clearCanvas(); // Clear the canvas before drawing the circles
        circles.forEach(circle => {
            this.drawCircle(circle.x, circle.y, circle.radius);
        });
    }
}
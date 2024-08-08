"use client"

import React, { useState, useEffect,useRef, useCallback } from 'react';

import { loadOpenCV } from '@/lib/opencv';
import { ImageUploader } from './ImageUploader';

const CropperComponent = () => {
  const [uploadedImage, setUploadedImage] = useState<File | null>(null);
  const [opencvLoaded, setOpencvLoaded] = useState(false);
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



  if (!opencvLoaded) {
  
    return document.getElementById('header')?.innerHTML=='Loading...';
  }
  const handleImageUpload = (file: File) => {
    setUploadedImage(file);

};
  return (
    <div>

      <ImageUploader onImageUpload={handleImageUpload}/>
    
    </div>
  );
};

export default CropperComponent;

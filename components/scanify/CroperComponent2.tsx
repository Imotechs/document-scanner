"use client"

import React, { useState, useEffect,useRef, useCallback } from 'react';

import { ImageUploader } from './ImageUploader';

const CropperComponent = (props:any) => {



 
  const handleImageUpload = (file: File) => {

};
  return (
    <div>

      <ImageUploader onImageUpload={handleImageUpload}/>
    
    </div>
  );
};

export default CropperComponent;

import React, { useState, useCallback } from 'react';
import Cropper from 'react-easy-crop';
import { ZoomIn, ZoomOut, RotateCw } from 'lucide-react';

const PhotoCrop = ({ imageSrc, onCropComplete, onCancel }) => {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);

  const onCropChange = (crop) => {
    setCrop(crop);
  };

  const onZoomChange = (zoom) => {
    setZoom(zoom);
  };

  const onCropCompleteCallback = useCallback((croppedArea, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  // Utility function to draw the cropped image on canvas and return as data URL
  const createImage = (url) =>
    new Promise((resolve, reject) => {
      const image = new Image();
      image.addEventListener('load', () => resolve(image));
      image.addEventListener('error', (error) => reject(error));
      image.setAttribute('crossOrigin', 'anonymous'); // avoid cors issues
      image.src = url;
    });

  const getCroppedImg = async (imageSrc, pixelCrop, rotation = 0) => {
    const image = await createImage(imageSrc);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    if (!ctx) {
      return null;
    }

    // Set canvas dimensions to the crop size (matches card photo dimensions: 224x284 for optimal resolution)
    const targetWidth = 224 * 2; // high res crop
    const targetHeight = 284 * 2;
    canvas.width = targetWidth;
    canvas.height = targetHeight;

    // Draw the cropped section onto the canvas
    ctx.drawImage(
      image,
      pixelCrop.x,
      pixelCrop.y,
      pixelCrop.width,
      pixelCrop.height,
      0,
      0,
      targetWidth,
      targetHeight
    );

    // Compress and return as base64 JPEG
    return canvas.toDataURL('image/jpeg', 0.85);
  };

  const handleConfirmCrop = async () => {
    try {
      const croppedImageBase64 = await getCroppedImg(
        imageSrc,
        croppedAreaPixels,
        rotation
      );
      onCropComplete(croppedImageBase64);
    } catch (e) {
      console.error(e);
      alert('Failed to crop image. Please try again.');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center p-4 bg-slate-900 text-white rounded-xl shadow-2xl max-w-lg mx-auto">
      <h3 className="text-lg font-bold mb-3">Crop Your Profile Photo</h3>
      
      {/* Cropper Container */}
      <div className="relative w-full h-80 bg-slate-800 rounded-lg overflow-hidden border border-slate-700">
        <Cropper
          image={imageSrc}
          crop={crop}
          zoom={zoom}
          rotation={rotation}
          aspect={224 / 284} // Matches card photo box aspect ratio
          onCropChange={onCropChange}
          onCropComplete={onCropCompleteCallback}
          onZoomChange={onZoomChange}
          showGrid={true}
          cropShape="round" // Gives rounded feedback
        />
      </div>

      {/* Controls */}
      <div className="w-full mt-4 space-y-4">
        {/* Zoom Slider */}
        <div className="flex items-center gap-3">
          <ZoomOut className="w-5 h-5 text-slate-400" />
          <input
            type="range"
            value={zoom}
            min={1}
            max={3}
            step={0.1}
            aria-label="Zoom"
            onChange={(e) => setZoom(Number(e.target.value))}
            className="w-full h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-teal-500"
          />
          <ZoomIn className="w-5 h-5 text-slate-400" />
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 justify-end pt-2">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 bg-slate-800 border border-slate-700 hover:bg-slate-700 text-slate-300 rounded-lg transition duration-200"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleConfirmCrop}
            className="px-5 py-2 bg-teal-600 hover:bg-teal-500 text-white font-semibold rounded-lg shadow-md transition duration-200"
          >
            Crop & Continue
          </button>
        </div>
      </div>
    </div>
  );
};

export default PhotoCrop;

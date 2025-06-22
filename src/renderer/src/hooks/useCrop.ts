import { useCallback, useRef, useState } from 'react';

export interface CropRect {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface CropState {
  isActive: boolean;
  isDragging: boolean;
  isHovering: boolean;
  startPoint: { x: number; y: number } | null;
  currentRect: CropRect | null;
  videoDimensions: { width: number; height: number } | null;
}

export function useCrop() {
  const [cropState, setCropState] = useState<CropState>({
    isActive: false,
    isDragging: false,
    isHovering: false,
    startPoint: null,
    currentRect: null,
    videoDimensions: null,
  });

  const containerRef = useRef<HTMLDivElement>(null);

  const getVideoDimensions = useCallback(() => {
    if (!containerRef.current) return null;
    
    const video = containerRef.current.querySelector('video') as HTMLVideoElement;
    if (!video) return null;
    
    return {
      width: video.videoWidth || video.clientWidth,
      height: video.videoHeight || video.clientHeight,
    };
  }, []);

  const getCropFilter = useCallback((cropRect: CropRect | null, videoStream: any) => {
    if (!cropRect || !videoStream) return null;
    
    // Convert from display coordinates to video coordinates
    const displayDimensions = getVideoDimensions();
    if (!displayDimensions) return null;
    
    const scaleX = videoStream.width / displayDimensions.width;
    const scaleY = videoStream.height / displayDimensions.height;
    
    const cropX = Math.round(cropRect.x * scaleX);
    const cropY = Math.round(cropRect.y * scaleY);
    const cropWidth = Math.round(cropRect.width * scaleX);
    const cropHeight = Math.round(cropRect.height * scaleY);
    
    // Ensure crop dimensions are within video bounds
    const finalX = Math.max(0, Math.min(cropX, videoStream.width - 1));
    const finalY = Math.max(0, Math.min(cropY, videoStream.height - 1));
    const finalWidth = Math.max(1, Math.min(cropWidth, videoStream.width - finalX));
    const finalHeight = Math.max(1, Math.min(cropHeight, videoStream.height - finalY));
    
    return `crop=${finalWidth}:${finalHeight}:${finalX}:${finalY}`;
  }, [getVideoDimensions]);

  const startCrop = useCallback(() => {
    const dimensions = getVideoDimensions();
    setCropState(prev => ({
      ...prev,
      isActive: true,
      videoDimensions: dimensions,
    }));
  }, [getVideoDimensions]);

  const stopCrop = useCallback(() => {
    setCropState(prev => ({
      ...prev,
      isActive: false,
      isDragging: false,
      startPoint: null,
    }));
  }, []);

  const clearCrop = useCallback(() => {
    setCropState(prev => ({
      ...prev,
      isActive: false,
      isDragging: false,
      isHovering: false,
      startPoint: null,
      currentRect: null,
    }));
  }, []);

  const setHovering = useCallback((hovering: boolean) => {
    setCropState(prev => ({
      ...prev,
      isHovering: hovering,
    }));
  }, []);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (!cropState.isActive) return;
    
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    setCropState(prev => ({
      ...prev,
      isDragging: true,
      startPoint: { x, y },
      currentRect: { x, y, width: 0, height: 0 },
    }));
  }, [cropState.isActive]);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!cropState.isActive || !cropState.isDragging || !cropState.startPoint) return;
    
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const startX = cropState.startPoint.x;
    const startY = cropState.startPoint.y;
    
    const cropX = Math.min(startX, x);
    const cropY = Math.min(startY, y);
    const cropWidth = Math.abs(x - startX);
    const cropHeight = Math.abs(y - startY);
    
    setCropState(prev => ({
      ...prev,
      currentRect: { x: cropX, y: cropY, width: cropWidth, height: cropHeight },
    }));
  }, [cropState.isActive, cropState.isDragging, cropState.startPoint]);

  const handleMouseUp = useCallback(() => {
    if (!cropState.isActive || !cropState.isDragging) return;

    setCropState(prev => ({
      ...prev,
      isActive: false,
      isDragging: false,
      startPoint: null,
    }));
  }, [cropState.isActive, cropState.isDragging]);

  return {
    cropState,
    containerRef,
    startCrop,
    stopCrop,
    clearCrop,
    getCropFilter,
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
    setHovering,
  };
} 
import React from 'react';
import { CropRect } from '../hooks/useCrop';

interface CropOverlayProps {
  cropRect: CropRect | null;
  isActive: boolean;
  isDragging: boolean;
  isHovering: boolean;
  exportConfirmVisible?: boolean;
  onMouseDown: (e: React.MouseEvent) => void;
  onMouseMove: (e: React.MouseEvent) => void;
  onMouseUp: () => void;
}

export function CropOverlay({ 
  cropRect, 
  isActive, 
  isDragging, 
  isHovering,
  exportConfirmVisible = false,
  onMouseDown, 
  onMouseMove, 
  onMouseUp 
}: CropOverlayProps) {
  // Hide overlay when export confirm is visible
  if (exportConfirmVisible) return null;
  
  // Show overlay when active (drawing), when hovering (preview), or when there's a crop rectangle
  if (!isActive && !isHovering && !cropRect) return null;

  return (
    <div
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        cursor: isDragging ? 'crosshair' : 'crosshair',
        zIndex: 1000,
        pointerEvents: isActive ? 'auto' : 'none',
      }}
      onMouseDown={isActive ? onMouseDown : undefined}
      onMouseMove={isActive ? onMouseMove : undefined}
      onMouseUp={isActive ? onMouseUp : undefined}
    >
      {/* Semi-transparent overlay */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.3)',
          pointerEvents: 'none',
        }}
      />
      
      {/* Crop rectangle */}
      {cropRect && (
        <>
          {/* Crop area (transparent) */}
          <div
            style={{
              position: 'absolute',
              left: cropRect.x,
              top: cropRect.y,
              width: cropRect.width,
              height: cropRect.height,
              border: isActive ? '2px dashed #00f' : '2px solid #00f',
              background: isActive ? 'rgba(0,0,255,0.1)' : 'rgba(0,0,255,0.05)',
              pointerEvents: isActive ? 'auto' : 'none',
            }}
          />
          
          {/* Crop dimensions label */}
          <div
            style={{
              position: 'absolute',
              left: cropRect.x + cropRect.width + 5,
              top: cropRect.y - 25,
              backgroundColor: 'rgba(0, 0, 0, 0.8)',
              color: '#00ff00',
              padding: '2px 6px',
              borderRadius: '3px',
              fontSize: '12px',
              fontFamily: 'monospace',
              pointerEvents: 'none',
              whiteSpace: 'nowrap',
            }}
          >
            {Math.round(cropRect.width)} × {Math.round(cropRect.height)}
          </div>
        </>
      )}
      
      {/* Instructions */}
      {!cropRect && (
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            color: 'white',
            padding: '10px 15px',
            borderRadius: '5px',
            fontSize: '14px',
            pointerEvents: 'none',
            textAlign: 'center',
          }}
        >
          Click and drag to create a crop area
        </div>
      )}
    </div>
  );
} 
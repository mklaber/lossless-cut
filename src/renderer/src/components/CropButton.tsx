import React from 'react';
import { MdCrop } from 'react-icons/md';
import { useTranslation } from 'react-i18next';

interface CropButtonProps {
  isActive: boolean;
  hasCrop: boolean;
  onClick: () => void;
  onClear?: () => void;
  onHover?: (hovering: boolean) => void;
}

export function CropButton({ isActive, hasCrop, onClick, onClear, onHover }: CropButtonProps) {
  const { t } = useTranslation();

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (hasCrop && !isActive && onClear) {
      // If we have a crop but UI is not active, clicking should clear the crop
      onClear();
    } else {
      // Otherwise toggle the crop UI
      onClick();
    }
  };

  const handleMouseEnter = (e: React.MouseEvent) => {
    (e.currentTarget as HTMLButtonElement).style.backgroundColor = isActive ? '#005a9e' : 'rgba(0,0,0,0.1)';
    if (hasCrop && !isActive && onHover) {
      onHover(true);
    }
  };

  const handleMouseLeave = (e: React.MouseEvent) => {
    (e.currentTarget as HTMLButtonElement).style.backgroundColor = isActive ? '#007acc' : 'transparent';
    if (onHover) {
      onHover(false);
    }
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      title={hasCrop && !isActive ? t('Clear crop') : t('Toggle crop mode')}
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '40px',
        height: '40px',
        border: 'none',
        borderRadius: '4px',
        backgroundColor: isActive ? '#007acc' : 'transparent',
        color: isActive ? 'white' : hasCrop ? '#00ff00' : 'var(--gray-12)',
        cursor: 'pointer',
        transition: 'all 0.2s ease',
        marginRight: '8px',
      }}
    >
      <MdCrop size={20} />
    </button>
  );
} 
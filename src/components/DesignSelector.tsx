import React, { useState } from 'react';
import { BoothDesign } from '../types/booth';
import './DesignSelector.css';

interface DesignSelectorProps {
  designs: BoothDesign[];
  selectedDesignId: string | null;
  onDesignSelect: (design: BoothDesign) => void;
}

const DesignSelector: React.FC<DesignSelectorProps> = ({
  designs,
  selectedDesignId,
  onDesignSelect,
}) => {
  const [previewImage, setPreviewImage] = useState<BoothDesign | null>(null);
  const [imageLoading, setImageLoading] = useState<{ [key: string]: boolean }>({});

  // Helper function to strip HTML tags
  const stripHtmlTags = (html: string): string => {
    const tmp = document.createElement('div');
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || '';
  };

  const handleImageClick = (e: React.MouseEvent, design: BoothDesign) => {
    e.stopPropagation();
    setPreviewImage(design);
  };

  const closePreview = () => {
    setPreviewImage(null);
  };

  const handleImageLoad = (designId: string) => {
    setImageLoading(prev => ({ ...prev, [designId]: false }));
  };

  const handleImageLoadStart = (designId: string) => {
    setImageLoading(prev => ({ ...prev, [designId]: true }));
  };

  if (designs.length === 0) {
    return (
      <div className="no-designs">
        <p>No designs available for this booth size.</p>
      </div>
    );
  }

  return (
    <div className="design-selector">
      <h3>Choose Your Booth Design</h3>
      <p className="design-selector-subtitle">
        Select a design that best fits your exhibition needs. Click on images to preview.
      </p>

      <div className="design-grid">
        {designs.map((design) => (
          <div
            key={design.id}
            className={`design-card ${
              selectedDesignId === design.id ? 'selected' : ''
            }`}
            onClick={() => onDesignSelect(design)}
          >
            <div className="design-image-wrapper">
              {imageLoading[design.id] && (
                <div className="image-loader">
                  <div className="spinner"></div>
                </div>
              )}
              <img
                src={design.imagePath}
                alt={design.name}
                className="design-image"
                onLoadStart={() => handleImageLoadStart(design.id)}
                onLoad={() => handleImageLoad(design.id)}
                onError={(e) => {
                  handleImageLoad(design.id);
                  (e.target as HTMLImageElement).src =
                    'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="200" height="150"%3E%3Crect width="200" height="150" fill="%23ddd"/%3E%3Ctext x="50%25" y="50%25" dominant-baseline="middle" text-anchor="middle" fill="%23999"%3ENo Image%3C/text%3E%3C/svg%3E';
                }}
              />
              <div
                className="preview-overlay"
                onClick={(e) => handleImageClick(e, design)}
              >
                <svg
                  width="32"
                  height="32"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="11" cy="11" r="8"></circle>
                  <path d="m21 21-4.35-4.35"></path>
                  <path d="M11 8v6"></path>
                  <path d="M8 11h6"></path>
                </svg>
                <span>Click to Preview</span>
              </div>
              {selectedDesignId === design.id && (
                <div className="selected-badge">
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                </div>
              )}
            </div>

            <div className="design-info">
              <h4 className="design-name">{design.name}</h4>
              {design.description && (
                <p className="design-description">
                  {stripHtmlTags(design.description)}
                </p>
              )}
              <div className="design-price">
                <span className="price-label">Price:</span>
                <span className="price-amount">
                  ${design.price.toLocaleString()}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {previewImage && (
        <div className="image-preview-modal" onClick={closePreview}>
          <div className="preview-modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="preview-close-btn" onClick={closePreview}>
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
            <div className="preview-image-container">
              <img
                src={previewImage.imagePath}
                alt={previewImage.name}
                className="preview-image"
              />
            </div>
            <div className="preview-details">
              <h3>{previewImage.name}</h3>
              <p className="preview-size">{previewImage.size}</p>
              {previewImage.description && (
                <p className="preview-description">
                  {stripHtmlTags(previewImage.description)}
                </p>
              )}
              <div className="preview-price">
                <span className="preview-price-label">Price:</span>
                <span className="preview-price-amount">
                  ${previewImage.price.toLocaleString()}
                </span>
              </div>
              <button
                className="preview-select-btn"
                onClick={() => {
                  onDesignSelect(previewImage);
                  closePreview();
                }}
              >
                {selectedDesignId === previewImage.id ? 'Selected' : 'Select This Design'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DesignSelector;

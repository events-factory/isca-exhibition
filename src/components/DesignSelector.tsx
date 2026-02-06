import React from 'react';
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
  // Helper function to strip HTML tags
  const stripHtmlTags = (html: string): string => {
    const tmp = document.createElement('div');
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || '';
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
        Select a design that best fits your exhibition needs
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
              <img
                src={design.imagePath}
                alt={design.name}
                className="design-image"
                onError={(e) => {
                  (e.target as HTMLImageElement).src =
                    'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="200" height="150"%3E%3Crect width="200" height="150" fill="%23ddd"/%3E%3Ctext x="50%25" y="50%25" dominant-baseline="middle" text-anchor="middle" fill="%23999"%3ENo Image%3C/text%3E%3C/svg%3E';
                }}
              />
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
    </div>
  );
};

export default DesignSelector;

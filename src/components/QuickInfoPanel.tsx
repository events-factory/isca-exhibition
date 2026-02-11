import React from 'react';
import { Booth } from '../types/booth';
import './QuickInfoPanel.css';

interface QuickInfoPanelProps {
  selectedBooths: Booth[];
  totalPrice: number;
  onRemoveBooth: (boothId: string) => void;
  onClearAll: () => void;
}

const QuickInfoPanel: React.FC<QuickInfoPanelProps> = ({
  selectedBooths,
  totalPrice,
  onRemoveBooth,
  onClearAll,
}) => {
  if (selectedBooths.length === 0) return null;

  return (
    <div className="quick-info-panel">
      <div className="quick-info-header">
        <div className="quick-info-title">
          <span>Selected Booths ({selectedBooths.length})</span>
        </div>
        <button
          className="quick-info-clear"
          onClick={onClearAll}
          title="Clear all selections"
        >
          ✕
        </button>
      </div>

      <div className="quick-info-list">
        {selectedBooths.map((booth) => (
          <div key={booth.id} className="quick-info-item">
            <div className="quick-info-item-header">
              <span className="quick-info-booth-number">#{booth.id}</span>
              <button
                className="quick-info-remove"
                onClick={() => onRemoveBooth(booth.id)}
                title="Remove booth"
              >
                ✕
              </button>
            </div>
            <div className="quick-info-item-details">
              <span className="quick-info-detail">
                <span className="quick-info-label">Size:</span>
                <span className="quick-info-value">{booth.size}</span>
              </span>
              <span className="quick-info-detail">
                <span className="quick-info-label">Price:</span>
                <span className="quick-info-value">
                  ${booth.price?.toLocaleString() || 'N/A'}
                </span>
              </span>
            </div>
          </div>
        ))}
      </div>

      <div className="quick-info-footer">
        <div className="quick-info-total">
          <span className="quick-info-total-label">Total:</span>
          <span className="quick-info-total-value">
            ${totalPrice.toLocaleString()}
          </span>
        </div>
      </div>
    </div>
  );
};

export default QuickInfoPanel;

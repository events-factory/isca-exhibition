import React from 'react';
import { Booth, BOOTH_CATEGORIES } from '../types/booth';
import './SelectionBadge.css';

interface SelectionBadgeProps {
  selectedBooths: Booth[];
  totalPrice: number;
  onClick: () => void;
}

const SelectionBadge: React.FC<SelectionBadgeProps> = ({
  selectedBooths,
  totalPrice,
  onClick,
}) => {
  if (selectedBooths.length === 0) {
    return null;
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    }).format(price);
  };

  return (
    <div className="selection-badge" onClick={onClick}>
      <div className="badge-content">
        <div className="badge-icon">
          <span className="booth-count">{selectedBooths.length}</span>
        </div>
        <div className="badge-info">
          <span className="badge-label">
            {selectedBooths.length === 1 ? 'Booth' : 'Booths'} Selected
          </span>
          {totalPrice > 0 && (
            <span className="badge-price">{formatPrice(totalPrice)}</span>
          )}
        </div>
        <div className="badge-arrow">›</div>
      </div>
      <div className="badge-booths">
        {selectedBooths.slice(0, 5).map((booth) => {
          const category = BOOTH_CATEGORIES.find((c) => c.id === booth.category);
          return (
            <span
              key={booth.id}
              className="booth-chip"
              style={{ backgroundColor: category?.color || '#666' }}
            >
              {booth.id}
            </span>
          );
        })}
        {selectedBooths.length > 5 && (
          <span className="booth-chip more">+{selectedBooths.length - 5}</span>
        )}
      </div>
    </div>
  );
};

export default SelectionBadge;

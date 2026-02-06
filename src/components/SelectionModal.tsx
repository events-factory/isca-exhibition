import React from 'react';
import { Booth, BOOTH_CATEGORIES } from '../types/booth';
import './SelectionModal.css';

interface SelectionModalProps {
  isOpen: boolean;
  selectedBooths: Booth[];
  totalPrice: number;
  onClose: () => void;
  onRemoveBooth: (boothId: string) => void;
  onClearAll: () => void;
  onProceedToBooking: () => void;
}

const SelectionModal: React.FC<SelectionModalProps> = ({
  isOpen,
  selectedBooths,
  totalPrice,
  onClose,
  onRemoveBooth,
  onClearAll,
  onProceedToBooking,
}) => {
  if (!isOpen) return null;

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const getCategoryInfo = (categoryId: number) => {
    return BOOTH_CATEGORIES.find((c) => c.id === categoryId);
  };

  return (
    <div className="selection-modal-overlay" onClick={onClose}>
      <div className="selection-modal" onClick={(e) => e.stopPropagation()}>
        <div className="selection-modal-header">
          <h2>Selected Booths ({selectedBooths.length})</h2>
          <button className="close-btn" onClick={onClose}>
            &times;
          </button>
        </div>

        <div className="selection-modal-body">
          {selectedBooths.length === 0 ? (
            <div className="empty-selection">
              <p>No booths selected</p>
              <p className="hint">Click on booths in the floor plan to select them</p>
            </div>
          ) : (
            <ul className="booth-list">
              {selectedBooths.map((booth) => {
                const category = getCategoryInfo(booth.category);
                return (
                  <li key={booth.id} className="booth-item">
                    <div
                      className="booth-color"
                      style={{ backgroundColor: category?.color || '#666' }}
                    />
                    <div className="booth-details">
                      <div className="booth-header">
                        <span className="booth-id">Booth {booth.id}</span>
                        <span className="booth-size">{booth.size}</span>
                      </div>
                      <div className="booth-meta">
                        <span className="booth-category">{category?.name}</span>
                        <span className="booth-location">{booth.location}</span>
                      </div>
                      {booth.price && (
                        <div className="booth-price">{formatPrice(booth.price)}</div>
                      )}
                    </div>
                    <button
                      className="remove-btn"
                      onClick={() => onRemoveBooth(booth.id)}
                      title="Remove booth"
                    >
                      &times;
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        {selectedBooths.length > 0 && (
          <div className="selection-modal-footer">
            <div className="footer-left">
              <button className="clear-btn" onClick={onClearAll}>
                Clear All
              </button>
            </div>
            <div className="footer-right">
              {totalPrice > 0 && (
                <div className="total-price">
                  <span className="total-label">Estimated Total:</span>
                  <span className="total-amount">{formatPrice(totalPrice)}</span>
                </div>
              )}
              <button className="proceed-btn" onClick={onProceedToBooking}>
                Proceed to Booking
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SelectionModal;

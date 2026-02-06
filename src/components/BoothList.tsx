import React from 'react';
import { Booth, BOOTH_CATEGORIES } from '../types/booth';
import './BoothList.css';

interface BoothListProps {
  booths: Booth[];
  onBoothSelect: (boothId: string) => void;
  selectedBoothIds?: string[];
}

const BoothList: React.FC<BoothListProps> = ({
  booths,
  onBoothSelect,
  selectedBoothIds = [],
}) => {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'available':
        return '🟢';
      case 'booked':
        return '🔴';
      case 'reserved':
        return '🟡';
      default:
        return '⚪';
    }
  };

  const getCategoryColor = (categoryId: number) => {
    return (
      BOOTH_CATEGORIES.find((cat) => cat.id === categoryId)?.color || '#ccc'
    );
  };

  const sortedBooths = [...booths].sort((a, b) => {
    const numA = parseInt(a.id);
    const numB = parseInt(b.id);
    return numA - numB;
  });

  return (
    <div className="booth-list-container">
      <h3>Available Booths</h3>
      <div className="booth-list-stats">
        <span className="stat">
          Total: <strong>{booths.length}</strong>
        </span>
        <span className="stat available">
          Available:{' '}
          <strong>
            {booths.filter((b) => b.status === 'available').length}
          </strong>
        </span>
        <span className="stat booked">
          Booked:{' '}
          <strong>{booths.filter((b) => b.status === 'booked').length}</strong>
        </span>
      </div>

      <div className="booth-list">
        {sortedBooths.map((booth) => (
          <div
            key={booth.id}
            className={`booth-list-item ${booth.status} ${
              selectedBoothIds.includes(booth.id) ? 'selected' : ''
            }`}
            onClick={() => onBoothSelect(booth.id)}
          >
            <div className="booth-header">
              <span className="booth-number">
                <span
                  className="category-indicator"
                  style={{ backgroundColor: getCategoryColor(booth.category) }}
                />
                Booth {booth.id}
              </span>
              <span className="booth-status">
                {getStatusIcon(booth.status)}
              </span>
            </div>
            <div className="booth-info">
              <span className="booth-size">{booth.size}</span>
              <span className="booth-location">{booth.location}</span>
            </div>
            {booth.bookedBy && (
              <div className="booth-booked-info">📋 {booth.bookedBy}</div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default BoothList;

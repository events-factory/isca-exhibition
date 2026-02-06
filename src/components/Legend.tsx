import React from 'react';
import { BOOTH_CATEGORIES } from '../types/booth';
import './Legend.css';

interface LegendProps {
  selectedCategory: number | null;
  onCategoryClick: (categoryId: number) => void;
}

const Legend: React.FC<LegendProps> = ({
  selectedCategory,
  onCategoryClick,
}) => {
  return (
    <div className="legend-container">
      <h3>Booth Categories</h3>

      <div className="legend-items">
        {BOOTH_CATEGORIES.map((category) => (
          <div
            key={category.id}
            className={`legend-item ${
              selectedCategory === category.id ? 'selected' : ''
            }`}
            onClick={() => onCategoryClick(category.id)}
          >
            <div
              className="legend-color"
              style={{ backgroundColor: category.color }}
            />
            <div className="legend-info">
              <div className="legend-name">{category.name}</div>
              <div className="legend-size">{category.size}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="legend-status">
        <h4>Status</h4>
        <div className="status-item">
          <div className="status-dot available" />
          <span>Available</span>
        </div>
        <div className="status-item">
          <div className="status-dot booked" />
          <span>Booked</span>
        </div>
        <div className="status-item">
          <div className="status-dot reserved" />
          <span>Reserved</span>
        </div>
      </div>
    </div>
  );
};

export default Legend;

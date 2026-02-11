import React, { useState } from 'react';
import './FilterPanel.css';

export interface BoothFilters {
  status: ('available' | 'booked' | 'reserved')[];
  minPrice: number | null;
  maxPrice: number | null;
  sizes: string[];
}

interface FilterPanelProps {
  onFilterChange: (filters: BoothFilters) => void;
  availableSizes: string[];
  priceRange: { min: number; max: number };
}

const FilterPanel: React.FC<FilterPanelProps> = ({
  onFilterChange,
  availableSizes,
  priceRange,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [filters, setFilters] = useState<BoothFilters>({
    status: [],
    minPrice: null,
    maxPrice: null,
    sizes: [],
  });

  const handleStatusToggle = (status: 'available' | 'booked' | 'reserved') => {
    const newStatuses = filters.status.includes(status)
      ? filters.status.filter((s) => s !== status)
      : [...filters.status, status];

    const newFilters = { ...filters, status: newStatuses };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handleSizeToggle = (size: string) => {
    const newSizes = filters.sizes.includes(size)
      ? filters.sizes.filter((s) => s !== size)
      : [...filters.sizes, size];

    const newFilters = { ...filters, sizes: newSizes };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handlePriceChange = (type: 'min' | 'max', value: string) => {
    const numValue = value === '' ? null : Number(value);
    const newFilters = {
      ...filters,
      [type === 'min' ? 'minPrice' : 'maxPrice']: numValue,
    };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handleClearFilters = () => {
    const clearedFilters = {
      status: [],
      minPrice: null,
      maxPrice: null,
      sizes: [],
    };
    setFilters(clearedFilters);
    onFilterChange(clearedFilters);
  };

  const hasActiveFilters =
    filters.status.length > 0 ||
    filters.sizes.length > 0 ||
    filters.minPrice !== null ||
    filters.maxPrice !== null;

  return (
    <div className={`filter-panel ${isExpanded ? 'expanded' : ''}`}>
      <button
        className="filter-toggle"
        onClick={() => setIsExpanded(!isExpanded)}
        title={isExpanded ? 'Hide filters' : 'Show filters'}
      >
        <span className="filter-icon">⚙️</span>
        <span className="filter-label">Filters</span>
        {hasActiveFilters && <span className="filter-badge">{
          filters.status.length + filters.sizes.length +
          (filters.minPrice !== null ? 1 : 0) +
          (filters.maxPrice !== null ? 1 : 0)
        }</span>}
      </button>

      {isExpanded && (
        <div className="filter-content">
          <div className="filter-header">
            <h3>Filter Booths</h3>
            {hasActiveFilters && (
              <button className="filter-clear-all" onClick={handleClearFilters}>
                Clear All
              </button>
            )}
          </div>

          {/* Status Filter */}
          <div className="filter-section">
            <h4 className="filter-section-title">Availability</h4>
            <div className="filter-options">
              <label className="filter-checkbox">
                <input
                  type="checkbox"
                  checked={filters.status.includes('available')}
                  onChange={() => handleStatusToggle('available')}
                />
                <span className="filter-checkbox-label">
                  <span className="status-dot status-available"></span>
                  Available
                </span>
              </label>
              <label className="filter-checkbox">
                <input
                  type="checkbox"
                  checked={filters.status.includes('booked')}
                  onChange={() => handleStatusToggle('booked')}
                />
                <span className="filter-checkbox-label">
                  <span className="status-dot status-booked"></span>
                  Booked
                </span>
              </label>
              <label className="filter-checkbox">
                <input
                  type="checkbox"
                  checked={filters.status.includes('reserved')}
                  onChange={() => handleStatusToggle('reserved')}
                />
                <span className="filter-checkbox-label">
                  <span className="status-dot status-reserved"></span>
                  Reserved
                </span>
              </label>
            </div>
          </div>

          {/* Price Filter */}
          <div className="filter-section">
            <h4 className="filter-section-title">Price Range (USD)</h4>
            <div className="filter-price-inputs">
              <input
                type="number"
                className="filter-price-input"
                placeholder={`Min ($${priceRange.min.toLocaleString()})`}
                value={filters.minPrice ?? ''}
                onChange={(e) => handlePriceChange('min', e.target.value)}
              />
              <span className="filter-price-separator">-</span>
              <input
                type="number"
                className="filter-price-input"
                placeholder={`Max ($${priceRange.max.toLocaleString()})`}
                value={filters.maxPrice ?? ''}
                onChange={(e) => handlePriceChange('max', e.target.value)}
              />
            </div>
          </div>

          {/* Size Filter */}
          {availableSizes.length > 0 && (
            <div className="filter-section">
              <h4 className="filter-section-title">Booth Size</h4>
              <div className="filter-options filter-size-grid">
                {availableSizes.map((size) => (
                  <label key={size} className="filter-checkbox filter-size-option">
                    <input
                      type="checkbox"
                      checked={filters.sizes.includes(size)}
                      onChange={() => handleSizeToggle(size)}
                    />
                    <span className="filter-size-label">{size}</span>
                  </label>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default FilterPanel;

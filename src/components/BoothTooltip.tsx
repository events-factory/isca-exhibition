import React from 'react';
import { Booth } from '../types/booth';
import './BoothTooltip.css';

interface BoothTooltipProps {
  booth: Booth | null;
  x: number;
  y: number;
  visible: boolean;
}

const BoothTooltip: React.FC<BoothTooltipProps> = ({ booth, x, y, visible }) => {
  if (!visible || !booth) return null;

  // Format price with currency (USD)
  const formattedPrice = booth.price
    ? `$${booth.price.toLocaleString()}`
    : 'Price not available';

  // Status badge color
  const statusColor = {
    available: '#28a745',
    booked: '#dc3545',
    reserved: '#ffc107'
  }[booth.status] || '#6c757d';

  // Sanitize description - remove HTML tags
  const sanitizeDescription = (text: string | undefined): string | null => {
    if (!text) return null;
    // Remove HTML tags
    const cleaned = text.replace(/<[^>]*>/g, ' ').trim();
    // If it's just the booth code and size info, don't show it (redundant)
    if (cleaned.includes('BOOTH') && cleaned.includes('SQM')) {
      return null;
    }
    return cleaned;
  };

  const cleanDescription = sanitizeDescription(booth.description);

  return (
    <div
      className="booth-tooltip"
      style={{
        left: `${x + 15}px`,
        top: `${y + 15}px`
      }}
    >
      <div className="booth-tooltip-header">
        <span className="booth-tooltip-number">Booth {booth.id}</span>
        <span
          className="booth-tooltip-status"
          style={{ backgroundColor: statusColor }}
        >
          {booth.status}
        </span>
      </div>
      <div className="booth-tooltip-body">
        <div className="booth-tooltip-row">
          <span className="booth-tooltip-label">Size:</span>
          <span className="booth-tooltip-value">{booth.size}</span>
        </div>
        <div className="booth-tooltip-row">
          <span className="booth-tooltip-label">Price:</span>
          <span className="booth-tooltip-value">{formattedPrice}</span>
        </div>
        {cleanDescription && (
          <div className="booth-tooltip-description">
            {cleanDescription}
          </div>
        )}
      </div>
      {booth.status === 'available' && (
        <div className="booth-tooltip-hint">
          Click to select
        </div>
      )}
    </div>
  );
};

export default BoothTooltip;

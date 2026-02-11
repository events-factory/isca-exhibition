import React from 'react';
import './Minimap.css';

interface MinimapProps {
  scale: number;
  position: { x: number; y: number };
  containerWidth: number;
  containerHeight: number;
  onNavigate: (x: number, y: number) => void;
}

const Minimap: React.FC<MinimapProps> = ({
  scale,
  position,
  containerWidth,
  containerHeight,
  onNavigate,
}) => {
  const minimapSize = 150; // Fixed size of minimap
  const svgWidth = 1200; // Approximate SVG width (adjust based on your SVG)
  const svgHeight = 800; // Approximate SVG height

  // Calculate viewport rectangle in minimap coordinates
  const viewportWidth = containerWidth / scale;
  const viewportHeight = containerHeight / scale;

  // Scale factors for minimap
  const scaleX = minimapSize / svgWidth;
  const scaleY = minimapSize / svgHeight;

  // Viewport position (inverted from pan position)
  const viewportX = (-position.x / scale) * scaleX;
  const viewportY = (-position.y / scale) * scaleY;
  const viewportW = (viewportWidth * scaleX);
  const viewportH = (viewportHeight * scaleY);

  const handleMinimapClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;

    // Convert minimap coordinates to floor plan coordinates
    const targetX = (clickX / scaleX) * scale;
    const targetY = (clickY / scaleY) * scale;

    // Center the clicked point
    const newX = -(targetX - containerWidth / 2);
    const newY = -(targetY - containerHeight / 2);

    // Apply boundary constraints
    const maxOffset = 500;
    const minOffset = -500;
    const constrainedX = Math.min(Math.max(newX, minOffset), maxOffset);
    const constrainedY = Math.min(Math.max(newY, minOffset), maxOffset);

    onNavigate(constrainedX, constrainedY);
  };

  return (
    <div className="minimap-container">
      <div className="minimap-title">Map Overview</div>
      <div
        className="minimap"
        style={{ width: minimapSize, height: minimapSize }}
        onClick={handleMinimapClick}
      >
        {/* Background representing floor plan */}
        <div className="minimap-background">
          <div className="minimap-grid"></div>
        </div>

        {/* Viewport indicator */}
        <div
          className="minimap-viewport"
          style={{
            left: `${Math.max(0, Math.min(viewportX, minimapSize))}px`,
            top: `${Math.max(0, Math.min(viewportY, minimapSize))}px`,
            width: `${Math.min(viewportW, minimapSize)}px`,
            height: `${Math.min(viewportH, minimapSize)}px`,
          }}
        />

        {/* Zoom indicator */}
        <div className="minimap-zoom-indicator">
          {Math.round(scale * 100)}%
        </div>
      </div>
    </div>
  );
};

export default Minimap;

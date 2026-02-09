import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { Booth, BoothDesign, INITIAL_BOOTHS, PaymentMethod } from '../types/booth';
import BookingModal from './BookingModal';
import Legend from './Legend';
import BoothList from './BoothList';
import SelectionBadge from './SelectionBadge';
import SelectionModal from './SelectionModal';
import { fetchExhibitionPackages, fetchProductDetails } from '../services/api';
import './FloorPlan.css';

const FloorPlan: React.FC = () => {
  const [booths, setBooths] = useState<Booth[]>(INITIAL_BOOTHS);
  // Multi-selection state
  const [selectedBooths, setSelectedBooths] = useState<Booth[]>([]);
  const [boothDesigns, setBoothDesigns] = useState<Map<string, BoothDesign>>(new Map());
  const [showSelectionModal, setShowSelectionModal] = useState(false);
  const [showBookingModal, setShowBookingModal] = useState(false);

  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [showBoothList, setShowBoothList] = useState(false);
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [lastTouchDistance, setLastTouchDistance] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const svgContainerRef = useRef<HTMLDivElement>(null);

  // Refs for stable SVG event handlers (prevents duplicate listener issues)
  const selectedBoothsRef = useRef<Booth[]>([]);
  const selectedCategoryRef = useRef<number | null>(null);
  const boothsRef = useRef<Booth[]>(INITIAL_BOOTHS);
  const handleBoothToggleRef = useRef<(boothId: string) => void>(() => {});

  // Fetch exhibition packages from API on mount
  useEffect(() => {
    const loadExhibitionData = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await fetchExhibitionPackages();

        // Transform API products into booth format
        if (data.products && data.products.length > 0) {
          // Build a size-to-product map for matching booths by size category
          const sizeToProduct = new Map<string, typeof data.products[0]>();
          for (const product of data.products) {
            // Extract size pattern from product sizes (e.g., "2m*3m" -> "3x2", "3m*3m" -> "3x3")
            const sizeMatch = product.sizes?.match(/(\d+)m?\*(\d+)m?/);
            if (sizeMatch) {
              const [, w, h] = sizeMatch;
              // Normalize: larger dimension first (e.g., "2m*3m" -> "3x2")
              const a = Math.max(Number(w), Number(h));
              const b = Math.min(Number(w), Number(h));
              sizeToProduct.set(`${a}x${b}`, product);
            }
          }

          const enrichedBooths = INITIAL_BOOTHS.map((booth) => {
            // Try booth_numbers matching first
            let matchedProduct = data.products.find(
              (product) =>
                product.booth_numbers &&
                Array.isArray(product.booth_numbers) &&
                product.booth_numbers.includes(booth.id)
            );

            // Fallback: match by booth size (e.g., "3mx2m" -> "3x2")
            if (!matchedProduct) {
              const boothSizeMatch = booth.size.match(/(\d+)mx(\d+)m/);
              if (boothSizeMatch) {
                const a = Math.max(Number(boothSizeMatch[1]), Number(boothSizeMatch[2]));
                const b = Math.min(Number(boothSizeMatch[1]), Number(boothSizeMatch[2]));
                matchedProduct = sizeToProduct.get(`${a}x${b}`);
              }
            }

            if (matchedProduct) {
              const price = parseFloat(matchedProduct.prices);
              return {
                ...booth,
                price: isNaN(price) ? booth.price : price,
                productCode: matchedProduct.product_code,
                description: matchedProduct.description_english,
                apiProduct: matchedProduct,
              };
            }

            return booth;
          });

          setBooths(enrichedBooths);

          // Fetch payment methods from first product's details endpoint
          const firstProductId = data.products[0].id;
          if (firstProductId) {
            fetchProductDetails(firstProductId)
              .then((details) => {
                if (details.payment_method && Array.isArray(details.payment_method)) {
                  setPaymentMethods(details.payment_method);
                }
              })
              .catch(() => {});
          }
        }
      } catch (err) {
        console.error('Failed to load exhibition data:', err);
        setError('Failed to load booth data. Using default booths.');
        // Keep using INITIAL_BOOTHS as fallback
      } finally {
        setLoading(false);
      }
    };

    loadExhibitionData();
  }, []);

  // Toggle booth selection (add/remove from selection)
  const handleBoothToggle = useCallback(
    (boothId: string) => {
      const booth = booths.find((b) => b.id === boothId);
      if (!booth || booth.status !== 'available') return;

      setSelectedBooths((prev) => {
        const exists = prev.find((b) => b.id === boothId);
        return exists
          ? prev.filter((b) => b.id !== boothId)
          : [...prev, booth];
      });
    },
    [booths]
  );

  // Keep refs in sync for stable SVG event handlers
  selectedBoothsRef.current = selectedBooths;
  selectedCategoryRef.current = selectedCategory;
  boothsRef.current = booths;
  handleBoothToggleRef.current = handleBoothToggle;

  // Remove a specific booth from selection
  const handleRemoveBooth = useCallback((boothId: string) => {
    setSelectedBooths((prev) => prev.filter((b) => b.id !== boothId));
    // Also remove any design associated with this booth
    setBoothDesigns((prev) => {
      const newMap = new Map(prev);
      newMap.delete(boothId);
      return newMap;
    });
  }, []);

  // Clear all selections
  const clearSelections = useCallback(() => {
    setSelectedBooths([]);
    setBoothDesigns(new Map());
  }, []);

  // Proceed to booking modal
  const proceedToBooking = useCallback(() => {
    if (selectedBooths.length > 0) {
      setShowSelectionModal(false);
      setShowBookingModal(true);
    }
  }, [selectedBooths.length]);

  // Calculate total price
  const totalPrice = useMemo(() => {
    return selectedBooths.reduce((sum, booth) => {
      const design = boothDesigns.get(booth.id);
      return sum + (design?.price || booth.price || 0);
    }, 0);
  }, [selectedBooths, boothDesigns]);

  // Handle booking completion for multiple booths
  const handleBooking = useCallback(
    (
      boothIds: string[],
      customerName: string,
      email: string,
      designs: Map<string, { designId: string; designPrice: number }>
    ) => {
      setBooths((prevBooths) =>
        prevBooths.map((booth) => {
          if (boothIds.includes(booth.id)) {
            const design = designs.get(booth.id);
            return {
              ...booth,
              status: 'booked' as const,
              bookedBy: customerName,
              designId: design?.designId,
              designPrice: design?.designPrice,
            };
          }
          return booth;
        })
      );
      // Clear selections after booking
      clearSelections();
      setShowBookingModal(false);
    },
    [clearSelections]
  );

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();

    // Get the mouse position relative to the container
    const container = svgContainerRef.current;
    if (!container) return;

    const rect = container.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    // Calculate zoom
    const delta = e.deltaY * -0.001;
    const newScale = Math.min(Math.max(0.5, scale + delta), 5);

    // Zoom towards mouse position
    const scaleRatio = newScale / scale;
    const newX = mouseX - (mouseX - position.x) * scaleRatio;
    const newY = mouseY - (mouseY - position.y) * scaleRatio;

    setScale(newScale);
    setPosition({ x: newX, y: newY });
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button === 0) {
      // Left mouse button
      setIsDragging(true);
      setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y });
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging) {
      setPosition({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y,
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Touch event handlers for mobile
  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 1) {
      // Single touch - start dragging
      setIsDragging(true);
      setDragStart({
        x: e.touches[0].clientX - position.x,
        y: e.touches[0].clientY - position.y,
      });
    } else if (e.touches.length === 2) {
      // Two fingers - prepare for pinch zoom
      const distance = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY
      );
      setLastTouchDistance(distance);
      setIsDragging(false);
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    e.preventDefault();

    if (e.touches.length === 1 && isDragging) {
      // Single touch - drag
      setPosition({
        x: e.touches[0].clientX - dragStart.x,
        y: e.touches[0].clientY - dragStart.y,
      });
    } else if (e.touches.length === 2 && lastTouchDistance) {
      // Two fingers - pinch zoom
      const distance = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY
      );

      const container = svgContainerRef.current;
      if (!container) return;

      // Calculate center point between two fingers
      const centerX = (e.touches[0].clientX + e.touches[1].clientX) / 2;
      const centerY = (e.touches[0].clientY + e.touches[1].clientY) / 2;
      const rect = container.getBoundingClientRect();
      const touchX = centerX - rect.left;
      const touchY = centerY - rect.top;

      // Calculate new scale based on distance change
      const scaleChange = distance / lastTouchDistance;
      const newScale = Math.min(Math.max(0.5, scale * scaleChange), 5);

      // Zoom towards touch center
      const scaleRatio = newScale / scale;
      const newX = touchX - (touchX - position.x) * scaleRatio;
      const newY = touchY - (touchY - position.y) * scaleRatio;

      setScale(newScale);
      setPosition({ x: newX, y: newY });
      setLastTouchDistance(distance);
    }
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
    setLastTouchDistance(null);
  };

  const resetView = () => {
    setScale(1);
    setPosition({ x: 0, y: 0 });
  };

  const handleCategoryClick = (categoryId: number) => {
    setSelectedCategory(selectedCategory === categoryId ? null : categoryId);
  };

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent context menu when dragging
  };

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Zoom in: + or =
      if (e.key === '+' || e.key === '=') {
        e.preventDefault();
        setScale((s) => Math.min(s + 0.2, 5));
      }
      // Zoom out: - or _
      else if (e.key === '-' || e.key === '_') {
        e.preventDefault();
        setScale((s) => Math.max(s - 0.2, 0.5));
      }
      // Reset view: 0 or r
      else if (e.key === '0' || e.key.toLowerCase() === 'r') {
        e.preventDefault();
        resetView();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);


  // Add click handlers to SVG elements and booth text labels
  useEffect(() => {
    const container = svgContainerRef.current;
    if (!container) return;

    // Wait for SVG to load (when using object tag)
    const objectElement = container.querySelector(
      'object'
    ) as HTMLObjectElement;
    if (!objectElement) return;

    const checkSvgLoaded = () => {
      const svgDoc = objectElement.contentDocument;
      if (!svgDoc) {
        setTimeout(checkSvgLoaded, 100);
        return;
      }

      const svg = svgDoc.querySelector('svg');
      if (!svg) {
        setTimeout(checkSvgLoaded, 100);
        return;
      }

      // Add styling to SVG to enable interactions
      const style = svgDoc.createElementNS('http://www.w3.org/2000/svg', 'style');
      style.textContent = `
        text[class*="cls-"] {
          cursor: pointer;
          transition: all 0.2s;
        }
        text[class*="cls-"]:hover {
          opacity: 0.7;
          filter: drop-shadow(0 0 10px rgba(0, 150, 255, 0.8));
        }
        .booth-text-highlight {
          font-weight: bold;
          fill: #fff !important;
        }
        .booth-dimmed {
          opacity: 0.2;
        }
        .booth-dynamic-highlight {
          pointer-events: none;
        }
        @keyframes boothPulse {
          0%, 100% { fill-opacity: 0.85; }
          50% { fill-opacity: 1; }
        }
        .booth-dynamic-highlight {
          animation: boothPulse 2s ease-in-out infinite;
        }
      `;
      // SVG documents don't have <head>, append style to <svg> root
      svg.appendChild(style);

      // Find all text elements that contain booth numbers
      const textElements = svgDoc.querySelectorAll('text');

      const updateBoothHighlighting = () => {
        // Remove all previously created dynamic highlight rects
        svgDoc.querySelectorAll('.booth-dynamic-highlight').forEach((el: Element) => el.remove());

        textElements.forEach((textElement) => {
          const textContent = textElement.textContent?.trim();

          // Check if this text element contains a booth number (1-2 digits)
          if (textContent && /^\d{1,2}$/.test(textContent)) {
            // Normalize booth ID: pad single digits with leading zero (e.g., "2" -> "02")
            const boothId = textContent.length === 1 ? `0${textContent}` : textContent;
            const booth = boothsRef.current.find((b) => b.id === boothId);
            const isSelected = selectedBoothsRef.current.some((b) => b.id === boothId);

            // Remove highlight classes from text
            textElement.classList.remove(
              'booth-text-highlight',
              'booth-dimmed'
            );

            // Helper: create a highlight rect behind the text element
            const createHighlightRect = (color: string, strokeColor: string) => {
              try {
                const bbox = (textElement as SVGTextElement).getBBox();
                const transform = textElement.getAttribute('transform') || '';
                const padding = 12;
                const rect = svgDoc.createElementNS('http://www.w3.org/2000/svg', 'rect');
                rect.setAttribute('x', String(bbox.x - padding));
                rect.setAttribute('y', String(bbox.y - padding));
                rect.setAttribute('width', String(bbox.width + padding * 2));
                rect.setAttribute('height', String(bbox.height + padding * 2));
                rect.setAttribute('rx', '6');
                rect.setAttribute('ry', '6');
                rect.setAttribute('transform', transform);
                rect.setAttribute('fill', color);
                rect.setAttribute('stroke', strokeColor);
                rect.setAttribute('stroke-width', '3');
                rect.classList.add('booth-dynamic-highlight');
                // Insert before the text so it renders behind it
                textElement.parentElement?.insertBefore(rect, textElement);
              } catch (e) {
                // getBBox may fail if element is not rendered
              }
            };

            // Priority: Selected > Category filter > Default
            if (isSelected) {
              createHighlightRect('#007bff', '#0056b3');
              textElement.classList.add('booth-text-highlight');
            } else if (booth && selectedCategoryRef.current !== null) {
              if (booth.category === selectedCategoryRef.current) {
                textElement.classList.add('booth-text-highlight');
                let bgColor = '#28a745'; // available (green)
                if (booth.status === 'booked') {
                  bgColor = '#dc3545'; // red
                } else if (booth.status === 'reserved') {
                  bgColor = '#ffc107'; // yellow
                }
                createHighlightRect(bgColor, bgColor);
              } else {
                textElement.classList.add('booth-dimmed');
              }
            }
          }
        });
      };

      // Store reference for later updates
      (svgDoc as any).__updateBoothHighlighting = updateBoothHighlighting;

      // Create a hitbox layer on top of everything for click targets
      const hitboxGroup = svgDoc.createElementNS('http://www.w3.org/2000/svg', 'g');
      hitboxGroup.setAttribute('class', 'booth-hitboxes');
      svg.appendChild(hitboxGroup);

      const processedBoothIds = new Set<string>();

      textElements.forEach((textElement) => {
        const textContent = textElement.textContent?.trim();

        // Check if this text element contains a booth number (1-2 digits)
        if (textContent && /^\d{1,2}$/.test(textContent)) {
          const boothId = textContent.length === 1 ? `0${textContent}` : textContent;

          // Skip if we already created a hitbox for this booth ID
          if (processedBoothIds.has(boothId)) return;
          processedBoothIds.add(boothId);

          const handleClick = (e: Event) => {
            e.preventDefault();
            e.stopPropagation();

            const booth = boothsRef.current.find((b) => b.id === boothId);
            if (booth && booth.status === 'available') {
              handleBoothToggleRef.current(boothId);
            }
          };

          // Create a large invisible hitbox rect at the text position
          try {
            const bbox = (textElement as SVGTextElement).getBBox();
            const transform = textElement.getAttribute('transform') || '';
            const hitboxPadding = 35;

            const hitbox = svgDoc.createElementNS('http://www.w3.org/2000/svg', 'rect');
            hitbox.setAttribute('x', String(bbox.x - hitboxPadding));
            hitbox.setAttribute('y', String(bbox.y - hitboxPadding));
            hitbox.setAttribute('width', String(bbox.width + hitboxPadding * 2));
            hitbox.setAttribute('height', String(bbox.height + hitboxPadding * 2));
            hitbox.setAttribute('rx', '6');
            hitbox.setAttribute('ry', '6');
            hitbox.setAttribute('transform', transform);
            hitbox.setAttribute('fill', 'transparent');
            hitbox.setAttribute('stroke', 'none');
            hitbox.style.cursor = 'pointer';
            hitbox.style.pointerEvents = 'all';
            hitbox.addEventListener('click', handleClick);
            hitboxGroup.appendChild(hitbox);
          } catch {
            // Fallback: attach to text element directly
            textElement.addEventListener('click', handleClick);
            textElement.style.cursor = 'pointer';
          }
        }
      });

      // Initial highlighting update
      updateBoothHighlighting();

      // Also add hover effects to legend rectangles in the SVG
      const legendRects = svgDoc.querySelectorAll('rect[class*="cls-"]');
      legendRects.forEach((rect) => {
        const rectElement = rect as SVGRectElement;
        const width = parseFloat(rectElement.getAttribute('width') || '0');
        const height = parseFloat(rectElement.getAttribute('height') || '0');

        // Only interact with small legend boxes (approximate size)
        if (width < 150 && height < 150 && width > 50) {
          rectElement.style.cursor = 'pointer';
          rectElement.addEventListener('mouseenter', () => {
            rectElement.style.opacity = '0.7';
          });
          rectElement.addEventListener('mouseleave', () => {
            rectElement.style.opacity = '1';
          });
        }
      });
    };

    // Start checking if SVG is loaded
    if (objectElement.contentDocument) {
      checkSvgLoaded();
    } else {
      objectElement.addEventListener('load', checkSvgLoaded);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Update highlighting when selection or category changes
  useEffect(() => {
    const container = svgContainerRef.current;
    if (!container) return;

    const objectElement = container.querySelector('object') as HTMLObjectElement;
    if (!objectElement) return;

    const svgDoc = objectElement.contentDocument;
    if (!svgDoc) return;

    const updateFn = (svgDoc as any).__updateBoothHighlighting;
    if (updateFn) {
      updateFn();
    }
  }, [selectedCategory, booths, selectedBooths]);

  return (
    <div className="floor-plan-container">
      <div className="controls">
        <h1>ISCA 2026 - Exhibition Floor Plan</h1>
        <div className="control-buttons">
          {loading && <span style={{ color: '#666' }}>Loading booths...</span>}
          {error && (
            <span style={{ color: '#dc3545', fontSize: '12px' }}>{error}</span>
          )}
          <button onClick={() => setShowBoothList(!showBoothList)}>
            {showBoothList ? '✕ Hide' : '☰ Show'} Booth List
          </button>
          <button onClick={() => setScale((s) => Math.min(s + 0.2, 5))}>
            Zoom In
          </button>
          <button onClick={() => setScale((s) => Math.max(s - 0.2, 0.5))}>
            Zoom Out
          </button>
          <button onClick={resetView}>Reset View</button>
          <span className="zoom-level">Zoom: {Math.round(scale * 100)}%</span>
          <span className="keyboard-hint" title="Keyboard shortcuts: +/- to zoom, 0 or R to reset">
            ⌨️
          </span>
        </div>
      </div>

      <div className="main-content">
        {showBoothList && (
          <BoothList
            booths={booths}
            onBoothSelect={handleBoothToggle}
            selectedBoothIds={selectedBooths.map((b) => b.id)}
          />
        )}

        <div
          className="svg-container"
          ref={svgContainerRef}
          onWheel={handleWheel}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          onContextMenu={handleContextMenu}
          style={{ cursor: isDragging ? 'grabbing' : 'grab' }}
        >
          <div
            className={`svg-wrapper ${!isDragging ? 'smooth-transition' : ''}`}
            style={{
              transform: `translate(${position.x}px, ${position.y}px) scale(${scale})`,
            }}
          >
            <object
              data="/Booth3.svg"
              type="image/svg+xml"
              className="floor-plan-svg"
            >
              Your browser does not support SVG
            </object>
          </div>
        </div>

        <Legend
          selectedCategory={selectedCategory}
          onCategoryClick={handleCategoryClick}
        />
      </div>

      {/* Selection Badge - shows when booths are selected */}
      <SelectionBadge
        selectedBooths={selectedBooths}
        totalPrice={totalPrice}
        onClick={() => setShowSelectionModal(true)}
      />

      {/* Selection Modal - view and manage selected booths */}
      <SelectionModal
        isOpen={showSelectionModal}
        selectedBooths={selectedBooths}
        totalPrice={totalPrice}
        onClose={() => setShowSelectionModal(false)}
        onRemoveBooth={handleRemoveBooth}
        onClearAll={clearSelections}
        onProceedToBooking={proceedToBooking}
      />

      {/* Booking Modal - complete the booking */}
      <BookingModal
        booths={selectedBooths}
        isOpen={showBookingModal}
        onClose={() => setShowBookingModal(false)}
        onBook={handleBooking}
        availablePaymentMethods={paymentMethods}
      />
    </div>
  );
};

export default FloorPlan;

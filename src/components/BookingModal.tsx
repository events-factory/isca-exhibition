import React, { useState, useMemo, useEffect } from 'react';
import {
  Booth,
  BOOTH_CATEGORIES,
  BoothDesign,
  BOOTH_DESIGNS,
} from '../types/booth';
import DesignSelector from './DesignSelector';
import PaymentModal from './PaymentModal';
import {
  submitBooking,
  BookingFormData,
  validatePaymentMethod,
  fetchProductDetails,
} from '../services/api';
import { PaymentMethod } from '../types/booth';
import './BookingModal.css';

interface BookingModalProps {
  booths: Booth[];
  isOpen: boolean;
  onClose: () => void;
  onBook: (
    boothIds: string[],
    customerName: string,
    email: string,
    designs: Map<string, { designId: string; designPrice: number }>
  ) => void;
  availablePaymentMethods?: PaymentMethod[];
}

const BookingModal: React.FC<BookingModalProps> = ({
  booths,
  isOpen,
  onClose,
  onBook,
  availablePaymentMethods,
}) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedDesigns, setSelectedDesigns] = useState<Map<string, BoothDesign>>(new Map());
  const [expandedBoothId, setExpandedBoothId] = useState<string | null>(null);
  const [customerName, setCustomerName] = useState('');
  const [email, setEmail] = useState('');
  const [company, setCompany] = useState('');
  const [phone, setPhone] = useState('');
  const [country, setCountry] = useState('');
  const [message, setMessage] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('');
  const [paymentToken, setPaymentToken] = useState('');
  const [paymentSession, setPaymentSession] = useState('');
  const [orderId, setOrderId] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);

  // Expand first booth by default
  useEffect(() => {
    if (booths.length > 0 && !expandedBoothId) {
      setExpandedBoothId(booths[0].id);
    }
  }, [booths, expandedBoothId]);

  // Use payment methods from prop (initial API response), fallback to product details fetch
  useEffect(() => {
    if (availablePaymentMethods && availablePaymentMethods.length > 0) {
      setPaymentMethods(availablePaymentMethods);
      return;
    }

    const firstBooth = booths[0];
    const productId = firstBooth?.apiProduct?.id || firstBooth?.apiProduct?.product_code;
    if (productId) {
      fetchProductDetails(productId)
        .then((details) => {
          if (details.payment_method && Array.isArray(details.payment_method)) {
            setPaymentMethods(details.payment_method);
          }
        })
        .catch((error) => {
          console.error('Failed to load payment methods:', error);
        });
    }
  }, [booths, availablePaymentMethods]);

  // Get available designs for a specific booth
  const getAvailableDesigns = (booth: Booth): BoothDesign[] => {
    if (booth.apiProduct && booth.apiProduct.banner) {
      return [
        {
          id: booth.apiProduct.product_code || 'banner-1',
          name: booth.apiProduct.name_english,
          size: booth.size,
          imagePath: booth.apiProduct.banner,
          price: booth.price || 0,
          description: booth.apiProduct.description_english,
        },
      ];
    }

    if (booth.apiProduct?.banners?.length) {
      return booth.apiProduct.banners.map((banner, index) => ({
        id: banner.id || `banner-${index}`,
        name: booth.apiProduct?.name_english || `Design ${index + 1}`,
        size: booth.size,
        imagePath: banner.banner,
        price: booth.price || 0,
        description: banner.description || booth.apiProduct?.description_english,
      }));
    }

    const sizePattern = booth.size.match(/(\d+x\d+)/)?.[1];
    return BOOTH_DESIGNS.filter((design) => {
      const designPattern = design.size.match(/(\d+)mx(\d+)m/);
      if (designPattern && sizePattern) {
        const normalizedDesignSize = `${designPattern[1]}x${designPattern[2]}`;
        return normalizedDesignSize === sizePattern;
      }
      return design.size === booth.size;
    });
  };

  // Calculate total price
  const totalPrice = useMemo(() => {
    return booths.reduce((sum, booth) => {
      const design = selectedDesigns.get(booth.id);
      return sum + (design?.price || booth.price || 0);
    }, 0);
  }, [booths, selectedDesigns]);

  // Check if all booths have designs selected
  const allDesignsSelected = useMemo(() => {
    return booths.every((booth) => selectedDesigns.has(booth.id));
  }, [booths, selectedDesigns]);

  if (!isOpen || booths.length === 0) return null;

  const handleDesignSelect = (boothId: string, design: BoothDesign) => {
    setSelectedDesigns((prev) => {
      const newMap = new Map(prev);
      newMap.set(boothId, design);
      return newMap;
    });
  };

  const handleNextStep = () => {
    if (currentStep === 1 && allDesignsSelected) {
      setCurrentStep(2);
    } else if (currentStep === 2) {
      setCurrentStep(3);
    }
  };

  const handlePreviousStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName.trim() || !email.trim() || !allDesignsSelected) return;

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      // Use first booth for payment validation
      const firstBooth = booths[0];
      const productKey = firstBooth.apiProduct?.product_code || firstBooth.id;

      const validationData: BookingFormData = {
        product_key: productKey,
        name: customerName,
        email: email,
        phone: phone,
        company: company,
        country: country,
        message: message,
        quantity: booths.length.toString(),
        booth_numbers: booths.map((b) => b.id), // Array of booth IDs
        payment_method: paymentMethod,
      };

      const validation = await validatePaymentMethod(validationData);

      if (!validation.data?.result) {
        setSubmitError('This payment method is not currently accepted.');
        setIsSubmitting(false);
        return;
      }

      if (validation.data.direct_payment === 'true') {
        setIsSubmitting(false);
        setShowPaymentModal(true);
        return;
      }

      await submitAllBookings();
    } catch (error: any) {
      console.error('Payment validation error:', error);
      setSubmitError('Failed to validate payment method. Please try again.');
      setIsSubmitting(false);
    }
  };

  const submitAllBookings = async () => {
    setIsSubmitting(true);
    setSubmitError(null);

    try {
      // Use first booth's product_key (all booths in this context should be same type)
      const productKey = booths[0].apiProduct?.product_code || booths[0].id;

      // Collect all booth numbers
      const boothNumbers = booths.map((booth) => booth.id);

      // Submit single booking request with all booth numbers
      const bookingData: BookingFormData = {
        product_key: productKey,
        name: customerName,
        email: email,
        phone: phone,
        company: company,
        country: country,
        message: message,
        quantity: booths.length.toString(), // Total number of booths
        booth_numbers: boothNumbers, // Array of booth IDs
        payment_method: paymentMethod,
        payment_token: paymentToken || undefined,
        payment_session: paymentSession || undefined,
        order_id: orderId || undefined,
      };

      await submitBooking(bookingData);

      // Build designs map for parent callback
      const designsMap = new Map<string, { designId: string; designPrice: number }>();
      selectedDesigns.forEach((design, boothId) => {
        designsMap.set(boothId, { designId: design.id, designPrice: design.price });
      });

      onBook(booths.map((b) => b.id), customerName, email, designsMap);
      resetForm();
      onClose();
    } catch (error: any) {
      console.error('Error submitting bookings:', error);
      setSubmitError('Failed to submit booking. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePaymentSuccess = (newOrderId: string, token: string, sessionId: string) => {
    setOrderId(newOrderId);
    setPaymentToken(token);
    setPaymentSession(sessionId);
    setShowPaymentModal(false);
    submitAllBookings();
  };

  const handlePaymentError = (error: string) => {
    setSubmitError(`Payment failed: ${error}`);
    setShowPaymentModal(false);
  };

  const resetForm = () => {
    setCurrentStep(1);
    setSelectedDesigns(new Map());
    setExpandedBoothId(booths[0]?.id || null);
    setCustomerName('');
    setEmail('');
    setCompany('');
    setPhone('');
    setCountry('');
    setMessage('');
    setPaymentMethod('');
    setPaymentToken('');
    setPaymentSession('');
    setOrderId('');
    setSubmitError(null);
  };

  const handleClose = () => {
    onClose();
    setTimeout(resetForm, 300);
  };

  const getCategoryInfo = (categoryId: number) => {
    return BOOTH_CATEGORIES.find((c) => c.id === categoryId);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    }).format(price);
  };

  return (
    <div className="modal-overlay" onClick={handleClose}>
      <div className="modal-content booking-wizard multi-booth" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={handleClose}>&times;</button>

        <h2>Book {booths.length} {booths.length === 1 ? 'Booth' : 'Booths'}</h2>

        {/* Step indicator */}
        <div className="step-indicator">
          <div className={`step ${currentStep >= 1 ? 'active' : ''} ${currentStep > 1 ? 'completed' : ''}`}>
            <div className="step-number">1</div>
            <div className="step-label">Choose Designs</div>
          </div>
          <div className="step-line"></div>
          <div className={`step ${currentStep >= 2 ? 'active' : ''} ${currentStep > 2 ? 'completed' : ''}`}>
            <div className="step-number">2</div>
            <div className="step-label">Your Details</div>
          </div>
          <div className="step-line"></div>
          <div className={`step ${currentStep >= 3 ? 'active' : ''}`}>
            <div className="step-number">3</div>
            <div className="step-label">Review & Pay</div>
          </div>
        </div>

        {/* Step 1: Design Selection per booth */}
        {currentStep === 1 && (
          <div className="step-content">
            <div className="booth-accordion">
              {booths.map((booth) => {
                const category = getCategoryInfo(booth.category);
                const selectedDesign = selectedDesigns.get(booth.id);
                const isExpanded = expandedBoothId === booth.id;
                const designs = getAvailableDesigns(booth);

                return (
                  <div key={booth.id} className={`accordion-item ${isExpanded ? 'expanded' : ''}`}>
                    <div
                      className="accordion-header"
                      onClick={() => setExpandedBoothId(isExpanded ? null : booth.id)}
                    >
                      <div className="accordion-booth-info">
                        <span
                          className="category-dot"
                          style={{ backgroundColor: category?.color }}
                        />
                        <span className="booth-name">Booth {booth.id}</span>
                        <span className="booth-size-tag">{booth.size}</span>
                      </div>
                      <div className="accordion-status">
                        {selectedDesign ? (
                          <span className="design-selected">
                            {selectedDesign.name} - {formatPrice(selectedDesign.price)}
                          </span>
                        ) : (
                          <span className="design-pending">Select design</span>
                        )}
                        <span className="accordion-arrow">{isExpanded ? '▼' : '▶'}</span>
                      </div>
                    </div>
                    {isExpanded && (
                      <div className="accordion-body">
                        <DesignSelector
                          designs={designs}
                          selectedDesignId={selectedDesign?.id || null}
                          onDesignSelect={(design) => handleDesignSelect(booth.id, design)}
                        />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            <div className="selection-summary">
              <div className="summary-row">
                <span>Booths selected:</span>
                <strong>{booths.length}</strong>
              </div>
              <div className="summary-row">
                <span>Designs configured:</span>
                <strong>{selectedDesigns.size} / {booths.length}</strong>
              </div>
              <div className="summary-row total">
                <span>Estimated Total:</span>
                <strong>{formatPrice(totalPrice)}</strong>
              </div>
            </div>

            <div className="form-actions">
              <button type="button" onClick={handleClose} className="btn-cancel">
                Cancel
              </button>
              <button
                type="button"
                onClick={handleNextStep}
                className="btn-next"
                disabled={!allDesignsSelected}
              >
                Next: Your Details →
              </button>
            </div>
          </div>
        )}

        {/* Step 2: Customer Details */}
        {currentStep === 2 && (
          <div className="step-content">
            <form className="booking-form" onSubmit={(e) => { e.preventDefault(); handleNextStep(); }}>
              <div className="form-group">
                <label htmlFor="name">Contact Name *</label>
                <input
                  type="text"
                  id="name"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  required
                  placeholder="John Doe"
                />
              </div>

              <div className="form-group">
                <label htmlFor="email">Email *</label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="john@company.com"
                />
              </div>

              <div className="form-group">
                <label htmlFor="company">Company</label>
                <input
                  type="text"
                  id="company"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  placeholder="Company Name"
                />
              </div>

              <div className="form-group">
                <label htmlFor="phone">Phone *</label>
                <input
                  type="tel"
                  id="phone"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                  placeholder="+1 234 567 8900"
                />
              </div>

              <div className="form-group">
                <label htmlFor="country">Country</label>
                <input
                  type="text"
                  id="country"
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  placeholder="Country"
                />
              </div>

              <div className="form-group">
                <label htmlFor="message">Message</label>
                <textarea
                  id="message"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Additional information or requirements"
                  rows={3}
                />
              </div>

              <div className="form-actions">
                <button type="button" onClick={handlePreviousStep} className="btn-back">
                  ← Back
                </button>
                <button
                  type="submit"
                  className="btn-next"
                  disabled={!customerName.trim() || !email.trim() || !phone.trim()}
                >
                  Next: Review & Pay →
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Step 3: Review & Pay */}
        {currentStep === 3 && (
          <div className="step-content">
            <div className="order-review">
              <h3>Order Summary</h3>

              <div className="review-booths">
                {booths.map((booth) => {
                  const category = getCategoryInfo(booth.category);
                  const design = selectedDesigns.get(booth.id);
                  return (
                    <div key={booth.id} className="review-booth-item">
                      <div className="review-booth-header">
                        <span
                          className="category-dot"
                          style={{ backgroundColor: category?.color }}
                        />
                        <span>Booth {booth.id}</span>
                        <span className="booth-size-tag">{booth.size}</span>
                      </div>
                      <div className="review-booth-design">
                        {design && (
                          <>
                            <span className="design-name">{design.name}</span>
                            <span className="design-price">{formatPrice(design.price)}</span>
                          </>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="review-customer">
                <h4>Contact Information</h4>
                <p><strong>{customerName}</strong></p>
                <p>{email}</p>
                {company && <p>{company}</p>}
                <p>{phone}</p>
                {country && <p>{country}</p>}
              </div>

              <div className="review-total">
                <span>Total Amount:</span>
                <strong>{formatPrice(totalPrice)}</strong>
              </div>

              <div className="form-group">
                <label htmlFor="paymentMethod">Payment Method *</label>
                <select
                  id="paymentMethod"
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  required
                >
                  <option value="">Select Payment Method</option>
                  {paymentMethods.map((method) => (
                    <option key={method.id} value={method.id}>
                      {method.contentEnglish}
                    </option>
                  ))}
                </select>
              </div>

              <div className="payment-deadline-notice">
                <div className="notice-icon">⚠️</div>
                <div className="notice-content">
                  <strong>Important Payment Notice:</strong>
                  <p>
                    These booths must be paid within <strong>5 days</strong> of
                    booking, or they will be automatically released.
                  </p>
                </div>
              </div>

              {submitError && <div className="error-message">{submitError}</div>}

              <div className="form-actions">
                <button
                  type="button"
                  onClick={handlePreviousStep}
                  className="btn-back"
                  disabled={isSubmitting}
                >
                  ← Back
                </button>
                <button
                  type="button"
                  onClick={handleSubmit}
                  className="btn-submit"
                  disabled={isSubmitting || !paymentMethod}
                >
                  {isSubmitting ? 'Processing...' : `Pay ${formatPrice(totalPrice)}`}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Payment Modal */}
      {showPaymentModal && booths.length > 0 && (
        <PaymentModal
          isOpen={showPaymentModal}
          onClose={() => setShowPaymentModal(false)}
          amount={totalPrice}
          currency="USD"
          customerEmail={email}
          customerName={customerName}
          productKey={booths[0].apiProduct?.product_code || booths[0].id}
          quantity={booths.length.toString()}
          onSuccess={handlePaymentSuccess}
          onError={handlePaymentError}
        />
      )}
    </div>
  );
};

export default BookingModal;

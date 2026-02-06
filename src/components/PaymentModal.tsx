import React, { useEffect, useState } from 'react';
import {
  loadCheckoutScript,
  showEmbeddedCheckout,
  initializePaymentSession,
  generateOrderId,
} from '../services/payment';
import './PaymentModal.css';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  amount: number;
  currency: string;
  customerEmail: string;
  customerName: string;
  productKey: string;
  quantity: string;
  onSuccess: (orderId: string, paymentToken: string, sessionId: string) => void;
  onError: (error: string) => void;
}

const PaymentModal: React.FC<PaymentModalProps> = ({
  isOpen,
  onClose,
  amount,
  currency,
  customerEmail,
  customerName,
  productKey,
  quantity,
  onSuccess,
  onError,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [orderId, setOrderId] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [showPaymentForm, setShowPaymentForm] = useState(false);

  const setupCallbacks = React.useCallback(
    (expectedToken: string, ordId: string, sessId: string) => {
      // Error callback
      window.errorCallback = (error: any) => {
        setError(error['error.explanation'] || 'Payment processing error');
        onError(error['error.explanation'] || 'Payment failed');
      };

      // Cancel callback
      window.cancelCallback = () => {
        setError('Payment was cancelled');
      };

      // Complete callback
      window.completeCallback = (result: any) => {
        if (result.resultIndicator === expectedToken) {
          // Payment successful
          onSuccess(ordId, result.resultIndicator, sessId);
          onClose();
        } else {
          setError('Payment verification failed. Please try again.');
          onError('Payment verification failed');
        }
      };
    },
    [onError, onSuccess, onClose]
  );

  const initializePayment = React.useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      // Load checkout script
      await loadCheckoutScript();

      // Initialize payment session - backend generates the order ID
      const session = await initializePaymentSession({
        amount,
        currency,
        order_id: '', // Not used - backend generates it
        customer_email: customerEmail,
        customer_name: customerName,
        product_key: productKey,
        quantity: quantity,
      });

      console.log('Payment session initialized:', session);
      console.log('Session ID:', session.session_id);
      console.log('Result Indicator:', session.result_indicator);
      console.log('Backend Order ID:', session.order_id);

      if (!session.session_id) {
        throw new Error('Invalid session ID received from gateway');
      }

      // Use the order ID from backend
      setOrderId(session.order_id);

      // Show payment form
      setShowPaymentForm(true);

      // Configure callbacks with backend's order ID
      setupCallbacks(
        session.result_indicator,
        session.order_id,
        session.session_id
      );

      // Show embedded checkout
      setTimeout(() => {
        console.log(
          'Showing embedded checkout with session:',
          session.session_id
        );
        showEmbeddedCheckout(session.session_id, '#payment-target');
      }, 100);
    } catch (err) {
      console.error('Payment initialization error:', err);
      setError('Unable to initialize payment. Please try again.');
      onError('Failed to initialize payment gateway');
    } finally {
      setIsLoading(false);
    }
  }, [
    amount,
    currency,
    customerEmail,
    customerName,
    productKey,
    quantity,
    onError,
    setupCallbacks,
  ]);

  useEffect(() => {
    if (isOpen) {
      initializePayment();
    }

    return () => {
      // Cleanup
      setShowPaymentForm(false);
      setError(null);
    };
  }, [isOpen, initializePayment]);

  const handleRetry = () => {
    setError(null);
    setShowPaymentForm(false);
    initializePayment();
  };

  const handleClose = () => {
    if (!isLoading) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="payment-modal-overlay" onClick={handleClose}>
      <div
        className="payment-modal-content"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          className="payment-modal-close"
          onClick={handleClose}
          disabled={isLoading}
        >
          &times;
        </button>

        <h2>Complete Payment</h2>

        <div className="payment-summary">
          <div className="summary-row">
            <span>Amount:</span>
            <strong>
              {currency} {amount.toLocaleString()}
            </strong>
          </div>
          {orderId && (
            <div className="summary-row">
              <span>Order ID:</span>
              <strong>{orderId}</strong>
            </div>
          )}
        </div>

        {isLoading && (
          <div className="payment-loading">
            <div className="spinner"></div>
            <p>Initializing secure payment...</p>
          </div>
        )}

        {error && (
          <div className="payment-error">
            <div className="error-icon">⚠️</div>
            <p>{error}</p>
            <button onClick={handleRetry} className="btn-retry">
              Try Again
            </button>
          </div>
        )}

        {showPaymentForm && !error && (
          <div className="payment-form-container">
            <div id="payment-target"></div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PaymentModal;

/**
 * Payment Gateway Service
 * Handles Mastercard payment gateway integration
 */

export interface PaymentSessionResponse {
  session_id: string;
  result_indicator: string;
  success_indicator?: string;
  order_id: string;
}

export interface PaymentInitData {
  amount: number;
  currency: string;
  order_id: string;
  customer_email: string;
  customer_name: string;
  product_key: string;
  quantity: string;
}

// Gateway credentials are now handled by backend API
// const GATEWAY_USERNAME = process.env.REACT_APP_GATEWAY_USERNAME || '';
// const GATEWAY_PASSWORD = process.env.REACT_APP_GATEWAY_PASSWORD || '';
// const GATEWAY_URL = process.env.REACT_APP_GATEWAY_URL || '';

/**
 * Initialize a payment session with the gateway via backend API
 * @param paymentData - Payment initialization data
 * @returns Promise with session details
 */
export const initializePaymentSession = async (
  paymentData: PaymentInitData
): Promise<PaymentSessionResponse> => {
  try {
    // Import the API service
    const { initiateGatewaySession } = await import('./api');

    // Call backend API to initialize session
    const result = await initiateGatewaySession(
      paymentData.product_key,
      paymentData.quantity
    );

    console.log('Raw result from API:', JSON.stringify(result, null, 2));
    console.log('result.data:', result.data);
    console.log(
      'result.data.payment_session type:',
      typeof result.data.payment_session
    );
    console.log(
      'result.data.payment_session value:',
      result.data.payment_session
    );

    if (result.data.result !== 'SUCCESS') {
      throw new Error('Payment gateway session initialization failed');
    }

    // Extract session ID - might be nested or need parsing
    let sessionId = result.data.payment_session;

    // Check if payment_session is an object with an 'id' field
    if (typeof sessionId === 'object' && sessionId !== null) {
      console.log('payment_session is an object:', sessionId);
      sessionId =
        sessionId.id ||
        sessionId.sessionId ||
        sessionId.session_id ||
        JSON.stringify(sessionId);
    }

    console.log('Final session ID to use:', sessionId);
    console.log('Backend orderId:', result.data.orderId);

    return {
      session_id: sessionId,
      result_indicator: result.data.token,
      success_indicator: result.data.token,
      order_id: result.data.orderId,
    };
  } catch (error) {
    console.error('Error initializing payment session:', error);
    throw error;
  }
};

/**
 * Load the Mastercard Checkout script
 * @returns Promise that resolves when script is loaded
 */
export const loadCheckoutScript = (): Promise<void> => {
  return new Promise((resolve, reject) => {
    // Check if already loaded
    if (window.Checkout) {
      console.log('Checkout.js already loaded');
      console.log('Checkout object:', window.Checkout);
      resolve();
      return;
    }

    console.log(
      'Loading Checkout.js from:',
      process.env.REACT_APP_GATEWAY_URL_JS
    );
    const script = document.createElement('script');
    script.src = process.env.REACT_APP_GATEWAY_URL_JS || '';
    script.async = true;
    script.setAttribute('data-error', 'errorCallback');
    script.setAttribute('data-cancel', 'cancelCallback');
    script.setAttribute('data-complete', 'completeCallback');

    script.onload = () => {
      console.log('Checkout.js loaded successfully');
      console.log('window.Checkout available:', !!window.Checkout);
      console.log('Checkout object:', window.Checkout);
      resolve();
    };
    script.onerror = (error) => {
      console.error('Failed to load Checkout.js script:', error);
      reject(new Error('Failed to load payment script'));
    };

    document.body.appendChild(script);
  });
};

/**
 * Configure and show the embedded payment page
 * @param sessionId - Payment session ID from gateway
 * @param targetElement - HTML element ID to render payment form
 */
export const showEmbeddedCheckout = (
  sessionId: string,
  targetElement: string
) => {
  console.log('showEmbeddedCheckout called with:', {
    sessionId,
    targetElement,
  });
  console.log('window.Checkout exists:', !!window.Checkout);

  if (!window.Checkout) {
    console.error('Checkout script not loaded!');
    throw new Error('Checkout script not loaded');
  }

  console.log('Configuring Checkout with session:', {
    session: { id: sessionId },
  });

  try {
    window.Checkout.configure({
      session: {
        id: sessionId,
      },
    });
    console.log('Checkout.configure() completed successfully');
  } catch (error) {
    console.error('Error in Checkout.configure():', error);
    throw error;
  }

  console.log('Calling Checkout.showEmbeddedPage:', targetElement);
  try {
    window.Checkout.showEmbeddedPage(targetElement);
    console.log('Checkout.showEmbeddedPage() completed');
  } catch (error) {
    console.error('Error in Checkout.showEmbeddedPage():', error);
    throw error;
  }
};

/**
 * Generate a unique order ID
 * @returns Order ID string
 */
export const generateOrderId = (): string => {
  const timestamp = Date.now();
  const random = Math.floor(Math.random() * 10000);
  return `BOOTH-${timestamp}-${random}`;
};

// Global callback types for Mastercard Checkout
declare global {
  interface Window {
    Checkout?: {
      configure: (config: { session: { id: string } }) => void;
      showEmbeddedPage: (element: string) => void;
      showLightbox: () => void;
      showPaymentPage: () => void;
    };
    errorCallback?: (error: any) => void;
    cancelCallback?: () => void;
    completeCallback?: (result: any) => void;
  }
}

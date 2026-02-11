import { ApiResponse } from '../types/booth';

// Use relative URL in development (proxied), absolute URL in production
const API_BASE_URL = process.env.NODE_ENV === 'development'
  ? '/Api'
  : 'https://app.smartevent.rw/Api';
const EVENT_CODE = 'fIl6s21JDIrd8r/ORz/EgzlBY1VQUlplSXhEemtvMnFpVUJKdGc9PQ==';

/**
 * Fetches exhibition packages from the API
 * @returns Promise with the API response containing event details and products
 */
export const fetchExhibitionPackages = async (): Promise<ApiResponse> => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/Get-Exibition-Packages-Full/List-All`,
      {
        method: 'GET',
        headers: {
          Authorization: EVENT_CODE,
        },
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: ApiResponse = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching exhibition packages:', error);
    throw error;
  }
};

/**
 * Fetch product details including payment methods
 * @param productId - Product ID to fetch details for
 * @returns Promise with product details including payment methods
 */
export const fetchProductDetails = async (productId: string): Promise<any> => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/Get-Exibition-Packages-Full/Details/${productId}`,
      {
        method: 'GET',
        headers: {
          Authorization: EVENT_CODE,
        },
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching product details:', error);
    throw error;
  }
};

/**
 * Fetch booked booth numbers for a product
 * @param productCode - Product code to fetch bookings for
 * @returns Promise with array of booked booth numbers
 */
export interface BookingRecord {
  [index: number]: string;
}

export interface BookingsResponse {
  message: string;
  draw: number;
  recordsTotal: number;
  recordsFiltered: number;
  data: BookingRecord[];
}

export const fetchBookedBooths = async (productCode: string): Promise<string[]> => {
  try {
    const url = `${API_BASE_URL}/Get-Exhibition-Bookings/GetBookings/${productCode}?draw=1&start=0&length=1000`;
    console.log('Fetching bookings for product code:', productCode);
    console.log('Booking URL:', url);

    const response = await fetch(url, {
      method: 'GET',
      credentials: 'include', // Include cookies for authentication
    });

    console.log('Booking response status:', response.status);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: BookingsResponse = await response.json();
    console.log('Booking response data:', data);

    // Extract booth numbers from booking records
    // Booth numbers are in the format "06,07,08" at index 14 of each record
    const bookedBooths: string[] = [];

    if (data.data && Array.isArray(data.data)) {
      data.data.forEach((record) => {
        const boothNumbersString = record[14]; // Index 14 contains booth numbers
        if (boothNumbersString && typeof boothNumbersString === 'string') {
          // Handle both single booth numbers and comma-separated lists
          // e.g., "06" or "06,07,08"
          const booths = boothNumbersString.split(',').map(b => b.trim()).filter(b => b);
          bookedBooths.push(...booths);
        }
      });
    }

    console.log('Extracted booked booth numbers:', bookedBooths);
    return bookedBooths;
  } catch (error) {
    console.error('Error fetching booked booths:', error);
    return []; // Return empty array on error, don't block the app
  }
};

/**
 * Helper function to map size string to category number
 * @param size - Size string like "3x2m 6sqm"
 * @returns Category number 1-6
 */
export const sizeToCategory = (size: string): 1 | 2 | 3 | 4 | 5 | 6 => {
  const sizeMap: { [key: string]: 1 | 2 | 3 | 4 | 5 | 6 } = {
    '3x2': 1,
    '3x3': 2,
    '6x3': 3,
    '9x3': 4,
    '12x3': 5,
    '10x10': 6,
  };

  // Extract size pattern from the string (e.g., "3x2m 6sqm" -> "3x2")
  const sizePattern = size.match(/(\d+x\d+)/)?.[1];

  if (sizePattern && sizeMap[sizePattern]) {
    return sizeMap[sizePattern];
  }

  // Default to category 2 if no match
  return 2;
};

/**
 * Submit booth booking with all form data
 * @param formData - Object containing all booking form fields
 * @returns Promise with the API response
 */
export interface BookingFormData {
  product_key: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  country: string;
  message: string;
  quantity: string;
  payment_method: string;
  booth_numbers: string[]; // Array of booth IDs being booked
  payment_token?: string;
  payment_session?: string;
  order_id?: string;
}

export const submitBooking = async (
  formData: BookingFormData
): Promise<any> => {
  try {
    const data = new FormData();

    // Add all form fields in exact order as reference
    data.append('product_key', formData.product_key);
    data.append('name', formData.name);
    data.append('email', formData.email);
    data.append('phone', formData.phone);
    data.append('company', formData.company);
    data.append('country', formData.country || '');
    data.append('message', formData.message || '');
    data.append('event_code', EVENT_CODE); // First event_code (from getFormInputData)
    data.append('quantity', formData.quantity);
    data.append('payment_method', formData.payment_method);

    // Add booth numbers as comma-separated string (backend expects string, not array)
    data.append('booth_numbers', formData.booth_numbers.join(','));

    data.append('field_name', 'exhibition_email_english');
    data.append('application', 'exhibition');
    data.append('payment_token', formData.payment_token || '');
    data.append('payment_session', formData.payment_session || '');
    data.append('order_id', formData.order_id || '');
    data.append('event_code', EVENT_CODE); // Second event_code (from submitForm)
    data.append('appication_id', 'Exhibition'); // Note: typo matches API requirement
    data.append('product_key', formData.product_key); // Second product_key as per API requirement

    // Log all FormData entries for debugging
    console.log('=== Booking Form Data ===');
    for (const [key, value] of data.entries()) {
      console.log(`${key}:`, value);
    }
    console.log('========================');

    const response = await fetch(`${API_BASE_URL}/Book-Exibition-Packages`, {
      method: 'POST',
      headers: {
        Authorization: EVENT_CODE,
      },
      body: data,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.error('Error submitting booking:', error);
    throw error;
  }
};

/**
 * Validate payment method before processing
 * @param formData - Booking form data
 * @returns Promise with validation result
 */
export const validatePaymentMethod = async (
  formData: BookingFormData
): Promise<any> => {
  try {
    const data = new FormData();

    // Add all form fields
    data.append('product_key', formData.product_key);
    data.append('name', formData.name);
    data.append('email', formData.email);
    data.append('phone', formData.phone);
    data.append('company', formData.company);
    data.append('country', formData.country || '');
    data.append('message', formData.message || '');
    data.append('quantity', formData.quantity);
    data.append('payment_method', formData.payment_method);

    // Add booth numbers as comma-separated string (backend expects string, not array)
    data.append('booth_numbers', formData.booth_numbers.join(','));

    data.append('event_code', EVENT_CODE);
    data.append('field_name', 'exhibition_email_english');
    data.append('application', 'exhibition');
    data.append('appication_id', 'Exhibition');

    const response = await fetch(`${API_BASE_URL}/Validate-Payment-Method`, {
      method: 'POST',
      body: data,
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw errorData;
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.error('Error validating payment method:', error);
    throw error;
  }
};

/**
 * Initialize payment gateway session
 * @param productKey - Product identifier
 * @param quantity - Quantity to purchase
 * @returns Promise with payment session details
 */
export interface PaymentSessionResponse {
  data: {
    result: string;
    token: string;
    payment_session: string;
    orderId: string;
  };
}

export const initiateGatewaySession = async (
  productKey: string,
  quantity: string
): Promise<PaymentSessionResponse> => {
  try {
    const data = new FormData();
    data.append('product_id', productKey);
    data.append('quantity', quantity);
    data.append('event_code', EVENT_CODE);
    data.append('application', 'exhibition');

    const response = await fetch(`${API_BASE_URL}/Initiate-Gateway-Session`, {
      method: 'POST',
      body: data,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.error('Error initiating gateway session:', error);
    throw error;
  }
};

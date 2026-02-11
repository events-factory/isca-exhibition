// API Response Types
export interface ApiProductBanner {
  id: string;
  banner: string;
  description?: string;
}

export interface ApiProduct {
  id?: string;
  name_english: string;
  name_french: string;
  quantity: string;
  product_code: string;
  sizes: string;
  description_english: string;
  description_french: string;
  prices: string;
  banner?: string; // Single banner URL
  banners?: ApiProductBanner[]; // Array of banners (if API returns this format)
  booth_numbers?: string[]; // Array of booth numbers (e.g., ["01", "02", "03"])
}

export interface ApiEventDescription {
  id: number;
  event_category: string;
  entrance_type: string;
}

export interface ApiEvent {
  name: string;
  code: string;
  email: string;
}

export interface ApiAbout {
  french_description: string;
  english_description: string;
  banner: string;
}

export interface PaymentMethod {
  id: string;
  contentEnglish: string;
  contentFrench?: string;
}

export interface ApiResponse {
  message: string;
  event: ApiEvent;
  event_description: ApiEventDescription;
  about: ApiAbout;
  menues: any[];
  products: ApiProduct[];
  payment_method?: PaymentMethod[];
}

export interface Booth {
  id: string;
  category: 1 | 2 | 3 | 4 | 5 | 6;
  size: string;
  price?: number;
  status: 'available' | 'booked' | 'reserved';
  bookedBy?: string;
  location: string;
  designId?: string;
  designPrice?: number;
  productCode?: string;
  description?: string;
  apiProduct?: ApiProduct;
}

export interface BoothDesign {
  id: string;
  name: string;
  size: string;
  imagePath: string;
  price: number;
  description?: string;
}

export interface BoothCategory {
  id: number;
  name: string;
  size: string;
  color: string;
  description?: string;
}

// Multi-booth selection types
export interface BoothSelection {
  booth: Booth;
  design?: BoothDesign;
}

export const BOOTH_CATEGORIES: BoothCategory[] = [
  {
    id: 1,
    name: 'Booth Category 1',
    size: '3mx2m',
    color: '#FF69B4',
    description: 'Premium corner booth',
  },
  {
    id: 2,
    name: 'Booth Category 2',
    size: '3mx3m',
    color: '#87CEEB',
    description: 'Standard booth',
  },
  {
    id: 3,
    name: 'Booth Category 3',
    size: '6mx3m',
    color: '#FFA500',
    description: 'Large exhibition space',
  },
  {
    id: 4,
    name: 'Booth Category 4',
    size: '9mx3m',
    color: '#90EE90',
    description: 'Extra large booth',
  },
  {
    id: 5,
    name: 'Booth Category 5',
    size: '12mx3m',
    color: '#00CED1',
    description: 'Premium large space',
  },
  {
    id: 6,
    name: 'Booth Category 6',
    size: '10mx10m',
    color: '#FF0000',
    description: 'Special exhibition area',
  },
];

// Booth data matching the ISCA 2026 Exhibition Floor Plan
export const INITIAL_BOOTHS: Booth[] = [
  // Foyer 1A - Category 4 (9mx3m, Green)
  { id: '01', category: 4, size: '9mx3m', status: 'available', location: 'Foyer 1A' },
  { id: '02', category: 4, size: '9mx3m', status: 'available', location: 'Foyer 1A' },
  { id: '03', category: 4, size: '9mx3m', status: 'available', location: 'Foyer 1C' },

  // Foyer 1C
  { id: '04', category: 4, size: '9mx3m', status: 'available', location: 'Foyer 1C' },
  { id: '05', category: 4, size: '9mx3m', status: 'available', location: "No Man's Land" },
  

  // No Man's Land - Category 3 (6mx3m, Orange)
  { id: '06', category: 1, size: '3mx2m', status: 'available', location: "AD11&AD12 Exhibition" },
  { id: '07', category: 1, size: '3mx2m', status: 'available', location: "AD11&AD12 Exhibition" },

  // Foyer 1B - Vertical strip booths
  { id: '08', category: 1, size: '3mx2m', status: 'available', location: 'AD11&AD12 Exhibition' },
  { id: '09', category: 1, size: '3mx2m', status: 'available', location: 'AD11&AD12 Exhibition' },
  { id: '10', category: 1, size: '3mx2m', status: 'available', location: 'AD11&AD12 Exhibition' },
  { id: '11', category: 1, size: '3mx2m', status: 'available', location: 'AD11&AD12 Exhibition' },
  { id: '12', category: 1, size: '3mx2m', status: 'available', location: 'AD11&AD12 Exhibition' },
  { id: '13', category: 1, size: '3mx2m', status: 'available', location: 'AD11&AD12 Exhibition' },
  { id: '14', category: 1, size: '3mx2m', status: 'available', location: 'AD11&AD12 Exhibition' },
  { id: '15', category: 1, size: '3mx2m', status: 'available', location: 'AD11&AD12 Exhibition' },
  { id: '16', category: 1, size: '3mx2m', status: 'available', location: 'AD11&AD12 Exhibition' },
  { id: '17', category: 1, size: '3mx2m', status: 'available', location: 'AD11&AD12 Exhibition' },
  { id: '18', category: 1, size: '3mx2m', status: 'available', location: 'AD11&AD12 Exhibition' },
  { id: '19', category: 1, size: '3mx2m', status: 'available', location: "AD11&AD12 Exhibition" },
  { id: '20', category: 1, size: '3mx2m', status: 'available', location: "AD11&AD12 Exhibition" },
  // AD11&AD12 Exhibition - Category 6 (10mx10m, Red)
  { id: '21', category: 5, size: '12mx3m', status: 'available', location: 'AD11&AD12 Exhibition' },

  // Concourse
  { id: '22', category: 5, size: '12mx3m', status: 'available', location: 'Concourse' },
  { id: '23', category: 3, size: '6mx3m', status: 'available', location: 'Concourse' },
  { id: '24', category: 3, size: '6mx3m', status: 'available', location: 'Concourse' },
  { id: '25', category: 3, size: '6mx3m', status: 'available', location: 'Concourse' },
  { id: '26', category: 5, size: '12mx3m', status: 'available', location: 'Concourse' },
  { id: '27', category: 3, size: '6mx3m', status: 'available', location: 'Concourse' },
  { id: '28', category: 3, size: '6mx3m', status: 'available', location: 'Concourse' },
  { id: '29', category: 3, size: '6mx3m', status: 'available', location: 'Concourse' },

  // Square Tent (45mx25m)
  { id: '30', category: 4, size: '9mx3m', status: 'available', location: 'Square Tent' },
  { id: '31', category: 4, size: '9mx3m', status: 'available', location: 'Square Tent' },
  { id: '32', category: 2, size: '3mx3m', status: 'available', location: 'Square Tent' },
  { id: '33', category: 2, size: '3mx3m', status: 'available', location: 'Square Tent' },
  { id: '34', category: 2, size: '3mx3m', status: 'available', location: 'Square Tent' },
  { id: '35', category: 2, size: '3mx3m', status: 'available', location: 'Square Tent' },
  { id: '36', category: 2, size: '3mx3m', status: 'available', location: 'Square Tent' },
  { id: '37', category: 2, size: '3mx3m', status: 'available', location: 'Square Tent' },
  { id: '38', category: 2, size: '3mx3m', status: 'available', location: 'Square Tent' },
  { id: '39', category: 2, size: '3mx3m', status: 'available', location: 'Square Tent' },
  { id: '40', category: 2, size: '3mx3m', status: 'available', location: 'Square Tent' },
  { id: '41', category: 2, size: '3mx3m', status: 'available', location: 'Square Tent' },
  { id: '42', category: 4, size: '9mx3m', status: 'available', location: 'Square Tent' },
  { id: '43', category: 4, size: '9mx3m', status: 'available', location: 'Square Tent' },
  { id: '44', category: 6, size: '10mx10m', status: 'available', location: 'Square Tent' },
  { id: '45', category: 6, size: '10mx10m', status: 'available', location: 'Square Tent' },

  // Roundabout Tent 
  { id: '46', category: 3, size: '6mx3m', status: 'available', location: 'Roundabout Tent' },
  { id: '47', category: 3, size: '6mx3m', status: 'available', location: 'Roundabout Tent' },
  { id: '48', category: 3, size: '6mx3m', status: 'available', location: 'Roundabout Tent' },
  { id: '49', category: 3, size: '6mx3m', status: 'available', location: 'Roundabout Tent' },
  { id: '50', category: 3, size: '6mx3m', status: 'available', location: 'Roundabout Tent' },
  { id: '51', category: 3, size: '6mx3m', status: 'available', location: 'Roundabout Tent' },
  { id: '52', category: 3, size: '6mx3m', status: 'available', location: 'Roundabout Tent' },
  { id: '53', category: 3, size: '6mx3m', status: 'available', location: 'Roundabout Tent' },
  { id: '54', category: 5, size: '12mx3m', status: 'available', location: 'Roundabout Tent' },
];

// Booth designs with pricing
export const BOOTH_DESIGNS: BoothDesign[] = [
  // 3x2 designs
  {
    id: '3x2-1',
    name: 'Compact Design 1',
    size: '3mx2m',
    imagePath: '/3x2/WhatsApp Image 2025-12-04 at 12.10.07.jpeg',
    price: 2500,
    description: 'Perfect for small displays',
  },
  {
    id: '3x2-2',
    name: 'Compact Design 2',
    size: '3mx2m',
    imagePath: '/3x2/WhatsApp Image 2025-12-04 at 12.10.07 (1).jpeg',
    price: 2600,
    description: 'Modern minimalist layout',
  },
  {
    id: '3x2-3',
    name: 'Compact Design 3',
    size: '3mx2m',
    imagePath: '/3x2/WhatsApp Image 2025-12-04 at 12.10.07 (2).jpeg',
    price: 2700,
    description: 'Professional corner booth',
  },
  {
    id: '3x2-4',
    name: 'Compact Design 4',
    size: '3mx2m',
    imagePath: '/3x2/WhatsApp Image 2025-12-04 at 12.10.07 (3).jpeg',
    price: 2800,
    description: 'Elegant presentation space',
  },
  {
    id: '3x2-5',
    name: 'Compact Design 5',
    size: '3mx2m',
    imagePath: '/3x2/WhatsApp Image 2025-12-04 at 12.10.07 (4).jpeg',
    price: 2900,
    description: 'Contemporary style booth',
  },
  {
    id: '3x2-6',
    name: 'Compact Design 6',
    size: '3mx2m',
    imagePath: '/3x2/WhatsApp Image 2025-12-04 at 12.10.07 (5).jpeg',
    price: 3000,
    description: 'Premium compact design',
  },
  {
    id: '3x2-7',
    name: 'Compact Design 7',
    size: '3mx2m',
    imagePath: '/3x2/WhatsApp Image 2025-12-04 at 12.10.07 (6).jpeg',
    price: 3100,
    description: 'Dynamic layout option',
  },
  {
    id: '3x2-8',
    name: 'Compact Design 8',
    size: '3mx2m',
    imagePath: '/3x2/WhatsApp Image 2025-12-04 at 12.10.07 (7).jpeg',
    price: 3200,
    description: 'Versatile booth setup',
  },
  {
    id: '3x2-9',
    name: 'Compact Design 9',
    size: '3mx2m',
    imagePath: '/3x2/WhatsApp Image 2025-12-04 at 12.10.07 (8).jpeg',
    price: 3300,
    description: 'Stylish presentation area',
  },
  {
    id: '3x2-10',
    name: 'Compact Design 10',
    size: '3mx2m',
    imagePath: '/3x2/WhatsApp Image 2025-12-04 at 12.10.07 (9).jpeg',
    price: 3400,
    description: 'Premium corner configuration',
  },

  // 3x3 designs
  {
    id: '3x3-1',
    name: 'Standard Design 1',
    size: '3mx3m',
    imagePath: '/3x3/WhatsApp Image 2025-12-04 at 12.12.19.jpeg',
    price: 4500,
    description: 'Classic exhibition booth',
  },
  {
    id: '3x3-2',
    name: 'Standard Design 2',
    size: '3mx3m',
    imagePath: '/3x3/WhatsApp Image 2025-12-04 at 12.12.19-1.jpeg',
    price: 4800,
    description: 'Professional standard space',
  },

  // 6x3 designs
  {
    id: '6x3-1',
    name: 'Large Design 1',
    size: '6mx3m',
    imagePath: '/6x3/WhatsApp Image 2025-12-04 at 12.13.44.jpeg',
    price: 7500,
    description: 'Spacious exhibition area',
  },
  {
    id: '6x3-2',
    name: 'Large Design 2',
    size: '6mx3m',
    imagePath: '/6x3/WhatsApp Image 2025-12-04 at 12.13.44 (1).jpeg',
    price: 7800,
    description: 'Premium large booth',
  },
  {
    id: '6x3-3',
    name: 'Large Design 3',
    size: '6mx3m',
    imagePath: '/6x3/WhatsApp Image 2025-12-04 at 12.13.44 (2).jpeg',
    price: 8100,
    description: 'Deluxe exhibition space',
  },
  {
    id: '6x3-4',
    name: 'Large Design 4',
    size: '6mx3m',
    imagePath: '/6x3/WhatsApp Image 2025-12-04 at 12.13.44 (3).jpeg',
    price: 8400,
    description: 'Executive booth layout',
  },

  // 9x3 designs (add placeholder prices)
  {
    id: '9x3-1',
    name: 'Extra Large Design 1',
    size: '9mx3m',
    imagePath: '/9x3/design-1.jpeg',
    price: 11000,
    description: 'Expansive exhibition space',
  },

  // 10x10 designs (add placeholder prices)
  {
    id: '10x10-1',
    name: 'Premium Island Design 1',
    size: '10mx10m',
    imagePath: '/10x10/design-1.jpeg',
    price: 25000,
    description: 'Island booth configuration',
  },

  // 12x3 designs (add placeholder prices)
  {
    id: '12x3-1',
    name: 'Mega Design 1',
    size: '12mx3m',
    imagePath: '/12x3/design-1.jpeg',
    price: 15000,
    description: 'Maximum exhibition impact',
  },
];

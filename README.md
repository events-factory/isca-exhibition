# Exhibition Management - Interactive Floor Plan

An interactive React application for managing exhibition booth bookings with an SVG-based floor plan.

## Features

✨ **Interactive Floor Plan**

- Click on colored booths to view details and book
- Zoom in/out using mouse wheel or control buttons
- Pan around by dragging the floor plan
- Visual hover effects on interactive booths

📋 **Booking System**

- Modal-based booking interface
- Booth information display (category, size, location, status)
- Customer information form
- Real-time status updates
- **Payment Integration** - Mastercard gateway support with bank transfer option

💳 **Payment Processing**

- Online payment via Mastercard gateway
- Bank transfer option
- Secure payment session management
- Payment verification and callbacks

🎨 **Visual Legend**

- Color-coded booth categories
- Size information for each category
- Status indicators (Available, Booked, Reserved)

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Install dependencies:

```bash
npm install
```

2. Configure environment variables:

Create a `.env` file in the root directory with:

```env
PORT=5500

# Payment Gateway Configuration (Test Mode)
REACT_APP_GATEWAY_USERNAME=TESTBOK000012
REACT_APP_GATEWAY_PASSWORD=a1f97670c3eb016a11c39de541f8065e
REACT_APP_GATEWAY_URL=https://test-gateway.mastercard.com/api/nvp/version/70
REACT_APP_GATEWAY_URL_JS=https://test-gateway.mastercard.com/static/checkout/checkout.min.js
```

3. Start the development server:

```bash
npm start
```

The app will open at [http://localhost:3000](http://localhost:3000)

## Payment Integration

The system includes integrated payment processing via Mastercard gateway. For detailed information about payment setup, configuration, and testing, see [PAYMENT_INTEGRATION.md](./PAYMENT_INTEGRATION.md).

**Quick Start:**

- Users can choose between "Bank Transfer" or "Online Payment"
- Online payments use Mastercard's secure checkout
- Test cards are available for development testing
- Production setup requires backend API implementation

## Project Structure

```
exhibition-management/
├── public/
│   ├── index.html
│   └── Booth Exhibition FloorPlan (ISCA 2026).svg
├── src/
│   ├── components/
│   │   ├── FloorPlan.tsx          # Main floor plan component
│   │   ├── FloorPlan.css
│   │   ├── BookingModal.tsx       # Booking modal dialog
│   │   ├── BookingModal.css
│   │   ├── BoothList.tsx          # Booth list sidebar
│   │   ├── BoothList.css
│   │   ├── Legend.tsx             # Legend sidebar
│   │   └── Legend.css
│   ├── types/
│   │   └── booth.ts               # TypeScript interfaces
│   ├── App.tsx
│   ├── App.css
│   ├── index.tsx
│   └── index.css
├── package.json
└── tsconfig.json
```

## How to Use

1. **View the Floor Plan**: The exhibition floor plan loads automatically

2. **Navigate**:

   - Scroll with mouse wheel to zoom in/out
   - Click and drag to pan around the floor plan
   - Use control buttons for zoom and reset view

3. **Select a Booth**:

   - **Method 1**: Click on booth numbers directly in the SVG floor plan
   - **Method 2**: Click on any booth in the left sidebar booth list
   - The booking modal will open showing booth details

4. **Book a Booth**:

   - Fill in customer information (name, email, company, phone)
   - Click "Book Now" to reserve the booth
   - Booked booths show with red status indicators

5. **Check Information**:
   - **Left Sidebar**: Browse all booths with status indicators
   - **Right Sidebar**: View booth categories and color coding
   - Green 🟢 = Available, Red 🔴 = Booked, Yellow 🟡 = Reserved

## Booth Categories

- **Category 1** (Pink): 3m×2m - Premium corner booth
- **Category 2** (Light Blue): 3m×3m - Standard booth
- **Category 3** (Orange): 6m×3m - Large exhibition space
- **Category 4** (Light Green): 9m×3m - Extra large booth
- **Category 5** (Cyan): 12m×3m - Premium large space
- **Category 6** (Red): 10m×10m - Special exhibition area

## Next Steps (Backend Integration)

To connect this to a backend:

1. **API Integration**:

   - Create API endpoints for booth data (GET, POST, PUT)
   - Replace `INITIAL_BOOTHS` with API calls
   - Add authentication for booking management

2. **State Management**:

   - Consider using Context API or Redux for global state
   - Add loading states and error handling

3. **Database Schema**:

```sql
CREATE TABLE booths (
  id VARCHAR PRIMARY KEY,
  category INT,
  size VARCHAR,
  status VARCHAR,
  location VARCHAR,
  booked_by VARCHAR,
  customer_email VARCHAR,
  booking_date TIMESTAMP
);
```

4. **Additional Features**:
   - User authentication
   - Admin dashboard for booth management
   - Email notifications
   - Payment integration
   - Booking history
   - Search and filter booths

## Technologies Used

- **React 18** - UI framework
- **TypeScript** - Type safety
- **CSS3** - Styling and animations
- **SVG** - Interactive floor plan graphics

## Build for Production

```bash
npm run build
```

This creates an optimized production build in the `build/` folder.

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## License

MIT

## Contact

For questions or support, please contact the development team.

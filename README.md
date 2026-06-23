# Dashpad - Business Management Dashboard

A lightweight, mobile-first dashboard for small business owners to manage products, sales, customers, and expenses.

## Project Structure

```
dashpad/
├── src/
│   ├── components/
│   │   ├── ui/                    # Reusable UI components
│   │   │   ├── Avatar.jsx         # User avatar with initials
│   │   │   ├── Badge.jsx          # Status badge (paid/partial/unpaid)
│   │   │   ├── Sparkline.jsx      # Mini 7-day chart
│   │   │   └── StockBadge.jsx     # Stock status indicator
│   │   ├── Dashboard.jsx          # Main dashboard view with metrics
│   │   ├── Products.jsx           # Product inventory management
│   │   ├── Sales.jsx              # Sales records and tracking
│   │   ├── Customers.jsx          # Customer management
│   │   ├── Reports.jsx            # P&L and business analytics
│   │   └── Modal.jsx              # Universal modal for forms
│   ├── data/
│   │   ├── constants.js           # App categories and tab definitions
│   │   └── initialData.js         # Sample data
│   ├── utils/
│   │   └── formatters.js          # Date and currency formatting utilities
│   ├── styles/
│   │   └── index.css              # Global styles
│   ├── App.jsx                    # Main app component
│   └── index.jsx                  # React entry point
├── index.html                     # HTML entry point
├── package.json                   # Dependencies
├── vite.config.js                 # Vite configuration
└── .gitignore
```

## Features

- **Dashboard**: Overview of daily/weekly/monthly sales, inventory value, and profit metrics
- **Products**: Manage inventory with cost/selling prices, stock levels, and reorder alerts
- **Sales**: Record transactions, track payment status, and send WhatsApp notifications
- **Customers**: Manage customer contacts and view purchase history
- **Reports**: Monthly P&L statement, best-selling products, and expense tracking

## Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

The app will run on `http://localhost:5173`

## Technology Stack

- **React 18**: UI framework
- **Vite**: Build tool and dev server
- **Tabler Icons**: Icon library (via CDN)
- **Inline CSS**: Styled components

## Color Scheme

- **Primary**: `#1B1F3B` (Dark blue)
- **Accent**: `#00C896` (Green)
- **Success**: `#d1fae5` (Light green)
- **Warning**: `#fef3c7` (Light yellow)
- **Danger**: `#fee2e2` (Light red)
- **Background**: `#F0F2F8` (Light blue-gray)

## Notes

- This is a mobile-first design optimized for 430px width
- Data is stored in React state (use localStorage or a backend for persistence)
- WhatsApp integration requires valid phone numbers
- All currency formatting is set to Ghana Cedis (GHS)
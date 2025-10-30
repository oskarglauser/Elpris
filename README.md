# Greenely Prototyping

Mobile-first web application for testing different electricity price visualization prototypes.

## Overview

This project contains three different prototypes for visualizing 15-minute electricity spot prices:

- **Prototype A**: Bar chart visualization with color-coded price levels
- **Prototype B**: Line chart with gradient area visualization
- **Prototype C**: Heatmap/block visualization with time grouping

## Tech Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **Components**: ShadCN/UI
- **Design System**: Figma design tokens (Greenely brand)
- **API**: Real-time electricity prices from elprisetjustnu.se

## Features

### Shared Components
- Header with location selector and weather display
- Bottom navigation (Hem, Insikter, Enheter, Profil)
- Power usage card (current consumption)
- Cost card (monthly expenses)
- EV charging status card
- Battery level indicator

### Prototype-Specific Features
Each prototype includes:
- Unique spot price visualization
- Interactive detail view with iOS-style navigation
- 48-hour price forecast
- Color-coded price levels (low/medium/high)
- Current price highlighting

## Data Integration

The app fetches real-time electricity prices from the Swedish electricity price API:

**API Endpoint**: `https://www.elprisetjustnu.se/api/v1/prices/{year}/{month}-{day}_{region}.json`

**Features**:
- 96 intervals per day (15-minute granularity)
- Support for all Swedish regions (SE1-SE4)
- Automatic date handling
- Price level calculation based on daily average

## Design System

Colors and styles are based on Figma design tokens:

- **Primary Green**: `#009a33`
- **Gray**: `#cdc8c2`
- **Light Gray**: `#f2efec`
- **Subtle Text**: `#353230`
- **Typography**: Systemia font family
- **Border Radius**: 28px (extra-large), 4px (small)

## Project Structure

```
/app
  /page.tsx                 # Landing page with prototype selector
  /prototype-a              # Prototype A routes
    /page.tsx               # Home screen
    /detail/page.tsx        # Detail view
  /prototype-b              # Prototype B routes
  /prototype-c              # Prototype C routes
  
/components
  /shared                   # Shared components
    Header.tsx
    BottomNav.tsx
    PowerUsageCard.tsx
    CostCard.tsx
    ChargingCard.tsx
    BatteryCard.tsx
  /prototypes               # Prototype-specific components
    /prototype-a
      SpotPriceChart.tsx
      DetailView.tsx
    /prototype-b
    /prototype-c
    
/lib
  electricity-api.ts        # API integration and utilities
```

## Development

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Setup

```bash
# Install dependencies
npm install

# Run development server
npm run dev
```

Visit `http://localhost:3000` to view the application.

### Build

```bash
npm run build
npm start
```

## Deployment

This project is configured for deployment on Vercel:

1. Push to GitHub repository
2. Import project in Vercel
3. Deploy automatically

The app is optimized for mobile viewing with a max-width of 448px (md breakpoint).

## Mobile Testing

The application is designed mobile-first with:
- Viewport optimization for mobile devices
- Touch-friendly interactions
- iOS-style navigation patterns
- Responsive card layouts

## API Region Configuration

Default region is SE3 (Stockholm). To change:

```typescript
// In any component using the API
fetchTodaysPrices('SE1') // Northern Sweden
fetchTodaysPrices('SE2') // Central Sweden
fetchTodaysPrices('SE3') // Stockholm (default)
fetchTodaysPrices('SE4') // Southern Sweden
```

## Future Enhancements

- User preference for region selection
- Historical price data
- Push notifications for price alerts
- Integration with smart home devices
- A/B testing analytics

## License

Private - Greenely Internal Project

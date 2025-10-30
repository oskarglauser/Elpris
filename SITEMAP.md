# Greenely Prototyping - Sitemap

## Application Structure

```
┌─────────────────────────────────────────┐
│         Landing Page (/)                │
│                                         │
│  ┌─────────────────────────────────┐   │
│  │  🏠 Greenely Logo & Header       │   │
│  └─────────────────────────────────┘   │
│                                         │
│  📱 Prototype Testing                   │
│  Choose a visualization to test:        │
│                                         │
│  ┌─────────────────────────────────┐   │
│  │  [Prototype A - Bar Chart]       │───┼──┐
│  └─────────────────────────────────┘   │  │
│  ┌─────────────────────────────────┐   │  │
│  │  [Prototype B - Line Chart]      │───┼──┼──┐
│  └─────────────────────────────────┘   │  │  │
│  ┌─────────────────────────────────┐   │  │  │
│  │  [Prototype C - Heatmap]         │───┼──┼──┼──┐
│  └─────────────────────────────────┘   │  │  │  │
└─────────────────────────────────────────┘  │  │  │
                                             │  │  │
┌────────────────────────────────────────────┘  │  │
│                                                │  │
│  Prototype A (/prototype-a)                   │  │
│  ┌──────────────────────────────────────┐     │  │
│  │  Header (Location + Weather)          │     │  │
│  ├──────────────────────────────────────┤     │  │
│  │  📊 Bar Chart - Dagens Elpris         │     │  │
│  │  ┌────────────────────────────────┐  │     │  │
│  │  │ Current: 27.5 öre (12:00-13:00)│  │     │  │
│  │  │ ▌▌▌▌▌▌▌▌▌▌▌▌▌ (48h bars)      │  │     │  │
│  │  └────────────────────────────────┘  │     │  │
│  │  [Click to expand] ──────────────────┼──┐  │  │
│  ├──────────────────────────────────────┤  │  │  │
│  │  Cards (2x2 Grid)                    │  │  │  │
│  │  ┌───────┐ ┌───────┐                │  │  │  │
│  │  │1254 W │ │1625 kr│ (Power/Cost)   │  │  │  │
│  │  └───────┘ └───────┘                │  │  │  │
│  │  ┌───────┐ ┌───────┐                │  │  │  │
│  │  │  EV   │ │ 62%  │ (Charge/Batt)  │  │  │  │
│  │  └───────┘ └───────┘                │  │  │  │
│  ├──────────────────────────────────────┤  │  │  │
│  │  Bottom Nav: [Hem|Insikter|...]      │  │  │  │
│  └──────────────────────────────────────┘  │  │  │
│                                             │  │  │
│  Detail View (/prototype-a/detail) ◄────────┘  │  │
│  ┌──────────────────────────────────────┐     │  │
│  │  [← Back] Elpris detaljer             │     │  │
│  ├──────────────────────────────────────┤     │  │
│  │  Stats: Min | Avg | Max               │     │  │
│  │  ┌────────────────────────────────┐  │     │  │
│  │  │ Full 48h Bar Chart              │  │     │  │
│  │  └────────────────────────────────┘  │     │  │
│  │  Hour Breakdown List:                │     │  │
│  │  00:00 ─ 45.2 öre/kWh                │     │  │
│  │  01:00 ─ 42.1 öre/kWh                │     │  │
│  │  ...                                 │     │  │
│  └──────────────────────────────────────┘     │  │
└────────────────────────────────────────────────┘  │
                                                    │
┌───────────────────────────────────────────────────┘
│                                                    
│  Prototype B (/prototype-b)                       
│  ┌──────────────────────────────────────┐         
│  │  Header (Location + Weather)          │         
│  ├──────────────────────────────────────┤         
│  │  📈 Line Chart - Dagens Elpris        │         
│  │  ┌────────────────────────────────┐  │         
│  │  │ Current: 27.5 öre (12:00-13:00)│  │         
│  │  │ ╱╲╱╲╱╲  (smooth line + fill)   │  │         
│  │  └────────────────────────────────┘  │         
│  │  [Click to expand] ──────────────────┼──┐      
│  ├──────────────────────────────────────┤  │      
│  │  Cards (2x2 Grid) - Same as A        │  │      
│  ├──────────────────────────────────────┤  │      
│  │  Bottom Nav: [Hem|Insikter|...]      │  │      
│  └──────────────────────────────────────┘  │      
│                                             │      
│  Detail View (/prototype-b/detail) ◄────────┘      
│  ┌──────────────────────────────────────┐         
│  │  [← Back] Elpris trend                │         
│  │  Stats + Line Chart with Gradient     │         
│  │  Price List                            │         
│  └──────────────────────────────────────┘         
└────────────────────────────────────────────────┐
                                                 │
┌────────────────────────────────────────────────┘
│
│  Prototype C (/prototype-c)
│  ┌──────────────────────────────────────┐
│  │  Header (Location + Weather)          │
│  ├──────────────────────────────────────┤
│  │  🔥 Heatmap - Aktuellt Pris          │
│  │  ┌────────────────────────────────┐  │
│  │  │ 27.5 öre/kWh (Current)         │  │
│  │  │ Idag 00-04:  ████████████      │  │
│  │  │ Idag 04-08:  ████████████      │  │
│  │  │ ... (4h blocks, color-coded)   │  │
│  │  └────────────────────────────────┘  │
│  │  [Click to expand] ──────────────────┼──┐
│  ├──────────────────────────────────────┤  │
│  │  Cards (2x2 Grid) - Same as A        │  │
│  ├──────────────────────────────────────┤  │
│  │  Bottom Nav: [Hem|Insikter|...]      │  │
│  └──────────────────────────────────────┘  │
│                                             │
│  Detail View (/prototype-c/detail) ◄────────┘
│  ┌──────────────────────────────────────┐
│  │  [← Back] Elpris översikt             │
│  │  Stats + 15-min Interval List         │
│  │  (Color-coded by price level)         │
│  └──────────────────────────────────────┘
└────────────────────────────────────────────

Additional Pages (All Prototypes):
├── /insights  → Placeholder (Insikter)
├── /devices   → Placeholder (Enheter)
└── /profile   → Placeholder (Profil)
```

## Navigation Flow

### User Journey 1: Quick Test
```
Landing (/) → Choose Prototype → View Home → Back to Landing
```

### User Journey 2: Deep Dive
```
Landing (/) → Choose Prototype → View Home → Click Chart → 
Detail View → Analyze Data → Back → Try Another Prototype
```

### User Journey 3: Tab Navigation
```
Home → Bottom Nav (Insikter) → Bottom Nav (Enheter) → 
Bottom Nav (Profil) → Bottom Nav (Hem)
```

## Component Hierarchy

### Shared Components (Used in all prototypes)
```
Layout
└── Header
    ├── Logo
    ├── LocationSelector
    └── WeatherDisplay
└── Main Content
    ├── SpotPriceChart (prototype-specific)
    └── Card Grid
        ├── PowerUsageCard
        ├── CostCard
        ├── ChargingCard
        └── BatteryCard
└── BottomNav
    ├── Home Tab
    ├── Insights Tab
    ├── Devices Tab
    └── Profile Tab
```

### Prototype-Specific Components
```
Prototype A/B/C
├── SpotPriceChart
│   ├── Data fetching
│   ├── Visualization (unique)
│   └── Current price callout
└── DetailView
    ├── Back navigation
    ├── Statistics
    ├── Expanded chart
    └── Price breakdown
```

## Data Flow

```
API (elprisetjustnu.se)
    ↓
lib/electricity-api.ts
    ├── fetchTodaysPrices()
    ├── fetchTomorrowsPrices()
    ├── getCurrentPriceInterval()
    └── calculatePriceStats()
    ↓
Components (SpotPriceChart)
    ├── Display current price
    ├── Render visualization
    └── Calculate price levels
    ↓
User Interaction
    ├── Click chart → Navigate to detail
    └── Back button → Return to home
```

## Color Coding System

- 🟢 **Green** (Low): Price below average - 20%
- 🟡 **Yellow** (Medium): Price near average ±20%
- 🔴 **Red** (High): Price above average + 20%

## Responsive Design

- **Mobile**: 375px - 448px (optimized)
- **Tablet**: 448px+ (centered with max-width)
- **Desktop**: Same as tablet (mobile view centered)

---

**Total Routes**: 20  
**Total Components**: 23  
**All Static**: Pre-rendered at build time  
**Mobile-First**: Optimized for touch interaction


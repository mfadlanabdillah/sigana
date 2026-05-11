# SiGANA - Sistem Informasi dan Geospasial Bencana Alam

## Concept & Vision

SiGANA adalah dashboard manajemen kebencanaan berbasis web untuk BPBD Jawa Barat yang memadukan visualisasi data geospasial dengan manajemen informasi bencana secara komprehensif. Aplikasi ini dirancang dengan nuansa profesional-responden darurat, menggunakan warna biru tebal yang mencerminkan kepercayaan dan keamanan, dengan aksen merah untuk situasi kritis. Pengalaman pengguna terasa tanggap dan sigap—mirip dengan antarmuka pusat komando darurat yang terorganisir.

## Design Language

### Aesthetic Direction
Command-center aesthetic dengan sentuhan modern Indonesia. Terinspirasi dari dashboard kontrol bencana dengan visualisasi data yang jelas dan hierarki informasi yang tegas. Menggunakan card-based layout dengan shadow sutil untuk kedalaman.

### Color Palette
- **Primary**: `hsl(213 85% 48%)` - Biru responsif
- **Primary Dark/Sidebar**: `hsl(213 85% 44%)` - Biru sidebar
- **Background Light**: `hsl(0 0% 98%)`
- **Background Dark**: `hsl(222 47% 11%)`
- **Card Light**: `hsl(0 0% 100%)`
- **Card Dark**: `hsl(222 47% 15%)`
- **Border Light**: `hsl(214 32% 91%)`
- **Border Dark**: `hsl(217 33% 17%)`
- **Foreground Light**: `hsl(222 47% 11%)`
- **Foreground Dark**: `hsl(210 40% 98%)`
- **Destructive**: `hsl(0 84% 60%)`
- **Success**: `hsl(142 76% 36%)`
- **Warning**: `hsl(38 92% 50%)`

### Typography
- **Body Font**: Inter (400, 500, 600, 700)
- **Heading Font**: Plus Jakarta Sans (600, 700, 800)
- **Scale**: 12px / 14px / 16px / 18px / 20px / 24px / 30px / 36px / 48px

### Spatial System
- Base unit: 4px
- Spacing scale: 4, 8, 12, 16, 20, 24, 32, 40, 48, 64px
- Card padding: 24px
- Page padding: 24px (mobile) / 32px (desktop)
- Gap between cards: 16px / 24px

### Motion Philosophy
- **Page transitions**: Fade-in 200ms ease-out
- **Card hover**: translateY(-2px) + shadow increase, 150ms
- **Button interactions**: Scale 0.98 on press, 100ms
- **Alert ticker**: Continuous horizontal scroll, 30s linear
- **Map markers**: Subtle pulse animation for active disasters
- **Sidebar collapse**: Width transition 200ms ease-in-out
- **Toast notifications**: Slide-in from right 300ms spring

### Visual Assets
- **Icons**: Lucide React (24px default, 20px for inline, 16px for badges)
- **Maps**: react-leaflet with custom styled markers
- **Charts**: Recharts with custom theme colors
- **Decorative**: Subtle gradient overlays on headers, geometric patterns for empty states

## Layout & Structure

### App Layout
- **Sidebar**: 280px expanded, 80px collapsed, fixed position
- **Topbar**: 64px height, sticky
- **Content**: Fluid width with max-width 1600px
- **Mobile**: Drawer sidebar overlay, hamburger menu

### Page Structure
1. **Dashboard**: 2-column grid (map + stats left, alerts + lists right)
2. **Map**: Full-bleed map with floating controls panel
3. **Lists**: Card grid with filter sidebar
4. **Forms**: Centered single-column with max-width 720px
5. **Analytics**: Dashboard-style multi-chart layout

### Responsive Breakpoints
- Mobile: < 768px
- Tablet: 768px - 1024px
- Desktop: > 1024px

## Features & Interactions

### Dashboard (/)
- **AlertTicker**: Red scrolling text showing active disasters (only visible when active disasters exist)
- **4 DonutGauges**: Active Disasters, Total Affected, Active Posts, Aid Needed
- **MiniMap**: Interactive Leaflet map showing disaster locations in West Java
- **NearbyLocations**: Uses geolocation to show 5 nearest disasters/evacuation centers
- **ActiveDisasterList**: Scrollable list of active disasters
- **RecentReportsList**: Latest 5 disaster reports

### Disaster Map (/peta)
- Full-screen Leaflet map
- Base layer selector (Satellite, Street, Terrain, Dark, Light)
- MarkerCluster for disaster markers
- Custom animated markers by disaster type
- Filter panel by status
- Active ticker showing current alerts
- Zoom level display
- Legend panel
- Click marker to show popup with disaster summary

### Disaster Reports (/laporan)
- Search bar with debounced input
- Filter chips: Status, Disaster Type
- Grid of DisasterCards (responsive: 1/2/3 columns)
- DisasterCard shows: emoji icon, title, location, status badge, severity badge, affected count, relative time
- Click card opens detail dialog
- Admin can update status or delete report

### Early Warning (/peringatan-dini)
- Create warning floating button
- Filter by warning level (Hijau, Kuning, Oranye, Merah)
- WarningCard with level-appropriate colors
- Summary cards: count per level
- Delete warning with confirmation

### Infographic (/infografis)
- Year filter dropdown
- Summary cards: Total disasters, Total affected, Total casualties
- Monthly trend line chart
- Disaster type pie chart
- Province bar chart (Top 10)
- Severity distribution horizontal bar

### Evacuation Centers (/evakuasi)
- Grid of CenterCards
- Occupancy progress bar
- Status badge
- Create center dialog
- Summary: Total capacity, Active posts, Total displaced

### Aid Management (/bantuan)
- Create aid report form
- Status filter tabs
- Pipeline visualization: Dibutuhkan → Dalam Perjalanan → Tiba → Terdistribusi
- Summary statistics cards

### Analytics (/analisis)
- Multi-chart dashboard
- Monthly trend area chart
- Province comparison bar chart
- Disaster type pie chart
- Severity radar chart
- Aid prediction vs stock

### Documents (/dokumen)
- File upload zone
- Search and filter
- Document cards with download/delete
- Filter by document type

### Report Form (/buat-laporan)
- Multi-section form
- Disaster type selector with icons
- Location picker (dropdown + lat/long input)
- Date/time picker
- Photo upload
- Success confirmation modal

### Recommendations (/rekomendasi)
- Tab/accordion for each disaster type
- Icon per disaster type
- Checklist items for preparedness
- Emergency contacts section

## Component Inventory

### DonutGauge
- **Default**: SVG circle with stroke-dasharray animation, center icon, value, label
- **Hover**: Slight glow effect
- **Loading**: Pulsing skeleton

### AlertTicker
- **Active**: Red background, white text, continuous scroll animation
- **Hidden**: When no active disasters, component returns null

### DisasterCard
- **Default**: White/dark card with border, emoji, badges, info
- **Hover**: Lift effect with shadow
- **Loading**: Skeleton with shimmer
- **Expanded**: Dialog overlay with full details

### DisasterBadge
- **Status variants**: aktif (blue), siaga (yellow), terkendali (green), selesai (gray)
- **Severity variants**: ringan (green), sedang (yellow), berat (orange), kritis (red)

### WarningCard
- **Level colors**: hijau (green), kuning (yellow), oranye (orange), merah (red)
- **Hover**: Scale 1.02
- **Content**: Icon, title, description, affected regions, valid until

### CenterCard
- **Default**: Name, type badge, location, capacity bar, occupancy count
- **Full**: Red indicator on capacity bar
- **Inactive**: Grayed out styling

### AppLayout
- **Sidebar**: Logo, nav links with icons, collapse toggle, theme toggle
- **Topbar**: Page title, breadcrumb, notification bell, mobile menu
- **Mobile**: Drawer overlay with backdrop

### Sidebar
- **Expanded**: 280px with labels
- **Collapsed**: 80px with icons only
- **Active link**: Primary color background
- **Hover**: Subtle background change

### Topbar
- **Default**: Shadow, blur background
- **Mobile**: Hamburger menu added

## Technical Approach

### Stack
- **Framework**: React 18+ with Vite
- **Routing**: React Router v6
- **Styling**: Tailwind CSS with CSS variables
- **UI Components**: shadcn/ui (Radix primitives)
- **Icons**: Lucide React
- **Maps**: react-leaflet + react-leaflet-cluster
- **Charts**: Recharts
- **State**: React Context (Theme) + useState/useReducer
- **Date**: date-fns with Indonesian locale
- **Notifications**: react-hot-toast

### Data Layer
- Mock data with realistic Indonesian disaster scenarios
- LocalStorage for theme persistence
- All entities stored in-memory with CRUD operations

### Theme Implementation
- CSS variables defined in index.css
- `dark` class on html element
- ThemeContext provides darkMode boolean and toggle function
- localStorage key: 'sigana-theme'

### API Design (Mock)
All operations are client-side with mock data:
```ts
// DisasterReport
createReport(data) → DisasterReport
updateReport(id, data) → DisasterReport
deleteReport(id) → void
getReports() → DisasterReport[]
getActiveDisasters() → DisasterReport[]

// Similar for AidReport, EvacuationCenter, EarlyWarning, DisasterDocument
```

### Map Configuration
- Center: [-6.9, 107.6] (West Java)
- Bounds: [[-7.85, 105.1], [-5.9, 109.3]]
- Default zoom: 9
- Min zoom: 7
- Max zoom: 18

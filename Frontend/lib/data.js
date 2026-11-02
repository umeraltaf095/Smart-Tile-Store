// In-memory initial data for the Smart Tile Store & Inventory System
// Easily upgradeable to MongoDB in the next development phase

export const initialCategories = [
  {
    id: 1,
    code: 'CAT-FL-01',
    name: 'Floor Tiles',
    icon: '🏢',
    desc: 'Heavy-duty porcelain & marble finishes for indoor living spaces and commercial areas.',
    itemsCount: 64,
    status: 'Active'
  },
  {
    id: 2,
    code: 'CAT-WS-02',
    name: 'Washroom Tiles',
    icon: '🚿',
    desc: 'Anti-skid floor tiles and moisture-resistant glossy wall cladding for modern bathrooms.',
    itemsCount: 48,
    status: 'Active'
  },
  {
    id: 3,
    code: 'CAT-EL-03',
    name: 'Front Elevation Tiles',
    icon: '🏛️',
    desc: 'Weather-proof 3D textured stone & rock face tiles for building exteriors and facade walls.',
    itemsCount: 36,
    status: 'Active'
  },
  {
    id: 4,
    code: 'CAT-KT-04',
    name: 'Kitchen Backsplash',
    icon: '🍳',
    desc: 'Stain-resistant heat-proof glazed subway and mosaic tiles for kitchen work areas.',
    itemsCount: 22,
    status: 'Active'
  },
  {
    id: 5,
    code: 'CAT-OD-05',
    name: 'Outdoor Pavers',
    icon: '🌳',
    desc: 'Ultra-durable anti-freeze thick porcelain slabs for driveways, patios, and gardens.',
    itemsCount: 15,
    status: 'Active'
  }
];

export const initialProducts = [
  {
    id: 1,
    code: 'T-FL-101',
    name: 'Carrara White Porcelain',
    category: 'Floor Tiles',
    size: '60 x 120 cm',
    company: 'Master Ceramics',
    price: 4.50,
    unit: 'Sq.Ft',
    stockWarehouseA: 140,
    stockOutlet1: 45,
    stockOutlet2: 20,
    coveragePerBox: 15.5
  },
  {
    id: 2,
    code: 'T-EL-304',
    name: 'Rustic Slate 3D Stone',
    category: 'Front Elevation Tiles',
    size: '30 x 60 cm',
    company: 'National Tiles',
    price: 5.20,
    unit: 'Sq.Ft',
    stockWarehouseA: 85,
    stockOutlet1: 30,
    stockOutlet2: 15,
    coveragePerBox: 12.0
  },
  {
    id: 3,
    code: 'T-WS-208',
    name: 'Royal Blue Anti-Skid',
    category: 'Washroom Tiles',
    size: '30 x 30 cm',
    company: 'Shabbir Tiles (Stile)',
    price: 3.80,
    unit: 'Sq.Ft',
    stockWarehouseA: 210,
    stockOutlet1: 60,
    stockOutlet2: 40,
    coveragePerBox: 10.0
  },
  {
    id: 4,
    code: 'T-FL-109',
    name: 'Travertine Gold Polished',
    category: 'Floor Tiles',
    size: '80 x 80 cm',
    company: 'Karam Ceramics',
    price: 6.10,
    unit: 'Sq.Ft',
    stockWarehouseA: 95,
    stockOutlet1: 25,
    stockOutlet2: 10,
    coveragePerBox: 14.0
  },
  {
    id: 5,
    code: 'T-WS-215',
    name: 'Onyx Pearl Subway Tile',
    category: 'Washroom Tiles',
    size: '10 x 30 cm',
    company: 'Master Ceramics',
    price: 4.10,
    unit: 'Sq.Ft',
    stockWarehouseA: 110,
    stockOutlet1: 50,
    stockOutlet2: 25,
    coveragePerBox: 11.5
  }
];

export const outlets = [
  { id: 'wh-a', name: 'Main Central Warehouse A', type: 'Warehouse', location: 'Industrial Zone, Lahore' },
  { id: 'out-1', name: 'Outlet Store #1 (Metro Plaza)', type: 'Store Outlet', location: 'Gulberg III, Lahore' },
  { id: 'out-2', name: 'Outlet Store #2 (DHA Phase 5)', type: 'Store Outlet', location: 'Commercial Area, DHA Lahore' }
];

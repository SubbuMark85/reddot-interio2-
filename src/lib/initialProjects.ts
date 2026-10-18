import { Project } from './types';

export const INITIAL_PROJECTS: Project[] = [
  {
    id: 'rd-01',
    name: 'The Obsidian Penthouse',
    category: 'Luxury Villa',
    media_url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1600&q=80',
    media_type: 'image',
    price: '₹28,50,000',
    offer_price: '₹24,90,000',
    show_price: true,
    location: 'Jubilee Hills, Hyderabad',
    description: 'Custom fluted Italian marble walls, bespoke warm mood lighting, and imported minimal furniture designed for grand entertaining.'
  },
  {
    id: 'rd-02',
    name: 'Aura Minimalist Living Suite',
    category: 'Living Room',
    media_url: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1600&q=80',
    media_type: 'image',
    price: '₹9,80,000',
    offer_price: '₹8,20,000',
    show_price: true,
    location: 'Financial District, Hyderabad',
    description: 'ElevenLabs-inspired monochrome architectural acoustics, low-profile modular seating, and recessed museum-grade spotlights.'
  },
  {
    id: 'rd-03',
    name: 'Verdant Slate Modular Kitchen',
    category: 'Modular Kitchen',
    media_url: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=1600&q=80',
    media_type: 'image',
    price: '₹14,50,000',
    offer_price: '₹12,40,000',
    show_price: true,
    location: 'Banjara Hills, Hyderabad',
    description: 'Anti-fingerprint matte acrylic shutters, Blum soft-touch hardware, waterfall quartz island with integrated induction cooktop.'
  },
  {
    id: 'rd-04',
    name: 'Serene Sanctuary Master Suite',
    category: 'Master Bedroom',
    media_url: 'https://images.unsplash.com/photo-1616594039964-ae9021a400a0?auto=format&fit=crop&w=1600&q=80',
    media_type: 'image',
    price: '₹11,00,000',
    offer_price: '₹9,50,000',
    show_price: true,
    location: 'Gachibowli, Hyderabad',
    description: 'Acoustic suede upholstered headboard wall, tinted fluted glass walk-in wardrobe, and smart ambient twilight lighting.'
  },
  {
    id: 'rd-05',
    name: 'Nexus Tech HQ Executive Studio',
    category: 'Commercial',
    media_url: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1600&q=80',
    media_type: 'image',
    price: '₹34,00,000',
    offer_price: '₹29,00,000',
    show_price: true,
    location: 'Hitec City, Hyderabad',
    description: 'Biophilic ergonomic workstations, acoustic felt ceiling baffles, and private presentation pod with glass privacy switch.'
  },
  {
    id: 'rd-06',
    name: 'Crimson Accent Private Villa',
    category: 'Luxury Villa',
    media_url: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1600&q=80',
    media_type: 'image',
    price: '₹42,00,000',
    offer_price: '₹36,50,000',
    show_price: false,
    location: 'Kokapet, Hyderabad',
    description: 'Triple-height foyer with signature RedDot crimson metal statement stairs, ambient cove fixtures, and automated louvers.'
  },
  {
    id: 'rd-07',
    name: 'Modernist Japandi Lounge',
    category: 'Living Room',
    media_url: 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=1600&q=80',
    media_type: 'image',
    price: '₹8,50,000',
    offer_price: '₹7,20,000',
    show_price: true,
    location: 'Madhapur, Hyderabad',
    description: 'Warm oak wood batten paneling, curved bouclé sofas, hidden storage compartments, and natural micro-cement flooring.'
  },
  {
    id: 'rd-08',
    name: 'Chef’s Gourmet Island & Pantry',
    category: 'Modular Kitchen',
    media_url: 'https://images.unsplash.com/photo-1600585152220-90363fe7e115?auto=format&fit=crop&w=1600&q=80',
    media_type: 'image',
    price: '₹16,80,000',
    offer_price: '₹14,20,000',
    show_price: true,
    location: 'Kondapur, Hyderabad',
    description: 'German pull-out larder units, integrated wine chiller, quartz splashbacks, and touchless sensor LED strip illumination.'
  }
];

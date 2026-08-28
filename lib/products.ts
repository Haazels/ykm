import type { Product, ProductReview } from "@/types";

export const PRODUCTS: Product[] = [
  {
    id: 1,
    name: "Smart WiFi Camera Station",
    cat: "wireless",
    badge: "BESTSELLER",
    price: 4999,
    old: 6999,
    img: "/images/wifi-camera.jpeg",
    thumb: "/images/wifi-camera.jpeg",
    desc: "Advanced 4K WiFi camera with intelligent motion detection, night vision, and cloud backup. Connect via app, control remotely from anywhere. Built-in microphone and speaker for two-way communication.",
    specs: [
      { l: "Resolution", v: "4K/8MP" },
      { l: "WiFi", v: "Dual Band" },
      { l: "Night Vision", v: "IR 30ft" },
      { l: "App Control", v: "iOS & Android" },
      { l: "Storage", v: "Cloud + Local" },
      { l: "Power", v: "USB-C" },
    ],
     stock: 42,
  },
  {
    id: 2,
    name: "Arc Reactor Wearable",
    cat: "wireless",
    badge: "TRENDING",
    price: 8999,
    old: 11999,
    img: "/images/arc-reactor.jpeg",
    thumb: "/images/arc-reactor.jpeg",
    desc: "Fashion-forward wearable with RGB LED lighting, multiple light modes, touch controls, rechargeable battery. Wear on clothing or accessories. Premium build quality, perfect for events and cosplay.",
    specs: [
      { l: "LED Colors", v: "16M RGB" },
      { l: "Light Modes", v: "8 Modes" },
      { l: "Touch Control", v: "Yes" },
      { l: "Battery", v: "Rechargeable" },
      { l: "Material", v: "Premium Plastic" },
      { l: "Size", v: "7cm Diameter" },
    ],
     stock: 28,
  },
  {
    id: 3,
    name: "ThunderBolt Defense Shocker",
    cat: "defense",
    badge: "SAFETY",
    price: 2999,
    old: 3999,
    img: "/images/thunderbolt.jpeg",
    thumb: "/images/thunderbolt.jpeg",
    desc: "High-voltage self-defense taser with ergonomic grip, rechargeable battery, and compact design. Effective against attackers, easy to carry in pocket. Safe, legal, and reliable protection for personal safety.",
    specs: [
      { l: "Voltage", v: "High Output" },
      { l: "Battery", v: "Rechargeable" },
      { l: "Design", v: "Compact" },
      { l: "Grip", v: "Ergonomic" },
      { l: "Weight", v: "200g" },
      { l: "Safety", v: "Certified" },
    ],
     stock: 65,
  },
  {
    id: 4,
    name: "Falcon 2.9 Drone Frame",
    cat: "drones",
    badge: "PRECISION",
    price: 1999,
    old: 2999,
    img: "/images/falcon-frame.jpeg",
    thumb: "/images/falcon-frame.jpeg",
    desc: 'Ultra-lightweight 3D-printed drone frame optimized for 2.9" motors. Precision-engineered for speed and control. Durable yet agile, crash-resistant design. Perfect for FPV racing and acrobatic flying.',
    specs: [
      { l: "Weight", v: "16g Only" },
      { l: "Motor Compat", v: '2.9" Coreless' },
      { l: "Material", v: "PETG Print" },
      { l: "Durability", v: "Crash-Proof" },
      { l: "Frame Size", v: "100mm" },
      { l: "Config", v: "4-Rotor" },
    ],
     stock: 120,
  },
];

export const PRODUCT_REVIEWS: Record<number, ProductReview[]> = {
  1: [
    {
      name: "Raj Patel",
      rating: 5,
      text: "Crystal clear image, amazing night vision! Love the app control.",
      images: ["https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=100&h=100&fit=crop"],
    },
    {
      name: "Priya Singh",
      rating: 4.5,
      text: "Great quality, easy to install. Highly recommend for home security.",
      images: [
        "https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=100&h=100&fit=crop",
        "https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=100&h=100&fit=crop",
      ],
    },
  ],
  2: [
    {
      name: "Alex Chen",
      rating: 5,
      text: "Super cool design, amazing RGB modes. Love wearing this to events!",
      images: ["https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=100&h=100&fit=crop"],
    },
    {
      name: "Marcus Johnson",
      rating: 4.8,
      text: "Battery lasts ages, touch controls are smooth. Definitely worth it.",
      images: [],
    },
  ],
  3: [
    {
      name: "Security Expert",
      rating: 5,
      text: "Powerful, reliable, and pocket-friendly. Perfect for personal safety.",
      images: ["https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=100&h=100&fit=crop"],
    },
  ],
  4: [
    {
      name: "FPV Racer",
      rating: 5,
      text: "Lightweight and durable! Survived multiple crashes. Highly recommended!",
      images: ["https://images.unsplash.com/photo-1579088328851-33648d37f04b?w=100&h=100&fit=crop"],
    },
  ],
};

export const SHOP_CATEGORIES: { label: string; value: "all" | Product["cat"] }[] = [
  { label: "All Products", value: "all" },
  { label: "Wireless Devices", value: "wireless" },
  { label: "Defense Gear", value: "defense" },
  { label: "Drone Parts", value: "drones" },
];

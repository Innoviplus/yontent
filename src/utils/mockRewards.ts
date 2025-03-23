
import { RedemptionItem } from '@/types/redemption';

// Shared mock rewards data for consistent fallback
export const mockRewards: RedemptionItem[] = [
  {
    id: '1',
    name: 'Apple Gift Card',
    description: 'Redeem for an Apple Gift Card that can be used on the App Store, iTunes, Apple Store and more. This gift card can be used to purchase apps, games, music, movies, TV shows, books, and more from the Apple ecosystem.',
    points_required: 5000,
    image_url: 'https://qoycoypkyqxrcqdpfqhd.supabase.co/storage/v1/object/public/brand-images/apple-logo.png',
    is_active: true,
  },
  {
    id: '2',
    name: 'Starbucks Gift Card',
    description: 'Treat yourself to coffee, food and more with a Starbucks Gift Card. Use it at any participating Starbucks store to purchase your favorite beverages, food items, or merchandise. Perfect for coffee lovers!',
    points_required: 3000,
    image_url: 'https://qoycoypkyqxrcqdpfqhd.supabase.co/storage/v1/object/public/brand-images/starbucks-logo.png',
    banner_image: 'https://qoycoypkyqxrcqdpfqhd.supabase.co/storage/v1/object/public/brand-images/starbucks-banner.jpg',
    is_active: true,
  },
  {
    id: '3',
    name: 'Bank Transfer Cash Out',
    description: 'Convert your points directly to cash and transfer to your bank account. The cash equivalent will be calculated based on the current conversion rate and transferred to your registered bank account within 3-5 business days.',
    points_required: 10000,
    image_url: 'https://qoycoypkyqxrcqdpfqhd.supabase.co/storage/v1/object/public/brand-images/bank-logo.png',
    is_active: true,
  },
];

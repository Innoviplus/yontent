
import { Review, Mission } from '@/lib/types';

// Sample user data
export const sampleUserData = {
  id: '1',
  username: 'sampleuser',
  email: 'user@example.com',
  avatar: undefined,
  points: 750,
  createdAt: new Date('2023-05-15'),
  completedReviews: 12,
  completedMissions: 8,
};

// Sample reviews data
export const sampleReviews: Review[] = [
  {
    id: '1',
    userId: '1',
    productName: 'Wireless Headphones',
    rating: 5,
    content: 'These headphones have amazing sound quality and the noise cancellation is top-notch. Battery life is exceptional - I can go days without charging. The comfort level is also great for long listening sessions.',
    images: ['/placeholder.svg'],
    createdAt: new Date('2023-09-15'),
    user: {
      id: '1',
      username: 'sampleuser',
      email: 'user@example.com',
      points: 750,
      createdAt: new Date('2023-05-15')
    }
  },
  {
    id: '2',
    userId: '1',
    productName: 'Smart Watch Series 7',
    rating: 4,
    content: 'Great fitness tracking capabilities and the screen is beautiful. Battery life could be better but overall very satisfied with the purchase.',
    images: ['/placeholder.svg', '/placeholder.svg'],
    createdAt: new Date('2023-10-05'),
    user: {
      id: '1',
      username: 'sampleuser',
      email: 'user@example.com',
      points: 750,
      createdAt: new Date('2023-05-15')
    }
  },
];

// Sample missions data
export const sampleMissions: Mission[] = [
  {
    id: '1',
    title: 'Review Your Recent Electronics',
    description: 'Share your honest opinion about any electronics product you purchased in the last 3 months.',
    pointsReward: 150,
    type: 'REVIEW',
    status: 'ACTIVE',
    expiresAt: new Date('2024-01-31'),
    requirementDescription: 'Post a review with at least one photo and 100+ words.',
    startDate: new Date('2023-09-15'),
    createdAt: new Date('2023-09-15'),
    updatedAt: new Date('2023-09-15')
  },
  {
    id: '2',
    title: 'Holiday Shopping Receipt',
    description: 'Submit a receipt from your holiday shopping for a chance to earn points.',
    pointsReward: 100,
    type: 'RECEIPT',
    status: 'ACTIVE',
    expiresAt: new Date('2024-01-15'),
    requirementDescription: 'Upload a clear photo of your receipt showing date and store name.',
    startDate: new Date('2023-10-01'),
    createdAt: new Date('2023-10-01'),
    updatedAt: new Date('2023-10-01')
  },
  {
    id: '3',
    title: 'Home Appliance Review',
    description: 'Share your experience with a home appliance you use regularly.',
    pointsReward: 200,
    type: 'REVIEW',
    status: 'COMPLETED',
    expiresAt: new Date('2024-02-28'),
    requirementDescription: 'Post a detailed review covering pros, cons, and usage tips.',
    startDate: new Date('2023-11-01'),
    createdAt: new Date('2023-11-01'),
    updatedAt: new Date('2023-11-01')
  },
];

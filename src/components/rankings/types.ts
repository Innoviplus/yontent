
import { User } from '@/lib/types';

export type RankingType = 'points' | 'views' | 'likes';

export interface RankedUser extends User {
  rank: number;
  stats: number;
}

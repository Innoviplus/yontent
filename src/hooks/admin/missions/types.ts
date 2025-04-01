
import { Mission } from '@/lib/types';

export interface MissionsState {
  missions: Mission[];
  isLoading: boolean;
  isRefreshing: boolean;
}

export interface UploadFiles {
  merchantLogo?: File | null;
  bannerImage?: File | null;
  productImages?: File[] | null;
}

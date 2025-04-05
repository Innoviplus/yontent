
export interface RedemptionItem {
  id: string;
  name: string;
  description: string;
  points_required: number;
  image_url?: string;
  banner_image?: string;
  is_active?: boolean;
  terms_conditions?: string;
  redemption_details?: string;
  redemption_type?: 'GIFT_VOUCHER' | 'CASH';
  display_order?: number;
}

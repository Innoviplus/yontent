
export type Transaction = {
  id: string;
  description: string;
  amount: number;
  type: "EARNED" | "REDEEMED" | "REFUNDED" | "ADJUSTED" | "WELCOME" | "DEDUCTED";
  createdAt: string;
  source?: string;
  itemName?: string;
};

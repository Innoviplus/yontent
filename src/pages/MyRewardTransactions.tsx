
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/Navbar";
import { format } from "date-fns";

type Transaction = {
  id: string;
  description: string;
  amount: number;
  type: "EARNED" | "REDEEMED" | "REFUNDED" | "ADJUSTED" | "WELCOME";
  createdAt: string;
};

const MyRewardTransactions = () => {
  const { user } = useAuth();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTransactions = async () => {
      if (!user?.id) return;
      setLoading(true);

      const { data, error } = await supabase
        .from("point_transactions")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (!error && data) {
        // Normalize transaction fields to TS type with type assertion to ensure
        // the database values match our expected literal types
        setTransactions(
          data.map((row) => ({
            id: row.id,
            description: row.description,
            amount: row.amount,
            // Use type assertion to ensure the type matches our expected literals
            type: row.type as Transaction["type"],
            createdAt: row.created_at,
          }))
        );
      } else {
        setTransactions([]);
      }
      setLoading(false);
    };
    fetchTransactions();
  }, [user?.id]);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="container mx-auto px-4 pt-24 pb-16 max-w-2xl">
        <h1 className="text-2xl font-bold text-gray-900 mb-8">Reward Transactions</h1>

        {loading && (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white rounded-xl h-20 animate-pulse" />
            ))}
          </div>
        )}

        {!loading && transactions.length === 0 && (
          <div className="text-gray-500 text-center mt-10">No transactions found.</div>
        )}

        <div className="space-y-4">
          {transactions.map((tx) => (
            <div
              key={tx.id}
              className="flex justify-between items-center bg-white rounded-xl p-6 shadow-card"
            >
              <div>
                <div className="text-lg font-semibold text-gray-900">{tx.description}</div>
                <div className="text-gray-500 text-sm mt-1">{format(new Date(tx.createdAt), "MMM dd, yyyy")}</div>
              </div>
              <div
                className={
                  "font-bold text-base " +
                  (tx.type === "REDEEMED" ? "text-red-600" : "text-green-600")
                }
              >
                {tx.type === "REDEEMED" ? "-" : "+"}
                {tx.amount} <span className="font-semibold">points</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MyRewardTransactions;

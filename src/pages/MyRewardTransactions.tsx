
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import Navbar from '@/components/Navbar';
import { supabase } from '@/integrations/supabase/client';
import { format } from 'date-fns';
import { 
  Breadcrumb, 
  BreadcrumbList, 
  BreadcrumbItem, 
  BreadcrumbLink, 
  BreadcrumbSeparator, 
  BreadcrumbPage 
} from '@/components/ui/breadcrumb';
import { ChevronRight } from 'lucide-react';

type Transaction = {
  id: string;
  description: string;
  amount: number;
  type: "EARNED" | "REDEEMED" | "REFUNDED" | "ADJUSTED" | "WELCOME";
  createdAt: string;
  source?: string;
};

const MyRewardTransactions = () => {
  const { user } = useAuth();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTransactions = async () => {
      if (!user?.id) return;
      setLoading(true);

      try {
        console.log("Fetching transactions for user:", user.id);
        
        const { data, error } = await supabase
          .from("point_transactions")
          .select("*")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false });

        if (error) {
          console.error("Error fetching transactions:", error);
          setTransactions([]);
        } else if (data) {
          console.log("Raw transactions fetched:", data);
          
          const parsedTransactions = data.map((row) => {
            // Extract source information from description
            let cleanDescription = row.description;
            let source: string | undefined = undefined;
            
            const sourceMatch = row.description.match(/\[(.*?)(?::([^\]]+))?\]$/);
            if (sourceMatch) {
              source = sourceMatch[1];
              // Remove the source tag from the description
              cleanDescription = row.description.replace(/\s*\[.*?\]$/, '').trim();
            }
            
            console.log(`Transaction ${row.id} - Source: ${source}, Description: ${cleanDescription}`);
            
            return {
              id: row.id,
              description: cleanDescription,
              amount: row.amount,
              type: row.type as Transaction["type"],
              createdAt: row.created_at,
              source
            };
          });
          
          console.log("Processed transactions:", parsedTransactions);
          setTransactions(parsedTransactions);
        }
      } catch (err) {
        console.error("Unexpected error fetching transactions:", err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchTransactions();
  }, [user?.id]);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="container mx-auto px-4 pt-24 pb-16 max-w-2xl">
        <Breadcrumb className="mb-6">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/dashboard">Dashboard</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator>
              <ChevronRight />
            </BreadcrumbSeparator>
            <BreadcrumbPage>Reward Transactions</BreadcrumbPage>
          </BreadcrumbList>
        </Breadcrumb>

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
                {tx.source === 'ADMIN_ADJUSTMENT' && (
                  <div className="text-gray-500 text-xs mt-1">Manual adjustment by admin</div>
                )}
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

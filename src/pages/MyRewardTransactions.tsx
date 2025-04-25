
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import Navbar from '@/components/Navbar';
import { supabase } from '@/integrations/supabase/client';
import { format } from 'date-fns';
import { Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbLink, BreadcrumbSeparator, BreadcrumbPage } from '@/components/ui/breadcrumb';
import { ChevronRight, RefreshCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

type Transaction = {
  id: string;
  description: string;
  amount: number;
  type: "EARNED" | "REDEEMED" | "REFUNDED" | "ADJUSTED" | "WELCOME" | "DEDUCTED";
  createdAt: string;
  source?: string;
  itemName?: string;
};

const MyRewardTransactions = () => {
  const { user } = useAuth();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const navigate = useNavigate();

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
        
        // Process transactions to extract source and item information
        const parsedTransactions = await Promise.all(data.map(async (row) => {
          // Extract source information from description
          let cleanDescription = row.description;
          let source: string | undefined = undefined;
          let itemId: string | undefined = undefined;
          let itemName: string | undefined = undefined;
          
          // Parse source from description (e.g., [REDEMPTION:item_id] or [REDEMPTION])
          const sourceMatch = row.description.match(/\[(.*?)(?::([^\]]+))?\]$/);
          if (sourceMatch) {
            source = sourceMatch[1];
            itemId = sourceMatch[2];
            
            // Remove the source tag from the description
            cleanDescription = row.description.replace(/\s*\[.*?\]$/, '').trim();
          }
          
          // For redemptions with itemId, fetch item name from redemption_items
          if (source === 'REDEMPTION' && itemId) {
            try {
              const { data: itemData } = await supabase
                .from('redemption_items')
                .select('name')
                .eq('id', itemId)
                .single();
                
              if (itemData) {
                itemName = itemData.name;
              }
            } catch (err) {
              console.error(`Error fetching item name for ${itemId}:`, err);
            }
          }

          // For redemptions, ensure the description clearly shows what was redeemed
          if ((row.type === 'REDEEMED') && !cleanDescription.toLowerCase().includes('redemption') && !cleanDescription.toLowerCase().includes('redeem')) {
            cleanDescription = `Redeemed: ${cleanDescription}`;
          }

          console.log(`Transaction ${row.id} - Source: ${source}, Description: ${cleanDescription}, Item: ${itemName}`);
          
          return {
            id: row.id,
            description: cleanDescription,
            amount: row.amount,
            type: row.type as Transaction["type"],
            createdAt: row.created_at,
            source,
            itemName
          };
        }));
        
        console.log("Processed transactions:", parsedTransactions);
        setTransactions(parsedTransactions);
      }
    } catch (err) {
      console.error("Unexpected error fetching transactions:", err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, [user?.id]);

  const handleRefresh = () => {
    setRefreshing(true);
    fetchTransactions();
    toast.success("Refreshing transactions...");
  };

  const renderTransaction = (tx: Transaction) => {
    // Determine if transaction is a deduction (REDEEMED or DEDUCTED type)
    const isDeduction = tx.type === "REDEEMED" || tx.type === "DEDUCTED";
    // For redemptions, show item name if available
    const displayDescription = tx.itemName && tx.source === 'REDEMPTION' 
      ? `Redeemed: ${tx.itemName}` 
      : tx.description;

    return (
      <div key={tx.id} className="flex justify-between items-center bg-white rounded-xl p-6 shadow-card">
        <div>
          <div className="text-lg font-semibold text-gray-900">{displayDescription}</div>
          <div className="text-gray-500 text-sm mt-1">{format(new Date(tx.createdAt), "MMM dd, yyyy")}</div>
          {tx.source === 'ADMIN_ADJUSTMENT' && (
            <div className="text-gray-500 text-xs mt-1">Manual adjustment by admin</div>
          )}
        </div>
        <div className={"font-bold text-base " + (isDeduction ? "text-[#ea384c]" : "text-green-600")}>
          {isDeduction ? '-' : '+'}{Math.abs(tx.amount)} <span className="font-semibold">points</span>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="container mx-auto px-4 pt-24 pb-16 max-w-2xl">
        <div className="flex justify-between items-center mb-6">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/dashboard">Dashboard</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator>
                <ChevronRight />
              </BreadcrumbSeparator>
              <BreadcrumbPage>Transactions</BreadcrumbPage>
            </BreadcrumbList>
          </Breadcrumb>
          
          <Button 
            variant="outline" 
            size="sm"
            onClick={handleRefresh}
            disabled={refreshing}
          >
            <RefreshCcw className={`h-4 w-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>

        <h1 className="text-2xl font-bold text-gray-900 mb-8">My Transactions</h1>

        {loading && (
          <div className="space-y-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="bg-white rounded-xl h-20 animate-pulse" />
            ))}
          </div>
        )}

        {!loading && transactions.length === 0 && (
          <div className="text-gray-500 text-center py-16 bg-white rounded-xl">
            <p className="mb-2">No transactions found.</p>
            <p className="text-sm">When you earn or redeem points, they will appear here.</p>
          </div>
        )}

        <div className="space-y-4">
          {transactions.map(renderTransaction)}
        </div>
      </div>
    </div>
  );
};

export default MyRewardTransactions;

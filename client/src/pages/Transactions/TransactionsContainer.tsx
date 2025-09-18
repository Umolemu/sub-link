import { useEffect, useState } from "react";
import { Badge } from "../../components/Badge/Badge";
import { Card, CardContent } from "../../components/Card/Card";
import { getUserTransactions } from "../../api/Transactions/Transactions";
import { getSocket } from "../../realtime/socket";
import type { TransactionDTO } from "../../types/Transactions/transactions";

export const TransactionsContainer = () => {
  const [transactions, setTransactions] = useState<TransactionDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function loadTransactions() {
      setLoading(true);
      try {
        const data = await getUserTransactions();
        if (!cancelled) setTransactions(data);
      } catch {
        if (!cancelled) setError("Failed to load transactions");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    loadTransactions();
    return () => {
      cancelled = true;
    };
  }, []);

  // Listen for realtime transaction events
  useEffect(() => {
    const socket = getSocket();

    function onTransactionCreated(tx: TransactionDTO) {
      setTransactions((prev) =>
        prev.some((t) => t._id === tx._id) ? prev : [tx, ...prev]
      );
    }

    socket.on("transactionCreated", onTransactionCreated);

    return () => {
      socket.off("transactionCreated", onTransactionCreated);
    };
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h2 className="text-2xl font-bold text-black mb-6">
          Transaction History
        </h2>

        {loading && <p>Loading transactions...</p>}
        {error && <p className="text-red-500">{error}</p>}

        {!loading && transactions.length > 0 && (
          <Card className="bg-white">
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="border-b">
                    <tr>
                      <th className="text-left p-4 font-medium text-black">
                        Date
                      </th>
                      <th className="text-left p-4 font-medium text-black">
                        Description
                      </th>
                      <th className="text-left p-4 font-medium text-black">
                        Type
                      </th>
                      <th className="text-right p-4 font-medium text-black">
                        Amount
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {transactions.map((tx, index) => (
                      <tr
                        key={tx._id}
                        className={index % 2 === 0 ? "bg-gray-50" : "bg-white"}
                      >
                        <td className="p-4 text-gray-600">
                          {new Date(tx.timestamp).toLocaleString()}
                        </td>
                        <td className="p-4 text-black font-medium">
                          {tx.serviceName || "Service"}
                        </td>
                        <td className="p-4">
                          <Badge
                            className={
                              tx.type === "SUBSCRIBE"
                                ? "bg-black text-white"
                                : "bg-gray-200 text-gray-800"
                            }
                          >
                            {tx.type}
                          </Badge>
                        </td>
                        <td className="p-4 text-right font-medium text-black">
                          {`R${tx.amount?.toFixed(2)} / month`}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        )}
        {!loading && transactions.length === 0 && <p>No transactions found.</p>}
      </div>
    </div>
  );
};

import type { TransactionDTO } from "../../types/Transactions/transactions";
import { Client, extractErrorMessage } from "../Client/Client";

export async function getUserTransactions(): Promise<TransactionDTO[]> {
  try {
    const res = await Client.get<TransactionDTO[]>("/transactions");
    return res.data ?? [];
  } catch (error) {
    console.error(
      "Failed to get transactions:",
      extractErrorMessage(error, "Failed to get transactions")
    );
    return [];
  }
}

// Create a transaction manually (optional, usually handled by subscribe/unsubscribe)
export async function createTransaction(
  msisdn: string,
  serviceId: string,
  type: "SUBSCRIBE" | "UNSUBSCRIBE"
): Promise<TransactionDTO | null> {
  try {
    const res = await Client.post<TransactionDTO>("/transactions", {
      msisdn,
      serviceId,
      type,
    });
    return res.data ?? null;
  } catch (error) {
    console.error(
      "Failed to create transaction:",
      extractErrorMessage(error, "Failed to create transaction")
    );
    return null;
  }
}

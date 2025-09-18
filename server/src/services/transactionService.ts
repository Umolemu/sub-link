import { Service } from "../models/serviceModel";
import {
  Transaction,
  ITransaction,
  TransactionType,
} from "../models/transactionModel";

export async function addTransaction(
  msisdn: string,
  serviceId: string,
  type: TransactionType
) {
  const service = await Service.findById(serviceId);
  if (!service) throw new Error("Service not found");

  const transaction = new Transaction({
    msisdn,
    serviceId,
    type,
    timestamp: new Date(),
    serviceName: service.name,
    amount: service.price,
  });

  await transaction.save();
  return transaction;
}

export async function getUserTransactions(
  msisdn: string
): Promise<ITransaction[]> {
  return Transaction.find({ msisdn }).populate("serviceId");
}

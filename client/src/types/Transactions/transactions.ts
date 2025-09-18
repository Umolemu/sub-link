export interface TransactionDTO {
  _id: string;
  msisdn: string;
  serviceId: string;
  type: "SUBSCRIBE" | "UNSUBSCRIBE";
  timestamp: string;
  serviceName?: string;
  amount?: number;
}

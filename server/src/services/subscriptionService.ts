import { Subscription, ISubscription } from "../models/subscriptionModel";
import { addTransaction } from "./transactionService";

export async function subscribeUser(
  msisdn: string,
  serviceId: string
): Promise<ISubscription> {
  let existing = await Subscription.findOne({ msisdn, serviceId });
  if (existing) return existing;

  const subscription = new Subscription({ msisdn, serviceId });
  await subscription.save();

  await addTransaction(msisdn, serviceId, "SUBSCRIBE");

  return subscription;
}

export async function unsubscribeUser(
  msisdn: string,
  serviceId: string
): Promise<boolean> {
  const result = await Subscription.findOneAndDelete({ msisdn, serviceId });
  if (result) {
    await addTransaction(msisdn, serviceId, "UNSUBSCRIBE");
    return true;
  }
  return false;
}

export async function getUserSubscriptions(
  msisdn: string
): Promise<{ serviceId: string }[]> {
  const subs = await Subscription.find({ msisdn }).select("serviceId");

  return subs.map((s) => ({
    serviceId: s.serviceId.toString(),
  }));
}

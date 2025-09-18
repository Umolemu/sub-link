import type { SubscriptionDTO } from "../../types/Subscriptions/subscriptions";
import { Client, extractErrorMessage } from "../Client/Client";

export async function getUserSubscriptions(): Promise<SubscriptionDTO[]> {
  try {
    const res = await Client.get<SubscriptionDTO[]>("/subscriptions");
    return res.data ?? [];
  } catch (error) {
    console.error(
      "Failed to get subscriptions:",
      extractErrorMessage(error, "Failed to get subscriptions")
    );
    return [];
  }
}

export async function subscribe(
  serviceId: string
): Promise<SubscriptionDTO | null> {
  try {
    const res = await Client.post<SubscriptionDTO>("/subscriptions", {
      serviceId,
    });
    return res.data ?? null;
  } catch (error) {
    console.error("Failed to subscribe:", extractErrorMessage(error));
    return null;
  }
}

export async function unsubscribe(serviceId: string): Promise<boolean> {
  try {
    await Client.delete(`/subscriptions/${serviceId}`);
    return true;
  } catch (error) {
    console.error(
      "Failed to unsubscribe:",
      extractErrorMessage(error, "Failed to unsubscribe")
    );
    return false;
  }
}

export async function unsubscribeByAdmin(
  serviceId: string,
  msisdn: string
): Promise<boolean> {
  try {
    await Client.delete(`/subscriptions/admin/${msisdn}/${serviceId}`);
    return true;
  } catch (error) {
    console.error(
      "Failed to unsubscribe:",
      extractErrorMessage(error, "Failed to unsubscribe")
    );
    return false;
  }
}

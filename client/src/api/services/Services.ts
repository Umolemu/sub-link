import type {
  CreateServiceInput,
  ServiceDTO,
} from "../../types/Services/services";
import { Client, extractErrorMessage } from "../Client/Client";

export async function getServices(): Promise<ServiceDTO[]> {
  try {
    const res = await Client.get<ServiceDTO[]>("/services");
    return res.data ?? [];
  } catch (error) {
    console.error(
      "Failed to get services:",
      extractErrorMessage(error, "Failed to get services")
    );
    return [];
  }
}

export async function createService(
  input: CreateServiceInput
): Promise<ServiceDTO | null> {
  try {
    const res = await Client.post<ServiceDTO>("/services", input);
    const service = res.data;
    if (service && service._id) {
      return service;
    }
    return null;
  } catch (error) {
    console.error(
      "Failed to create service:",
      extractErrorMessage(error, "Failed to create service")
    );
    return null;
  }
}

export async function deleteService(id: string): Promise<boolean> {
  try {
    await Client.delete(`/services/${id}`);
    return true;
  } catch (error) {
    console.error(
      "Failed to delete service:",
      extractErrorMessage(error, "Failed to delete service")
    );
    return false;
  }
}

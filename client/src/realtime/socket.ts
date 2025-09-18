import { io, Socket } from "socket.io-client";

let socket: Socket | null = null;

export function getSocket() {
  if (!socket) {
    socket = io(import.meta.env.VITE_BACKEND_API as string, {
      transports: ["websocket"],
      autoConnect: true,
    });
  }
  return socket;
}

export type ServiceCreatedPayload = {
  _id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  icon: string;
};

export type ServiceDeletedPayload = { id: string };

export type SubscriptionCreatedPayload = {
  _id: string;
  serviceId: string;
  msisdn: string;
};

export type SubscriptionDeletedPayload = {
  msisdn: string;
  serviceId: string;
};

export interface User {
  msisdn: string;
  otp?: string;
  otpExpires?: Date;
  createdAt: Date;
  subscriptionCount: number;
  monthlyRevenue: number;
  isAdmin?: boolean;
}

export interface ActiveSubscriptionDetail {
  serviceId: string;
  name: string;
  price: number;
  category: string;
  subscribedAt?: string;
}

export interface UserDetail {
  msisdn: string;
  activeSubscriptions: ActiveSubscriptionDetail[];
  monthlyRevenue: number;
  createdAt: string;
  isAdmin?: boolean;
}

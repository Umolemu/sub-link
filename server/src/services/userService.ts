import { User, IUser, UserWithStats } from "../models/userModel";
import { Subscription } from "../models/subscriptionModel";

export async function getAllUsers(): Promise<UserWithStats[]> {
  const users = await User.find().sort({ createdAt: -1 });

  const result = await Promise.all(
    users.map(async (user) => {
      const subscriptions = await Subscription.find({
        msisdn: user.msisdn,
      }).populate("serviceId");

      const subscriptionCount = subscriptions.filter((s) => s.serviceId).length;

      const monthlyRevenue = subscriptions
        .filter((s) => s.serviceId)
        .reduce((sum, sub) => sum + (sub.serviceId as any).price, 0);

      return {
        msisdn: user.msisdn,
        otp: user.otp,
        otpExpires: user.otpExpires,
        createdAt: user.createdAt,
        subscriptionCount,
        monthlyRevenue,
        isAdmin: user.isAdmin,
      };
    })
  );

  return result;
}

// Get user by msisdn with stats
export async function getUserByMsisdn(msisdn: string) {
  const user = await User.findOne({ msisdn });
  if (!user) return null;

  // Get active subscriptions
  const subscriptions = await Subscription.find({ msisdn }).populate(
    "serviceId"
  );

  // Transform subscriptions to return useful info
  const activeSubscriptions = subscriptions
    .filter((sub) => sub.serviceId)
    .map((sub) => ({
      serviceId: (sub.serviceId as any)._id.toString(),
      name: (sub.serviceId as any).name,
      price: (sub.serviceId as any).price,
      category: (sub.serviceId as any).category,
      subscribedAt: sub.subscribedAt,
    }));

  const monthlyRevenue = activeSubscriptions.reduce(
    (sum, sub) => sum + sub.price,
    0
  );

  return {
    msisdn: user.msisdn,
    activeSubscriptions,
    monthlyRevenue,
    createdAt: user.createdAt,
  };
}

// Delete user and all their subscriptions
export async function deleteUser(msisdn: string): Promise<boolean> {
  const result = await User.findOneAndDelete({ msisdn });
  if (!result) return false;

  await Subscription.deleteMany({ msisdn });
  return true;
}

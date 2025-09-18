import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "../Card/Card";
import { Button } from "../Button/Button";
import { getUserDetail } from "../../api/Users/Users";
import { unsubscribeByAdmin } from "../../api/Subscriptions/Subscriptions";
import type { UserDetail } from "../../types/Users/users";
import { SubscriptionsTable } from "../SubscriptionsTable/SubscriptionsTable";

// User Detail page: loads from backend and shows subscriptions
export const UserDetailContainer = () => {
  const { msisdn } = useParams<{ msisdn: string }>();
  const navigate = useNavigate();

  const [user, setUser] = useState<UserDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [removingServiceId, setRemovingServiceId] = useState<string | null>(
    null
  );

  useEffect(() => {
    let cancelled = false;
    (async () => {
      if (!msisdn) return;
      setLoading(true);
      try {
        const data = await getUserDetail(msisdn);
        if (!cancelled) {
          if (data) setUser(data);
          else setError("User not found");
        }
      } catch (e) {
        if (!cancelled) setError("Failed to load user");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [msisdn]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-8">
        <div className="text-center text-gray-700">Loading user…</div>
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-8">
        <div className="text-center space-y-4">
          <h1 className="text-2xl font-bold text-black">
            {error || "User not found"}
          </h1>
          <Button variant="secondary" onClick={() => navigate("/admin")}>
            Back to Admin
          </Button>
        </div>
      </div>
    );
  }

  const totalRevenue = user.monthlyRevenue;

  const handleRemove = async (serviceId: string, price: number) => {
    setRemovingServiceId(serviceId);
    const ok = await unsubscribeByAdmin(serviceId, user.msisdn);
    if (ok) {
      setUser((prev) => {
        if (!prev) return prev;
        const filtered = prev.activeSubscriptions.filter(
          (s) => s.serviceId !== serviceId
        );
        const newRevenue = Math.max(0, (prev.monthlyRevenue ?? 0) - price);
        return {
          ...prev,
          activeSubscriptions: filtered,
          monthlyRevenue: newRevenue,
        };
      });
    } else {
      alert("Failed to remove subscription");
    }
    setRemovingServiceId(null);
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-16">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-3xl font-bold text-black mb-1">
              User {user.msisdn}
            </h1>
            <p className="text-gray-600 text-sm">
              Joined {new Date(user.createdAt).toLocaleDateString()}
            </p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" onClick={() => navigate("/admin")}>
              Back
            </Button>
          </div>
        </div>

        {/* Overview Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <Card className="bg-white border border-gray-200">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">MSISDN</CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <p className="text-lg font-semibold text-black">{user.msisdn}</p>
            </CardContent>
          </Card>
          <Card className="bg-white border border-gray-200">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Active Subscriptions</CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <p className="text-lg font-semibold text-black">
                {user.activeSubscriptions.length}
              </p>
            </CardContent>
          </Card>
          <Card className="bg-white border border-gray-200">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Monthly Revenue</CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <p className="text-lg font-semibold text-black">
                R{totalRevenue.toFixed(2)}
              </p>
            </CardContent>
          </Card>
        </div>

        <section>
          <h2 className="text-2xl font-bold text-black mb-6">Subscriptions</h2>
          <SubscriptionsTable
            user={user}
            removingServiceId={removingServiceId}
            onRemove={handleRemove}
          />
        </section>
      </div>
    </div>
  );
};

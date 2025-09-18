import { useEffect, useState, useMemo } from "react";
import { Badge } from "../../components/Badge/Badge";
import { Button } from "../../components/Button/Button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../components/Card/Card";
import { getServices } from "../../api/Services/Services";
import {
  getUserSubscriptions,
  subscribe,
  unsubscribe,
} from "../../api/Subscriptions/Subscriptions";
import { getSocket } from "../../realtime/socket";
import * as Icons from "lucide-react";
import type { ServiceDTO } from "../../types/Services/services";
import type { SubscriptionDTO } from "../../types/Subscriptions/subscriptions";
import {
  PaymentPopup,
  type PaymentMethod,
} from "../../components/PaymentPopup/PaymentPopup";

export const DashboardContainer = () => {
  const [services, setServices] = useState<ServiceDTO[]>([]);
  const [subscriptions, setSubscriptions] = useState<SubscriptionDTO[]>([]);
  const [loadingServices, setLoadingServices] = useState(true);
  const [loadingSubs, setLoadingSubs] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState<string | null>(null);
  const [paymentOpen, setPaymentOpen] = useState(false);
  const [selectedService, setSelectedService] = useState<ServiceDTO | null>(
    null
  );
  const [confirming, setConfirming] = useState(false);

  useEffect(() => {
    let cancelled = false;
    async function loadServices() {
      setLoadingServices(true);
      try {
        const data = await getServices();
        if (!cancelled) setServices(data);
      } catch (e) {
        if (!cancelled) setError("Failed to load services");
      } finally {
        if (!cancelled) setLoadingServices(false);
      }
    }
    loadServices();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    let cancelled = false;
    async function loadSubs() {
      setLoadingSubs(true);
      try {
        const data = await getUserSubscriptions();
        if (!cancelled) setSubscriptions(data);
      } catch (e) {
        if (!cancelled)
          setError((prev) => prev || "Failed to load subscriptions");
      } finally {
        if (!cancelled) setLoadingSubs(false);
      }
    }
    loadSubs();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    const socket = getSocket();

    function onServiceCreated(service: any) {
      setServices((prev) =>
        prev.some((s) => s._id === service._id) ? prev : [...prev, service]
      );
    }

    function onServiceDeleted(payload: { id: string }) {
      setServices((prev) => prev.filter((s) => s._id !== payload.id));
      setSubscriptions((prev) =>
        prev.filter((sub) => sub.serviceId !== payload.id)
      );
    }

    function onSubscriptionCreated(sub: SubscriptionDTO) {
      setSubscriptions((prev) =>
        prev.some((s) => s._id === sub._id) ? prev : [...prev, sub]
      );
    }

    function onSubscriptionDeleted(payload: { serviceId: string }) {
      setSubscriptions((prev) =>
        prev.filter((s) => s.serviceId !== payload.serviceId)
      );
    }
    socket.on("serviceCreated", onServiceCreated);
    socket.on("serviceDeleted", onServiceDeleted);
    socket.on("subscriptionCreated", onSubscriptionCreated);
    socket.on("subscriptionDeleted", onSubscriptionDeleted);
    return () => {
      socket.off("serviceCreated", onServiceCreated);
      socket.off("serviceDeleted", onServiceDeleted);
      socket.off("subscriptionCreated", onSubscriptionCreated);
      socket.off("subscriptionDeleted", onSubscriptionDeleted);
    };
  }, []);

  const subscribedIds = useMemo(
    () => new Set(subscriptions.map((s) => s.serviceId)),
    [subscriptions]
  );

  const activeServices = services.filter((s) => subscribedIds.has(s._id));
  const availableServices = services.filter((s) => !subscribedIds.has(s._id));

  const openPaymentFor = (service: ServiceDTO) => {
    setSelectedService(service);
    setPaymentOpen(true);
  };

  const handleConfirmPayment = async (_method: PaymentMethod) => {
    if (!selectedService) return;
    setConfirming(true);
    try {
      const subscription = await subscribe(selectedService._id);
      if (subscription) {
        setSubscriptions((prev) => [...prev, subscription]);
        setPaymentOpen(false);
        setSelectedService(null);
      } else {
        setError("Failed to subscribe");
      }
    } catch {
      setError("Failed to subscribe");
    } finally {
      setConfirming(false);
    }
  };

  const handleUnsubscribe = async (serviceId: string) => {
    setBusy(serviceId);
    try {
      const success = await unsubscribe(serviceId);
      if (success) {
        setSubscriptions((prev) =>
          prev.filter((s) => s.serviceId !== serviceId)
        );
      }
    } catch {
      setError("Failed to unsubscribe");
    } finally {
      setBusy(null);
    }
  };

  const Separator = () => <hr className="my-12 border-gray-300" />;

  const LoadingGrid = () => (
    <div className="text-sm text-gray-500">Loading...</div>
  );

  const EmptyCard = ({ message }: { message: string }) => (
    <Card className="bg-white border border-dashed border-gray-300">
      <CardContent className="p-6 text-center text-gray-600">
        {message}
      </CardContent>
    </Card>
  );

  function renderActive() {
    if (loadingServices || loadingSubs) return <LoadingGrid />;
    if (activeServices.length === 0)
      return <EmptyCard message="You have no active subscriptions yet." />;
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {activeServices.map((s) => {
          const IconComp: any = (Icons as any)[s.icon] || Icons.Box;
          return (
            <Card key={s._id} className="bg-white border-gray-200">
              <CardHeader className="flex flex-row items-center space-y-0 pb-2">
                <IconComp className="h-6 w-6 text-black mr-2" />
                <div className="flex-1">
                  <CardTitle className="text-lg text-black">{s.name}</CardTitle>
                  <CardDescription className="text-gray-600">
                    R{s.price.toFixed(2)} / month
                  </CardDescription>
                </div>
                <Badge className="bg-green-100 text-green-800">Active</Badge>
              </CardHeader>
              <CardContent>
                <Button
                  variant="outline"
                  className="w-full"
                  disabled={busy === s._id}
                  onClick={() => handleUnsubscribe(s._id)}
                >
                  {busy === s._id ? "..." : "Unsubscribe"}
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>
    );
  }

  function renderAvailable() {
    if (loadingServices || loadingSubs) return <LoadingGrid />;
    if (availableServices.length === 0)
      return <EmptyCard message="No services are available right now." />;
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {availableServices.map((s) => {
          const IconComp: any = (Icons as any)[s.icon] || Icons.Box;
          return (
            <Card key={s._id} className="bg-white border-gray-200">
              <CardHeader className="text-center">
                <IconComp className="h-8 w-8 text-black mx-auto mb-2" />
                <CardTitle className="text-lg text-black">{s.name}</CardTitle>
                <CardDescription className="text-gray-600">
                  {s.description}
                </CardDescription>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-xl font-bold text-black mb-4">
                  R{s.price.toFixed(2)} / month
                </p>
                <Button
                  variant="primary"
                  className="w-full"
                  disabled={busy === s._id}
                  onClick={() => openPaymentFor(s)}
                >
                  {busy === s._id ? "..." : "Subscribe"}
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error && <div className="mb-6 text-sm text-red-600">{error}</div>}
        <h2 className="text-2xl font-bold text-black mb-6">
          Active Subscriptions
        </h2>
        {renderActive()}
        <Separator />
        <h2 className="text-2xl font-bold text-black mb-6">
          Available Services
        </h2>
        {renderAvailable()}
      </div>
      <PaymentPopup
        open={paymentOpen}
        service={selectedService}
        onClose={() => {
          if (confirming) return;
          setPaymentOpen(false);
          setSelectedService(null);
        }}
        onConfirm={handleConfirmPayment}
        confirming={confirming}
      />
    </div>
  );
};

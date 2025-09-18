import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "../../components/Card/Card";
import type { ServiceDTO } from "../../types/Services/services";
import type { User } from "../../types/Users/users";
import { getUsers, getUserDetail } from "../../api/Users/Users";
import { getServices, deleteService } from "../../api/Services/Services";
import { UsersTable } from "../../components/UsersTable/UsersTable.tsx";
import { ServiceUsageGrid } from "../../components/ServiceUsageGrid/ServiceUsageGrid.tsx";
import { AddServiceForm } from "../../components/AddServiceForm/AddServiceForm.tsx";

export const AdminContainer = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState<User[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [usersError, setUsersError] = useState<string | null>(null);

  const [services, setServices] = useState<ServiceDTO[]>([]);
  const [loadingServices, setLoadingServices] = useState(true);
  const [servicesError, setServicesError] = useState<string | null>(null);

  const [serviceUserCounts, setServiceUserCounts] = useState<
    Record<string, number>
  >({});
  const [loadingCounts, setLoadingCounts] = useState(false);
  const [deletingServiceId, setDeletingServiceId] = useState<string | null>(
    null
  );

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoadingUsers(true);
      try {
        const data = await getUsers();
        if (!cancelled) setUsers(data);
      } catch (e) {
        if (!cancelled) setUsersError("Failed to load users");
      } finally {
        if (!cancelled) setLoadingUsers(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoadingServices(true);
      try {
        const data = await getServices();
        if (!cancelled) setServices(data);
      } catch (e) {
        if (!cancelled) setServicesError("Failed to load services");
      } finally {
        if (!cancelled) setLoadingServices(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      if (users.length === 0) {
        setServiceUserCounts({});
        return;
      }
      setLoadingCounts(true);
      try {
        const detailsList = await Promise.all(
          users.map((u) => getUserDetail(u.msisdn))
        );
        if (cancelled) return;
        const counts: Record<string, number> = {};
        for (const detail of detailsList) {
          if (!detail) continue;
          for (const sub of detail.activeSubscriptions) {
            counts[sub.serviceId] = (counts[sub.serviceId] || 0) + 1;
          }
        }
        setServiceUserCounts(counts);
      } finally {
        if (!cancelled) setLoadingCounts(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [users]);

  return (
    <div className="min-h-screen bg-gray-50 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
        <header className="text-center">
          <h1 className="text-3xl font-bold text-black mb-2">
            Admin Dashboard
          </h1>
          <p className="text-gray-600">
            Operational overview & service management (wireframe)
          </p>
        </header>
        <hr className="my-12 border-gray-300" />

        <section>
          <h2 className="text-2xl font-bold text-black mb-6">Users</h2>
          <UsersTable
            users={users}
            loading={loadingUsers}
            error={usersError}
            onView={(msisdn) => navigate(`/admin/${msisdn}`)}
          />
        </section>

        <section>
          <h2 className="text-2xl font-bold text-black mb-6">Service Usage</h2>
          <ServiceUsageGrid
            services={services}
            loading={loadingServices || loadingCounts}
            error={servicesError}
            counts={serviceUserCounts}
            deletingServiceId={deletingServiceId}
            onDelete={async (svc: ServiceDTO) => {
              const ok = window.confirm(
                `Delete service "${svc.name}"? This cannot be undone.`
              );
              if (!ok) return;
              setDeletingServiceId(svc._id);
              const success = await deleteService(svc._id);
              if (success) {
                setServices((prev) => prev.filter((s) => s._id !== svc._id));
                setServiceUserCounts((prev) => {
                  const next = { ...prev };
                  delete next[svc._id];
                  return next;
                });
              } else {
                setServicesError((prev) => prev || "Failed to delete service");
              }
              setDeletingServiceId(null);
            }}
          />
        </section>

        <section>
          <h2 className="text-2xl font-bold text-black mb-6">Add Service</h2>
          <Card className="bg-white border border-gray-200">
            <CardContent>
              <AddServiceForm
                iconOptions={[
                  "Wifi",
                  "MessageSquare",
                  "Music",
                  "Video",
                  "Globe",
                  "Shield",
                  "Smartphone",
                  "Phone",
                ]}
                onServiceCreated={(response: ServiceDTO | null) => {
                  if (!response) return;
                  setServices((prev) => [response, ...prev]);
                  setServiceUserCounts((prev) => ({
                    ...prev,
                    [response._id]: prev[response._id] ?? 0,
                  }));
                }}
              />
            </CardContent>
          </Card>
        </section>
      </div>
    </div>
  );
};

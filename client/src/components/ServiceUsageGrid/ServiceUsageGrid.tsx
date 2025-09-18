import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "../Card/Card";
import { Badge } from "../Badge/Badge";
import * as Icons from "lucide-react";
import type { ServiceDTO } from "../../types/Services/services";

export function ServiceUsageGrid({
  services,
  loading,
  error,
  counts,
  deletingServiceId,
  onDelete,
}: {
  services: ServiceDTO[];
  loading: boolean;
  error: string | null;
  counts: Record<string, number>;
  deletingServiceId: string | null;
  onDelete: (svc: ServiceDTO) => void;
}) {
  if (loading) return <div className="text-gray-600">Loading services…</div>;
  if (error) return <div className="text-red-600">{error}</div>;
  if (services.length === 0)
    return <div className="text-gray-600">No services available.</div>;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {services.map((svc) => {
        const IconComp: any = (Icons as any)[svc.icon] || Icons.Box;
        const activeUsers = counts[svc._id] || 0;
        return (
          <Card key={svc._id} className="bg-white border border-gray-200">
            <CardHeader className="flex items-start space-x-3 pb-3">
              <IconComp className="h-6 w-6 text-black" />
              <div className="flex-1">
                <CardTitle className="text-base mb-1">{svc.name}</CardTitle>
                <CardDescription>
                  R{svc.price.toFixed(2)} / month
                </CardDescription>
              </div>
              <div className="flex items-center gap-2">
                <Badge className="bg-black text-white">
                  {activeUsers} users
                </Badge>
                <button
                  type="button"
                  className="p-1 rounded hover:bg-gray-100 text-gray-500 hover:text-red-600"
                  aria-label="Delete service"
                  disabled={deletingServiceId === svc._id}
                  onClick={() => onDelete(svc)}
                  title="Delete service"
                >
                  <Icons.Trash2 className="w-4 h-4" />
                </button>
              </div>
            </CardHeader>
            {svc.description && svc.description.trim().length > 0 && (
              <CardContent className="pt-0">
                <p className="text-sm text-gray-600">{svc.description}</p>
              </CardContent>
            )}
          </Card>
        );
      })}
    </div>
  );
}

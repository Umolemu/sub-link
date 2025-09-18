import { Card, CardContent } from "../Card/Card";
import { Button } from "../Button/Button";
import * as Icons from "lucide-react";
import type { UserDetail } from "../../types/Users/users";

export function SubscriptionsTable({
  user,
  removingServiceId,
  onRemove,
}: {
  user: UserDetail;
  removingServiceId: string | null;
  onRemove: (serviceId: string, price: number) => Promise<void> | void;
}) {
  return (
    <Card className="bg-white">
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="border-b">
              <tr>
                <th className="text-left p-4 font-medium text-black">
                  Service
                </th>
                <th className="text-left p-4 font-medium text-black">
                  Started
                </th>
                <th className="text-left p-4 font-medium text-black">Price</th>
                <th className="text-center p-4 font-medium text-black">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {user.activeSubscriptions.length === 0 ? (
                <tr>
                  <td colSpan={4} className="p-6 text-center text-gray-600">
                    No active subscriptions.
                  </td>
                </tr>
              ) : (
                user.activeSubscriptions.map((sub, idx) => {
                  const IconComp: any =
                    (Icons as any)[sub.category] || Icons.Box;
                  return (
                    <tr
                      key={`${sub.serviceId}-${idx}`}
                      className={idx % 2 === 0 ? "bg-gray-50" : "bg-white"}
                    >
                      <td className="p-4 text-gray-700 font-medium flex items-center gap-2">
                        <IconComp className="h-5 w-5 text-black" /> {sub.name}
                      </td>
                      <td className="p-4 text-gray-700">
                        {sub.subscribedAt
                          ? new Date(sub.subscribedAt).toLocaleDateString()
                          : "-"}
                      </td>
                      <td className="p-4 text-gray-700">
                        R{sub.price.toFixed(2)} / month
                      </td>
                      <td className="p-4 text-center">
                        <Button
                          variant="table"
                          disabled={removingServiceId === sub.serviceId}
                          onClick={() => onRemove(sub.serviceId, sub.price)}
                        >
                          {removingServiceId === sub.serviceId
                            ? "Removing…"
                            : "Remove"}
                        </Button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}

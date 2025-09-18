import { Card, CardContent } from "../Card/Card";
import { Button } from "../Button/Button";
import type { User } from "../../types/Users/users";

export function UsersTable({
  users,
  loading,
  error,
  onView,
}: {
  users: User[];
  loading: boolean;
  error: string | null;
  onView: (msisdn: string) => void;
}) {
  return (
    <Card className="bg-white">
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="border-b">
              <tr>
                <th className="text-left p-4 font-medium text-black">MSISDN</th>
                <th className="text-left p-4 font-medium text-black">
                  No. Subscriptions
                </th>
                <th className="text-left p-4 font-medium text-black">
                  Revenue / month
                </th>
                <th className="text-right p-4 font-medium text-black">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={4} className="p-6 text-center text-gray-600">
                    Loading users...
                  </td>
                </tr>
              ) : error ? (
                <tr>
                  <td colSpan={4} className="p-6 text-center text-red-600">
                    {error}
                  </td>
                </tr>
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan={4} className="p-6 text-center text-gray-600">
                    No users found.
                  </td>
                </tr>
              ) : (
                users.map((u, idx) => (
                  <tr
                    key={u.msisdn}
                    className={idx % 2 === 0 ? "bg-gray-50" : "bg-white"}
                  >
                    <td className="p-4 text-gray-700 font-medium">
                      {u.msisdn}
                    </td>
                    <td className="p-4 text-gray-700">{u.subscriptionCount}</td>
                    <td className="p-4 text-gray-700">
                      R{u.monthlyRevenue.toFixed(2)}
                    </td>
                    <td className="p-4 text-right">
                      <Button variant="ghost" onClick={() => onView(u.msisdn)}>
                        View
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}

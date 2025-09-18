// @ts-nocheck
import { jest } from "@jest/globals";

const UserFindMock = jest.fn();
const UserFindOneMock = jest.fn();
const UserFindOneAndDeleteMock = jest.fn();

const UserModelMock: any = function () {};
(UserModelMock as any).find = UserFindMock;
(UserModelMock as any).findOne = UserFindOneMock;
(UserModelMock as any).findOneAndDelete = UserFindOneAndDeleteMock;

const SubscriptionFindMock = jest.fn();
const SubscriptionDeleteManyMock = jest.fn(() => Promise.resolve());

jest.mock("../../../src/models/userModel", () => ({
  User: UserModelMock,
}));

jest.mock("../../../src/models/subscriptionModel", () => ({
  Subscription: {
    find: SubscriptionFindMock,
    deleteMany: SubscriptionDeleteManyMock,
  },
}));

import {
  getAllUsers,
  getUserByMsisdn,
  deleteUser,
} from "../../../src/services/userService";

describe("userService", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("getAllUsers aggregates subscription counts and revenue", async () => {
    const u = { msisdn: "1", createdAt: new Date() } as any;
    (UserFindMock as any).mockReturnValueOnce({
      sort: jest.fn().mockResolvedValueOnce([u]),
    });
    (SubscriptionFindMock as any).mockReturnValueOnce({
      populate: jest
        .fn()
        .mockResolvedValueOnce([
          { serviceId: { price: 5 } },
          { serviceId: { price: 7 } },
          { serviceId: null },
        ]),
    });

    const list = await getAllUsers();
    expect(list).toEqual([
      expect.objectContaining({
        msisdn: "1",
        subscriptionCount: 2,
        monthlyRevenue: 12,
      }),
    ]);
  });

  it("getUserByMsisdn returns detailed user view", async () => {
    (UserFindOneMock as any).mockResolvedValueOnce({
      msisdn: "1",
      createdAt: new Date(),
    });
    (SubscriptionFindMock as any).mockReturnValueOnce({
      populate: jest
        .fn()
        .mockResolvedValueOnce([
          {
            serviceId: { _id: "a", name: "A", price: 1, category: "c1" },
            subscribedAt: new Date("2020-01-01"),
          },
          { serviceId: null },
        ]),
    });

    const user = await getUserByMsisdn("1");
    expect(user).toEqual(
      expect.objectContaining({ msisdn: "1", monthlyRevenue: 1 })
    );
    expect(user?.activeSubscriptions).toHaveLength(1);
  });

  it("deleteUser removes user and subscriptions", async () => {
    (UserFindOneAndDeleteMock as any).mockResolvedValueOnce({ msisdn: "1" });
    const ok = await deleteUser("1");
    expect(ok).toBe(true);
    expect(SubscriptionDeleteManyMock).toHaveBeenCalledWith({ msisdn: "1" });
  });
});

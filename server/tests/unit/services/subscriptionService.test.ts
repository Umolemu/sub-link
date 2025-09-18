// @ts-nocheck
import { jest } from "@jest/globals";

// Mock transaction logger
const addTransactionMock: any = jest.fn();
jest.mock("../../../src/services/transactionService", () => ({
  addTransaction: (...args: any[]) => addTransactionMock(...args),
}));

// Mock Subscription model
const SubscriptionFindOneMock = jest.fn();
const SubscriptionFindOneAndDeleteMock = jest.fn();
const SubscriptionFindMock = jest.fn();
const SubscriptionSaveMock = jest.fn(() => Promise.resolve());

const SubscriptionCtor: any = function (this: any, doc: any) {
  Object.assign(this, doc);
  this.save = SubscriptionSaveMock;
};
(SubscriptionCtor as any).findOne = SubscriptionFindOneMock;
(SubscriptionCtor as any).findOneAndDelete = SubscriptionFindOneAndDeleteMock;
(SubscriptionCtor as any).find = SubscriptionFindMock;

jest.mock("../../../src/models/subscriptionModel", () => ({
  Subscription: SubscriptionCtor,
}));

import {
  subscribeUser,
  unsubscribeUser,
  getUserSubscriptions,
} from "../../../src/services/subscriptionService";

describe("subscriptionService", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("subscribeUser returns existing subscription if present", async () => {
    const existing = { msisdn: "1", serviceId: "svc" };
    (SubscriptionFindOneMock as any).mockResolvedValueOnce(existing);

    const res = await subscribeUser("1", "svc");
    expect(res).toBe(existing as any);
    expect(SubscriptionSaveMock).not.toHaveBeenCalled();
    expect(addTransactionMock).not.toHaveBeenCalled();
  });

  it("unsubscribeUser deletes and logs when found; returns false otherwise", async () => {
    // found
    (SubscriptionFindOneAndDeleteMock as any).mockResolvedValueOnce({
      msisdn: "1",
      serviceId: "svc",
    });
    let ok = await unsubscribeUser("1", "svc");
    expect(ok).toBe(true);
    expect(addTransactionMock).toHaveBeenCalledWith("1", "svc", "UNSUBSCRIBE");

    // not found
    (SubscriptionFindOneAndDeleteMock as any).mockResolvedValueOnce(null);
    ok = await unsubscribeUser("1", "missing");
    expect(ok).toBe(false);
  });

  it("getUserSubscriptions maps to serviceId strings", async () => {
    (SubscriptionFindMock as any).mockReturnValueOnce({
      select: jest
        .fn()
        .mockResolvedValueOnce([
          { serviceId: { toString: () => "a" } },
          { serviceId: { toString: () => "b" } },
        ]),
    });

    const list = await getUserSubscriptions("1");
    expect(list).toEqual([{ serviceId: "a" }, { serviceId: "b" }]);
  });
});

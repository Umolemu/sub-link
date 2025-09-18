import { jest } from "@jest/globals";

// Mock Mongoose Types.ObjectId toString behavior if needed
jest.mock("mongoose", () => ({
  Types: {
    ObjectId: class MockObjectId {
      private v: string;
      constructor(v?: string) {
        this.v = v || "507f1f77bcf86cd799439011";
      }
      toString() {
        return this.v;
      }
    },
  },
}));

const ServiceFindMock = jest.fn();
const ServiceFindByIdAndDeleteMock = jest.fn();
const ServiceSaveMock = jest.fn(() => Promise.resolve());

const ServiceCtor: any = function (this: any, doc: any) {
  Object.assign(this, doc);
  this._id = doc._id || { toString: () => "507f1f77bcf86cd799439011" };
  this.createdAt = doc.createdAt || new Date();
  this.updatedAt = doc.updatedAt || new Date();
  this.save = ServiceSaveMock;
};
(ServiceCtor as any).find = ServiceFindMock;
(ServiceCtor as any).findByIdAndDelete = ServiceFindByIdAndDeleteMock;

const SubscriptionCountDocumentsMock = jest.fn();
const SubscriptionDeleteManyMock = jest.fn(() => Promise.resolve());

jest.mock("../../../src/models/serviceModel", () => ({
  Service: ServiceCtor,
}));

jest.mock("../../../src/models/subscriptionModel", () => ({
  Subscription: {
    countDocuments: SubscriptionCountDocumentsMock,
    deleteMany: SubscriptionDeleteManyMock,
  },
}));

import {
  addService,
  deleteService,
  getServices,
  getServicesWithUserCount,
} from "../../../src/services/serviceService";

describe("serviceService", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("deleteService removes service and related subscriptions", async () => {
    const id = "deadbeefdeadbeefdeadbeef";
    (ServiceFindByIdAndDeleteMock as any).mockResolvedValueOnce({
      _id: { toString: () => id },
    });

    const ok = await deleteService(id);
    expect(ok).toBe(true);
    expect(SubscriptionDeleteManyMock).toHaveBeenCalledWith({
      serviceId: { toString: expect.any(Function) },
    });
  });

  it("getServices returns all services", async () => {
    (ServiceFindMock as any).mockResolvedValueOnce([
      { name: "A" },
      { name: "B" },
    ]);
    const list = await getServices();
    expect(ServiceFindMock).toHaveBeenCalled();
    expect(list).toHaveLength(2);
  });

  it("getServicesWithUserCount returns aggregated results", async () => {
    const now = new Date();
    (ServiceFindMock as any).mockResolvedValueOnce([
      {
        _id: { toString: () => "1" },
        name: "S1",
        description: "d1",
        price: 1,
        category: "c1",
        icon: "i1",
        createdAt: now,
        updatedAt: now,
      },
      {
        _id: { toString: () => "2" },
        name: "S2",
        description: "d2",
        price: 2,
        category: "c2",
        icon: "i2",
        createdAt: now,
        updatedAt: now,
      },
    ]);
    (SubscriptionCountDocumentsMock as any)
      .mockResolvedValueOnce(3)
      .mockResolvedValueOnce(5);

    const agg = await getServicesWithUserCount();
    expect(SubscriptionCountDocumentsMock).toHaveBeenCalledTimes(2);
    expect(agg).toEqual([
      expect.objectContaining({ _id: "1", userCount: 3 }),
      expect.objectContaining({ _id: "2", userCount: 5 }),
    ]);
  });
});

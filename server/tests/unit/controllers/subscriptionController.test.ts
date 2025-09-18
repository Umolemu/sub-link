// @ts-nocheck
import { jest } from "@jest/globals";

const subscribeUserMock: any = jest.fn();
const unsubscribeUserMock: any = jest.fn();
const getUserSubscriptionsMock: any = jest.fn();

jest.mock("../../../src/services/subscriptionService", () => ({
  subscribeUser: (...args: any[]) => subscribeUserMock(...args),
  unsubscribeUser: (...args: any[]) => unsubscribeUserMock(...args),
  getUserSubscriptions: (...args: any[]) => getUserSubscriptionsMock(...args),
}));

const addTransactionMock = jest.fn();
jest.mock("../../../src/services/transactionService", () => ({
  addTransaction: (...args: any[]) => addTransactionMock(...args),
}));

const emitMock = jest.fn();
jest.mock("../../../src/server", () => ({
  io: { emit: (...args: any[]) => emitMock(...args) },
}));

import {
  createSubscriptionController,
  deleteSubscriptionController,
  adminDeleteSubscriptionController,
  getSubscriptionsController,
} from "../../../src/controllers/subscriptionController";

function mockReqRes(body: any = {}, params: any = {}, user: any = undefined) {
  const req: any = { body, params, user };
  const res: any = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn().mockReturnThis(),
  };
  return { req, res };
}

describe("subscriptionController", () => {
  beforeEach(() => jest.clearAllMocks());

  it("createSubscriptionController validates auth and body", async () => {
    // unauthorized
    let ctx = mockReqRes({ serviceId: "s" }, {}, undefined);
    await createSubscriptionController(ctx.req, ctx.res);
    expect(ctx.res.status).toHaveBeenCalledWith(401);

    // missing serviceId
    ctx = mockReqRes({}, {}, { msisdn: "1" });
    await createSubscriptionController(ctx.req, ctx.res);
    expect(ctx.res.status).toHaveBeenCalledWith(400);
  });

  it("createSubscriptionController subscribes and emits", async () => {
    const created = { id: "sub1" };
    subscribeUserMock.mockResolvedValueOnce(created);
    const ctx = mockReqRes({ serviceId: "s" }, {}, { msisdn: "1" });
    await createSubscriptionController(ctx.req, ctx.res);
    expect(ctx.res.status).toHaveBeenCalledWith(201);
    expect(ctx.res.json).toHaveBeenCalledWith(created);
    expect(emitMock).toHaveBeenCalledWith("subscriptionCreated", created);
  });

  it("deleteSubscriptionController requires auth and returns 404 when missing", async () => {
    // unauthorized
    let ctx = mockReqRes({}, { serviceId: "s" }, undefined);
    await deleteSubscriptionController(ctx.req, ctx.res);
    expect(ctx.res.status).toHaveBeenCalledWith(401);

    // not found
    ctx = mockReqRes({}, { serviceId: "s" }, { msisdn: "1" });
    unsubscribeUserMock.mockResolvedValueOnce(false);
    await deleteSubscriptionController(ctx.req, ctx.res);
    expect(ctx.res.status).toHaveBeenCalledWith(404);
  });

  it("deleteSubscriptionController succeeds and emits", async () => {
    const ctx = mockReqRes({}, { serviceId: "s" }, { msisdn: "1" });
    unsubscribeUserMock.mockResolvedValueOnce(true);
    await deleteSubscriptionController(ctx.req, ctx.res);
    expect(ctx.res.json).toHaveBeenCalledWith({
      message: "Unsubscribed successfully",
    });
    expect(emitMock).toHaveBeenCalledWith("subscriptionDeleted", {
      msisdn: "1",
      serviceId: "s",
    });
  });

  it("adminDeleteSubscriptionController validates params and handles not found", async () => {
    // missing params
    let ctx = mockReqRes({}, {});
    await adminDeleteSubscriptionController(ctx.req, ctx.res);
    expect(ctx.res.status).toHaveBeenCalledWith(400);

    // not found
    ctx = mockReqRes({}, { msisdn: "1", serviceId: "x" });
    unsubscribeUserMock.mockResolvedValueOnce(false);
    await adminDeleteSubscriptionController(ctx.req, ctx.res);
    expect(ctx.res.status).toHaveBeenCalledWith(404);
  });

  it("adminDeleteSubscriptionController unsubscribes, logs, and emits", async () => {
    const ctx = mockReqRes({}, { msisdn: "1", serviceId: "s" });
    unsubscribeUserMock.mockResolvedValueOnce(true);
    await adminDeleteSubscriptionController(ctx.req, ctx.res);
    expect(addTransactionMock).toHaveBeenCalledWith("1", "s", "UNSUBSCRIBE");
    expect(emitMock).toHaveBeenCalledWith("subscriptionDeleted", {
      msisdn: "1",
      serviceId: "s",
    });
    expect(ctx.res.json).toHaveBeenCalledWith({
      message: "User unsubscribed successfully",
    });
  });

  it("getSubscriptionsController requires auth and returns list", async () => {
    // unauthorized
    let ctx = mockReqRes({}, {}, undefined);
    await getSubscriptionsController(ctx.req, ctx.res);
    expect(ctx.res.status).toHaveBeenCalledWith(401);

    // success
    ctx = mockReqRes({}, {}, { msisdn: "1" });
    getUserSubscriptionsMock.mockResolvedValueOnce([{ serviceId: "a" }]);
    await getSubscriptionsController(ctx.req, ctx.res);
    expect(ctx.res.json).toHaveBeenCalledWith([{ serviceId: "a" }]);
  });
});

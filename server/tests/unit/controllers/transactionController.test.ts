// @ts-nocheck
import { jest } from "@jest/globals";

const addTransactionMock: any = jest.fn();
const getUserTransactionsMock: any = jest.fn();

jest.mock("../../../src/services/transactionService", () => ({
  addTransaction: (...args: any[]) => addTransactionMock(...args),
  getUserTransactions: (...args: any[]) => getUserTransactionsMock(...args),
}));

const emitMock = jest.fn();
jest.mock("../../../src/server", () => ({
  io: { emit: (...args: any[]) => emitMock(...args) },
}));

import {
  createTransactionController,
  getTransactionsController,
} from "../../../src/controllers/transactionController";

function mockReqRes(body: any = {}, params: any = {}, user: any = undefined) {
  const req: any = { body, params, user };
  const res: any = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn().mockReturnThis(),
  };
  return { req, res };
}

describe("transactionController", () => {
  beforeEach(() => jest.clearAllMocks());

  it("createTransactionController validates body", async () => {
    let ctx = mockReqRes({});
    await createTransactionController(ctx.req, ctx.res);
    expect(ctx.res.status).toHaveBeenCalledWith(400);

    ctx = mockReqRes({ msisdn: "1", serviceId: "s", type: "BAD" });
    await createTransactionController(ctx.req, ctx.res);
    expect(ctx.res.status).toHaveBeenCalledWith(400);
  });

  it("createTransactionController creates and emits", async () => {
    const body = { msisdn: "1", serviceId: "s", type: "SUBSCRIBE" };
    const created = { id: "tx1" };
    addTransactionMock.mockResolvedValueOnce(created);
    const ctx = mockReqRes(body);
    await createTransactionController(ctx.req, ctx.res);
    expect(ctx.res.status).toHaveBeenCalledWith(201);
    expect(ctx.res.json).toHaveBeenCalledWith(created);
    expect(emitMock).toHaveBeenCalledWith("transactionCreated", created);
  });

  it("getTransactionsController requires auth and returns list", async () => {
    // unauthorized
    let ctx = mockReqRes({}, {}, undefined);
    await getTransactionsController(ctx.req, ctx.res);
    expect(ctx.res.status).toHaveBeenCalledWith(401);

    // success
    ctx = mockReqRes({}, {}, { msisdn: "1" });
    getUserTransactionsMock.mockResolvedValueOnce([{ id: 1 }]);
    await getTransactionsController(ctx.req, ctx.res);
    expect(ctx.res.json).toHaveBeenCalledWith([{ id: 1 }]);
  });
});

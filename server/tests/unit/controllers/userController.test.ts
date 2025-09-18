// @ts-nocheck
import { jest } from "@jest/globals";

const getAllUsersMock: any = jest.fn();
const getUserByMsisdnMock: any = jest.fn();
const deleteUserMock: any = jest.fn();

jest.mock("../../../src/services/userService", () => ({
  getAllUsers: (...args: any[]) => getAllUsersMock(...args),
  getUserByMsisdn: (...args: any[]) => getUserByMsisdnMock(...args),
  deleteUser: (...args: any[]) => deleteUserMock(...args),
}));

import {
  getUsersController,
  getUserController,
  deleteUserController,
} from "../../../src/controllers/userController";

function mockReqRes(body: any = {}, params: any = {}) {
  const req: any = { body, params };
  const res: any = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn().mockReturnThis(),
  };
  return { req, res };
}

describe("userController", () => {
  beforeEach(() => jest.clearAllMocks());

  it("getUsersController responds with users", async () => {
    const users = [{ msisdn: "1" }];
    getAllUsersMock.mockResolvedValueOnce(users);
    const ctx = mockReqRes();
    await getUsersController(ctx.req, ctx.res);
    expect(ctx.res.json).toHaveBeenCalledWith(users);
  });

  it("getUserController returns 404 when missing", async () => {
    let ctx = mockReqRes({}, { msisdn: "x" });
    getUserByMsisdnMock.mockResolvedValueOnce(null);
    await getUserController(ctx.req, ctx.res);
    expect(ctx.res.status).toHaveBeenCalledWith(404);

    ctx = mockReqRes({}, { msisdn: "1" });
    getUserByMsisdnMock.mockResolvedValueOnce({ msisdn: "1" });
    await getUserController(ctx.req, ctx.res);
    expect(ctx.res.json).toHaveBeenCalledWith({ msisdn: "1" });
  });

  it("deleteUserController deletes or 404s", async () => {
    let ctx = mockReqRes({}, { msisdn: "x" });
    deleteUserMock.mockResolvedValueOnce(false);
    await deleteUserController(ctx.req, ctx.res);
    expect(ctx.res.status).toHaveBeenCalledWith(404);

    ctx = mockReqRes({}, { msisdn: "1" });
    deleteUserMock.mockResolvedValueOnce(true);
    await deleteUserController(ctx.req, ctx.res);
    expect(ctx.res.json).toHaveBeenCalledWith({
      message: "User deleted successfully",
    });
  });
});

// @ts-nocheck
import { jest } from "@jest/globals";

const ServiceFindByIdMock = jest.fn();
const TransactionSaveMock = jest.fn(() => Promise.resolve());
const TransactionFindMock = jest.fn();

const ServiceModelMock: any = { findById: ServiceFindByIdMock };

const TransactionCtor: any = function (this: any, doc: any) {
  Object.assign(this, doc);
  this.save = TransactionSaveMock;
};
(TransactionCtor as any).find = TransactionFindMock;

jest.mock("../../../src/models/serviceModel", () => ({
  Service: ServiceModelMock,
}));

jest.mock("../../../src/models/transactionModel", () => ({
  Transaction: TransactionCtor,
}));

import {
  addTransaction,
  getUserTransactions,
} from "../../../src/services/transactionService";

describe("transactionService", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("addTransaction throws if service not found", async () => {
    (ServiceFindByIdMock as any).mockResolvedValueOnce(null);
    await expect(
      addTransaction("1", "svc", "SUBSCRIBE" as any)
    ).rejects.toThrow("Service not found");
  });

  it("getUserTransactions queries by msisdn and populates", async () => {
    const populateMock = jest.fn().mockResolvedValueOnce([{ id: 1 }]);
    (TransactionFindMock as any).mockReturnValueOnce({
      populate: populateMock,
    });
    const list = await getUserTransactions("1");
    expect(TransactionFindMock).toHaveBeenCalledWith({ msisdn: "1" });
    expect(populateMock).toHaveBeenCalledWith("serviceId");
    expect(list).toEqual([{ id: 1 }]);
  });
});

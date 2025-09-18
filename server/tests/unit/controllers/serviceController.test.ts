import { jest } from '@jest/globals';

// service layer mocks
const getServicesMock: any = jest.fn();
const getServicesWithUserCountMock: any = jest.fn();
const addServiceMock: any = jest.fn();
const deleteServiceMock: any = jest.fn();

jest.mock('../../../src/services/serviceService', () => ({
  getServices: (...args: any[]) => getServicesMock(...args),
  getServicesWithUserCount: (...args: any[]) => getServicesWithUserCountMock(...args),
  addService: (...args: any[]) => addServiceMock(...args),
  deleteService: (...args: any[]) => deleteServiceMock(...args),
}));

// mock io emitter
const emitMock = jest.fn();
jest.mock('../../../src/server', () => ({
  io: { emit: (...args: any[]) => emitMock(...args) },
}));

import {
  getServicesController,
  getServicesWithUserCountController,
  addServiceController,
  deleteServiceController,
} from '../../../src/controllers/serviceController';

function mockReqRes(body: any = {}, params: any = {}) {
  const req: any = { body, params };
  const res: any = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn().mockReturnThis(),
  };
  return { req, res };
}

describe('serviceController', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('getServicesController responds with list', async () => {
    getServicesMock.mockResolvedValueOnce([{ name: 'A' }]);
    const { req, res } = mockReqRes();
    await getServicesController(req, res);
    expect(res.json).toHaveBeenCalledWith([{ name: 'A' }]);
  });

  it('addServiceController validates required fields and emits event', async () => {
    // missing required field -> 400
    let ctx = mockReqRes({ name: 'N' });
    await addServiceController(ctx.req, ctx.res);
    expect(ctx.res.status).toHaveBeenCalledWith(400);

    // valid body -> 201 + emit
    const body = {
      name: 'N',
      description: 'D',
      price: 5,
      category: 'C',
      icon: 'I',
    };
    const created = { ...body, _id: '1' };
    addServiceMock.mockResolvedValueOnce(created);
    ctx = mockReqRes(body);
    await addServiceController(ctx.req, ctx.res);
    expect(ctx.res.status).toHaveBeenCalledWith(201);
    expect(ctx.res.json).toHaveBeenCalledWith(created);
    expect(emitMock).toHaveBeenCalledWith('serviceCreated', created);
  });

  it('deleteServiceController emits event when deleted and 404 when not found', async () => {
    // not found
    let ctx = mockReqRes({}, { id: 'x' });
    deleteServiceMock.mockResolvedValueOnce(false);
    await deleteServiceController(ctx.req, ctx.res);
    expect(ctx.res.status).toHaveBeenCalledWith(404);

    // deleted
    ctx = mockReqRes({}, { id: '1' });
    deleteServiceMock.mockResolvedValueOnce(true);
    await deleteServiceController(ctx.req, ctx.res);
    expect(ctx.res.json).toHaveBeenCalledWith({ message: 'Service deleted successfully' });
    expect(emitMock).toHaveBeenCalledWith('serviceDeleted', { id: '1' });
  });
});

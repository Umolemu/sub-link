import { jest } from '@jest/globals';

const sendOtpMock: any = jest.fn();
const verifyOtpMock: any = jest.fn();

jest.mock('../../../src/services/authService', () => ({
  sendOtp: (...args: any[]) => sendOtpMock(...args),
  verifyOtp: (...args: any[]) => verifyOtpMock(...args),
}));

import { sendOtpController, verifyOtpController } from '../../../src/controllers/authController';

function mockReqRes(body: any = {}) {
  const req: any = { body };
  const res: any = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn().mockReturnThis(),
  };
  return { req, res };
}

describe('authController', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('sendOtpController validates msisdn and returns 400 when missing', async () => {
    const { req, res } = mockReqRes({});
    await sendOtpController(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: 'MSISDN is required' });
    expect(sendOtpMock).not.toHaveBeenCalled();
  });

  it('verifyOtpController returns token when service resolves; 401 when null', async () => {
    // success
    let ctx = mockReqRes({ msisdn: '23480', otp: '123456' });
    verifyOtpMock.mockResolvedValueOnce('token');
    await verifyOtpController(ctx.req, ctx.res);
    expect(ctx.res.json).toHaveBeenCalledWith({ token: 'token' });

    // failure
    ctx = mockReqRes({ msisdn: '23480', otp: '000000' });
    verifyOtpMock.mockResolvedValueOnce(null);
    await verifyOtpController(ctx.req, ctx.res);
    expect(ctx.res.status).toHaveBeenCalledWith(401);
    expect(ctx.res.json).toHaveBeenCalledWith({ error: 'Invalid or expired OTP' });
  });
});

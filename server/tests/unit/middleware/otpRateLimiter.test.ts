import { otpRateLimiter, __resetOtpRateLimiterStore } from '../../../src/middleware/otpRateLimiter';

function mockReqRes(msisdn?: string) {
  const req: any = { body: { msisdn } };
  const headers: Record<string, string> = {};
  const res: any = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn().mockReturnThis(),
    setHeader: jest.fn((k: string, v: string) => {
      headers[k] = v;
    }),
    __headers: headers,
  };
  const next = jest.fn();
  return { req, res, next };
}

describe('otpRateLimiter', () => {
  beforeEach(() => {
    __resetOtpRateLimiterStore();
    jest.useFakeTimers();
    jest.setSystemTime(0);
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('allows first and second attempts, blocks on third within window', () => {
    const mw = otpRateLimiter({ windowMs: 60_000, blockMs: 180_000, maxAttempts: 3 });

    const c1 = mockReqRes('23480');
    mw(c1.req, c1.res, c1.next);
    expect(c1.next).toHaveBeenCalled();

    const c2 = mockReqRes('23480');
    mw(c2.req, c2.res, c2.next);
    expect(c2.next).toHaveBeenCalled();

    const c3 = mockReqRes('23480');
    mw(c3.req, c3.res, c3.next);
    expect(c3.res.status).toHaveBeenCalledWith(429);
    expect(c3.res.json).toHaveBeenCalledWith({
      error: expect.stringContaining('Too many OTP requests'),
    });
    expect(c3.res.__headers['Retry-After']).toBe('180');
  });

  it('unblocks after blockMs elapses', () => {
    const mw = otpRateLimiter({ windowMs: 60_000, blockMs: 180_000, maxAttempts: 3 });

  // consume attempts and get blocked
  const a1 = mockReqRes('999');
  mw(a1.req, a1.res, a1.next);
  const a2 = mockReqRes('999');
  mw(a2.req, a2.res, a2.next);
    const blocked = mockReqRes('999');
    mw(blocked.req, blocked.res, blocked.next);
    expect(blocked.res.status).toHaveBeenCalledWith(429);

    // Advance time beyond block
    jest.setSystemTime(180_001);

    const after = mockReqRes('999');
    mw(after.req, after.res, after.next);
    expect(after.next).toHaveBeenCalled();
  });
});

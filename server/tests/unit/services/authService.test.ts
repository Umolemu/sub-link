import { jest } from '@jest/globals';

// Mocks for helpers
jest.mock('../../../src/utils/otpGenerator', () => ({
  generateOtp: jest.fn(() => '123456'),
}));

jest.mock('../../../src/utils/tokenGenerator', () => ({
  generateToken: jest.fn(() => 'mockToken'),
}));

// Mock User model: constructor + static findOne
const saveMock: any = jest.fn(() => Promise.resolve());
const userFindOneMock: any = jest.fn();
const UserMock = jest.fn(function (this: any, doc: any) {
  Object.assign(this, doc);
  this.save = saveMock;
});
(UserMock as any).findOne = userFindOneMock;

jest.mock('../../../src/models/userModel', () => ({
  User: UserMock,
}));

import { sendOtp, verifyOtp } from '../../../src/services/authService';
import { generateOtp } from '../../../src/utils/otpGenerator';
import { generateToken } from '../../../src/utils/tokenGenerator';

describe('authService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('sendOtp creates a user if missing, sets otp and expiry, and returns the otp', async () => {
  (userFindOneMock as any).mockResolvedValue(null);

    const msisdn = '2348012345678';
    const before = Date.now();
    const otp = await sendOtp(msisdn);
    const after = Date.now();

    expect(generateOtp).toHaveBeenCalled();
    expect(otp).toBe('123456');

    // A new User was constructed and saved
    expect(UserMock).toHaveBeenCalledWith({ msisdn });
    expect(saveMock).toHaveBeenCalled();

    const instance = (UserMock as jest.Mock).mock.instances[0] as any;
    expect(instance.msisdn).toBe(msisdn);
    expect(instance.otp).toBe('123456');
    expect(instance.otpExpires).toBeInstanceOf(Date);
    const expTime = (instance.otpExpires as Date).getTime();
    // expiry should be about 5 minutes from now
    expect(expTime).toBeGreaterThanOrEqual(before);
    expect(expTime).toBeGreaterThan(after); // in the future
  });

  it('verifyOtp returns token and clears otp when valid; returns null when invalid', async () => {
    const msisdn = '2348099998888';

    // valid path
    const future = new Date(Date.now() + 60_000);
  const userSave: any = jest.fn(() => Promise.resolve());
    (userFindOneMock as any).mockResolvedValueOnce({
      msisdn,
      otp: '123456',
      otpExpires: future,
      save: userSave,
    });

    const token = await verifyOtp(msisdn, '123456');
    expect(token).toBe('mockToken');
    expect(generateToken).toHaveBeenCalledWith(msisdn);
    expect(userSave).toHaveBeenCalled();

    // invalid path (no user)
  (userFindOneMock as any).mockResolvedValueOnce(null);
    const token2 = await verifyOtp(msisdn, '000000');
    expect(token2).toBeNull();
  });
});

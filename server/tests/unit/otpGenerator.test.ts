import { generateOtp } from '../../src/utils/otpGenerator';

describe('generateOtp', () => {
  it('generates a string of the requested length', () => {
    const otp = generateOtp(6);
    expect(typeof otp).toBe('string');
    expect(otp).toHaveLength(6);
  });

  it('pads with leading zeros when needed', () => {
    // Force a low value by retrying until we get one starting with 0 (non-deterministic but fast)
    let otp: string = '';
    for (let i = 0; i < 1000; i++) {
      otp = generateOtp(6);
      if (otp.startsWith('0')) break;
    }
    expect(otp).toHaveLength(6);
  });
});

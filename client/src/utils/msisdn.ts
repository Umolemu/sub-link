// Digits-only MSISDN helpers (no '+')
// - Only digits
// - Length 8 to 15

const DIGITS_ONLY_REGEX = /^\d{8,15}$/;

export function normalizeMsisdn(input: string): string {
  // Remove anything that's not a digit
  return input.replace(/\D/g, "");
}

export function isValidMsisdn(msisdn: string): boolean {
  return DIGITS_ONLY_REGEX.test(msisdn);
}

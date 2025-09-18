export type RequestOtpResponse = {
  success: boolean;
  message: string;
};

export type VerifyOtpResponse = {
  success: boolean;
  message: string;
  token?: string;
};

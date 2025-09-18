import { Phone } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../components/Card/Card";
import { Button } from "../../components/Button/Button";
import { requestOtp } from "../../api/Otp/Otp";
import { isValidMsisdn, normalizeMsisdn } from "../../utils/msisdn";
import { Input } from "../../components/Input/Input";

type LandingContainerProps = {
  setMsisdn: (value: string) => void;
};

export const LandingContainer = ({ setMsisdn }: LandingContainerProps) => {
  const [localMsisdn, setLocalMsisdn] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  async function handleRequestOtp() {
    setError(null);
    if (!localMsisdn) return;
    const normalized = normalizeMsisdn(localMsisdn);
    if (!isValidMsisdn(normalized)) {
      setError("Please enter a valid mobile number (8–15 digits, digits only)");
      return;
    }
    setLoading(true);
    const res = await requestOtp(normalized);
    setLoading(false);
    if (res.success) {
      setMsisdn(normalized);
      navigate("/otp");
    } else {
      setError(res.message);
    }
  }
  return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <Phone className="h-12 w-12 text-black mx-auto mb-4" />
          <CardTitle className="text-2xl text-black">Welcome</CardTitle>
          <CardDescription className="text-gray-600">
            Enter your mobile number to get started
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-black">
              Mobile Number (MSISDN)
            </label>
            <Input
              type="tel"
              inputMode="numeric"
              pattern="\d*"
              placeholder="1234567890"
              value={localMsisdn}
              onChange={(e) => setLocalMsisdn(normalizeMsisdn(e.target.value))}
              className="border-gray-300"
            />
          </div>
          {error && <p className="text-sm text-red-600">{error}</p>}
          <Button
            disabled={
              !localMsisdn ||
              loading ||
              !isValidMsisdn(normalizeMsisdn(localMsisdn))
            }
            className="w-full disabled:opacity-50"
            onClick={handleRequestOtp}
          >
            {loading ? "Sending..." : "Request OTP"}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

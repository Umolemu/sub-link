import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../components/Card/Card";
import { Shield } from "lucide-react";
import { Button } from "../../components/Button/Button";
import { useNavigate } from "react-router-dom";
import { useRef, useEffect, useState } from "react";
import { verifyOtp } from "../../api/Otp/Otp";

type OtpContainerProps = {
  msisdn: string;
  otp: string;
  setOtp: (value: string) => void;
};

export const OtpContainer = ({ msisdn, otp, setOtp }: OtpContainerProps) => {
  const navigate = useNavigate();

  const length = 6;
  const digits = Array.from({ length }, (_, i) => otp[i] || "");
  const inputsRef = useRef<Array<HTMLInputElement | null>>([]);
  const [isVerifying, setIsVerifying] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const firstEmptyIndex = digits.findIndex((d) => d === "");
    const idx = firstEmptyIndex === -1 ? length - 1 : firstEmptyIndex;
    inputsRef.current[idx]?.focus();
  }, [otp]);

  const updateDigit = (index: number, value: string) => {
    if (!/^[0-9]?$/.test(value)) return;
    const next = [...digits];
    next[index] = value;
    const joined = next.join("");
    setOtp(joined);
    if (value && index < length - 1) {
      // move to next input automatically
      inputsRef.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (e.key === "Backspace") {
      if (digits[index]) {
        updateDigit(index, "");
      } else if (index > 0) {
        inputsRef.current[index - 1]?.focus();
        updateDigit(index - 1, "");
      }
    } else if (e.key === "ArrowLeft" && index > 0) {
      inputsRef.current[index - 1]?.focus();
    } else if (e.key === "ArrowRight" && index < length - 1) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const paste = e.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, length);
    if (!paste) return;
    const next = paste.padEnd(length, "").split("");
    setOtp(next.join(""));
  };

  const handleVerify = async () => {
    setError(null);
    if (otp.length !== length) {
      setError("Please enter all 6 digits");
      return;
    }
    setIsVerifying(true);
    const res = await verifyOtp(msisdn, otp);
    setIsVerifying(false);
    if (res.success) {
      navigate("/dashboard");
    } else {
      setError(res.message);
    }
  };
  return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <Shield className="h-12 w-12 text-black mx-auto mb-4" />
          <CardTitle className="text-2xl text-black">Verify OTP</CardTitle>
          <CardDescription className="text-gray-600">
            Enter the 6-digit code sent to {msisdn}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-black">OTP Code</label>
            <div className="flex justify-between gap-2" onPaste={handlePaste}>
              {digits.map((digit, i) => (
                <input
                  key={i}
                  ref={(el) => {
                    inputsRef.current[i] = el;
                  }}
                  inputMode="numeric"
                  pattern="[0-9]*"
                  maxLength={1}
                  className="w-12 h-12 text-center text-lg font-medium border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                  value={digit}
                  onChange={(e) => updateDigit(i, e.target.value.slice(-1))} // take last typed char
                  onKeyDown={(e) => handleKeyDown(i, e)}
                />
              ))}
            </div>
            {error && <p className="text-sm text-red-600">{error}</p>}
          </div>
          <Button
            className="w-full disabled:opacity-50"
            disabled={otp.length !== length || isVerifying}
            onClick={handleVerify}
          >
            {isVerifying ? "Verifying..." : "Verify & Login"}
          </Button>
          <Button
            variant="ghost"
            className="w-full text-gray-600 hover:bg-gray-100"
            onClick={() => navigate("/")}
          >
            Back to Login
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

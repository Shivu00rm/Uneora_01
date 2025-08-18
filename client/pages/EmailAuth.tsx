import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Mail, Shield, ArrowLeft, RefreshCw } from "lucide-react";

export default function EmailAuth() {
  const [step, setStep] = useState(1); // 1: Email, 2: OTP, 3: Success
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [isLoading, setIsLoading] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      setStep(2);
      setResendCooldown(30);

      // Start countdown
      const interval = setInterval(() => {
        setResendCooldown((prev) => {
          if (prev <= 1) {
            clearInterval(interval);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }, 1500);
  };

  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handleOtpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const otpValue = otp.join("");
    if (otpValue.length !== 6) return;

    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      if (otpValue === "123456") {
        setStep(3);
      } else {
        // Show error for invalid OTP
        setOtp(["", "", "", "", "", ""]);
      }
    }, 1500);
  };

  const handleResendOtp = () => {
    if (resendCooldown > 0) return;

    setResendCooldown(30);
    const interval = setInterval(() => {
      setResendCooldown((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/30 px-4">
      <div className="w-full max-w-md space-y-6">
        {/* Logo */}
        <div className="text-center">
          <Link
            to="/"
            className="flex items-center justify-center space-x-2 mb-4"
          >
            <img
              src="https://cdn.builder.io/api/v1/image/assets%2Fb7155483f4aa4218b0fd455934ead78a%2F70167a20be274a39b7819818c11d0910?format=webp&width=800"
              alt="Uneora Logo"
              className="h-10 w-10 object-contain"
            />
            <span className="text-2xl font-bold text-foreground">
              Uneora
            </span>
          </Link>
          <p className="text-muted-foreground">
            Secure authentication with email verification
          </p>
        </div>

        <Card>
          {/* Step 1: Email Entry */}
          {step === 1 && (
            <>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Mail className="h-5 w-5" />
                  Enter Your Email
                </CardTitle>
                <CardDescription>
                  We'll send you a verification code to sign in securely
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleEmailSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="Enter your email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      disabled={isLoading}
                    />
                  </div>

                  <Button
                    className="w-full"
                    type="submit"
                    disabled={isLoading || !email}
                  >
                    {isLoading ? (
                      <>
                        <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                        Sending Code...
                      </>
                    ) : (
                      <>
                        <Mail className="mr-2 h-4 w-4" />
                        Send Verification Code
                      </>
                    )}
                  </Button>
                </form>

                <div className="text-center mt-4">
                  <Link
                    to="/login"
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Back to traditional login
                  </Link>
                </div>
              </CardContent>
            </>
          )}

          {/* Step 2: OTP Verification */}
          {step === 2 && (
            <>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Verify Your Email
                </CardTitle>
                <CardDescription>
                  Enter the 6-digit code sent to{" "}
                  <span className="font-medium">{email}</span>
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleOtpSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label>Verification Code</Label>
                    <div className="flex gap-2 justify-center">
                      {otp.map((digit, index) => (
                        <Input
                          key={index}
                          id={`otp-${index}`}
                          type="text"
                          maxLength={1}
                          value={digit}
                          onChange={(e) =>
                            handleOtpChange(index, e.target.value)
                          }
                          className="w-12 h-12 text-center text-lg font-medium"
                          disabled={isLoading}
                          onKeyDown={(e) => {
                            if (e.key === "Backspace" && !digit && index > 0) {
                              const prevInput = document.getElementById(
                                `otp-${index - 1}`,
                              );
                              prevInput?.focus();
                            }
                          }}
                        />
                      ))}
                    </div>
                  </div>

                  <Button
                    className="w-full"
                    type="submit"
                    disabled={isLoading || otp.join("").length !== 6}
                  >
                    {isLoading ? (
                      <>
                        <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                        Verifying...
                      </>
                    ) : (
                      <>
                        <Shield className="mr-2 h-4 w-4" />
                        Verify & Sign In
                      </>
                    )}
                  </Button>
                </form>

                <div className="text-center mt-4 space-y-2">
                  <p className="text-sm text-muted-foreground">
                    Didn't receive the code?
                  </p>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleResendOtp}
                    disabled={resendCooldown > 0}
                  >
                    {resendCooldown > 0
                      ? `Resend in ${resendCooldown}s`
                      : "Resend Code"}
                  </Button>
                </div>

                <div className="text-center mt-4">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setStep(1)}
                    className="text-muted-foreground"
                  >
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Change Email
                  </Button>
                </div>

                {/* Demo hint */}
                <div className="mt-4 p-3 bg-muted rounded-lg">
                  <p className="text-sm text-muted-foreground text-center">
                    <strong>Demo:</strong> Use code{" "}
                    <Badge variant="outline">123456</Badge> to continue
                  </p>
                </div>
              </CardContent>
            </>
          )}

          {/* Step 3: Success */}
          {step === 3 && (
            <>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-emerald-600">
                  <Shield className="h-5 w-5" />
                  Authentication Successful!
                </CardTitle>
                <CardDescription>
                  You have been securely signed in to Uneora
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center py-4">
                  <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Shield className="h-8 w-8 text-emerald-600" />
                  </div>
                  <p className="text-muted-foreground">
                    Welcome to Uneora! Redirecting to your dashboard...
                  </p>
                </div>

                <Link to="/dashboard">
                  <Button className="w-full">Go to Dashboard</Button>
                </Link>

                <div className="text-center">
                  <Link
                    to="/"
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Back to home
                  </Link>
                </div>
              </CardContent>
            </>
          )}
        </Card>

        {/* Security Note */}
        <div className="text-center">
          <p className="text-xs text-muted-foreground">
            🔒 Secured with enterprise-grade encryption and OTP verification
          </p>
        </div>
      </div>
    </div>
  );
}

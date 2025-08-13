import React, { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Badge } from "./ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { usePermissions, useAuditLog } from "@/hooks/usePermissions";
import { Permission } from "@/lib/permissions";
import {
  AlertTriangle,
  Shield,
  Clock,
  Key,
  Eye,
  EyeOff,
  CheckCircle,
  XCircle,
} from "lucide-react";

interface SecurityConfirmationProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  action: string;
  description: string;
  permission: Permission;
  targetResource?: string;
  requiresMFA?: boolean;
  requiresPassword?: boolean;
  confirmationPhrase?: string;
}

export function SecurityConfirmation({
  isOpen,
  onClose,
  onConfirm,
  action,
  description,
  permission,
  targetResource,
  requiresMFA = true,
  requiresPassword = true,
  confirmationPhrase = "CONFIRM",
}: SecurityConfirmationProps) {
  const { user, needsSecondaryAuth } = usePermissions();
  const { logAction } = useAuditLog();
  const [password, setPassword] = useState("");
  const [mfaCode, setMfaCode] = useState("");
  const [confirmPhrase, setConfirmPhrase] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [error, setError] = useState("");

  const isHighImpact = needsSecondaryAuth(permission);

  const handleConfirm = async () => {
    setError("");
    setIsVerifying(true);

    try {
      // Validate confirmation phrase
      if (confirmPhrase.toUpperCase() !== confirmationPhrase.toUpperCase()) {
        throw new Error("Confirmation phrase does not match");
      }

      // Validate password if required
      if (requiresPassword && (!password || password.length < 8)) {
        throw new Error("Valid password required");
      }

      // Validate MFA if required
      if (requiresMFA && (!mfaCode || mfaCode.length !== 6)) {
        throw new Error("Valid 6-digit MFA code required");
      }

      // Simulate authentication delay
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Log the security event
      await logAction("security_confirmation_passed", "authorization", {
        action,
        permission,
        targetResource,
        requiresMFA,
        requiresPassword,
        timestamp: new Date().toISOString(),
      });

      onConfirm();
      handleClose();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Security verification failed",
      );

      // Log failed attempt
      await logAction("security_confirmation_failed", "authorization", {
        action,
        permission,
        targetResource,
        error: err instanceof Error ? err.message : "Unknown error",
        timestamp: new Date().toISOString(),
      });
    } finally {
      setIsVerifying(false);
    }
  };

  const handleClose = () => {
    setPassword("");
    setMfaCode("");
    setConfirmPhrase("");
    setError("");
    setShowPassword(false);
    onClose();
  };

  const isFormValid =
    confirmPhrase.toUpperCase() === confirmationPhrase.toUpperCase() &&
    (!requiresPassword || password.length >= 8) &&
    (!requiresMFA || mfaCode.length === 6);

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-yellow-500" />
            Security Confirmation Required
          </DialogTitle>
          <DialogDescription>
            This action requires additional security verification due to its
            high impact.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Action Details */}
          <div className="p-4 border rounded-lg bg-yellow-50 border-yellow-200">
            <div className="flex items-start gap-3">
              <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5" />
              <div className="flex-1">
                <h4 className="font-medium text-yellow-800 mb-1">{action}</h4>
                <p className="text-sm text-yellow-700">{description}</p>
                {targetResource && (
                  <p className="text-xs text-yellow-600 mt-2">
                    Target: {targetResource}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Security Requirements */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-sm font-medium">
              <Key className="h-4 w-4" />
              Security Requirements
            </div>

            {/* Confirmation Phrase */}
            <div className="space-y-2">
              <Label htmlFor="confirm-phrase">
                Type "{confirmationPhrase}" to confirm this action
              </Label>
              <Input
                id="confirm-phrase"
                value={confirmPhrase}
                onChange={(e) => setConfirmPhrase(e.target.value)}
                placeholder={`Type ${confirmationPhrase}`}
                className={
                  confirmPhrase &&
                  confirmPhrase.toUpperCase() !==
                    confirmationPhrase.toUpperCase()
                    ? "border-red-300"
                    : confirmPhrase.toUpperCase() ===
                          confirmationPhrase.toUpperCase() && confirmPhrase
                      ? "border-green-300"
                      : ""
                }
              />
            </div>

            {/* Password Verification */}
            {requiresPassword && (
              <div className="space-y-2">
                <Label htmlFor="password">Confirm your password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    className={
                      password && password.length < 8
                        ? "border-red-300"
                        : password.length >= 8
                          ? "border-green-300"
                          : ""
                    }
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-2 top-1/2 -translate-y-1/2 h-6 w-6 p-0"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>
            )}

            {/* MFA Code */}
            {requiresMFA && (
              <div className="space-y-2">
                <Label htmlFor="mfa-code">Two-Factor Authentication Code</Label>
                <Input
                  id="mfa-code"
                  value={mfaCode}
                  onChange={(e) =>
                    setMfaCode(e.target.value.replace(/\D/g, "").slice(0, 6))
                  }
                  placeholder="000000"
                  className={`font-mono text-center ${
                    mfaCode && mfaCode.length !== 6
                      ? "border-red-300"
                      : mfaCode.length === 6
                        ? "border-green-300"
                        : ""
                  }`}
                  maxLength={6}
                />
                <p className="text-xs text-muted-foreground">
                  Enter the 6-digit code from your authenticator app
                </p>
              </div>
            )}
          </div>

          {/* User Context */}
          <div className="p-3 bg-muted rounded-lg text-sm">
            <div className="flex items-center gap-2 mb-2">
              <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center">
                <span className="text-xs font-medium">
                  {user?.name?.charAt(0)}
                </span>
              </div>
              <span className="font-medium">{user?.name}</span>
              <Badge variant="outline" className="text-xs">
                {user?.role?.replace("_", " ")}
              </Badge>
            </div>
            <div className="text-xs text-muted-foreground">
              <div>Email: {user?.email}</div>
              <div>Organization: {user?.organizationName}</div>
              <div className="flex items-center gap-1 mt-1">
                <Clock className="h-3 w-3" />
                {new Date().toLocaleString()}
              </div>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-center gap-2 text-red-800">
                <XCircle className="h-4 w-4" />
                <span className="text-sm font-medium">{error}</span>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-2 pt-4 border-t">
            <Button
              onClick={handleConfirm}
              disabled={!isFormValid || isVerifying}
              className="flex-1"
              variant="destructive"
            >
              {isVerifying ? (
                <>
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent mr-2" />
                  Verifying...
                </>
              ) : (
                <>
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Confirm Action
                </>
              )}
            </Button>
            <Button
              variant="outline"
              onClick={handleClose}
              disabled={isVerifying}
            >
              Cancel
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// Hook for using security confirmation
export const useSecurityConfirmation = () => {
  const [confirmation, setConfirmation] = useState<{
    isOpen: boolean;
    action: string;
    description: string;
    permission: Permission;
    targetResource?: string;
    onConfirm: () => void;
  } | null>(null);

  const showConfirmation = (params: {
    action: string;
    description: string;
    permission: Permission;
    targetResource?: string;
    onConfirm: () => void;
  }) => {
    setConfirmation({
      isOpen: true,
      ...params,
    });
  };

  const hideConfirmation = () => {
    setConfirmation(null);
  };

  const ConfirmationDialog = confirmation ? (
    <SecurityConfirmation
      isOpen={confirmation.isOpen}
      onClose={hideConfirmation}
      onConfirm={confirmation.onConfirm}
      action={confirmation.action}
      description={confirmation.description}
      permission={confirmation.permission}
      targetResource={confirmation.targetResource}
    />
  ) : null;

  return {
    showConfirmation,
    ConfirmationDialog,
  };
};

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function Terms() {
  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">Terms of Service</h1>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Acceptance of Terms</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground">
          By accessing or using Uneora, you agree to these Terms. If you use the
          service on behalf of an organization, you represent that you have
          authority to bind that organization.
        </CardContent>
      </Card>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Accounts and Access</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground space-y-2">
          <ul className="list-disc pl-6 space-y-1">
            <li>
              You are responsible for safeguarding credentials and activity
              under your account.
            </li>
            <li>
              We may suspend or terminate accounts for policy violations,
              security concerns, or non-payment.
            </li>
          </ul>
        </CardContent>
      </Card>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Acceptable Use</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground space-y-2">
          <ul className="list-disc pl-6 space-y-1">
            <li>No illegal, harmful, or infringing content or activities.</li>
            <li>
              No attempts to disrupt, reverse-engineer, or bypass security
              controls.
            </li>
          </ul>
        </CardContent>
      </Card>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Subscriptions and Billing</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground space-y-2">
          <ul className="list-disc pl-6 space-y-1">
            <li>
              Paid plans renew automatically unless canceled as per plan terms.
            </li>
            <li>
              Fees are non-refundable except where required by law or explicitly
              stated.
            </li>
          </ul>
        </CardContent>
      </Card>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Intellectual Property</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground">
          The service, including software and content, is owned by Uneora or its
          licensors. You retain ownership of your data. You grant us a limited
          license to process your data to provide the service.
        </CardContent>
      </Card>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Disclaimers and Liability</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground">
          The service is provided "as is" without warranties. To the maximum
          extent permitted by law, Uneora is not liable for indirect,
          incidental, or consequential damages.
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Contact</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground">
          For questions about these Terms, contact legal@uneora.com.
        </CardContent>
      </Card>
    </div>
  );
}

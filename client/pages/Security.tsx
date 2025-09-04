import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function Security() {
  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">Security</h1>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Our Security Practices</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground space-y-2">
          <ul className="list-disc pl-6 space-y-1">
            <li>
              Data encrypted in transit (TLS) and at rest (provider-managed)
            </li>
            <li>
              Role-based access controls and audit logging across critical
              actions
            </li>
            <li>
              Principle of least privilege for infrastructure and application
              access
            </li>
            <li>Regular backups and disaster recovery procedures</li>
          </ul>
        </CardContent>
      </Card>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Compliance and Privacy</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground">
          We follow industry best practices for security and privacy. See the
          Privacy Policy for details on how data is collected and processed.
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Reporting</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground">
          Found a vulnerability? Report security issues to security@uneora.com.
          We review and respond promptly.
        </CardContent>
      </Card>
    </div>
  );
}

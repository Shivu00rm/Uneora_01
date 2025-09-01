import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function Privacy() {
  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">Privacy Policy</h1>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Overview</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm text-muted-foreground">
          <p>
            We respect your privacy and are committed to protecting your personal information. This policy explains what data we collect, how we use it, and your rights.
          </p>
        </CardContent>
      </Card>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Information We Collect</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm text-muted-foreground">
          <ul className="list-disc pl-6 space-y-1">
            <li>Account data (name, email, organization, role)</li>
            <li>Product usage events for improving features and security</li>
            <li>Billing details required to process subscriptions</li>
            <li>Files and records you upload to the platform</li>
          </ul>
        </CardContent>
      </Card>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>How We Use Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm text-muted-foreground">
          <ul className="list-disc pl-6 space-y-1">
            <li>Provide and maintain the Uneora service</li>
            <li>Secure accounts, detect fraud, and enforce policies</li>
            <li>Improve product performance and user experience</li>
            <li>Process payments and manage subscriptions</li>
            <li>Send important service notifications</li>
          </ul>
        </CardContent>
      </Card>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Data Sharing</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm text-muted-foreground">
          <p>
            We do not sell personal data. We share information with trusted processors only to deliver our service (e.g., hosting, analytics, payments). Each processor is bound by confidentiality and security obligations.
          </p>
        </CardContent>
      </Card>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Data Retention and Deletion</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm text-muted-foreground">
          <p>
            We retain data for as long as your account is active and as required by law. You may request deletion of your account data; some records may be retained for compliance, auditing, and fraud prevention.
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Your Rights</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm text-muted-foreground">
          <ul className="list-disc pl-6 space-y-1">
            <li>Access, correct, or export your personal data</li>
            <li>Object to or restrict certain processing</li>
            <li>Request account deletion subject to legal obligations</li>
            <li>Contact support for privacy inquiries at support@uneora.com</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}

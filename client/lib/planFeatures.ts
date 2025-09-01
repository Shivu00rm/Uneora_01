export type Plan = "starter" | "growth" | "pro" | "enterprise";

export const ALL_FEATURES = [
  "basic_inventory",
  "pos",
  "vendors",
  "purchase_orders",
  "analytics_basic",
  "files",
  "ecommerce_sync",
  "whatsapp_alerts",
  "reports_export",
  "automation",
  "api_access",
  "analytics_advanced",
  "priority_support",
  "dedicated_support",
  "custom_integrations",
  "sla_guarantee",
] as const;

export type Feature = typeof ALL_FEATURES[number];

export const PLAN_FEATURES: Record<Plan, Feature[]> = {
  starter: [
    "basic_inventory",
    "pos",
    "analytics_basic",
    "files",
  ],
  growth: [
    "basic_inventory",
    "pos",
    "analytics_basic",
    "files",
    "vendors",
    "purchase_orders",
    "ecommerce_sync",
    "whatsapp_alerts",
    "reports_export",
  ],
  pro: [
    "basic_inventory",
    "pos",
    "analytics_basic",
    "files",
    "vendors",
    "purchase_orders",
    "ecommerce_sync",
    "whatsapp_alerts",
    "reports_export",
    "automation",
    "api_access",
    "analytics_advanced",
    "priority_support",
  ],
  enterprise: [
    "basic_inventory",
    "pos",
    "analytics_basic",
    "files",
    "vendors",
    "purchase_orders",
    "ecommerce_sync",
    "whatsapp_alerts",
    "reports_export",
    "automation",
    "api_access",
    "analytics_advanced",
    "priority_support",
    "dedicated_support",
    "custom_integrations",
    "sla_guarantee",
  ],
};

export const isFeatureInPlan = (plan: Plan, feature: Feature) => {
  return PLAN_FEATURES[plan].includes(feature);
};

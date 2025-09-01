export type VendorContact = {
  email?: string;
  whatsapp?: string;
};

const STORAGE_KEY = "vendor_contacts";

function loadStore(): Record<string, VendorContact> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    if (parsed && typeof parsed === "object") return parsed;
    return {};
  } catch {
    return {};
  }
}

function saveStore(store: Record<string, VendorContact>) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
  } catch {}
}

export function getVendorContact(vendorName: string): VendorContact | undefined {
  const store = loadStore();
  return store[vendorName];
}

export function upsertVendorContact(
  vendorName: string,
  contact: VendorContact,
): VendorContact {
  const store = loadStore();
  const updated = { ...(store[vendorName] || {}), ...contact };
  store[vendorName] = sanitizedContact(updated);
  saveStore(store);
  return store[vendorName];
}

export function sanitizedContact(c: VendorContact): VendorContact {
  const result: VendorContact = {};
  if (c.email) result.email = c.email.trim();
  if (c.whatsapp) {
    // Keep only digits for wa.me format
    const digits = c.whatsapp.replace(/\D+/g, "");
    result.whatsapp = digits;
  }
  return result;
}

export function ensureContactForVendor(vendorName: string): VendorContact {
  const store = loadStore();
  if (!store[vendorName]) {
    store[vendorName] = {};
    saveStore(store);
  }
  return store[vendorName];
}

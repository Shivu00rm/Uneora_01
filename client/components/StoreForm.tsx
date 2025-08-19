import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Store, 
  MapPin, 
  Clock, 
  Settings,
  Phone,
  Mail,
  User,
  DollarSign,
  Save,
  X
} from "lucide-react";
import type { Store } from "@shared/api";

interface StoreFormProps {
  store?: Store | null;
  onSave: (storeData: Partial<Store>) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

const timeSlots = Array.from({ length: 24 }, (_, i) => {
  const hour = i.toString().padStart(2, '0');
  return `${hour}:00`;
});

const daysOfWeek = [
  { key: 'monday', label: 'Monday' },
  { key: 'tuesday', label: 'Tuesday' },
  { key: 'wednesday', label: 'Wednesday' },
  { key: 'thursday', label: 'Thursday' },
  { key: 'friday', label: 'Friday' },
  { key: 'saturday', label: 'Saturday' },
  { key: 'sunday', label: 'Sunday' }
];

export function StoreForm({ store, onSave, onCancel, isLoading = false }: StoreFormProps) {
  const [formData, setFormData] = useState<Partial<Store>>({
    name: store?.name || "",
    code: store?.code || "",
    type: store?.type || "physical",
    address: {
      street: store?.address?.street || "",
      city: store?.address?.city || "",
      state: store?.address?.state || "",
      country: store?.address?.country || "India",
      pincode: store?.address?.pincode || "",
      coordinates: store?.address?.coordinates || undefined
    },
    contact: {
      phone: store?.contact?.phone || "",
      email: store?.contact?.email || "",
      manager: store?.contact?.manager || ""
    },
    settings: {
      timezone: store?.settings?.timezone || "Asia/Kolkata",
      currency: store?.settings?.currency || "INR",
      taxSettings: {
        gstNumber: store?.settings?.taxSettings?.gstNumber || "",
        taxRate: store?.settings?.taxSettings?.taxRate || 18
      },
      operatingHours: store?.settings?.operatingHours || {
        monday: { open: "09:00", close: "18:00" },
        tuesday: { open: "09:00", close: "18:00" },
        wednesday: { open: "09:00", close: "18:00" },
        thursday: { open: "09:00", close: "18:00" },
        friday: { open: "09:00", close: "18:00" },
        saturday: { open: "09:00", close: "18:00" },
        sunday: { open: "10:00", close: "17:00", closed: false }
      }
    },
    status: store?.status || "active"
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleInputChange = (field: string, value: any) => {
    const fieldParts = field.split('.');
    
    if (fieldParts.length === 1) {
      setFormData(prev => ({ ...prev, [field]: value }));
    } else if (fieldParts.length === 2) {
      setFormData(prev => ({
        ...prev,
        [fieldParts[0]]: {
          ...prev[fieldParts[0] as keyof typeof prev],
          [fieldParts[1]]: value
        }
      }));
    } else if (fieldParts.length === 3) {
      setFormData(prev => ({
        ...prev,
        [fieldParts[0]]: {
          ...prev[fieldParts[0] as keyof typeof prev],
          [fieldParts[1]]: {
            ...(prev[fieldParts[0] as keyof typeof prev] as any)?.[fieldParts[1]],
            [fieldParts[2]]: value
          }
        }
      }));
    }

    // Clear error for this field
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }));
    }
  };

  const handleOperatingHoursChange = (day: string, type: 'open' | 'close' | 'closed', value: any) => {
    setFormData(prev => ({
      ...prev,
      settings: {
        ...prev.settings!,
        operatingHours: {
          ...prev.settings!.operatingHours,
          [day]: {
            ...(prev.settings!.operatingHours as any)[day],
            [type]: value
          }
        }
      }
    }));
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name?.trim()) {
      newErrors['name'] = 'Store name is required';
    }

    if (!formData.code?.trim()) {
      newErrors['code'] = 'Store code is required';
    }

    if (!formData.address?.street?.trim()) {
      newErrors['address.street'] = 'Street address is required';
    }

    if (!formData.address?.city?.trim()) {
      newErrors['address.city'] = 'City is required';
    }

    if (!formData.address?.state?.trim()) {
      newErrors['address.state'] = 'State is required';
    }

    if (!formData.address?.pincode?.trim()) {
      newErrors['address.pincode'] = 'Pincode is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (validateForm()) {
      onSave(formData);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] overflow-hidden">
        <div className="flex justify-between items-center p-6 border-b">
          <div>
            <h2 className="text-2xl font-bold">
              {store ? 'Edit Store' : 'Create New Store'}
            </h2>
            <p className="text-gray-600">
              {store ? 'Update store information and settings' : 'Add a new store location to your organization'}
            </p>
          </div>
          <Button variant="ghost" onClick={onCancel}>
            <X className="h-6 w-6" />
          </Button>
        </div>

        <div className="overflow-y-auto max-h-[calc(90vh-140px)]">
          <div className="p-6">
            <Tabs defaultValue="basic" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="basic">Basic Info</TabsTrigger>
                <TabsTrigger value="address">Address</TabsTrigger>
                <TabsTrigger value="contact">Contact</TabsTrigger>
                <TabsTrigger value="settings">Settings</TabsTrigger>
              </TabsList>

              <TabsContent value="basic" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Store className="h-5 w-5" />
                      Store Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="name">Store Name *</Label>
                        <Input
                          id="name"
                          value={formData.name || ""}
                          onChange={(e) => handleInputChange('name', e.target.value)}
                          placeholder="Downtown Store"
                          className={errors['name'] ? 'border-red-500' : ''}
                        />
                        {errors['name'] && (
                          <p className="text-red-500 text-sm mt-1">{errors['name']}</p>
                        )}
                      </div>

                      <div>
                        <Label htmlFor="code">Store Code *</Label>
                        <Input
                          id="code"
                          value={formData.code || ""}
                          onChange={(e) => handleInputChange('code', e.target.value.toUpperCase())}
                          placeholder="DS001"
                          className={errors['code'] ? 'border-red-500' : ''}
                        />
                        {errors['code'] && (
                          <p className="text-red-500 text-sm mt-1">{errors['code']}</p>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="type">Store Type</Label>
                        <Select
                          value={formData.type || "physical"}
                          onValueChange={(value) => handleInputChange('type', value)}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="physical">Physical Store</SelectItem>
                            <SelectItem value="online">Online Store</SelectItem>
                            <SelectItem value="hybrid">Hybrid Store</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <Label htmlFor="status">Status</Label>
                        <Select
                          value={formData.status || "active"}
                          onValueChange={(value) => handleInputChange('status', value)}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="active">Active</SelectItem>
                            <SelectItem value="inactive">Inactive</SelectItem>
                            <SelectItem value="maintenance">Maintenance</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="address" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <MapPin className="h-5 w-5" />
                      Store Address
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="street">Street Address *</Label>
                      <Textarea
                        id="street"
                        value={formData.address?.street || ""}
                        onChange={(e) => handleInputChange('address.street', e.target.value)}
                        placeholder="123 Main Street, Building Name"
                        className={errors['address.street'] ? 'border-red-500' : ''}
                      />
                      {errors['address.street'] && (
                        <p className="text-red-500 text-sm mt-1">{errors['address.street']}</p>
                      )}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="city">City *</Label>
                        <Input
                          id="city"
                          value={formData.address?.city || ""}
                          onChange={(e) => handleInputChange('address.city', e.target.value)}
                          placeholder="Mumbai"
                          className={errors['address.city'] ? 'border-red-500' : ''}
                        />
                        {errors['address.city'] && (
                          <p className="text-red-500 text-sm mt-1">{errors['address.city']}</p>
                        )}
                      </div>

                      <div>
                        <Label htmlFor="state">State *</Label>
                        <Input
                          id="state"
                          value={formData.address?.state || ""}
                          onChange={(e) => handleInputChange('address.state', e.target.value)}
                          placeholder="Maharashtra"
                          className={errors['address.state'] ? 'border-red-500' : ''}
                        />
                        {errors['address.state'] && (
                          <p className="text-red-500 text-sm mt-1">{errors['address.state']}</p>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="pincode">Pincode *</Label>
                        <Input
                          id="pincode"
                          value={formData.address?.pincode || ""}
                          onChange={(e) => handleInputChange('address.pincode', e.target.value)}
                          placeholder="400001"
                          className={errors['address.pincode'] ? 'border-red-500' : ''}
                        />
                        {errors['address.pincode'] && (
                          <p className="text-red-500 text-sm mt-1">{errors['address.pincode']}</p>
                        )}
                      </div>

                      <div>
                        <Label htmlFor="country">Country</Label>
                        <Input
                          id="country"
                          value={formData.address?.country || "India"}
                          onChange={(e) => handleInputChange('address.country', e.target.value)}
                          placeholder="India"
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="contact" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Phone className="h-5 w-5" />
                      Contact Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="manager">Store Manager</Label>
                      <Input
                        id="manager"
                        value={formData.contact?.manager || ""}
                        onChange={(e) => handleInputChange('contact.manager', e.target.value)}
                        placeholder="Rajesh Kumar"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="phone">Phone Number</Label>
                        <Input
                          id="phone"
                          value={formData.contact?.phone || ""}
                          onChange={(e) => handleInputChange('contact.phone', e.target.value)}
                          placeholder="+91 9876543210"
                        />
                      </div>

                      <div>
                        <Label htmlFor="email">Email Address</Label>
                        <Input
                          id="email"
                          type="email"
                          value={formData.contact?.email || ""}
                          onChange={(e) => handleInputChange('contact.email', e.target.value)}
                          placeholder="store@company.com"
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="settings" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Settings className="h-5 w-5" />
                      Store Settings
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="timezone">Timezone</Label>
                        <Select
                          value={formData.settings?.timezone || "Asia/Kolkata"}
                          onValueChange={(value) => handleInputChange('settings.timezone', value)}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Asia/Kolkata">Asia/Kolkata (IST)</SelectItem>
                            <SelectItem value="UTC">UTC</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <Label htmlFor="currency">Currency</Label>
                        <Select
                          value={formData.settings?.currency || "INR"}
                          onValueChange={(value) => handleInputChange('settings.currency', value)}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="INR">Indian Rupee (₹)</SelectItem>
                            <SelectItem value="USD">US Dollar ($)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="gstNumber">GST Number</Label>
                        <Input
                          id="gstNumber"
                          value={formData.settings?.taxSettings?.gstNumber || ""}
                          onChange={(e) => handleInputChange('settings.taxSettings.gstNumber', e.target.value)}
                          placeholder="27AAAAA0000A1Z5"
                        />
                      </div>

                      <div>
                        <Label htmlFor="taxRate">Tax Rate (%)</Label>
                        <Input
                          id="taxRate"
                          type="number"
                          value={formData.settings?.taxSettings?.taxRate || 18}
                          onChange={(e) => handleInputChange('settings.taxSettings.taxRate', Number(e.target.value))}
                          placeholder="18"
                        />
                      </div>
                    </div>

                    {/* Operating Hours */}
                    {formData.type === "physical" && (
                      <div>
                        <Label className="text-base font-medium">Operating Hours</Label>
                        <div className="space-y-3 mt-3">
                          {daysOfWeek.map((day) => (
                            <div key={day.key} className="flex items-center gap-4">
                              <div className="w-20 text-sm font-medium">{day.label}</div>
                              <div className="flex items-center gap-2">
                                <Select
                                  value={(formData.settings?.operatingHours as any)?.[day.key]?.open || "09:00"}
                                  onValueChange={(value) => handleOperatingHoursChange(day.key, 'open', value)}
                                >
                                  <SelectTrigger className="w-24">
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {timeSlots.map(time => (
                                      <SelectItem key={time} value={time}>{time}</SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                                <span className="text-sm text-gray-500">to</span>
                                <Select
                                  value={(formData.settings?.operatingHours as any)?.[day.key]?.close || "18:00"}
                                  onValueChange={(value) => handleOperatingHoursChange(day.key, 'close', value)}
                                >
                                  <SelectTrigger className="w-24">
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {timeSlots.map(time => (
                                      <SelectItem key={time} value={time}>{time}</SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                                <label className="flex items-center gap-2">
                                  <input
                                    type="checkbox"
                                    checked={(formData.settings?.operatingHours as any)?.[day.key]?.closed || false}
                                    onChange={(e) => handleOperatingHoursChange(day.key, 'closed', e.target.checked)}
                                  />
                                  <span className="text-sm text-gray-600">Closed</span>
                                </label>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>

        <div className="flex justify-end gap-2 p-6 border-t bg-gray-50">
          <Button variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={isLoading}>
            {isLoading ? (
              <>Saving...</>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                {store ? 'Update Store' : 'Create Store'}
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}

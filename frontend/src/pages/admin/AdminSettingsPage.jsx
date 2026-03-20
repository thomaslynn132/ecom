import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loading } from '@/components/ui/loading';
import { useToast } from '@/hooks/useToast';
import { useSettings, useUpdateSettings } from '@/hooks/useApi';

export default function AdminSettingsPage() {
  const { toast } = useToast();
  const { data, isLoading } = useSettings();
  const updateMutation = useUpdateSettings();
  const [formData, setFormData] = useState(null);

  useEffect(() => {
    if (data?.data) {
      setFormData({
        storeName: data.data.storeName || '',
        storeEmail: data.data.storeEmail || '',
        storePhone: data.data.storePhone || '',
        storeAddress: data.data.storeAddress || '',
        currency: { code: data.data.currency?.code || 'USD', symbol: data.data.currency?.symbol || '$', position: data.data.currency?.position || 'before' },
        tax: { enabled: data.data.tax?.enabled || false, rate: data.data.tax?.rate || 0 },
        shipping: { freeShippingThreshold: data.data.shipping?.freeShippingThreshold || 50, defaultFee: data.data.shipping?.defaultFee || 5, enabled: data.data.shipping?.enabled !== false },
        lowStockThreshold: data.data.lowStockThreshold || 10,
      });
    }
  }, [data]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateMutation.mutateAsync(formData);
      toast({ title: 'Settings saved successfully' });
    } catch (error) {
      toast({ title: 'Failed to save settings', variant: 'destructive' });
    }
  };

  if (isLoading || !formData) return <Loading />;

  return (
    <div>
      <h1 className="mb-8 text-3xl font-bold">Settings</h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card>
          <CardHeader><CardTitle>Store Information</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div><Label>Store Name</Label><Input value={formData.storeName} onChange={(e) => setFormData({ ...formData, storeName: e.target.value })} /></div>
              <div><Label>Store Email</Label><Input type="email" value={formData.storeEmail} onChange={(e) => setFormData({ ...formData, storeEmail: e.target.value })} /></div>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <div><Label>Phone</Label><Input value={formData.storePhone} onChange={(e) => setFormData({ ...formData, storePhone: e.target.value })} /></div>
              <div><Label>Address</Label><Input value={formData.storeAddress} onChange={(e) => setFormData({ ...formData, storeAddress: e.target.value })} /></div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Currency</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-3">
              <div><Label>Code</Label><Input value={formData.currency.code} onChange={(e) => setFormData({ ...formData, currency: { ...formData.currency, code: e.target.value } })} /></div>
              <div><Label>Symbol</Label><Input value={formData.currency.symbol} onChange={(e) => setFormData({ ...formData, currency: { ...formData.currency, symbol: e.target.value } })} /></div>
              <div><Label>Position</Label><select className="w-full h-10 rounded-md border border-input bg-background px-3" value={formData.currency.position} onChange={(e) => setFormData({ ...formData, currency: { ...formData.currency, position: e.target.value } })}><option value="before">Before amount</option><option value="after">After amount</option></select></div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Tax Settings</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-4">
              <input type="checkbox" id="taxEnabled" checked={formData.tax.enabled} onChange={(e) => setFormData({ ...formData, tax: { ...formData.tax, enabled: e.target.checked } })} />
              <Label htmlFor="taxEnabled">Enable Tax</Label>
            </div>
            {formData.tax.enabled && (
              <div className="max-w-xs"><Label>Tax Rate (%)</Label><Input type="number" step="0.01" min="0" max="100" value={formData.tax.rate} onChange={(e) => setFormData({ ...formData, tax: { ...formData.tax, rate: parseFloat(e.target.value) } })} /></div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Shipping Settings</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-4">
              <input type="checkbox" id="shippingEnabled" checked={formData.shipping.enabled} onChange={(e) => setFormData({ ...formData, shipping: { ...formData.shipping, enabled: e.target.checked } })} />
              <Label htmlFor="shippingEnabled">Enable Shipping</Label>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <div><Label>Free Shipping Threshold ($)</Label><Input type="number" value={formData.shipping.freeShippingThreshold} onChange={(e) => setFormData({ ...formData, shipping: { ...formData.shipping, freeShippingThreshold: parseFloat(e.target.value) } })} /></div>
              <div><Label>Default Shipping Fee ($)</Label><Input type="number" value={formData.shipping.defaultFee} onChange={(e) => setFormData({ ...formData, shipping: { ...formData.shipping, defaultFee: parseFloat(e.target.value) } })} /></div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Inventory</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="max-w-xs"><Label>Low Stock Threshold</Label><Input type="number" value={formData.lowStockThreshold} onChange={(e) => setFormData({ ...formData, lowStockThreshold: parseInt(e.target.value) })} /></div>
          </CardContent>
        </Card>

        <div className="flex justify-end">
          <Button type="submit" disabled={updateMutation.isPending}>{updateMutation.isPending ? 'Saving...' : 'Save Settings'}</Button>
        </div>
      </form>
    </div>
  );
}

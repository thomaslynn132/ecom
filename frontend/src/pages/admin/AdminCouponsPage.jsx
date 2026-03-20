import { useState } from 'react';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Loading } from '@/components/ui/loading';
import { EmptyState } from '@/components/ui/empty-state';
import { useToast } from '@/hooks/useToast';
import { useCoupons, useCreateCoupon, useUpdateCoupon, useDeleteCoupon } from '@/hooks/useApi';

export default function AdminCouponsPage() {
  const { toast } = useToast();
  const { data, isLoading } = useCoupons();
  const createMutation = useCreateCoupon();
  const updateMutation = useUpdateCoupon();
  const deleteMutation = useDeleteCoupon();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState(null);
  const [formData, setFormData] = useState({
    code: '', description: '', discountType: 'percentage', discountValue: '', maxDiscount: '',
    minOrderValue: '', usageLimit: '', expiresAt: '', isActive: true
  });

  const handleOpenDialog = (coupon = null) => {
    if (coupon) {
      setEditingCoupon(coupon);
      setFormData({
        code: coupon.code, description: coupon.description || '', discountType: coupon.discountType,
        discountValue: coupon.discountValue, maxDiscount: coupon.maxDiscount || '',
        minOrderValue: coupon.minOrderValue || '', usageLimit: coupon.usageLimit || '',
        expiresAt: coupon.expiresAt?.split('T')[0] || '', isActive: coupon.isActive
      });
    } else {
      setEditingCoupon(null);
      setFormData({ code: '', description: '', discountType: 'percentage', discountValue: '', maxDiscount: '', minOrderValue: '', usageLimit: '', expiresAt: '', isActive: true });
    }
    setIsDialogOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = { ...formData, discountValue: parseFloat(formData.discountValue), maxDiscount: formData.maxDiscount ? parseFloat(formData.maxDiscount) : null, minOrderValue: parseFloat(formData.minOrderValue) || 0, usageLimit: formData.usageLimit ? parseInt(formData.usageLimit) : null };
    try {
      if (editingCoupon) {
        await updateMutation.mutateAsync({ id: editingCoupon._id, payload });
        toast({ title: 'Coupon updated' });
      } else {
        await createMutation.mutateAsync(payload);
        toast({ title: 'Coupon created' });
      }
      setIsDialogOpen(false);
    } catch (error) {
      toast({ title: error.response?.data?.message || 'Failed', variant: 'destructive' });
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this coupon?')) return;
    try {
      await deleteMutation.mutateAsync(id);
      toast({ title: 'Coupon deleted' });
    } catch (error) {
      toast({ title: 'Failed to delete', variant: 'destructive' });
    }
  };

  if (isLoading) return <Loading />;

  const coupons = data?.data || [];

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-3xl font-bold">Coupons</h1>
        <Button onClick={() => handleOpenDialog()}><Plus className="mr-2 h-4 w-4" /> Add Coupon</Button>
      </div>

      <Card>
        <Card className="p-0">
          {coupons.length === 0 ? (
            <EmptyState icon="file" title="No coupons" description="Create discount codes for your customers" action={() => handleOpenDialog()} actionLabel="Add Coupon" />
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Code</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Value</TableHead>
                  <TableHead>Used</TableHead>
                  <TableHead>Expires</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {coupons.map((coupon) => (
                  <TableRow key={coupon._id}>
                    <TableCell className="font-mono font-medium">{coupon.code}</TableCell>
                    <TableCell className="capitalize">{coupon.discountType}</TableCell>
                    <TableCell>{coupon.discountType === 'percentage' ? `${coupon.discountValue}%` : `$${coupon.discountValue}`}</TableCell>
                    <TableCell>{coupon.usedCount}{coupon.usageLimit ? `/${coupon.usageLimit}` : ''}</TableCell>
                    <TableCell>{new Date(coupon.expiresAt).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <Badge variant={coupon.isActive ? 'default' : 'secondary'}>
                        {coupon.isActive ? 'Active' : 'Inactive'}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm" onClick={() => handleOpenDialog(coupon)}>Edit</Button>
                      <Button variant="ghost" size="sm" className="text-destructive" onClick={() => handleDelete(coupon._id)}>Delete</Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </Card>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader><DialogTitle>{editingCoupon ? 'Edit' : 'Add'} Coupon</DialogTitle></DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div><Label>Code</Label><Input className="uppercase" value={formData.code} onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })} required /></div>
            <div><Label>Description</Label><Input value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} /></div>
            <div className="grid grid-cols-2 gap-4">
              <div><Label>Type</Label><select className="w-full h-10 rounded-md border border-input bg-background px-3" value={formData.discountType} onChange={(e) => setFormData({ ...formData, discountType: e.target.value })}><option value="percentage">Percentage</option><option value="fixed">Fixed</option></select></div>
              <div><Label>Value</Label><Input type="number" value={formData.discountValue} onChange={(e) => setFormData({ ...formData, discountValue: e.target.value })} required /></div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div><Label>Max Discount</Label><Input type="number" value={formData.maxDiscount} onChange={(e) => setFormData({ ...formData, maxDiscount: e.target.value })} placeholder="For % type" /></div>
              <div><Label>Min Order</Label><Input type="number" value={formData.minOrderValue} onChange={(e) => setFormData({ ...formData, minOrderValue: e.target.value })} /></div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div><Label>Usage Limit</Label><Input type="number" value={formData.usageLimit} onChange={(e) => setFormData({ ...formData, usageLimit: e.target.value })} placeholder="Unlimited" /></div>
              <div><Label>Expires At</Label><Input type="date" value={formData.expiresAt} onChange={(e) => setFormData({ ...formData, expiresAt: e.target.value })} required /></div>
            </div>
            <div className="flex items-center gap-2">
              <input type="checkbox" id="isActive" checked={formData.isActive} onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })} />
              <Label htmlFor="isActive">Active</Label>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
              <Button type="submit" disabled={createMutation.isPending || updateMutation.isPending}>{editingCoupon ? 'Update' : 'Create'}</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

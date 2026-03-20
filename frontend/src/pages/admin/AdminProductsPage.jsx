import { useState, useEffect } from 'react';
import { Plus, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Loading, TableSkeleton } from '@/components/ui/loading';
import { EmptyState } from '@/components/ui/empty-state';
import { useToast } from '@/hooks/useToast';
import { useProducts, useCategories, useCreateProduct, useUpdateProduct, useDeleteProduct } from '@/hooks/useApi';

export default function AdminProductsPage() {
  const { toast } = useToast();
  const [params, setParams] = useState({ page: 1, limit: 10, search: '' });
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [formData, setFormData] = useState({ name: '', description: '', price: '', category: '', stock: '', sku: '', images: [''], isActive: true, featured: false });

  const { data, isLoading, refetch } = useProducts(params);
  const { data: categoriesData } = useCategories();
  const createMutation = useCreateProduct();
  const updateMutation = useUpdateProduct();
  const deleteMutation = useDeleteProduct();

  const categories = categoriesData?.data || [];

  useEffect(() => {
    if (categories.length > 0 && !formData.category) {
      setFormData(prev => ({ ...prev, category: categories[0]._id }));
    }
  }, [categories]);

  const handleOpenDialog = (product = null) => {
    if (product) {
      setEditingProduct(product);
      setFormData({
        name: product.name, description: product.description, price: product.price,
        category: typeof product.category === 'object' ? product.category._id : product.category,
        stock: product.stock, sku: product.sku || '', images: product.images || [''],
        isActive: product.isActive !== false, featured: product.featured || false
      });
    } else {
      setEditingProduct(null);
      setFormData({ name: '', description: '', price: '', category: categories[0]?._id || '', stock: '', sku: '', images: [''], isActive: true, featured: false });
    }
    setIsDialogOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = { ...formData, price: parseFloat(formData.price), stock: parseInt(formData.stock), images: formData.images.filter(img => img.trim()) };
    try {
      if (editingProduct) {
        await updateMutation.mutateAsync({ id: editingProduct._id, payload });
        toast({ title: 'Product updated' });
      } else {
        await createMutation.mutateAsync(payload);
        toast({ title: 'Product created' });
      }
      setIsDialogOpen(false);
      refetch();
    } catch (error) {
      toast({ title: error.response?.data?.message || 'Failed', variant: 'destructive' });
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this product?')) return;
    try {
      await deleteMutation.mutateAsync(id);
      toast({ title: 'Product deleted' });
      refetch();
    } catch (error) {
      toast({ title: 'Failed to delete', variant: 'destructive' });
    }
  };

  if (isLoading) return <Loading />;

  const result = data?.data || { products: [], totalPages: 1, currentPage: 1, total: 0 };

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-3xl font-bold">Products</h1>
        <Button onClick={() => handleOpenDialog()}><Plus className="mr-2 h-4 w-4" /> Add Product</Button>
      </div>

      <div className="mb-6 flex gap-4">
        <Input placeholder="Search products..." value={params.search} onChange={(e) => setParams({ ...params, search: e.target.value })} className="max-w-sm" />
        <Button onClick={() => setParams({ ...params, page: 1 })}>Search</Button>
      </div>

      <Card>
        {result.products.length === 0 ? (
          <EmptyState icon="package" title="No products" description="Add your first product to get started" action={() => handleOpenDialog()} actionLabel="Add Product" />
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Stock</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {result.products.map((product) => (
                <TableRow key={product._id}>
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-2">
                      {product.stock === 0 && <AlertTriangle className="h-4 w-4 text-red-500" />}
                      {product.isLowStock && <AlertTriangle className="h-4 w-4 text-orange-500" />}
                      {product.name}
                    </div>
                  </TableCell>
                  <TableCell>{typeof product.category === 'object' ? product.category.name : product.category}</TableCell>
                  <TableCell>${product.price}</TableCell>
                  <TableCell>
                    <span className={product.stock === 0 ? 'text-red-600 font-medium' : product.isLowStock ? 'text-orange-600' : ''}>
                      {product.stock}
                    </span>
                  </TableCell>
                  <TableCell>
                    <Badge variant={product.isActive ? 'default' : 'secondary'}>{product.isActive ? 'Active' : 'Draft'}</Badge>
                  </TableCell>
                  <TableCell className="text-right space-x-2">
                    <Button variant="ghost" size="sm" onClick={() => handleOpenDialog(product)}>Edit</Button>
                    <Button variant="ghost" size="sm" className="text-destructive" onClick={() => handleDelete(product._id)}>Delete</Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </Card>

      {result.totalPages > 1 && (
        <div className="mt-4 flex justify-center gap-2">
          <Button variant="outline" disabled={result.currentPage <= 1} onClick={() => setParams({ ...params, page: params.page - 1 })}>Previous</Button>
          <span className="flex items-center px-4">Page {result.currentPage} of {result.totalPages}</span>
          <Button variant="outline" disabled={result.currentPage >= result.totalPages} onClick={() => setParams({ ...params, page: params.page + 1 })}>Next</Button>
        </div>
      )}

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader><DialogTitle>{editingProduct ? 'Edit' : 'Add'} Product</DialogTitle></DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div><Label>Name</Label><Input value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required /></div>
            <div><Label>Description</Label><textarea className="min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2" value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} required /></div>
            <div className="grid grid-cols-2 gap-4">
              <div><Label>Price ($)</Label><Input type="number" step="0.01" value={formData.price} onChange={(e) => setFormData({ ...formData, price: e.target.value })} required /></div>
              <div><Label>Stock</Label><Input type="number" value={formData.stock} onChange={(e) => setFormData({ ...formData, stock: e.target.value })} required /></div>
            </div>
            <div><Label>Category</Label><select className="w-full h-10 rounded-md border border-input bg-background px-3" value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value })}>{categories.map(cat => <option key={cat._id} value={cat._id}>{cat.name}</option>)}</select></div>
            <div><Label>SKU</Label><Input value={formData.sku} onChange={(e) => setFormData({ ...formData, sku: e.target.value })} /></div>
            <div><Label>Image URL</Label><Input value={formData.images[0] || ''} onChange={(e) => setFormData({ ...formData, images: [e.target.value] })} placeholder="https://..." /></div>
            <div className="flex gap-4">
              <div className="flex items-center gap-2"><input type="checkbox" id="isActive" checked={formData.isActive} onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })} /><Label htmlFor="isActive">Active</Label></div>
              <div className="flex items-center gap-2"><input type="checkbox" id="featured" checked={formData.featured} onChange={(e) => setFormData({ ...formData, featured: e.target.checked })} /><Label htmlFor="featured">Featured</Label></div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
              <Button type="submit" disabled={createMutation.isPending || updateMutation.isPending}>{editingProduct ? 'Update' : 'Create'}</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

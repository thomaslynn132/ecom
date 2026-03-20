import { useState } from 'react';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Loading, TableSkeleton } from '@/components/ui/loading';
import { EmptyState } from '@/components/ui/empty-state';
import { useToast } from '@/hooks/useToast';
import { useCategories, useCategoryTree, useCreateCategory, useUpdateCategory, useDeleteCategory } from '@/hooks/useApi';

export default function AdminCategoriesPage() {
  const { toast } = useToast();
  const { data: tree, isLoading } = useCategoryTree();
  const createMutation = useCreateCategory();
  const updateMutation = useUpdateCategory();
  const deleteMutation = useDeleteCategory();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [formData, setFormData] = useState({ name: '', description: '', parent: '', isActive: true });

  const handleOpenDialog = (cat = null, parentId = null) => {
    if (cat) {
      setEditingCategory(cat);
      setFormData({ name: cat.name, description: cat.description || '', parent: cat.parent?._id || '', isActive: cat.isActive });
    } else {
      setEditingCategory(null);
      setFormData({ name: '', description: '', parent: parentId || '', isActive: true });
    }
    setIsDialogOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingCategory) {
        await updateMutation.mutateAsync({ id: editingCategory._id, payload: formData });
        toast({ title: 'Category updated successfully' });
      } else {
        await createMutation.mutateAsync(formData);
        toast({ title: 'Category created successfully' });
      }
      setIsDialogOpen(false);
    } catch (error) {
      toast({ title: error.response?.data?.message || 'Failed to save category', variant: 'destructive' });
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this category?')) return;
    try {
      await deleteMutation.mutateAsync(id);
      toast({ title: 'Category deleted' });
    } catch (error) {
      toast({ title: error.response?.data?.message || 'Failed to delete', variant: 'destructive' });
    }
  };

  const flattenTree = (categories, depth = 0) => {
    let result = [];
    categories.forEach((cat) => {
      result.push({ ...cat, depth });
      if (cat.children?.length) {
        result = result.concat(flattenTree(cat.children, depth + 1));
      }
    });
    return result;
  };

  if (isLoading) return <Loading />;

  const flatCategories = flattenTree(tree || []);

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-3xl font-bold">Categories</h1>
        <Button onClick={() => handleOpenDialog()}><Plus className="mr-2 h-4 w-4" /> Add Category</Button>
      </div>

      <Card>
        <CardContent className="p-0">
          {flatCategories.length === 0 ? (
            <EmptyState icon="file" title="No categories" description="Create your first category to organize products" action={() => handleOpenDialog()} actionLabel="Add Category" />
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Slug</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {flatCategories.map((cat) => (
                  <TableRow key={cat._id} style={{ paddingLeft: cat.depth * 24 }}>
                    <TableCell className={cat.depth > 0 ? 'pl-8' : ''}>
                      <span className={cat.depth > 0 ? 'text-muted-foreground' : 'font-medium'}>
                        {cat.name}
                      </span>
                    </TableCell>
                    <TableCell className="text-muted-foreground">{cat.slug}</TableCell>
                    <TableCell>
                      <span className={`text-xs px-2 py-1 rounded ${cat.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                        {cat.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </TableCell>
                    <TableCell className="text-right space-x-2">
                      <Button variant="ghost" size="sm" onClick={() => handleOpenDialog(cat)}>Edit</Button>
                      <Button variant="ghost" size="sm" onClick={() => handleOpenDialog(null, cat._id)}>Add Child</Button>
                      <Button variant="ghost" size="sm" className="text-destructive" onClick={() => handleDelete(cat._id)}>Delete</Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>{editingCategory ? 'Edit' : 'Add'} Category</DialogTitle></DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div><Label>Name</Label><Input value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required /></div>
            <div><Label>Description</Label><Input value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} /></div>
            <div className="flex items-center gap-2">
              <input type="checkbox" id="isActive" checked={formData.isActive} onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })} />
              <Label htmlFor="isActive">Active</Label>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
              <Button type="submit" disabled={createMutation.isPending || updateMutation.isPending}>
                {editingCategory ? 'Update' : 'Create'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

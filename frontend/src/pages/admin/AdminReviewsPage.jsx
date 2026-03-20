import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Loading, TableSkeleton } from '@/components/ui/loading';
import { EmptyState } from '@/components/ui/empty-state';
import { useToast } from '@/hooks/useToast';
import { useReviews, useDeleteReview } from '@/hooks/useApi';

export default function AdminReviewsPage() {
  const { toast } = useToast();
  const [params, setParams] = useState({ page: 1, limit: 10 });
  const [search, setSearch] = useState('');
  const { data, isLoading, refetch } = useReviews(params);
  const deleteMutation = useDeleteReview();

  const handleSearch = (e) => {
    e.preventDefault();
    setParams({ ...params, search, page: 1 });
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this review?')) return;
    try {
      await deleteMutation.mutateAsync(id);
      toast({ title: 'Review deleted' });
    } catch (error) {
      toast({ title: 'Failed to delete', variant: 'destructive' });
    }
  };

  if (isLoading) return <Loading />;

  const result = data?.data || { reviews: [], totalPages: 1, currentPage: 1, total: 0 };

  return (
    <div>
      <h1 className="mb-8 text-3xl font-bold">Reviews</h1>

      <form onSubmit={handleSearch} className="mb-6 flex gap-4">
        <Input placeholder="Search reviews..." value={search} onChange={(e) => setSearch(e.target.value)} className="max-w-sm" />
        <Button type="submit">Search</Button>
      </form>

      <Card>
        {result.reviews.length === 0 ? (
          <EmptyState icon="file" title="No reviews" description="No reviews found matching your criteria" />
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Product</TableHead>
                <TableHead>User</TableHead>
                <TableHead>Rating</TableHead>
                <TableHead>Comment</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {result.reviews.map((review) => (
                <TableRow key={review._id}>
                  <TableCell className="max-w-[150px] truncate">{review.product?.name || 'N/A'}</TableCell>
                  <TableCell>{review.user?.name || 'Anonymous'}</TableCell>
                  <TableCell><span className="text-yellow-500">{'★'.repeat(review.rating)}</span></TableCell>
                  <TableCell className="max-w-[200px] truncate">{review.comment}</TableCell>
                  <TableCell>
                    <Badge variant={review.isApproved ? 'default' : 'secondary'}>
                      {review.isApproved ? 'Approved' : 'Pending'}
                    </Badge>
                  </TableCell>
                  <TableCell>{new Date(review.createdAt).toLocaleDateString()}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm" className="text-destructive" onClick={() => handleDelete(review._id)}>Delete</Button>
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
    </div>
  );
}

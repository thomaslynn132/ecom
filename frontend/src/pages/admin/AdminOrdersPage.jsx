import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Loading } from '@/components/ui/loading';
import { EmptyState } from '@/components/ui/empty-state';
import { useToast } from '@/hooks/useToast';
import { useOrders, useUpdateOrderStatus } from '@/hooks/useApi';

const statusColors = {
  pending: 'bg-yellow-100 text-yellow-800',
  processing: 'bg-blue-100 text-blue-800',
  shipped: 'bg-purple-100 text-purple-800',
  delivered: 'bg-green-100 text-green-800',
  cancelled: 'bg-red-100 text-red-800',
};

const paymentStatusColors = {
  pending: 'bg-yellow-100 text-yellow-800',
  paid: 'bg-green-100 text-green-800',
  failed: 'bg-red-100 text-red-800',
  refunded: 'bg-gray-100 text-gray-800',
};

export default function AdminOrdersPage() {
  const { toast } = useToast();
  const [params, setParams] = useState({ page: 1, limit: 10, status: '' });
  const [search, setSearch] = useState('');
  const { data, isLoading, refetch } = useOrders(params);
  const updateStatusMutation = useUpdateOrderStatus();

  const handleSearch = (e) => {
    e.preventDefault();
    setParams({ ...params, search, page: 1 });
  };

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await updateStatusMutation.mutateAsync({ id: orderId, payload: { status: newStatus } });
      toast({ title: 'Order status updated' });
    } catch (error) {
      toast({ title: 'Failed to update status', variant: 'destructive' });
    }
  };

  if (isLoading) return <Loading />;

  const result = data?.data || { orders: [], totalPages: 1, currentPage: 1, total: 0 };

  return (
    <div>
      <h1 className="mb-8 text-3xl font-bold">Orders</h1>

      <div className="mb-6 flex gap-4 flex-wrap">
        <form onSubmit={handleSearch} className="flex gap-4">
          <Input placeholder="Search by order # or name..." value={search} onChange={(e) => setSearch(e.target.value)} className="max-w-sm" />
          <Button type="submit">Search</Button>
        </form>
        <select
          className="h-10 rounded-md border border-input bg-background px-3"
          value={params.status}
          onChange={(e) => setParams({ ...params, status: e.target.value, page: 1 })}
        >
          <option value="">All Status</option>
          <option value="pending">Pending</option>
          <option value="processing">Processing</option>
          <option value="shipped">Shipped</option>
          <option value="delivered">Delivered</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>

      <Card>
        {result.orders.length === 0 ? (
          <EmptyState icon="cart" title="No orders" description="Orders will appear here when customers place them" />
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order #</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Items</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Payment</TableHead>
                <TableHead>Date</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {result.orders.map((order) => (
                <TableRow key={order._id}>
                  <TableCell className="font-mono text-sm">{order.orderNumber}</TableCell>
                  <TableCell>
                    <div>
                      <p className="font-medium">{order.user?.name || order.shippingAddress?.fullName}</p>
                      <p className="text-xs text-muted-foreground">{order.user?.email}</p>
                    </div>
                  </TableCell>
                  <TableCell>{order.items?.length || 0}</TableCell>
                  <TableCell className="font-medium">${order.total?.toFixed(2)}</TableCell>
                  <TableCell>
                    <select
                      className={`text-xs px-2 py-1 rounded border-0 ${statusColors[order.status]}`}
                      value={order.status}
                      onChange={(e) => handleStatusChange(order._id, e.target.value)}
                      disabled={updateStatusMutation.isPending}
                    >
                      <option value="pending">Pending</option>
                      <option value="processing">Processing</option>
                      <option value="shipped">Shipped</option>
                      <option value="delivered">Delivered</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </TableCell>
                  <TableCell>
                    <Badge className={paymentStatusColors[order.payment?.status]}>
                      {order.payment?.status || 'pending'}
                    </Badge>
                  </TableCell>
                  <TableCell>{new Date(order.createdAt).toLocaleDateString()}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm" onClick={() => {/* TODO: view details */}}>View</Button>
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

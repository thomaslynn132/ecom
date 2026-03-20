import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Loading } from '@/components/ui/loading';
import { EmptyState } from '@/components/ui/empty-state';
import { useUsers } from '@/hooks/useApi';

export default function AdminUsersPage() {
  const [params, setParams] = useState({ page: 1, limit: 10, search: '' });
  const { data, isLoading } = useUsers(params);

  const handleSearch = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    setParams({ ...params, search: formData.get('search'), page: 1 });
  };

  if (isLoading) return <Loading />;

  const result = data?.data || [];

  return (
    <div>
      <h1 className="mb-8 text-3xl font-bold">Users</h1>

      <form onSubmit={handleSearch} className="mb-6 flex gap-4">
        <Input placeholder="Search by name or email..." name="search" defaultValue={params.search} className="max-w-sm" />
        <Button type="submit">Search</Button>
      </form>

      <Card>
        {result.length === 0 ? (
          <EmptyState icon="users" title="No users" description="No users found matching your criteria" />
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Joined</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {result.map((user) => (
                <TableRow key={user._id}>
                  <TableCell className="font-medium">{user.name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    <Badge variant={user.role === 'admin' ? 'default' : 'secondary'}>
                      {user.role}
                    </Badge>
                  </TableCell>
                  <TableCell>{new Date(user.createdAt).toLocaleDateString()}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </Card>
    </div>
  );
}

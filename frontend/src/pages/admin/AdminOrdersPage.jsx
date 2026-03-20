import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function AdminOrdersPage() {
  return (
    <div>
      <h1 className="mb-8 text-3xl font-bold">Orders</h1>

      <Card>
        <CardHeader>
          <CardTitle>All Orders</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Order management coming soon. This feature requires the Order module to be implemented.</p>
        </CardContent>
      </Card>
    </div>
  );
}

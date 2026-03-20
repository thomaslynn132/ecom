import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, Package, ShoppingCart, DollarSign, AlertTriangle, TrendingUp } from 'lucide-react';
import { Loading } from '@/components/ui/loading';
import { useProductStats, useUserStats, useOrderStats } from '@/hooks/useApi';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

export default function AdminDashboardPage() {
  const { data: productStats, isLoading: loadingProducts } = useProductStats();
  const { data: userStats, isLoading: loadingUsers } = useUserStats();
  const { data: orderStats, isLoading: loadingOrders } = useOrderStats();

  const isLoading = loadingProducts || loadingUsers || loadingOrders;

  if (isLoading) return <Loading />;

  const products = productStats?.data || {};
  const users = userStats?.data || {};
  const orders = orderStats?.data || {};

  const orderStatusData = Object.entries(orders.ordersByStatus || {}).map(([name, value]) => ({
    name: name.charAt(0).toUpperCase() + name.slice(1),
    value
  }));

  const cards = [
    { title: 'Total Users', value: users.totalUsers || 0, icon: Users, color: 'text-blue-500', bg: 'bg-blue-500/10' },
    { title: 'Total Products', value: products.totalProducts || 0, icon: Package, color: 'text-green-500', bg: 'bg-green-500/10' },
    { title: 'Total Orders', value: orders.totalOrders || 0, icon: ShoppingCart, color: 'text-purple-500', bg: 'bg-purple-500/10' },
    { title: 'Revenue', value: `$${(orders.totalRevenue || 0).toLocaleString()}`, icon: DollarSign, color: 'text-yellow-500', bg: 'bg-yellow-500/10' },
  ];

  return (
    <div>
      <h1 className="mb-8 text-3xl font-bold">Dashboard</h1>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
        {cards.map((card) => (
          <Card key={card.title}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">{card.title}</CardTitle>
              <div className={`p-2 rounded-lg ${card.bg}`}>
                <card.icon className={`h-4 w-4 ${card.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{card.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2 mb-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" /> Orders by Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            {orderStatusData.length > 0 ? (
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={orderStatusData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      fill="#8884d8"
                      paddingAngle={5}
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {orderStatusData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <p className="text-center text-muted-foreground py-8">No order data available</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-orange-500" /> Inventory Alerts
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center p-4 bg-red-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full bg-red-500" />
                  <span className="font-medium">Out of Stock</span>
                </div>
                <span className="text-xl font-bold text-red-600">{products.outOfStock || 0}</span>
              </div>
              <div className="flex justify-between items-center p-4 bg-orange-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full bg-orange-500" />
                  <span className="font-medium">Low Stock</span>
                </div>
                <span className="text-xl font-bold text-orange-600">{products.lowStock || 0}</span>
              </div>
              <div className="flex justify-between items-center p-4 bg-green-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full bg-green-500" />
                  <span className="font-medium">Active Products</span>
                </div>
                <span className="text-xl font-bold text-green-600">{products.active || 0}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Orders</CardTitle>
        </CardHeader>
        <CardContent>
          {orders.recentOrders?.length > 0 ? (
            <div className="space-y-4">
              {orders.recentOrders.map((order) => (
                <div key={order._id} className="flex justify-between items-center p-4 border rounded-lg">
                  <div>
                    <p className="font-medium">{order.orderNumber}</p>
                    <p className="text-sm text-muted-foreground">{order.user?.name || 'Guest'}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold">${order.total?.toFixed(2)}</p>
                    <span className={`text-xs px-2 py-1 rounded ${order.status === 'delivered' ? 'bg-green-100 text-green-800' : order.status === 'cancelled' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'}`}>
                      {order.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-muted-foreground py-8">No recent orders</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

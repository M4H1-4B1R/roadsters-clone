import { adminDb } from "@/lib/supabase/admin";
import { DollarSign, ShoppingCart, Package, FolderTree } from "lucide-react";

async function getStats() {
  const [orderSum, orderCount, productCount, categoryCount] = await Promise.all([
    adminDb
      .from("orders")
      .select("total")
      .neq("status", "cancelled"),
    adminDb
      .from("orders")
      .select("id", { count: "exact", head: true }),
    adminDb
      .from("products")
      .select("id", { count: "exact", head: true }),
    adminDb
      .from("categories")
      .select("id", { count: "exact", head: true }),
  ]);

  const totalRevenue =
    orderSum.data?.reduce((sum, o) => sum + Number(o.total), 0) ?? 0;

  return {
    totalRevenue,
    totalOrders: orderCount.count ?? 0,
    totalProducts: productCount.count ?? 0,
    totalCategories: categoryCount.count ?? 0,
  };
}

function StatCard({
  title,
  value,
  icon: Icon,
  format,
}: {
  title: string;
  value: number;
  icon: React.ElementType;
  format?: (v: number) => string;
}) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 flex items-start gap-4">
      <div className="p-3 rounded-lg bg-blue-50 text-blue-700">
        <Icon size={24} />
      </div>
      <div>
        <p className="text-sm text-gray-500">{title}</p>
        <p className="text-2xl font-bold text-gray-900 mt-1">
          {format ? format(value) : value.toLocaleString()}
        </p>
      </div>
    </div>
  );
}

export default async function AdminDashboard() {
  const stats = await getStats();

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Dashboard</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Revenue"
          value={stats.totalRevenue}
          icon={DollarSign}
          format={(v) => `$${v.toFixed(2)}`}
        />
        <StatCard
          title="Total Orders"
          value={stats.totalOrders}
          icon={ShoppingCart}
        />
        <StatCard
          title="Total Products"
          value={stats.totalProducts}
          icon={Package}
        />
        <StatCard
          title="Total Categories"
          value={stats.totalCategories}
          icon={FolderTree}
        />
      </div>
    </div>
  );
}

import { useEffect, useState } from "react";
import LoadingSpinner from "../../components/LoadingSpinner";
import { adminService } from "../../services/adminService";

function AdminDashboard() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    adminService.getStats().then((response) => setStats(response.data.stats));
  }, []);

  if (!stats) return <LoadingSpinner />;

  return (
    <>
      <h1 className="section-title">Admin Dashboard</h1>
      <div className="row g-3">
        <Stat label="Users" value={stats.total_users} />
        <Stat label="Products" value={stats.total_products} />
        <Stat label="Orders" value={stats.total_orders} />
        <Stat label="Inquiries" value={stats.total_inquiries} />
      </div>
    </>
  );
}

function Stat({ label, value }) {
  return <div className="col-md-3"><div className="stat-box"><span>{label}</span><strong>{value}</strong></div></div>;
}

export default AdminDashboard;

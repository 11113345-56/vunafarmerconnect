import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import LoadingSpinner from "../../components/LoadingSpinner";
import { orderService } from "../../services/orderService";
import { inquiryService } from "../../services/inquiryService";

function BuyerDashboard() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    async function loadStats() {
      const [ordersRes, inquiriesRes] = await Promise.all([
        orderService.getMyOrders(),
        inquiryService.getMyInquiries()
      ]);

      setStats({
        orders: ordersRes.data.orders.length,
        pending: ordersRes.data.orders.filter((order) => order.status === "pending").length,
        inquiries: inquiriesRes.data.inquiries.length
      });
    }

    loadStats();
  }, []);

  if (!stats) return <LoadingSpinner />;

  return (
    <>
      <h1 className="section-title">Buyer Dashboard</h1>
      <div className="row g-3 mb-4">
        <Stat label="My orders" value={stats.orders} />
        <Stat label="Pending orders" value={stats.pending} />
        <Stat label="My inquiries" value={stats.inquiries} />
      </div>
      <Link className="btn btn-success" to="/products">Browse available produce</Link>
    </>
  );
}

function Stat({ label, value }) {
  return <div className="col-md-4"><div className="stat-box"><span>{label}</span><strong>{value}</strong></div></div>;
}

export default BuyerDashboard;

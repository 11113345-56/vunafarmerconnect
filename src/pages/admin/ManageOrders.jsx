import { useEffect, useState } from "react";
import AlertMessage from "../../components/AlertMessage";
import LoadingSpinner from "../../components/LoadingSpinner";
import { adminService } from "../../services/adminService";
import { orderService } from "../../services/orderService";
import { formatCurrency } from "../../utils/formatCurrency";

function ManageOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function loadOrders() {
    const response = await adminService.getOrders();
    setOrders(response.data.orders);
  }

  useEffect(() => {
    loadOrders().catch(() => setError("Unable to load orders.")).finally(() => setLoading(false));
  }, []);

  async function changeStatus(id, status) {
    await orderService.updateStatus(id, status);
    await loadOrders();
  }

  if (loading) return <LoadingSpinner />;

  return (
    <>
      <h1 className="section-title">Manage Orders</h1>
      <AlertMessage type="danger" message={error} />
      <div className="table-responsive data-table">
        <table className="table align-middle">
          <thead><tr><th>Product</th><th>Buyer</th><th>Farmer</th><th>Total</th><th>Status</th><th></th></tr></thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id}>
                <td>{order.product_name}</td>
                <td>{order.buyer_name}</td>
                <td>{order.farmer_name}</td>
                <td>{formatCurrency(order.total_estimated_price)}</td>
                <td><span className="badge bg-secondary">{order.status}</span></td>
                <td className="text-end">
                  <select className="form-select form-select-sm" value={order.status} onChange={(e) => changeStatus(order.id, e.target.value)}>
                    <option value="pending">pending</option>
                    <option value="accepted">accepted</option>
                    <option value="rejected">rejected</option>
                    <option value="completed">completed</option>
                    <option value="cancelled">cancelled</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

export default ManageOrders;

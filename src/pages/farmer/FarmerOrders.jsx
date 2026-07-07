import { useEffect, useState } from "react";
import AlertMessage from "../../components/AlertMessage";
import LoadingSpinner from "../../components/LoadingSpinner";
import { orderService } from "../../services/orderService";
import { formatCurrency } from "../../utils/formatCurrency";

function FarmerOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function loadOrders() {
    const response = await orderService.getFarmerOrders();
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
      <h1 className="section-title">Buyer Orders</h1>
      <AlertMessage type="danger" message={error} />
      <div className="table-responsive data-table">
        <table className="table align-middle">
          <thead><tr><th>Product</th><th>Buyer</th><th>Qty</th><th>Total</th><th>Status</th><th></th></tr></thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id}>
                <td>{order.product_name}</td>
                <td>{order.buyer_name}<br /><span className="text-muted small">{order.buyer_phone}</span></td>
                <td>{order.quantity_requested} {order.unit}</td>
                <td>{formatCurrency(order.total_estimated_price)}</td>
                <td><span className="badge bg-secondary">{order.status}</span></td>
                <td className="text-end">
                  <button className="btn btn-sm btn-outline-success me-2" onClick={() => changeStatus(order.id, "accepted")}>Accept</button>
                  <button className="btn btn-sm btn-outline-danger" onClick={() => changeStatus(order.id, "rejected")}>Reject</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

export default FarmerOrders;

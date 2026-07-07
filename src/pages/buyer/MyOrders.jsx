import { useEffect, useState } from "react";
import AlertMessage from "../../components/AlertMessage";
import LoadingSpinner from "../../components/LoadingSpinner";
import { orderService } from "../../services/orderService";
import { formatCurrency } from "../../utils/formatCurrency";
import { formatDate } from "../../utils/formatDate";

function MyOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    orderService.getMyOrders()
      .then((response) => setOrders(response.data.orders))
      .catch(() => setError("Unable to load orders."))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingSpinner />;

  return (
    <>
      <h1 className="section-title">My Orders</h1>
      <AlertMessage type="danger" message={error} />
      <div className="table-responsive data-table">
        <table className="table align-middle">
          <thead><tr><th>Product</th><th>Farmer</th><th>Qty</th><th>Total</th><th>Status</th><th>Date</th></tr></thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id}>
                <td>{order.product_name}</td>
                <td>{order.farmer_name}</td>
                <td>{order.quantity_requested} {order.unit}</td>
                <td>{formatCurrency(order.total_estimated_price)}</td>
                <td><span className="badge bg-secondary">{order.status}</span></td>
                <td>{formatDate(order.created_at)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

export default MyOrders;

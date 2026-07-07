import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import AlertMessage from "../../components/AlertMessage";
import LoadingSpinner from "../../components/LoadingSpinner";
import { productService } from "../../services/productService";
import { formatCurrency } from "../../utils/formatCurrency";

function MyProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function loadProducts() {
    const response = await productService.getMyProducts();
    setProducts(response.data.products);
  }

  useEffect(() => {
    loadProducts().catch(() => setError("Unable to load your products.")).finally(() => setLoading(false));
  }, []);

  async function handleDelete(id) {
    if (!window.confirm("Remove this listing from public search?")) return;

    try {
      await productService.deleteProduct(id);
      await loadProducts();
    } catch (err) {
      setError(err.response?.data?.message || "Unable to delete product.");
    }
  }

  if (loading) return <LoadingSpinner />;

  return (
    <>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h1 className="section-title mb-0">My Products</h1>
        <Link className="btn btn-success" to="/farmer/products/new">Add product</Link>
      </div>
      <AlertMessage type="danger" message={error} />
      <div className="table-responsive data-table">
        <table className="table align-middle">
          <thead><tr><th>Product</th><th>Price</th><th>Quantity</th><th>District</th><th>Status</th><th></th></tr></thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.id}>
                <td>{product.product_name}</td>
                <td>{formatCurrency(product.price_per_unit)}</td>
                <td>{product.quantity} {product.unit}</td>
                <td>{product.district}</td>
                <td><span className="badge bg-success-subtle text-success">{product.availability_status}</span></td>
                <td className="text-end">
                  <Link className="btn btn-sm btn-outline-success me-2" to={`/farmer/products/${product.id}/edit`}>Edit</Link>
                  <button className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(product.id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

export default MyProducts;

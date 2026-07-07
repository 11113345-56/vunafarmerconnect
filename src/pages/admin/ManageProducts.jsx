import { useEffect, useState } from "react";
import AlertMessage from "../../components/AlertMessage";
import LoadingSpinner from "../../components/LoadingSpinner";
import { adminService } from "../../services/adminService";
import { productService } from "../../services/productService";
import { formatCurrency } from "../../utils/formatCurrency";

function ManageProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function loadProducts() {
    const response = await adminService.getProducts();
    setProducts(response.data.products);
  }

  useEffect(() => {
    loadProducts().catch(() => setError("Unable to load products.")).finally(() => setLoading(false));
  }, []);

  async function removeProduct(id) {
    if (!window.confirm("Remove this listing from public search?")) return;
    await productService.deleteProduct(id);
    await loadProducts();
  }

  if (loading) return <LoadingSpinner />;

  return (
    <>
      <h1 className="section-title">Manage Products</h1>
      <AlertMessage type="danger" message={error} />
      <div className="table-responsive data-table">
        <table className="table align-middle">
          <thead><tr><th>Product</th><th>Farmer</th><th>Category</th><th>Price</th><th>Status</th><th></th></tr></thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.id}>
                <td>{product.product_name}</td>
                <td>{product.farmer_name}</td>
                <td>{product.category_name}</td>
                <td>{formatCurrency(product.price_per_unit)}</td>
                <td><span className="badge bg-secondary">{product.availability_status}</span></td>
                <td className="text-end"><button className="btn btn-sm btn-outline-danger" onClick={() => removeProduct(product.id)}>Remove</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

export default ManageProducts;

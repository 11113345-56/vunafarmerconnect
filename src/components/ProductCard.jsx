import { Link } from "react-router-dom";
import { formatCurrency } from "../utils/formatCurrency";

const uploadsUrl = import.meta.env.VITE_UPLOADS_URL || "http://localhost:5000";

function ProductCard({ product }) {
  const imageUrl = product.image ? `${uploadsUrl}${product.image}` : "https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=900&q=80";

  return (
    <div className="card product-card h-100">
      <img src={imageUrl} className="card-img-top product-image" alt={product.product_name} />
      <div className="card-body d-flex flex-column">
        <div className="d-flex justify-content-between align-items-start gap-2">
          <h3 className="h5 card-title mb-1">{product.product_name}</h3>
          <span className="badge bg-success-subtle text-success">{product.availability_status}</span>
        </div>
        <p className="text-muted small mb-2">{product.category_name || "Produce"} · {product.district}</p>
        <p className="mb-1 fw-semibold">{formatCurrency(product.price_per_unit)} / {product.unit}</p>
        <p className="small text-muted mb-3">{product.quantity} {product.unit} available</p>
        <Link className="btn btn-success mt-auto" to={`/products/${product.id}`}>
          View details
        </Link>
      </div>
    </div>
  );
}

export default ProductCard;

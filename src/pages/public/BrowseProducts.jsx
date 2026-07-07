import { useEffect, useState } from "react";
import ProductCard from "../../components/ProductCard";
import LoadingSpinner from "../../components/LoadingSpinner";
import AlertMessage from "../../components/AlertMessage";
import { productService } from "../../services/productService";
import { adminService } from "../../services/adminService";

function BrowseProducts() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [filters, setFilters] = useState({ name: "", category_id: "", district: "", min_price: "", max_price: "", min_quantity: "" });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function loadProducts(nextFilters = filters) {
    setLoading(true);
    setError("");

    try {
      const response = await productService.getProducts(nextFilters);
      setProducts(response.data.products);
    } catch (err) {
      setError(err.response?.data?.message || "Unable to load products.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    async function loadInitialData() {
      const categoryResponse = await adminService.getCategories();
      setCategories(categoryResponse.data.categories);
      await loadProducts();
    }

    loadInitialData().catch(() => {
      setError("Unable to load products.");
      setLoading(false);
    });
  }, []);

  function handleChange(event) {
    setFilters({ ...filters, [event.target.name]: event.target.value });
  }

  function handleSubmit(event) {
    event.preventDefault();
    loadProducts(filters);
  }

  function clearFilters() {
    const emptyFilters = { name: "", category_id: "", district: "", min_price: "", max_price: "", min_quantity: "" };
    setFilters(emptyFilters);
    loadProducts(emptyFilters);
  }

  return (
    <div className="container py-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h1 className="section-title mb-0">Browse Produce</h1>
      </div>
      <form className="filter-bar row g-2 mb-4" onSubmit={handleSubmit}>
        <div className="col-md-3">
          <input className="form-control" name="name" placeholder="Search product" value={filters.name} onChange={handleChange} />
        </div>
        <div className="col-md-2">
          <select className="form-select" name="category_id" value={filters.category_id} onChange={handleChange}>
            <option value="">All categories</option>
            {categories.map((category) => <option key={category.id} value={category.id}>{category.name}</option>)}
          </select>
        </div>
        <div className="col-md-2">
          <input className="form-control" name="district" placeholder="District" value={filters.district} onChange={handleChange} />
        </div>
        <div className="col-md-1">
          <input className="form-control" name="min_price" placeholder="Min price" value={filters.min_price} onChange={handleChange} />
        </div>
        <div className="col-md-1">
          <input className="form-control" name="max_price" placeholder="Max price" value={filters.max_price} onChange={handleChange} />
        </div>
        <div className="col-md-1">
          <input className="form-control" name="min_quantity" placeholder="Qty" value={filters.min_quantity} onChange={handleChange} />
        </div>
        <div className="col-md-2 d-flex gap-2">
          <button className="btn btn-success flex-fill" type="submit">Search</button>
          <button className="btn btn-outline-secondary" type="button" onClick={clearFilters}>Clear</button>
        </div>
      </form>
      <AlertMessage type="danger" message={error} />
      {loading ? <LoadingSpinner /> : (
        <div className="row g-4">
          {products.map((product) => (
            <div className="col-sm-6 col-lg-4 col-xl-3" key={product.id}>
              <ProductCard product={product} />
            </div>
          ))}
          {products.length === 0 && <p className="text-muted">No products match your search.</p>}
        </div>
      )}
    </div>
  );
}

export default BrowseProducts;

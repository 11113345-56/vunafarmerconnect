import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AlertMessage from "../../components/AlertMessage";
import { adminService } from "../../services/adminService";
import { productService } from "../../services/productService";

const emptyProduct = {
  category_id: "",
  product_name: "",
  description: "",
  quantity: "",
  unit: "kg",
  price_per_unit: "",
  district: "",
  location_details: "",
  harvest_date: ""
};

function AddProduct() {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState(emptyProduct);
  const [image, setImage] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    adminService.getCategories().then((response) => setCategories(response.data.categories));
  }, []);

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");

    const data = new FormData();
    Object.entries(form).forEach(([key, value]) => data.append(key, value));
    if (image) data.append("image", image);

    try {
      await productService.createProduct(data);
      navigate("/farmer/products");
    } catch (err) {
      setError(err.response?.data?.message || "Unable to create product.");
    }
  }

  return (
    <ProductForm
      title="Add Product"
      form={form}
      setForm={setForm}
      categories={categories}
      error={error}
      onImageChange={setImage}
      onSubmit={handleSubmit}
    />
  );
}

export function ProductForm({ title, form, setForm, categories, error, onImageChange, onSubmit }) {
  function handleChange(event) {
    setForm({ ...form, [event.target.name]: event.target.value });
  }

  return (
    <form className="form-panel" onSubmit={onSubmit}>
      <h1 className="section-title">{title}</h1>
      <AlertMessage type="danger" message={error} />
      <div className="row g-2">
        <div className="col-md-6">
          <input className="form-control" name="product_name" placeholder="Product name" value={form.product_name || ""} onChange={handleChange} required />
        </div>
        <div className="col-md-6">
          <select className="form-select" name="category_id" value={form.category_id || ""} onChange={handleChange} required>
            <option value="">Choose category</option>
            {categories.map((category) => <option key={category.id} value={category.id}>{category.name}</option>)}
          </select>
        </div>
        <div className="col-12">
          <textarea className="form-control" name="description" placeholder="Description" value={form.description || ""} onChange={handleChange}></textarea>
        </div>
        <div className="col-md-3">
          <input className="form-control" type="number" name="quantity" placeholder="Quantity" value={form.quantity || ""} onChange={handleChange} required />
        </div>
        <div className="col-md-3">
          <input className="form-control" name="unit" placeholder="Unit" value={form.unit || ""} onChange={handleChange} required />
        </div>
        <div className="col-md-3">
          <input className="form-control" type="number" name="price_per_unit" placeholder="Price per unit" value={form.price_per_unit || ""} onChange={handleChange} required />
        </div>
        <div className="col-md-3">
          <input className="form-control" type="date" name="harvest_date" value={form.harvest_date?.slice?.(0, 10) || ""} onChange={handleChange} />
        </div>
        <div className="col-md-6">
          <input className="form-control" name="district" placeholder="District" value={form.district || ""} onChange={handleChange} required />
        </div>
        <div className="col-md-6">
          <input className="form-control" name="location_details" placeholder="Location details" value={form.location_details || ""} onChange={handleChange} />
        </div>
        <div className="col-md-6">
          <select className="form-select" name="availability_status" value={form.availability_status || "available"} onChange={handleChange}>
            <option value="available">Available</option>
            <option value="sold_out">Sold out</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>
        <div className="col-md-6">
          <input className="form-control" type="file" accept="image/*" onChange={(e) => onImageChange(e.target.files[0])} />
        </div>
      </div>
      <button className="btn btn-success mt-3" type="submit">Save product</button>
    </form>
  );
}

export default AddProduct;

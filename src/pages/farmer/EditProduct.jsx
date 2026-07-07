import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import LoadingSpinner from "../../components/LoadingSpinner";
import { ProductForm } from "./AddProduct";
import { adminService } from "../../services/adminService";
import { productService } from "../../services/productService";

function EditProduct() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState(null);
  const [image, setImage] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadData() {
      const [categoryResponse, productResponse] = await Promise.all([
        adminService.getCategories(),
        productService.getProduct(id)
      ]);

      setCategories(categoryResponse.data.categories);
      setForm(productResponse.data.product);
    }

    loadData().catch(() => setError("Unable to load product."));
  }, [id]);

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");

    const data = new FormData();
    Object.entries(form).forEach(([key, value]) => data.append(key, value ?? ""));
    if (image) data.append("image", image);

    try {
      await productService.updateProduct(id, data);
      navigate("/farmer/products");
    } catch (err) {
      setError(err.response?.data?.message || "Unable to update product.");
    }
  }

  if (!form) return <LoadingSpinner />;

  return (
    <ProductForm
      title="Edit Product"
      form={form}
      setForm={setForm}
      categories={categories}
      error={error}
      onImageChange={setImage}
      onSubmit={handleSubmit}
    />
  );
}

export default EditProduct;

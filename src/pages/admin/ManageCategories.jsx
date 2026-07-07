import { useEffect, useState } from "react";
import AlertMessage from "../../components/AlertMessage";
import LoadingSpinner from "../../components/LoadingSpinner";
import { adminService } from "../../services/adminService";

function ManageCategories() {
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState({ name: "", description: "" });
  const [loading, setLoading] = useState(true);
  const [notice, setNotice] = useState("");
  const [error, setError] = useState("");

  async function loadCategories() {
    const response = await adminService.getCategories();
    setCategories(response.data.categories);
  }

  useEffect(() => {
    loadCategories().catch(() => setError("Unable to load categories.")).finally(() => setLoading(false));
  }, []);

  async function createCategory(event) {
    event.preventDefault();
    setNotice("");
    setError("");

    try {
      await adminService.createCategory(form);
      setForm({ name: "", description: "" });
      setNotice("Category added.");
      await loadCategories();
    } catch (err) {
      setError(err.response?.data?.message || "Unable to add category.");
    }
  }

  async function deactivate(category) {
    await adminService.updateCategory(category.id, { ...category, status: "inactive" });
    await loadCategories();
  }

  if (loading) return <LoadingSpinner />;

  return (
    <>
      <h1 className="section-title">Manage Categories</h1>
      <AlertMessage type="success" message={notice} />
      <AlertMessage type="danger" message={error} />
      <form className="row g-2 form-panel mb-3" onSubmit={createCategory}>
        <div className="col-md-4">
          <input className="form-control" placeholder="Category name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
        </div>
        <div className="col-md-6">
          <input className="form-control" placeholder="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
        </div>
        <div className="col-md-2">
          <button className="btn btn-success w-100" type="submit">Add</button>
        </div>
      </form>
      <div className="table-responsive data-table">
        <table className="table align-middle">
          <thead><tr><th>Name</th><th>Description</th><th>Status</th><th></th></tr></thead>
          <tbody>
            {categories.map((category) => (
              <tr key={category.id}>
                <td>{category.name}</td>
                <td>{category.description}</td>
                <td><span className="badge bg-secondary">{category.status}</span></td>
                <td className="text-end"><button className="btn btn-sm btn-outline-danger" onClick={() => deactivate(category)}>Deactivate</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

export default ManageCategories;

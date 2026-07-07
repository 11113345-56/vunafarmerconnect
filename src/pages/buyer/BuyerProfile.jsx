import { useEffect, useState } from "react";
import AlertMessage from "../../components/AlertMessage";
import LoadingSpinner from "../../components/LoadingSpinner";
import { profileService } from "../../services/profileService";

function BuyerProfile() {
  const [form, setForm] = useState({ buyer_type: "Individual", business_name: "", district: "", address: "" });
  const [loading, setLoading] = useState(true);
  const [notice, setNotice] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    profileService.getProfile()
      .then((response) => response.data.profile && setForm(response.data.profile))
      .finally(() => setLoading(false));
  }, []);

  async function handleSubmit(event) {
    event.preventDefault();
    setNotice("");
    setError("");

    try {
      await profileService.updateBuyer(form);
      setNotice("Profile saved.");
    } catch (err) {
      setError(err.response?.data?.message || "Unable to save profile.");
    }
  }

  if (loading) return <LoadingSpinner />;

  return (
    <form className="form-panel" onSubmit={handleSubmit}>
      <h1 className="section-title">Buyer Profile</h1>
      <AlertMessage type="success" message={notice} />
      <AlertMessage type="danger" message={error} />
      <select className="form-select mb-2" value={form.buyer_type || "Individual"} onChange={(e) => setForm({ ...form, buyer_type: e.target.value })}>
        <option>Individual</option>
        <option>Retailer</option>
        <option>Restaurant</option>
        <option>Wholesaler</option>
      </select>
      <input className="form-control mb-2" placeholder="Business name" value={form.business_name || ""} onChange={(e) => setForm({ ...form, business_name: e.target.value })} />
      <input className="form-control mb-2" placeholder="District" value={form.district || ""} onChange={(e) => setForm({ ...form, district: e.target.value })} required />
      <input className="form-control mb-3" placeholder="Address" value={form.address || ""} onChange={(e) => setForm({ ...form, address: e.target.value })} />
      <button className="btn btn-success" type="submit">Save profile</button>
    </form>
  );
}

export default BuyerProfile;

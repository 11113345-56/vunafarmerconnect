import { useEffect, useState } from "react";
import AlertMessage from "../../components/AlertMessage";
import LoadingSpinner from "../../components/LoadingSpinner";
import { profileService } from "../../services/profileService";

function FarmerProfile() {
  const [form, setForm] = useState({ farm_name: "", farm_description: "", district: "", subcounty: "", village: "", address: "" });
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
      await profileService.updateFarmer(form);
      setNotice("Profile saved.");
    } catch (err) {
      setError(err.response?.data?.message || "Unable to save profile.");
    }
  }

  if (loading) return <LoadingSpinner />;

  return (
    <form className="form-panel" onSubmit={handleSubmit}>
      <h1 className="section-title">Farmer Profile</h1>
      <AlertMessage type="success" message={notice} />
      <AlertMessage type="danger" message={error} />
      <input className="form-control mb-2" placeholder="Farm name" value={form.farm_name || ""} onChange={(e) => setForm({ ...form, farm_name: e.target.value })} required />
      <textarea className="form-control mb-2" placeholder="Farm description" value={form.farm_description || ""} onChange={(e) => setForm({ ...form, farm_description: e.target.value })}></textarea>
      <input className="form-control mb-2" placeholder="District" value={form.district || ""} onChange={(e) => setForm({ ...form, district: e.target.value })} required />
      <input className="form-control mb-2" placeholder="Subcounty" value={form.subcounty || ""} onChange={(e) => setForm({ ...form, subcounty: e.target.value })} />
      <input className="form-control mb-2" placeholder="Village" value={form.village || ""} onChange={(e) => setForm({ ...form, village: e.target.value })} />
      <input className="form-control mb-3" placeholder="Address" value={form.address || ""} onChange={(e) => setForm({ ...form, address: e.target.value })} />
      <button className="btn btn-success" type="submit">Save profile</button>
    </form>
  );
}

export default FarmerProfile;

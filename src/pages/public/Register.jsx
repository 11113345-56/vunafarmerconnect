import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AlertMessage from "../../components/AlertMessage";
import { useAuth } from "../../context/AuthContext";

function Register() {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [form, setForm] = useState({ full_name: "", email: "", phone: "", password: "", role: "buyer" });
  const [notice, setNotice] = useState("");
  const [error, setError] = useState("");

  async function handleSubmit(event) {
    event.preventDefault();
    setNotice("");
    setError("");

    try {
      await register(form);
      setNotice("Account created. You can now login.");
      setTimeout(() => navigate("/login"), 900);
    } catch (err) {
      setError(err.message || "Unable to create account.");
    }
  }

  function handleChange(event) {
    setForm({ ...form, [event.target.name]: event.target.value });
  }

  return (
    <div className="auth-page">
      <form className="auth-card" onSubmit={handleSubmit}>
        <h1 className="h3 mb-3">Create Account</h1>
        <AlertMessage type="success" message={notice} />
        <AlertMessage type="danger" message={error} />
        <label className="form-label">Full name</label>
        <input className="form-control mb-2" name="full_name" value={form.full_name} onChange={handleChange} required />
        <label className="form-label">Email</label>
        <input className="form-control mb-2" type="email" name="email" value={form.email} onChange={handleChange} required />
        <label className="form-label">Phone</label>
        <input className="form-control mb-2" name="phone" value={form.phone} onChange={handleChange} required />
        <label className="form-label">Role</label>
        <select className="form-select mb-2" name="role" value={form.role} onChange={handleChange}>
          <option value="buyer">Buyer</option>
          <option value="farmer">Farmer</option>
        </select>
        <label className="form-label">Password</label>
        <input className="form-control mb-3" type="password" name="password" value={form.password} onChange={handleChange} required />
        <button className="btn btn-success w-100" type="submit">Register</button>
        <p className="small mt-3 mb-0">Already registered? <Link to="/login">Login</Link></p>
      </form>
    </div>
  );
}

export default Register;
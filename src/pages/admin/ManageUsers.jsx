import { useEffect, useState } from "react";
import AlertMessage from "../../components/AlertMessage";
import LoadingSpinner from "../../components/LoadingSpinner";
import { adminService } from "../../services/adminService";

function ManageUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function loadUsers() {
    const response = await adminService.getUsers();
    setUsers(response.data.users);
  }

  useEffect(() => {
    loadUsers().catch(() => setError("Unable to load users.")).finally(() => setLoading(false));
  }, []);

  async function toggleStatus(user) {
    await adminService.updateUserStatus(user.id, user.status === "active" ? "inactive" : "active");
    await loadUsers();
  }

  if (loading) return <LoadingSpinner />;

  return (
    <>
      <h1 className="section-title">Manage Users</h1>
      <AlertMessage type="danger" message={error} />
      <div className="table-responsive data-table">
        <table className="table align-middle">
          <thead><tr><th>Name</th><th>Email</th><th>Phone</th><th>Role</th><th>Status</th><th></th></tr></thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id}>
                <td>{user.full_name}</td>
                <td>{user.email}</td>
                <td>{user.phone}</td>
                <td>{user.role}</td>
                <td><span className="badge bg-secondary">{user.status}</span></td>
                <td className="text-end"><button className="btn btn-sm btn-outline-success" onClick={() => toggleStatus(user)}>Toggle status</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

export default ManageUsers;

import { useAuthStore } from "../store/authStore";

export default function Header() {
  const logout = useAuthStore((s) => s.logout);

  return (
    <div className="d-flex justify-content-between align-items-center p-3 border-bottom bg-white">
      <h5 className="m-0">Dashboard</h5>
      <button className="btn btn-outline-danger btn-sm" onClick={logout}>
        Logout
      </button>
    </div>
  );
}

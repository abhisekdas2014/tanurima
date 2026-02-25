import { useAuthStore } from "../store/authStore";

export default function Header({ onToggleSidebar }) {
  const logout = useAuthStore((s) => s.logout);

  return (
    <div className="d-flex justify-content-between align-items-center p-3 border-bottom bg-white">
      <div className="d-flex align-items-center gap-2">
        {/* Mobile toggle button */}
        <button
          className="btn btn-outline-secondary d-md-none"
          onClick={onToggleSidebar}
        >
          ☰
        </button>

        <h5 className="m-0">Dashboard</h5>
      </div>

      <button className="btn btn-outline-danger btn-sm" onClick={logout}>
        Logout
      </button>
    </div>
  );
}

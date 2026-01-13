import { FaUsers, FaBox, FaClipboardList } from "react-icons/fa";

export default function Sidebar({ isOpen, onClose }) {
  return (
    <>
      {/* Desktop sidebar */}
      <div
        className="bg-dark text-white vh-100 p-3 d-none d-md-block"
        style={{ width: "240px" }}
      >
        <SidebarContent />
      </div>

      {/* Mobile sidebar (offcanvas style) */}
      {isOpen && (
        <div
          className="position-fixed top-0 start-0 vh-100 bg-dark text-white p-3"
          style={{ width: "240px", zIndex: 1050 }}
        >
          <button
            className="btn btn-sm btn-light mb-3"
            onClick={onClose}
          >
            ✕ Close
          </button>

          <SidebarContent onClick={onClose} />
        </div>
      )}
    </>
  );
}

function SidebarContent({ onClick }) {
  return (
    <>
      <h4 className="mb-4">Admin</h4>

      <ul className="nav flex-column gap-2">
        <li className="nav-item">
          <a className="nav-link text-white" href="/dashboard" onClick={onClick}>
            <FaClipboardList /> Dashboard
          </a>
        </li>

        <li className="nav-item">
          <a className="nav-link text-white" href="/customers" onClick={onClick}>
            <FaUsers /> Customers
          </a>
        </li>

        <li className="nav-item">
          <a className="nav-link text-white" href="/items" onClick={onClick}>
            <FaBox /> Items
          </a>
        </li>

        <li className="nav-item">
          <a className="nav-link text-white" href="/stock" onClick={onClick}>
            <FaBox /> Stock
          </a>
        </li>

        <li className="nav-item">
          <a className="nav-link text-white" href="/orders" onClick={onClick}>
            <FaBox /> Order
          </a>
        </li>
      </ul>
    </>
  );
}

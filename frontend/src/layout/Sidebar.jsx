import { FaUsers, FaBox, FaClipboardList } from "react-icons/fa";

export default function Sidebar() {
  return (
    <div className="bg-dark text-white vh-100 p-3" style={{ width: "240px" }}>
      <h4 className="mb-4"> Admin</h4>

      <ul className="nav flex-column gap-2">
        <li className="nav-item">
          <a className="nav-link text-white" href="/dashboard">
            <FaClipboardList /> Dashboard
          </a>
        </li>

        <li className="nav-item">
          <a className="nav-link text-white" href="/customers">
            <FaUsers /> Customers
          </a>
        </li>

        <li className="nav-item">
          <a className="nav-link text-white" href="/items">
            <FaBox /> Items
          </a>
        </li>
        <li className="nav-item">
          <a className="nav-link text-white" href="/stock">
            <FaBox /> Stock
          </a>
        </li>
        <li className="nav-item">
          <a className="nav-link text-white" href="/orders">
            <FaBox /> Order
          </a>
        </li>

      </ul>
    </div>
  );
}

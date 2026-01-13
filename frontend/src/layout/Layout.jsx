import { useState } from "react";
import Sidebar from "./Sidebar";
import Header from "./Header";

export default function Layout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="d-flex">
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <div className="flex-grow-1">
        <Header onToggleSidebar={() => setSidebarOpen(true)} />

        <div className="p-3 p-md-4 bg-light min-vh-100">
          {children}
        </div>
      </div>
    </div>
  );
}

import { useState } from "react";
import Sidebar from "./Sidebar";
import Header from "./Header";
import CalculatorModal from "../components/CalculatorModal"; // add this

export default function Layout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showCalc, setShowCalc] = useState(false); // ✅ NEW

  return (
    <div className="d-flex">
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        onOpenCalc={() => setShowCalc(true)} // ✅ NEW
      />

      <div className="flex-grow-1">
        <Header onToggleSidebar={() => setSidebarOpen(true)} />

        <div className="p-3 p-md-4 bg-light min-vh-100">
          {children}
        </div>
      </div>

      {/* ✅ Calculator popup */}
      <CalculatorModal
        show={showCalc}
        onClose={() => setShowCalc(false)}
      />
    </div>
  );
}


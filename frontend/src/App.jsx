import { Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Customers from "./pages/Customers";
import Items from "./pages/Items";
import Stock from "./pages/Stock";
import Orders from "./pages/Orders";
import Payments from "./pages/PaymentHistory";
import ProtectedRoute from "./components/ProtectedRoute";
import BuyerPayments from "./pages/BuyerPayments";
import Voucher from "./pages/Voucher";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
      <Route path="/customers" element={<ProtectedRoute><Customers /></ProtectedRoute>} />
      <Route path="/items" element={<ProtectedRoute><Items /></ProtectedRoute>} />
      <Route path="/stock" element={<ProtectedRoute><Stock /></ProtectedRoute>} />
      <Route path="/orders" element={<ProtectedRoute><Orders /></ProtectedRoute>} />
      <Route path="/payment-history" element={<ProtectedRoute><Payments /></ProtectedRoute>}/>
      <Route path="/buyer-payments" element={<ProtectedRoute><BuyerPayments /></ProtectedRoute>} />
      <Route path="/voucher" element={<ProtectedRoute><Voucher /></ProtectedRoute>} />
      </Routes>  );
      
}

import { useEffect, useState } from "react";
import api from "../api/axios";
import Layout from "../layout/Layout";

export default function Dashboard() {
  const [dues, setDues] = useState([]);
  const [stock, setStock] = useState([]);
  const [profit, setProfit] = useState({ profit: 0, loss: 0 });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [d, s, p] = await Promise.all([
        api.get("/dashboard/dues"),
        api.get("/dashboard/stock-summary"),
        api.get("/dashboard/profit")
      ]);

      setDues(d.data || []);
      setStock(s.data || []);
      setProfit(p.data || { profit: 0, loss: 0 });
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <Layout>
      <h4>Dashboard</h4>

      <div className="row g-3">
        {/* Due List */}
        <div className="col-12 col-md-4">
          <div className="card p-3">
            <h6><b>Due Amounts</b></h6>
            {dues.length === 0 ? (
              <p className="text-muted small">No dues</p>
            ) : (
              <ul
                className="list-group list-group-flush"
                style={{
                  maxHeight: '300px',
                  overflowY: 'auto',
                  scrollbarWidth: 'thin'
                }}
              >
                {Object.entries(
                  dues.reduce((acc, d) => {
                    if (!acc[d.customer.name]) {
                      acc[d.customer.name] = 0;
                    }
                    acc[d.customer.name] += Number(d.dueAmount || 0);
                    return acc;
                  }, {})
                ).map(([customerName, totalDue]) => (
                  <li key={customerName} className="list-group-item d-flex justify-content-between">
                    <span>{customerName}</span>
                    <b>₹{totalDue.toFixed(2)}</b>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        {/* Stock Summary */}
        {/*add scroll bar to stock summary*/}
        <div className="col-12 col-md-4">
          <div className="card p-3">
            <h6><b>Current Stock</b></h6>
            {stock.length === 0 ? (
              <p className="text-muted small">No stock</p>
            ) : (
              <ul className="list-group list-group-flush" style={{ maxHeight: '300px', overflowY: 'auto', scrollbarWidth: 'thin' }}>
                {stock.map(s => (
                  <li key={s.itemId} className="list-group-item d-flex justify-content-between">
                    <span><b>{s.item.name}</b> ₹{s.buyingPrice}</span>
                    <b>{s.qty}</b>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        {/* Profit / Loss */}
        <div className="col-12 col-md-4">
          <div className="card p-3">
            <h6><b>Profit & Loss</b></h6>
            <p className="mb-1">Profit: <b className="text-success">₹{Number(profit.profit || 0).toFixed(2)}</b></p>
            <p className="mb-0">Loss: <b className="text-danger">₹{Number(profit.loss || 0).toFixed(2)}</b></p>
          </div>
        </div>
      </div>
    </Layout>
  );
}

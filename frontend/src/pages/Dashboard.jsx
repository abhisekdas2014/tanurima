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
            <h6>Due Amounts</h6>
            {dues.length === 0 ? (
              <p className="text-muted small">No dues</p>
            ) : (
              <ul className="list-group list-group-flush">
                {dues.map(d => (
                  <li key={d.orderId} className="list-group-item d-flex justify-content-between">
                    <span>{d.customer.name}</span>
                    <b>₹{d.dueAmount}</b>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        {/* Stock Summary */}
        <div className="col-12 col-md-4">
          <div className="card p-3">
            <h6>Current Stock</h6>
            {stock.length === 0 ? (
              <p className="text-muted small">No stock</p>
            ) : (
              <ul className="list-group list-group-flush">
                {stock.map(s => (
                  <li key={s.itemId} className="list-group-item d-flex justify-content-between">
                    <span>{s.item.name}</span>
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
            <h6>Profit & Loss</h6>
            <p className="mb-1">Profit: <b className="text-success">₹{profit.profit}</b></p>
            <p className="mb-0">Loss: <b className="text-danger">₹{profit.loss}</b></p>
          </div>
        </div>
      </div>
    </Layout>
  );
}

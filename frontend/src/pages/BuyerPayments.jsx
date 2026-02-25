import { useEffect, useState } from "react";
import api from "../api/axios";
import Layout from "../layout/Layout";

export default function BuyerPayments() {
  const [rows, setRows] = useState([]);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [form, setForm] = useState({
    buyerName: "",
    paidAmount: "",
    comments: "",
    billImage: "",
    date: ""
  });

  const load = async () => {
    const res = await api.get("/buyer-payments", { params: { page } });
    setRows(res.data.data);
    setPages(res.data.pagination.pages);
  };

  useEffect(() => { load(); }, [page]);

  const submit = async e => {
    e.preventDefault();
    await api.post("/buyer-payments", form);
    setForm({ buyerName: "", paidAmount: "", comments: "", billImage: "", date: "" });
    load();
  };

  return (
    <Layout>
      <h4>Buyer Payments</h4>

      <form className="card p-3 mb-3" onSubmit={submit}>
        <input className="form-control mb-2" placeholder="Buyer Name"
          value={form.buyerName}
          onChange={e => setForm({ ...form, buyerName: e.target.value })} />

        <input className="form-control mb-2" placeholder="Amount"
          value={form.paidAmount}
          onChange={e => setForm({ ...form, paidAmount: e.target.value })} />

        <input type="date" className="form-control mb-2"
          value={form.date}
          onChange={e => setForm({ ...form, date: e.target.value })} />
       
            <input type="file" className="form-control"
              onChange={e => setForm({ ...form, billImage: e.target.files[0] })}
            />
        <textarea className="form-control mb-2" placeholder="Comments"
          value={form.comments}
          onChange={e => setForm({ ...form, comments: e.target.value })} />

        <button className="btn btn-success">Save</button>
      </form>

      <div className="table-responsive">
        <table className="table table-bordered">
          <thead><tr><th>Name</th><th>Amount</th><th>Date</th></tr></thead>
          <tbody>
            {rows.map(r => (
              <tr key={r.id}>
                <td>{r.buyerName}</td>
                <td>₹{r.paidAmount}</td>
                <td>{r.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="d-flex justify-content-between">
        <button disabled={page <= 1} onClick={() => setPage(p => p - 1)}>Prev</button>
        <span>{page} / {pages}</span>
        <button disabled={page >= pages} onClick={() => setPage(p => p + 1)}>Next</button>
      </div>
    </Layout>
  );
}

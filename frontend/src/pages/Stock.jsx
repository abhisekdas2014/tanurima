import { useEffect, useState } from "react";
import api from "../api/axios";
import Layout from "../layout/Layout";

export default function Stock() {
  const [items, setItems] = useState([]);
  const [stock, setStock] = useState([]);
  const [search, setSearch] = useState("");
  const [editingId, setEditingId] = useState(null);

  const [form, setForm] = useState({
    itemId: "",
    qty: "",
    buyingPrice: ""
  });

  const load = async () => {
    const s = await api.get("/stock");
    setStock(s.data);
  };

  useEffect(() => {
    api.get("/items").then(r => setItems(r.data));
    load();
  }, []);

  const submit = async (e) => {
    e.preventDefault();

    try {
      if (editingId) {
        await api.put(`/stock/${editingId}`, {
          qty: form.qty,
          buyingPrice: form.buyingPrice
        });
      } else {
        await api.post("/stock", form);
      }

      setForm({ itemId: "", qty: "", buyingPrice: "" });
      setEditingId(null);
      load();
    } catch (err) {
      console.error(err.response?.data || err.message);
      alert("Save failed");
    }
  };

  const editStock = (s) => {
    setForm({
      itemId: s.itemId,
      qty: s.qty,
      buyingPrice: s.buyingPrice
    });
    setEditingId(s.id);
  };

  const deleteStock = async (id) => {
    if (!confirm("Delete stock entry?")) return;
    await api.delete(`/stock/${id}`);
    load();
  };

  const filtered = stock.filter(s =>
    s.item?.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Layout>
      <h4 className="mb-3">Stock</h4>

      {/* Add / Edit Form */}
      <form onSubmit={submit} className="card p-3 mb-3">
        <div className="row g-2">
          <div className="col-md-4">
            <select
              className="form-select"
              value={form.itemId}
              onChange={e => setForm({ ...form, itemId: e.target.value })}
              disabled={!!editingId}
              required
            >
              <option value="">Select Item</option>
              {items.map(i => (
                <option key={i.id} value={i.id}>{i.name}</option>
              ))}
            </select>
          </div>

          <div className="col-md-3">
            <input
              type="number"
              className="form-control"
              placeholder="Quantity"
              value={form.qty}
              onChange={e => setForm({ ...form, qty: e.target.value })}
              required
            />
          </div>

          <div className="col-md-3">
            <input
              type="number"
              className="form-control"
              placeholder="Buying Price"
              value={form.buyingPrice}
              onChange={e => setForm({ ...form, buyingPrice: e.target.value })}
              required
            />
          </div>

          <div className="col-md-2 d-grid">
            <button className="btn btn-primary">
              {editingId ? "Update" : "Add"}
            </button>
          </div>
        </div>
      </form>

      {/* Search */}
      <input
        className="form-control mb-2"
        placeholder="Search by item name"
        value={search}
        onChange={e => setSearch(e.target.value)}
      />

      {/* Table */}
      <table className="table table-bordered table-striped">
        <thead className="table-dark">
          <tr>
            <th>Item</th>
            <th>Qty</th>
            <th>Buying Price</th>
            <th width="160">Actions</th>
          </tr>
        </thead>
        <tbody>
          {filtered.map(s => (
            <tr key={s.id}>
              <td>{s.item?.name}</td>
              <td>{s.qty}</td>
              <td>{s.buyingPrice}</td>
              <td>
                <button
                  className="btn btn-sm btn-warning me-2"
                  onClick={() => editStock(s)}
                >
                  Edit
                </button>
                <button
                  className="btn btn-sm btn-danger"
                  onClick={() => deleteStock(s.id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </Layout>
  );
}

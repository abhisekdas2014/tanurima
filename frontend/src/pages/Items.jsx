import { useEffect, useState } from "react";
import api from "../api/axios";
import Layout from "../layout/Layout";

export default function Items() {
  const [items, setItems] = useState([]);
  const [name, setName] = useState("");
  const [editingId, setEditingId] = useState(null);

  const load = async () => {
    const res = await api.get("/items");
    setItems(res.data);
  };

  useEffect(() => {
    load();
  }, []);

  const submit = async (e) => {
    e.preventDefault();

    if (!name.trim()) {
      alert("Item name required");
      return;
    }

    try {
      if (editingId) {
        await api.put(`/items/${editingId}`, { name });
      } else {
        await api.post("/items", { name });
      }

      setName("");
      setEditingId(null);
      load();
    } catch (err) {
      console.error(err.response?.data || err.message);
      alert("Save failed");
    }
  };

  const editItem = (item) => {
    setName(item.name);
    setEditingId(item.id);
  };

  const deleteItem = async (id) => {
    if (!confirm("Delete this item?")) return;

    try {
      await api.delete(`/items/${id}`);
      load();
    } catch (err) {
      console.error(err.response?.data || err.message);
      alert("Delete failed");
    }
  };

  return (
    <Layout>
      <h4 className="mb-3">Items</h4>

      <form onSubmit={submit} className="card p-3 mb-3">
        <div className="d-flex gap-2">
          <input
            className="form-control"
            placeholder="Item name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <button className="btn btn-primary">
            {editingId ? "Update" : "Add"}
          </button>
          {editingId && (
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => {
                setName("");
                setEditingId(null);
              }}
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      <table className="table table-bordered table-striped">
        <thead className="table-dark">
          <tr>
            <th width="80">ID</th>
            <th>Name</th>
            <th width="180">Actions</th>
          </tr>
        </thead>
        <tbody>
          {items.map((i) => (
            <tr key={i.id}>
              <td>{i.id}</td>
              <td>{i.name}</td>
              <td>
                <button
                  className="btn btn-sm btn-warning me-2"
                  onClick={() => editItem(i)}
                >
                  Edit
                </button>
                <button
                  className="btn btn-sm btn-danger"
                  onClick={() => deleteItem(i.id)}
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

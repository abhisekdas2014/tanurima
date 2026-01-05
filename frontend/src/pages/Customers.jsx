import { useEffect, useState } from "react";
import api from "../api/axios";
import Layout from "../layout/Layout";

export default function Customers() {
    const [customers, setCustomers] = useState([]);
    const [form, setForm] = useState({ name: "", mobileNo: "", address: "" });
    const [editingId, setEditingId] = useState(null);

    const loadCustomers = async () => {
        const res = await api.get("/customers");
        setCustomers(res.data);
    };

    useEffect(() => {
        loadCustomers();
    }, []);

    const submit = async (e) => {
  e.preventDefault();

  if (!form.name.trim()) {
    alert("Name is required");
    return;
  }

  const payload = {
    name: form.name.trim(),
    mobileNo: form.mobileNo.trim(),
    address: form.address.trim()
  };

  try {
    if (editingId) {
      await api.put(`/customers/${editingId}`, payload);
    } else {
      await api.post("/customers", payload);
    }

    setForm({ name: "", mobileNo: "", address: "" });
    setEditingId(null);
    loadCustomers();
  } catch (err) {
    console.error("Save failed:", err.response?.data || err.message);
    alert("Failed to save customer");
  }
};



    const editCustomer = (c) => {
  setForm({
    name: c.name || "",
    mobileNo: c.mobileNo || "",
    address: c.address || ""
  });
  setEditingId(c.id);
};

    const deleteCustomer = async (id) => {
        if (confirm("Delete this customer?")) {
            await api.delete(`/customers/${id}`);
            loadCustomers();
        }
    };

    return (
        <Layout>
            <h4 className="mb-3">Customers</h4>

            <form className="card p-3 mb-4" onSubmit={submit}>
                <div className="row g-2">
                    <div className="col-md-4">
                        <input className="form-control" placeholder="Name"
                            value={form.name}
                            onChange={e => setForm({ ...form, name: e.target.value })}
                            required />
                    </div>
                    <div className="col-md-4">
                        <input className="form-control" placeholder="Mobile"
                            value={form.mobileNo}
                            onChange={e => setForm({ ...form, mobileNo: e.target.value })} />
                    </div>
                    <div className="col-md-4">
                        <input className="form-control" placeholder="Address"
                            value={form.address}
                            onChange={e => setForm({ ...form, address: e.target.value })} />
                    </div>
                </div>

                <button className="btn btn-primary mt-3">
                    {editingId ? "Update Customer" : "Add Customer"}
                </button>

                {editingId && (
                    <button
                        type="button"
                        className="btn btn-secondary mt-3 ms-2"
                        onClick={() => {
                            setForm({ name: "", mobileNo: "", address: "" });
                            setEditingId(null);
                        }}
                    >
                        Cancel
                    </button>
                )}
            </form>

            <table className="table table-bordered table-striped">
                <thead className="table-dark">
                    <tr>
                        <th>Name</th>
                        <th>Mobile</th>
                        <th>Address</th>
                        <th width="140">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {customers.map(c => (
                        <tr key={c.id}>
                            <td>{c.name}</td>
                            <td>{c.mobileNo}</td>
                            <td>{c.address}</td>
                            <td>
                                <button className="btn btn-sm btn-warning me-2"
                                    onClick={() => editCustomer(c)}>
                                    Edit
                                </button>
                                <button className="btn btn-sm btn-danger"
                                    onClick={() => deleteCustomer(c.id)}>
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

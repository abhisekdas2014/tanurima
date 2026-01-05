import { useEffect, useState } from "react";
import api from "../api/axios";
import Layout from "../layout/Layout";

export default function Orders() {
  /* ======================
     MASTER DATA
  ====================== */
  const [customers, setCustomers] = useState([]);
  const [stock, setStock] = useState([]);
  const [showInvoice, setShowInvoice] = useState(false);
  const [invoiceData, setInvoiceData] = useState(null);


  /* ======================
     CREATE ORDER
  ====================== */
  const [header, setHeader] = useState({
    customerId: "",
    billNo: "",
    billDate: "",
    comments: "",
    billImage: null
  });

  const [currentItem, setCurrentItem] = useState({
    stockId: "",
    itemId: "",
    itemName: "",
    buyingPrice: "",
    sellingPrice: "",
    qty: ""
  });

  const [items, setItems] = useState([]);

  /* ======================
     ORDER LIST
  ====================== */
  const [orders, setOrders] = useState([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);

  /* ======================
     EDIT MODAL
  ====================== */
  const [showEdit, setShowEdit] = useState(false);
  const [editHeader, setEditHeader] = useState({});
  const [editItems, setEditItems] = useState([]);
  const [editImage, setEditImage] = useState(null);
  const [editNewItem, setEditNewItem] = useState({
    stockId: "",
    itemId: "",
    itemName: "",
    buyingPrice: "",
    sellingPrice: "",
    qty: ""
  });
  const [showPayment, setShowPayment] = useState(false);
  const [paymentOrder, setPaymentOrder] = useState(null);
  const [payments, setPayments] = useState([]);

  const [paymentForm, setPaymentForm] = useState({
    amount: "",
    paymentMode: "cash",
    paidOn: new Date().toISOString().slice(0, 10)
  });
  const [editNewItems, setEditNewItems] = useState([]);
  /* ======================
     INVOICE PREVIEW
  ====================== */
  const [invoice, setInvoice] = useState(null);

  /* ======================
     INITIAL LOAD
  ====================== */
  useEffect(() => {
    api.get("/customers").then(r => setCustomers(r.data));
    api.get("/stock").then(r => setStock(r.data));
    loadOrders();
  }, [page]);

  /* ======================
     LOAD ORDERS
  ====================== */
  const loadOrders = async () => {
    const res = await api.get("/orders", { params: { search, page } });
    setOrders(res.data.data);
    setPages(res.data.pagination.pages);
  };

  /* ======================
     CREATE ORDER
  ====================== */
  const addItem = () => {
    if (!currentItem.itemId || !currentItem.qty || !currentItem.sellingPrice) {
      alert("Fill item details");
      return;
    }
    const exists = items.some(i => i.itemId === currentItem.itemId);
    if (exists) {
      alert("Item already added. Update quantity instead.");
      return;
    }
    setItems([...items, currentItem]);
    setCurrentItem({
      stockId: "",
      itemId: "",
      itemName: "",
      buyingPrice: "",
      sellingPrice: "",
      qty: ""
    });
  };
  const openPayment = async (order) => {
    setPaymentOrder(order);
    const res = await api.get(`/order-payments/${order.id}`);
    setPayments(res.data);
    setShowPayment(true);
  };
  const savePayment = async () => {
    const amount = Number(paymentForm.amount);
    const due = paymentOrder.dueAmount;

    if (!amount || amount <= 0) {
      alert("Enter valid amount");
      return;
    }

    if (amount > due) {
      alert(`Over-payment not allowed. Due amount: ₹${due}`);
      return;
    }

    await api.post("/order-payments", {
      orderId: paymentOrder.id,
      amount,
      paymentMode: paymentForm.paymentMode,
      paidOn: paymentForm.paidOn
    });

    setPaymentForm({
      amount: "",
      paymentMode: "cash",
      paidOn: paymentForm.paidOn
    });

    await openPayment(paymentOrder);
    await loadOrders();
  };


  const submit = async e => {
    e.preventDefault();

    if (!header.customerId) return alert("Select customer");
    if (!items.length) return alert("Add items");

    const fd = new FormData();
    Object.entries(header).forEach(([k, v]) => v && fd.append(k, v));
    fd.append(
      "items",
      JSON.stringify(
        items.map(i => ({
          itemId: i.itemId,
          buyingPrice: i.buyingPrice,
          sellingPrice: i.sellingPrice,
          qty: Number(i.qty)
        }))
      )
    );

    try {
      await api.post("/orders", fd);
      alert("Order created");
      loadOrders();
    } catch (err) {
      alert(err.response?.data?.message || "Create failed");
    }


    setHeader({
      customerId: "",
      billNo: "",
      billDate: "",
      comments: "",
      billImage: null
    });
    setItems([]);
    loadOrders();
  };

  /* ======================
     EDIT ORDER
  ====================== */
  const openEdit = async id => {
    const res = await api.get(`/orders/${id}`);
    setEditHeader(res.data);
    setEditItems(res.data.items || []);
    setShowEdit(true);
  };
  const openInvoice = async (id) => {
    const res = await api.get(`/orders/${id}`);
    setInvoiceData(res.data);
    setShowInvoice(true);
  };
  const addEditItem = s => {
    setEditItems([
      ...editItems,
      {
        itemId: s.item.id,
        qty: 1,
        buyingPrice: s.buyingPrice,
        sellingPrice: s.sellingPricePrice
      }
    ]);
  };
  console.log(editItems);
  const saveEdit = async () => {
    const fd = new FormData();
    fd.append("billNo", editHeader.billNo);
    fd.append("billDate", editHeader.billDate);
    fd.append("comments", editHeader.comments || "");
    fd.append("items", JSON.stringify(editItems));
    if (editImage) fd.append("billImage", editImage);

    await api.put(`/orders/${editHeader.id}`, fd);
    setShowEdit(false);
    loadOrders();
  };



  /* ======================
     DELETE ORDER
  ====================== */
  const removeOrder = async id => {
    if (!confirm("Delete this order?")) return;
    await api.delete(`/orders/${id}`);
    loadOrders();
  };

  return (
    <Layout>
      <h4>Create Order</h4>

      {/* ================= CREATE FORM ================= */}
      <form className="card p-4 mb-4" onSubmit={submit}>
        <div className="row g-3">
          <div className="col-md-4">
            <select className="form-select"
              value={header.customerId}
              onChange={e => setHeader({ ...header, customerId: e.target.value })}>
              <option value="">Select Customer</option>
              {customers.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>

          <div className="col-md-4">
            <input className="form-control" placeholder="Bill No"
              value={header.billNo}
              onChange={e => setHeader({ ...header, billNo: e.target.value })} />
          </div>

          <div className="col-md-4">
            <input type="date" className="form-control"
              value={header.billDate}
              onChange={e => setHeader({ ...header, billDate: e.target.value })} />
          </div>

          <div className="col-md-6">
            <textarea className="form-control" placeholder="Comments"
              value={header.comments}
              onChange={e => setHeader({ ...header, comments: e.target.value })} />
          </div>

          <div className="col-md-6">
            <input type="file" className="form-control"
              onChange={e => setHeader({ ...header, billImage: e.target.files[0] })} />
          </div>
        </div>

        <hr />

        <div className="row g-3 align-items-end">
          <div className="col-md-4">
            <select className="form-select"
              value={currentItem.stockId}
              onChange={e => {
                const s = stock.find(x => x.id == e.target.value);
                if (!s) return;
                setCurrentItem({
                  stockId: s.id,
                  itemId: s.item.id,
                  itemName: s.item.name,
                  buyingPrice: s.buyingPrice,
                  sellingPrice: s.buyingPrice,
                  qty: 1
                });
              }}>
              <option>Select Item</option>
              {stock.map(s => (
                <option key={s.id} value={s.id}>
                  {s.item.name} | ₹{s.buyingPrice}| qty {s.qty}
                </option>
              ))}
            </select>
          </div>

          <div className="col-md-2">
            <input className="form-control" type="number"
              value={currentItem.qty}
              onChange={e => setCurrentItem({ ...currentItem, qty: e.target.value })} />
          </div>

          <div className="col-md-2">
            <input className="form-control" type="number"
              value={currentItem.sellingPrice}
              onChange={e => setCurrentItem({ ...currentItem, sellingPrice: e.target.value })} />
          </div>

          <div className="col-md-2">
            <button type="button" className="btn btn-primary" onClick={addItem}>
              Add Item
            </button>
          </div>
        </div>
        {items.length > 0 && (
          <table className="table table-bordered mt-3">
            <thead className="table-dark">
              <tr>
                <th>Item</th>
                <th>Buy</th>
                <th>Sell</th>
                <th>Qty</th>
                <th>Total</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {items.map((i, idx) => (
                <tr key={idx}>
                  <td>{i.itemName}</td>
                  <td>{i.buyingPrice}</td>
                  <td>{i.sellingPrice}</td>
                  <td>{i.qty}</td>
                  <td>{i.qty * i.sellingPrice}</td>
                  <td>
                    <button
                      type="button"
                      className="btn btn-danger btn-sm"
                      onClick={() =>
                        setItems(items.filter((_, x) => x !== idx))
                      }
                    >
                      ✕
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        <button className="btn btn-success mt-3">Create Order</button>
      </form>

      {/* ================= ORDER LIST ================= */}
      <h4>Orders</h4>

      <input className="form-control w-25 mb-3"
        placeholder="Search Bill / Customer"
        value={search}
        onChange={e => setSearch(e.target.value)}
        onKeyUp={loadOrders} />

      <table className="table table-bordered">
        <thead>
          <tr>
            <th>ID</th>
            <th>Bill</th>
            <th>Customer</th>
            <th>Date</th>
            <th></th>
            <th width="220">Actions</th>
          </tr>
        </thead>
        <tbody>
          {orders.map(o => (
            <tr key={o.id}>
              <td>{o.id}</td>
              <td>{o.billNo}</td>
              <td>{o.customer?.name}</td>
              <td>{o.billDate}</td>
              <td>
                <span
                  className={`badge ${o.paymentStatus === "paid"
                    ? "bg-success"
                    : o.paymentStatus === "partial"
                      ? "bg-warning text-dark"
                      : "bg-danger"
                    }`}
                >
                  {o.paymentStatus || "unpaid"}
                </span>
              </td>
              <td className="d-flex gap-1">
                <button
                  className="btn btn-sm btn-primary"
                  disabled={o.dueAmount === 0}
                  onClick={() => openEdit(o.id)}
                >
                  Edit
                </button>

                <button
                  className="btn btn-sm btn-info"
                  onClick={() => openInvoice(o.id)}
                >
                  Invoice
                </button>

                <button
                  className="btn btn-sm btn-warning"
                  disabled={o.dueAmount === 0}
                  onClick={() => openPayment(o)}
                >
                  Pay
                </button>

                <button
                  className="btn btn-sm btn-danger"
                  disabled={o.dueAmount === 0}
                  onClick={async () => {
                    if (confirm("Delete this order?")) {
                      await api.delete(`/orders/${o.id}`);
                      loadOrders();
                    }
                  }}
                >
                  Delete
                </button>
              </td>


            </tr>
          ))}
        </tbody>
      </table>

      {/* ================= EDIT MODAL ================= */}
      {showEdit && (
        <div className="modal show d-block" style={{ background: "#0008" }}>
          <div className="modal-dialog modal-lg">
            <div className="modal-content p-3">
              <h5>Edit Order</h5>

              <input className="form-control mb-2"
                value={editHeader.billNo}
                onChange={e => setEditHeader({ ...editHeader, billNo: e.target.value })} />

              <textarea className="form-control mb-2"
                value={editHeader.comments || ""}
                onChange={e => setEditHeader({ ...editHeader, comments: e.target.value })} />

              <input type="file" className="form-control mb-3"
                onChange={e => setEditImage(e.target.files[0])} />

              {editItems.map((i, idx) => (
                <div className="row g-2 mb-2" key={idx}>
                  <div className="col">{i.item?.name}</div>
                  <div className="col">
                    <input className="form-control"
                      value={i.qty}
                      onChange={e => {
                        const x = [...editItems];
                        x[idx].qty = e.target.value;
                        setEditItems(x);
                      }} />
                  </div>
                  <div className="col">
                    <input className="form-control"
                      value={i.sellingPrice}
                      onChange={e => {
                        const x = [...editItems];
                        x[idx].sellingPrice = e.target.value;
                        setEditItems(x);
                      }} />
                  </div>

                  <div className="col-auto">
                    <button className="btn btn-danger btn-sm"
                      onClick={() =>
                        setEditItems(editItems.filter((_, i2) => i2 !== idx))
                      }>
                      ✕
                    </button>
                  </div>
                </div>
              ))}

              <hr />
              <h6>Add Item</h6>

              <div className="row g-2 mb-3">
                <div className="col-md-5">
                  <select className="form-select"
                    value={editNewItem.stockId}
                    onChange={e => {
                      const s = stock.find(x => x.id == e.target.value);
                      if (!s) return;
                      setEditNewItem({
                        stockId: s.id,
                        itemId: s.item.id,
                        itemName: s.item.name,
                        buyingPrice: s.buyingPrice,
                        sellingPrice: s.buyingPrice,
                        qty: 1
                      });
                    }}>
                    <option value="">Select item</option>
                    {stock.map(s => (
                      <option key={s.id} value={s.id}>
                        {s.item.name} | ₹{s.buyingPrice}| qty {s.qty}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="col-md-2">
                  <input type="number" className="form-control"
                    value={editNewItem.qty}
                    onChange={e => setEditNewItem({ ...editNewItem, qty: e.target.value })} />
                </div>

                <div className="col-md-3">
                  <input type="number" className="form-control"
                    value={editNewItem.sellingPrice}
                    onChange={e => setEditNewItem({ ...editNewItem, sellingPrice: e.target.value })} />
                </div>

                <div className="col-md-2">
                  <button type="button" className="btn btn-primary w-100" onClick={(e) => {
                    e.preventDefault();

                    if (!editNewItem.itemId || !editNewItem.qty) {
                      alert("Select item and qty");
                      return;
                    }

                    setEditItems(prev => [
                      ...prev,
                      {
                        itemId: editNewItem.itemId,
                        item: { name: editNewItem.itemName },
                        qty: Number(editNewItem.qty),
                        buyingPrice: Number(editNewItem.buyingPrice),
                        sellingPrice: Number(editNewItem.sellingPrice)
                      }
                    ]);

                    setEditNewItem({
                      stockId: "",
                      itemId: "",
                      itemName: "",
                      sellingPrice: "",
                      qty: ""
                    });
                  }}>
                    Add
                  </button>

                </div>
              </div>



              <div className="text-end mt-3">
                <button className="btn btn-secondary me-2" onClick={() => setShowEdit(false)}>Cancel</button>
                <button className="btn btn-success" onClick={saveEdit}>Save</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showInvoice && invoiceData && (
        <div className="modal show d-block" style={{ background: "#0008" }}>
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5>Invoice #{invoiceData.billNo}</h5>
                <button className="btn-close" onClick={() => setShowInvoice(false)} />
              </div>

              <div className="modal-body">
                <p><b>Customer:</b> {invoiceData.customer?.name}</p>
                <p><b>Date:</b> {invoiceData.billDate}</p>

                <table className="table table-bordered">
                  <thead>
                    <tr>
                      <th>Item</th>
                      <th>Price</th>
                      <th>Qty</th>
                      <th>Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {invoiceData.items.map((i, idx) => (
                      <tr key={idx}>
                        <td>{i.item?.name}</td>
                        <td>{i.sellingPrice}</td>
                        <td>{i.qty}</td>
                        <td>{i.qty * i.sellingPrice}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}


      {showPayment && paymentOrder && (
        <div className="modal show d-block" style={{ background: "#0008" }}>
          <div className="modal-dialog">
            <div className="modal-content">

              {/* ===== MODAL HEADER ===== */}
              <div className="modal-header">
                <h5 className="modal-title">
                  Payment – Bill {paymentOrder.billNo}
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowPayment(false)}
                />
              </div>

              {/* ===== MODAL BODY ===== */}
              <div className="modal-body">
                <p><b>Total:</b> ₹{paymentOrder.totalAmount}</p>
                <p><b>Paid:</b> ₹{paymentOrder.paidAmount}</p>
                <p>
                  <b>Status:</b>{" "}
                  <span className={`badge ${paymentOrder.paymentStatus === "paid"
                      ? "bg-success"
                      : paymentOrder.paymentStatus === "partial"
                        ? "bg-warning"
                        : "bg-danger"
                    }`}>
                    {paymentOrder.paymentStatus}
                  </span>
                </p>

                <input
                  className="form-control mb-2"
                  placeholder="Amount"
                  value={paymentForm.amount}
                  onChange={e =>
                    setPaymentForm({ ...paymentForm, amount: e.target.value })
                  }
                />

                <select
                  className="form-select mb-2"
                  value={paymentForm.paymentMode}
                  onChange={e =>
                    setPaymentForm({ ...paymentForm, paymentMode: e.target.value })
                  }
                >
                  <option value="cash">Cash</option>
                  <option value="online">Online</option>
                </select>

                <input
                  type="date"
                  className="form-control mb-2"
                  value={paymentForm.paidOn}
                  onChange={e =>
                    setPaymentForm({ ...paymentForm, paidOn: e.target.value })
                  }
                />

                <button
                  className="btn btn-success w-100"
                  onClick={savePayment}
                >
                  Add Payment
                </button>

                <hr />

                <h6>Payment History</h6>
                <ul className="list-group">
                  {payments.map(p => (
                    <li className="list-group-item" key={p.id}>
                      ₹{p.amount} – {p.paymentMode} – {p.paidOn}
                    </li>
                  ))}
                </ul>
              </div>

              {/* ===== MODAL FOOTER ===== */}
              <div className="modal-footer">
                <button
                  className="btn btn-secondary"
                  onClick={() => setShowPayment(false)}
                >
                  Close
                </button>
              </div>

            </div>
          </div>
        </div>
      )}



    </Layout>
  );
}

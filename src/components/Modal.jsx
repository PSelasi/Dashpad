import { useState } from "react";
import { fmtGHS } from "../utils/formatters";
import { CATEGORIES, EXPENSE_CATS } from "../data/constants";

export function Modal({ modal, setModal, products, setProducts, sales, setSales, customers, setCustomers, showToast }) {
  const close = () => setModal(null);

  // Product form
  const blankProduct = { name: "", category: "Beauty", costPrice: "", sellingPrice: "", quantity: "", reorderLevel: 5, notes: "" };
  const [pForm, setPForm] = useState(modal.type === "editProduct" ? { ...modal.data } : blankProduct);

  const saveProduct = () => {
    if (!pForm.name || !pForm.sellingPrice) { showToast("Name and selling price required", "error"); return; }
    if (modal.type === "editProduct") {
      setProducts(prev => prev.map(p => p.id === pForm.id ? { ...pForm, costPrice: Number(pForm.costPrice), sellingPrice: Number(pForm.sellingPrice), quantity: Number(pForm.quantity) } : p));
      showToast("Product updated ✓");
    } else {
      setProducts(prev => [...prev, { ...pForm, id: Date.now(), costPrice: Number(pForm.costPrice), sellingPrice: Number(pForm.sellingPrice), quantity: Number(pForm.quantity) }]);
      showToast("Product added ✓");
    }
    close();
  };

  const deleteProduct = () => {
    setProducts(prev => prev.filter(p => p.id !== pForm.id));
    showToast("Product deleted");
    close();
  };

  // Sale form
  const blankSale = { customerName: "", phone: "", items: [{ productId: "", qty: 1, price: "" }], paid: "", status: "paid" };
  const [sForm, setSForm] = useState(blankSale);

  const saleTotal = sForm.items.reduce((a, i) => a + (Number(i.price) * Number(i.qty) || 0), 0);

  const saveSale = () => {
    if (!sForm.customerName || sForm.items.some(i => !i.productId)) { showToast("Customer name and products required", "error"); return; }
    const paid = Number(sForm.paid) || (sForm.status === "paid" ? saleTotal : 0);
    const status = paid >= saleTotal ? "paid" : paid > 0 ? "partial" : "unpaid";
    const items = sForm.items.map(i => {
      const p = products.find(pr => pr.id === Number(i.productId));
      return { productId: Number(i.productId), name: p?.name || "", qty: Number(i.qty), price: Number(i.price) || p?.sellingPrice || 0 };
    });
    setSales(prev => [...prev, { id: Date.now(), customerId: Date.now(), customerName: sForm.customerName, phone: sForm.phone, items, total: saleTotal, paid, status, date: new Date().toISOString() }]);
    // Deduct stock
    setProducts(prev => prev.map(p => {
      const item = items.find(i => i.productId === p.id);
      return item ? { ...p, quantity: Math.max(0, p.quantity - item.qty) } : p;
    }));
    showToast("Sale recorded ✓");
    close();
  };

  // Customer form
  const [cForm, setCForm] = useState({ name: "", phone: "", notes: "" });
  const saveCustomer = () => {
    if (!cForm.name) return;
    setCustomers(prev => [...prev, { ...cForm, id: Date.now(), totalSpent: 0 }]);
    showToast("Customer added ✓");
    close();
  };

  const Input = ({ label, ...props }) => (
    <div style={{ marginBottom: 12 }}>
      <label style={{ fontSize: 12, fontWeight: 600, color: "#6B7280", display: "block", marginBottom: 4 }}>{label}</label>
      <input {...props} style={{ width: "100%", padding: "10px 12px", borderRadius: 10, border: "1px solid #E5E7EB", fontSize: 14, boxSizing: "border-box", outline: "none" }} />
    </div>
  );

  const isProduct = modal.type === "addProduct" || modal.type === "editProduct";
  const isSale = modal.type === "addSale";
  const isCust = modal.type === "addCustomer";

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.55)", zIndex: 400, display: "flex", alignItems: "flex-end", justifyContent: "center" }} onClick={e => e.target === e.currentTarget && close()}>
      <div style={{ background: "#fff", borderRadius: "20px 20px 0 0", padding: "20px", width: "100%", maxWidth: 430, maxHeight: "90vh", overflowY: "auto" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
          <p style={{ fontSize: 16, fontWeight: 700, color: "#1B1F3B", margin: 0 }}>
            {modal.type === "addProduct" ? "Add Product" : modal.type === "editProduct" ? "Edit Product" : modal.type === "addSale" ? "Record Sale" : "Add Customer"}
          </p>
          <button onClick={close} style={{ background: "#F0F2F8", border: "none", borderRadius: 50, width: 30, height: 30, cursor: "pointer", fontSize: 16 }}>✕</button>
        </div>

        {isProduct && (
          <>
            <Input label="Product Name *" value={pForm.name} onChange={e => setPForm(f => ({ ...f, name: e.target.value }))} placeholder="e.g. Shea Butter 250ml" />
            <div style={{ marginBottom: 12 }}>
              <label style={{ fontSize: 12, fontWeight: 600, color: "#6B7280", display: "block", marginBottom: 4 }}>Category</label>
              <select value={pForm.category} onChange={e => setPForm(f => ({ ...f, category: e.target.value }))} style={{ width: "100%", padding: "10px", borderRadius: 10, border: "1px solid #E5E7EB", fontSize: 14 }}>
                {CATEGORIES.map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 12 }}>
              <Input label="Cost Price (GHS)" type="number" value={pForm.costPrice} onChange={e => setPForm(f => ({ ...f, costPrice: e.target.value }))} placeholder="0" />
              <Input label="Selling Price (GHS) *" type="number" value={pForm.sellingPrice} onChange={e => setPForm(f => ({ ...f, sellingPrice: e.target.value }))} placeholder="0" />
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 12 }}>
              <Input label="Qty in Stock" type="number" value={pForm.quantity} onChange={e => setPForm(f => ({ ...f, quantity: e.target.value }))} placeholder="0" />
              <Input label="Reorder Level" type="number" value={pForm.reorderLevel} onChange={e => setPForm(f => ({ ...f, reorderLevel: e.target.value }))} placeholder="5" />
            </div>
            <Input label="Notes" value={pForm.notes} onChange={e => setPForm(f => ({ ...f, notes: e.target.value }))} placeholder="Optional notes…" />
            <div style={{ display: "flex", gap: 8, marginTop: 4 }}>
              {modal.type === "editProduct" && <button onClick={deleteProduct} style={{ background: "#fee2e2", border: "none", borderRadius: 10, padding: "12px", color: "#dc2626", fontSize: 14, fontWeight: 600, cursor: "pointer" }}>Delete</button>}
              <button onClick={saveProduct} style={{ flex: 1, background: "#1B1F3B", border: "none", borderRadius: 10, padding: "12px", color: "#fff", fontSize: 14, fontWeight: 600, cursor: "pointer" }}>
                {modal.type === "editProduct" ? "Save Changes" : "Add Product"}
              </button>
            </div>
          </>
        )}

        {isSale && (
          <>
            <Input label="Customer Name *" value={sForm.customerName} onChange={e => setSForm(f => ({ ...f, customerName: e.target.value }))} placeholder="e.g. Akosua Mensah" />
            <Input label="Phone (optional)" value={sForm.phone} onChange={e => setSForm(f => ({ ...f, phone: e.target.value }))} placeholder="0244..." />

            <p style={{ fontSize: 12, fontWeight: 600, color: "#6B7280", margin: "0 0 8px" }}>Items</p>
            {sForm.items.map((item, idx) => (
              <div key={idx} style={{ background: "#F8F9FC", borderRadius: 10, padding: "10px", marginBottom: 8 }}>
                <select value={item.productId} onChange={e => {
                  const p = products.find(pr => pr.id === Number(e.target.value));
                  setSForm(f => ({ ...f, items: f.items.map((it, i) => i === idx ? { ...it, productId: e.target.value, price: p?.sellingPrice || "" } : it) }));
                }} style={{ width: "100%", padding: "8px", borderRadius: 8, border: "1px solid #E5E7EB", fontSize: 13, marginBottom: 6 }}>
                  <option value="">Select product…</option>
                  {products.map(p => <option key={p.id} value={p.id}>{p.name} — {fmtGHS(p.sellingPrice)}</option>)}
                </select>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6 }}>
                  <input type="number" value={item.qty} onChange={e => setSForm(f => ({ ...f, items: f.items.map((it, i) => i === idx ? { ...it, qty: e.target.value } : it) }))} placeholder="Qty" style={{ padding: "8px", borderRadius: 8, border: "1px solid #E5E7EB", fontSize: 13, width: "100%", boxSizing: "border-box" }} />
                  <input type="number" value={item.price} onChange={e => setSForm(f => ({ ...f, items: f.items.map((it, i) => i === idx ? { ...it, price: e.target.value } : it) }))} placeholder="Price" style={{ padding: "8px", borderRadius: 8, border: "1px solid #E5E7EB", fontSize: 13, width: "100%", boxSizing: "border-box" }} />
                </div>
              </div>
            ))}
            <button onClick={() => setSForm(f => ({ ...f, items: [...f.items, { productId: "", qty: 1, price: "" }] }))} style={{ background: "none", border: "1.5px dashed #E5E7EB", borderRadius: 10, padding: "8px", width: "100%", cursor: "pointer", color: "#6B7280", fontSize: 13, marginBottom: 12 }}>+ Add Item</button>

            {saleTotal > 0 && <p style={{ fontSize: 15, fontWeight: 800, color: "#1B1F3B", margin: "0 0 12px" }}>Total: {fmtGHS(saleTotal)}</p>}

            <div style={{ marginBottom: 12 }}>
              <label style={{ fontSize: 12, fontWeight: 600, color: "#6B7280", display: "block", marginBottom: 4 }}>Payment Status</label>
              <div style={{ display: "flex", gap: 6 }}>
                {["paid", "partial", "unpaid"].map(s => (
                  <button key={s} onClick={() => setSForm(f => ({ ...f, status: s, paid: s === "paid" ? String(saleTotal) : s === "unpaid" ? "0" : f.paid }))} style={{ flex: 1, background: sForm.status === s ? "#1B1F3B" : "#F0F2F8", border: "none", borderRadius: 8, padding: "8px", color: sForm.status === s ? "#fff" : "#6B7280", fontSize: 12, fontWeight: 600, cursor: "pointer", textTransform: "capitalize" }}>{s}</button>
                ))}
              </div>
            </div>

            {sForm.status === "partial" && (
              <Input label="Amount Paid (GHS)" type="number" value={sForm.paid} onChange={e => setSForm(f => ({ ...f, paid: e.target.value }))} placeholder="0" />
            )}

            <button onClick={saveSale} style={{ width: "100%", background: "#1B1F3B", border: "none", borderRadius: 10, padding: "14px", color: "#fff", fontSize: 14, fontWeight: 700, cursor: "pointer" }}>Record Sale</button>
          </>
        )}

        {isCust && (
          <>
            <Input label="Full Name *" value={cForm.name} onChange={e => setCForm(f => ({ ...f, name: e.target.value }))} placeholder="e.g. Akosua Mensah" />
            <Input label="Phone" value={cForm.phone} onChange={e => setCForm(f => ({ ...f, phone: e.target.value }))} placeholder="0244…" />
            <Input label="Notes" value={cForm.notes} onChange={e => setCForm(f => ({ ...f, notes: e.target.value }))} placeholder="Instagram customer, prefers delivery, etc." />
            <button onClick={saveCustomer} style={{ width: "100%", background: "#1B1F3B", border: "none", borderRadius: 10, padding: "14px", color: "#fff", fontSize: 14, fontWeight: 700, cursor: "pointer" }}>Add Customer</button>
          </>
        )}
      </div>
    </div>
  );
}

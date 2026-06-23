import { useState } from "react";
import { fmtGHS, isThisMonth } from "../utils/formatters";
import { EXPENSE_CATS } from "../data/constants";

export function Reports({ sales, products, expenses, setExpenses, setModal, showToast }) {
  const [expModal, setExpModal] = useState(false);
  const [expForm, setExpForm] = useState({ category: "Transportation", amount: "", note: "" });

  const monthSales = sales.filter(s => isThisMonth(s.date));
  const revenue = monthSales.reduce((a, s) => a + s.paid, 0);
  const cogs = monthSales.reduce((a, s) => a + s.items.reduce((b, item) => {
    const p = products.find(pr => pr.id === item.productId);
    return b + (p ? p.costPrice * item.qty : 0);
  }, 0), 0);
  const monthExpenses = expenses.filter(e => isThisMonth(e.date)).reduce((a, e) => a + e.amount, 0);
  const grossProfit = revenue - cogs;
  const netProfit = grossProfit - monthExpenses;
  const margin = revenue > 0 ? ((netProfit / revenue) * 100).toFixed(1) : "0.0";

  // Best sellers
  const productSales = {};
  sales.forEach(s => s.items.forEach(item => {
    productSales[item.productId] = (productSales[item.productId] || 0) + item.qty;
  }));
  const bestSellers = Object.entries(productSales).sort((a, b) => b[1] - a[1]).slice(0, 5).map(([id, qty]) => {
    const p = products.find(pr => pr.id === Number(id));
    return { name: p?.name || "Unknown", qty, revenue: sales.reduce((a, s) => a + s.items.filter(i => i.productId === Number(id)).reduce((b, i) => b + i.price * i.qty, 0), 0) };
  });

  const expByCat = {};
  expenses.filter(e => isThisMonth(e.date)).forEach(e => { expByCat[e.category] = (expByCat[e.category] || 0) + e.amount; });

  const addExpense = () => {
    if (!expForm.amount) return;
    setExpenses(prev => [...prev, { id: Date.now(), category: expForm.category, amount: Number(expForm.amount), note: expForm.note, date: new Date().toISOString() }]);
    setExpForm({ category: "Transportation", amount: "", note: "" });
    setExpModal(false);
    showToast("Expense added ✓");
  };

  const barMax = Math.max(...bestSellers.map(b => b.qty), 1);

  return (
    <div style={{ padding: "16px" }}>
      {/* P&L card */}
      <div style={{ background: "#1B1F3B", borderRadius: 18, padding: "18px", marginBottom: 14 }}>
        <p style={{ color: "#9CA3AF", fontSize: 12, fontWeight: 600, margin: "0 0 12px", textTransform: "uppercase", letterSpacing: "0.06em" }}>This Month — P&L</p>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          {[["Revenue", revenue, "#fff"], ["Cost of Goods", cogs, "#F5A623"], ["Gross Profit", grossProfit, "#00C896"], ["Net Profit", netProfit, netProfit >= 0 ? "#00C896" : "#f87171"]].map(([label, val, color]) => (
            <div key={label}>
              <p style={{ color: "#9CA3AF", fontSize: 11, margin: "0 0 2px" }}>{label}</p>
              <p style={{ color, fontSize: 16, fontWeight: 800, margin: 0 }}>{fmtGHS(val)}</p>
            </div>
          ))}
        </div>
        <p style={{ color: "#6EE7B7", fontSize: 12, margin: "12px 0 0" }}>Profit margin: {margin}%</p>
      </div>

      {/* Best sellers */}
      <div style={{ background: "#fff", borderRadius: 14, padding: "14px", marginBottom: 14, boxShadow: "0 1px 3px rgba(0,0,0,0.06)" }}>
        <p style={{ fontSize: 14, fontWeight: 700, color: "#1B1F3B", margin: "0 0 12px" }}>Best Sellers</p>
        {bestSellers.map((b, i) => (
          <div key={i} style={{ marginBottom: 10 }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 3 }}>
              <p style={{ fontSize: 12, color: "#374151", margin: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", maxWidth: "70%" }}>{b.name}</p>
              <p style={{ fontSize: 12, fontWeight: 700, color: "#1B1F3B", margin: 0 }}>{b.qty} sold</p>
            </div>
            <div style={{ background: "#F0F2F8", borderRadius: 4, height: 6, overflow: "hidden" }}>
              <div style={{ width: `${(b.qty / barMax) * 100}%`, background: "#00C896", height: "100%", borderRadius: 4 }} />
            </div>
          </div>
        ))}
      </div>

      {/* Expenses */}
      <div style={{ background: "#fff", borderRadius: 14, padding: "14px", boxShadow: "0 1px 3px rgba(0,0,0,0.06)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
          <p style={{ fontSize: 14, fontWeight: 700, color: "#1B1F3B", margin: 0 }}>Expenses</p>
          <button onClick={() => setExpModal(true)} style={{ background: "#1B1F3B", border: "none", borderRadius: 8, color: "#fff", fontSize: 12, fontWeight: 600, padding: "6px 10px", cursor: "pointer" }}>+ Add</button>
        </div>
        {Object.entries(expByCat).length === 0 && <p style={{ fontSize: 13, color: "#9CA3AF", textAlign: "center", padding: "12px 0" }}>No expenses this month</p>}
        {Object.entries(expByCat).map(([cat, amt]) => (
          <div key={cat} style={{ display: "flex", justifyContent: "space-between", padding: "7px 0", borderBottom: "1px solid #F3F4F6" }}>
            <p style={{ fontSize: 13, color: "#374151", margin: 0 }}>{cat}</p>
            <p style={{ fontSize: 13, fontWeight: 700, color: "#dc2626", margin: 0 }}>{fmtGHS(amt)}</p>
          </div>
        ))}
        {monthExpenses > 0 && <p style={{ fontSize: 13, fontWeight: 800, color: "#1B1F3B", textAlign: "right", marginTop: 8 }}>Total: {fmtGHS(monthExpenses)}</p>}
      </div>

      {/* Expense modal */}
      {expModal && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 500, display: "flex", alignItems: "flex-end", justifyContent: "center" }}>
          <div style={{ background: "#fff", borderRadius: "20px 20px 0 0", padding: "20px", width: "100%", maxWidth: 430 }}>
            <p style={{ fontSize: 16, fontWeight: 700, color: "#1B1F3B", margin: "0 0 16px" }}>Add Expense</p>
            <label style={{ fontSize: 12, fontWeight: 600, color: "#6B7280", display: "block", marginBottom: 4 }}>Category</label>
            <select value={expForm.category} onChange={e => setExpForm(f => ({ ...f, category: e.target.value }))} style={{ width: "100%", padding: "10px", borderRadius: 10, border: "1px solid #E5E7EB", fontSize: 14, marginBottom: 12 }}>
              {EXPENSE_CATS.map(c => <option key={c}>{c}</option>)}
            </select>
            <label style={{ fontSize: 12, fontWeight: 600, color: "#6B7280", display: "block", marginBottom: 4 }}>Amount (GHS)</label>
            <input type="number" value={expForm.amount} onChange={e => setExpForm(f => ({ ...f, amount: e.target.value }))} placeholder="0.00" style={{ width: "100%", padding: "10px", borderRadius: 10, border: "1px solid #E5E7EB", fontSize: 14, marginBottom: 12, boxSizing: "border-box" }} />
            <label style={{ fontSize: 12, fontWeight: 600, color: "#6B7280", display: "block", marginBottom: 4 }}>Note</label>
            <input value={expForm.note} onChange={e => setExpForm(f => ({ ...f, note: e.target.value }))} placeholder="What was this for?" style={{ width: "100%", padding: "10px", borderRadius: 10, border: "1px solid #E5E7EB", fontSize: 14, marginBottom: 16, boxSizing: "border-box" }} />
            <div style={{ display: "flex", gap: 10 }}>
              <button onClick={() => setExpModal(false)} style={{ flex: 1, background: "#F0F2F8", border: "none", borderRadius: 10, padding: 12, fontSize: 14, fontWeight: 600, cursor: "pointer" }}>Cancel</button>
              <button onClick={addExpense} style={{ flex: 1, background: "#1B1F3B", border: "none", borderRadius: 10, padding: 12, color: "#fff", fontSize: 14, fontWeight: 600, cursor: "pointer" }}>Save</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

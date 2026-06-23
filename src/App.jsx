import { useState } from "react";
import { Dashboard } from "./components/Dashboard";
import { Products } from "./components/Products";
import { Sales } from "./components/Sales";
import { Customers } from "./components/Customers";
import { Reports } from "./components/Reports";
import { Modal } from "./components/Modal";
import { INITIAL_PRODUCTS, INITIAL_SALES, INITIAL_CUSTOMERS, INITIAL_EXPENSES } from "./data/initialData";
import { TABS } from "./data/constants";
import { isToday, isThisWeek, isThisMonth } from "./utils/formatters";

export default function App() {
  const [tab, setTab] = useState("dashboard");
  const [products, setProducts] = useState(INITIAL_PRODUCTS);
  const [sales, setSales] = useState(INITIAL_SALES);
  const [customers, setCustomers] = useState(INITIAL_CUSTOMERS);
  const [expenses, setExpenses] = useState(INITIAL_EXPENSES);
  const [modal, setModal] = useState(null); // {type, data}
  const [search, setSearch] = useState("");
  const [filterCat, setFilterCat] = useState("All");
  const [toast, setToast] = useState(null);

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 2800);
  };

  const todaySales = sales.filter(s => isToday(s.date)).reduce((a, s) => a + s.paid, 0);
  const weeklySales = sales.filter(s => isThisWeek(s.date)).reduce((a, s) => a + s.paid, 0);
  const monthlySales = sales.filter(s => isThisMonth(s.date)).reduce((a, s) => a + s.paid, 0);
  const totalInventoryValue = products.reduce((a, p) => a + p.sellingPrice * p.quantity, 0);
  const lowStock = products.filter(p => p.quantity <= p.reorderLevel && p.quantity > 0).length;
  const outOfStock = products.filter(p => p.quantity === 0).length;

  const monthlyRevenue = monthlySales;
  const monthlyCOGS = sales.filter(s => isThisMonth(s.date)).reduce((a, s) => {
    return a + s.items.reduce((b, item) => {
      const p = products.find(pr => pr.id === item.productId);
      return b + (p ? p.costPrice * item.qty : 0);
    }, 0);
  }, 0);
  const monthlyExpenses = expenses.filter(e => isThisMonth(e.date)).reduce((a, e) => a + e.amount, 0);
  const grossProfit = monthlyRevenue - monthlyCOGS;
  const netProfit = grossProfit - monthlyExpenses;

  // 7-day sparkline
  const sparkData = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(Date.now() - (6 - i) * 86400000);
    return sales.filter(s => new Date(s.date).toDateString() === d.toDateString()).reduce((a, s) => a + s.paid, 0);
  });

  return (
    <div style={{ fontFamily: "'Inter', 'SF Pro Display', system-ui, sans-serif", background: "#F0F2F8", minHeight: "100vh", maxWidth: 430, margin: "0 auto", position: "relative" }}>
      {/* Toast */}
      {toast && (
        <div style={{ position: "fixed", top: 16, left: "50%", transform: "translateX(-50%)", zIndex: 9999, background: toast.type === "success" ? "#1B1F3B" : "#dc2626", color: "#fff", padding: "10px 20px", borderRadius: 24, fontSize: 13, fontWeight: 500, whiteSpace: "nowrap", boxShadow: "0 4px 20px rgba(0,0,0,0.2)" }}>
          {toast.msg}
        </div>
      )}

      {/* Header */}
      <div style={{ background: "#1B1F3B", padding: "16px 20px 12px", position: "sticky", top: 0, zIndex: 100 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <p style={{ color: "#9CA3AF", fontSize: 12, margin: 0 }}>Good morning 👋</p>
            <h1 style={{ color: "#fff", fontSize: 18, fontWeight: 700, margin: 0 }}>My Business</h1>
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <button onClick={() => setModal({ type: "addSale" })} style={{ background: "#00C896", border: "none", borderRadius: 20, color: "#fff", fontSize: 12, fontWeight: 600, padding: "7px 14px", cursor: "pointer" }}>
              + Sale
            </button>
            <button onClick={() => setModal({ type: "addProduct" })} style={{ background: "rgba(255,255,255,0.12)", border: "none", borderRadius: 20, color: "#fff", fontSize: 12, fontWeight: 600, padding: "7px 14px", cursor: "pointer" }}>
              + Product
            </button>
          </div>
        </div>
      </div>

      {/* Page content */}
      <div style={{ paddingBottom: 90 }}>
        {tab === "dashboard" && <Dashboard {...{ todaySales, weeklySales, monthlySales, totalInventoryValue, lowStock, outOfStock, products, sales, sparkData, grossProfit, netProfit, monthlyExpenses, setTab, setModal }} />}
        {tab === "products" && <Products {...{ products, setProducts, search, setSearch, filterCat, setFilterCat, setModal, showToast }} />}
        {tab === "sales" && <Sales {...{ sales, setSales, setModal, showToast }} />}
        {tab === "customers" && <Customers {...{ customers, sales, setModal, showToast }} />}
        {tab === "reports" && <Reports {...{ sales, products, expenses, setExpenses, setModal, showToast }} />}
      </div>

      {/* Bottom Nav */}
      <div style={{ position: "fixed", bottom: 0, left: "50%", transform: "translateX(-50%)", width: "100%", maxWidth: 430, background: "#fff", borderTop: "1px solid #E5E7EB", display: "flex", zIndex: 200 }}>
        {TABS.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)} style={{ flex: 1, background: "none", border: "none", padding: "10px 0 8px", cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center", gap: 3 }}>
            <i className={`ti ${t.icon}`} style={{ fontSize: 22, color: tab === t.id ? "#1B1F3B" : "#9CA3AF" }} />
            <span style={{ fontSize: 10, fontWeight: 600, color: tab === t.id ? "#1B1F3B" : "#9CA3AF", textTransform: "uppercase", letterSpacing: "0.05em" }}>{t.label}</span>
            {tab === t.id && <div style={{ width: 20, height: 3, background: "#00C896", borderRadius: 2, marginTop: -2 }} />}
          </button>
        ))}
      </div>

      {/* Modals */}
      {modal && <Modal modal={modal} setModal={setModal} products={products} setProducts={setProducts} sales={sales} setSales={setSales} customers={customers} setCustomers={setCustomers} showToast={showToast} />}
    </div>
  );
}

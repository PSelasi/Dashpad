import { fmtGHS } from "../utils/formatters";
import { StockBadge } from "./ui/StockBadge";
import { CATEGORIES } from "../data/constants";

export function Products({ products, setProducts, search, setSearch, filterCat, setFilterCat, setModal, showToast }) {
  const filtered = products.filter(p => {
    const q = search.toLowerCase();
    return (filterCat === "All" || p.category === filterCat) && (p.name.toLowerCase().includes(q) || p.category.toLowerCase().includes(q));
  });

  const cats = ["All", ...CATEGORIES];

  return (
    <div style={{ padding: "16px" }}>
      <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
        <div style={{ flex: 1, background: "#fff", borderRadius: 12, display: "flex", alignItems: "center", padding: "0 12px", border: "1px solid #E5E7EB" }}>
          <i className="ti ti-search" style={{ color: "#9CA3AF", fontSize: 16 }} />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search products…" style={{ flex: 1, border: "none", outline: "none", fontSize: 14, padding: "10px 8px", background: "transparent" }} />
        </div>
        <button onClick={() => setModal({ type: "addProduct" })} style={{ background: "#1B1F3B", border: "none", borderRadius: 12, color: "#fff", fontSize: 13, fontWeight: 600, padding: "0 14px", cursor: "pointer", whiteSpace: "nowrap" }}>+ Add</button>
      </div>

      {/* Category pills */}
      <div style={{ display: "flex", gap: 6, overflowX: "auto", paddingBottom: 8, marginBottom: 12 }}>
        {cats.map(c => (
          <button key={c} onClick={() => setFilterCat(c)} style={{ background: filterCat === c ? "#1B1F3B" : "#fff", color: filterCat === c ? "#fff" : "#6B7280", border: filterCat === c ? "none" : "1px solid #E5E7EB", borderRadius: 20, fontSize: 12, fontWeight: 600, padding: "5px 12px", cursor: "pointer", whiteSpace: "nowrap" }}>{c}</button>
        ))}
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {filtered.length === 0 && <div style={{ textAlign: "center", padding: "40px 0", color: "#9CA3AF" }}>No products found</div>}
        {filtered.map(p => (
          <div key={p.id} style={{ background: "#fff", borderRadius: 14, padding: "14px", boxShadow: "0 1px 3px rgba(0,0,0,0.06)", display: "flex", gap: 12, alignItems: "center" }}>
            <div style={{ width: 46, height: 46, background: "#F0F2F8", borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <i className="ti ti-package" style={{ fontSize: 22, color: "#6366f1" }} />
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <p style={{ fontSize: 14, fontWeight: 700, color: "#1B1F3B", margin: "0 0 2px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", maxWidth: "65%" }}>{p.name}</p>
                <StockBadge qty={p.quantity} reorder={p.reorderLevel} />
              </div>
              <div style={{ display: "flex", gap: 12 }}>
                <p style={{ fontSize: 12, color: "#6B7280", margin: 0 }}>{p.category}</p>
                <p style={{ fontSize: 12, color: "#00C896", fontWeight: 700, margin: 0 }}>{fmtGHS(p.sellingPrice)}</p>
                <p style={{ fontSize: 12, color: "#9CA3AF", margin: 0 }}>Qty: {p.quantity}</p>
              </div>
            </div>
            <div style={{ display: "flex", gap: 6, flexShrink: 0 }}>
              <button onClick={() => setModal({ type: "editProduct", data: p })} style={{ background: "#F0F2F8", border: "none", borderRadius: 8, padding: "6px 8px", cursor: "pointer" }}>
                <i className="ti ti-edit" style={{ fontSize: 16, color: "#6B7280" }} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

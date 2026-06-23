import { fmtGHS, fmtDate } from "../utils/formatters";
import { Avatar } from "./ui/Avatar";
import { Badge } from "./ui/Badge";

export function Sales({ sales, setSales, setModal, showToast }) {
  const sorted = [...sales].sort((a, b) => new Date(b.date) - new Date(a.date));
  const totalOwed = sales.filter(s => s.status !== "paid").reduce((a, s) => a + (s.total - s.paid), 0);

  const sendWhatsApp = (sale) => {
    const items = sale.items.map(i => `${i.qty}x ${i.name}`).join(", ");
    const msg = `Hello ${sale.customerName}, your order of ${items} is ready. Total amount: ${fmtGHS(sale.total)}. ${sale.status === "partial" ? `Balance due: ${fmtGHS(sale.total - sale.paid)}.` : sale.status === "unpaid" ? "Payment pending." : "Thank you for your payment! 🙏"} — My Business`;
    const url = `https://wa.me/${sale.phone.replace(/^0/, "233")}?text=${encodeURIComponent(msg)}`;
    window.open(url, "_blank");
  };

  return (
    <div style={{ padding: "16px" }}>
      {totalOwed > 0 && (
        <div style={{ background: "#fff", borderRadius: 14, padding: "14px 16px", marginBottom: 14, border: "1.5px solid #fee2e2" }}>
          <p style={{ fontSize: 12, color: "#991b1b", margin: "0 0 2px", fontWeight: 600 }}>Outstanding Balance</p>
          <p style={{ fontSize: 22, fontWeight: 800, color: "#dc2626", margin: 0 }}>{fmtGHS(totalOwed)}</p>
        </div>
      )}

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
        <p style={{ fontSize: 15, fontWeight: 700, color: "#1B1F3B", margin: 0 }}>All Sales</p>
        <button onClick={() => setModal({ type: "addSale" })} style={{ background: "#1B1F3B", border: "none", borderRadius: 10, color: "#fff", fontSize: 13, fontWeight: 600, padding: "7px 14px", cursor: "pointer" }}>+ Record Sale</button>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {sorted.map(s => (
          <div key={s.id} style={{ background: "#fff", borderRadius: 14, padding: "14px", boxShadow: "0 1px 3px rgba(0,0,0,0.06)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
              <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                <Avatar name={s.customerName} size={34} />
                <div>
                  <p style={{ fontSize: 13, fontWeight: 700, color: "#1B1F3B", margin: 0 }}>{s.customerName}</p>
                  <p style={{ fontSize: 11, color: "#9CA3AF", margin: 0 }}>{fmtDate(s.date)}</p>
                </div>
              </div>
              <div style={{ textAlign: "right" }}>
                <p style={{ fontSize: 15, fontWeight: 800, color: "#1B1F3B", margin: "0 0 2px" }}>{fmtGHS(s.total)}</p>
                <Badge status={s.status} />
              </div>
            </div>
            <div style={{ background: "#F8F9FC", borderRadius: 8, padding: "8px 10px", marginBottom: 8 }}>
              {s.items.map((item, i) => (
                <p key={i} style={{ fontSize: 12, color: "#374151", margin: "1px 0" }}>{item.qty}× {item.name} — {fmtGHS(item.price * item.qty)}</p>
              ))}
            </div>
            {s.status !== "paid" && (
              <p style={{ fontSize: 12, color: "#dc2626", fontWeight: 600, margin: "0 0 8px" }}>Balance due: {fmtGHS(s.total - s.paid)}</p>
            )}
            <div style={{ display: "flex", gap: 6 }}>
              <button onClick={() => sendWhatsApp(s)} style={{ flex: 1, background: "#25D366", border: "none", borderRadius: 8, color: "#fff", fontSize: 12, fontWeight: 700, padding: "8px", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 4 }}>
                <i className="ti ti-brand-whatsapp" style={{ fontSize: 16 }} /> WhatsApp
              </button>
              {s.status !== "paid" && (
                <button onClick={() => { setSales(prev => prev.map(x => x.id === s.id ? { ...x, paid: x.total, status: "paid" } : x)); showToast("Marked as paid ✓"); }} style={{ flex: 1, background: "#d1fae5", border: "none", borderRadius: 8, color: "#065f46", fontSize: 12, fontWeight: 700, padding: "8px", cursor: "pointer" }}>
                  Mark Paid ✓
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

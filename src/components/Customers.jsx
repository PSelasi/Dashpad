import { fmtGHS } from "../utils/formatters";
import { Avatar } from "./ui/Avatar";

export function Customers({ customers, sales, setModal, showToast }) {
  return (
    <div style={{ padding: "16px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
        <p style={{ fontSize: 15, fontWeight: 700, color: "#1B1F3B", margin: 0 }}>Customers</p>
        <button onClick={() => setModal({ type: "addCustomer" })} style={{ background: "#1B1F3B", border: "none", borderRadius: 10, color: "#fff", fontSize: 13, fontWeight: 600, padding: "7px 14px", cursor: "pointer" }}>+ Add</button>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {customers.map(c => {
          const custSales = sales.filter(s => s.customerName === c.name);
          const totalSpent = custSales.reduce((a, s) => a + s.paid, 0);
          const pending = custSales.filter(s => s.status !== "paid").reduce((a, s) => a + (s.total - s.paid), 0);
          return (
            <div key={c.id} style={{ background: "#fff", borderRadius: 14, padding: "14px", boxShadow: "0 1px 3px rgba(0,0,0,0.06)" }}>
              <div style={{ display: "flex", gap: 12, alignItems: "center", marginBottom: 8 }}>
                <Avatar name={c.name} size={42} />
                <div style={{ flex: 1 }}>
                  <p style={{ fontSize: 14, fontWeight: 700, color: "#1B1F3B", margin: 0 }}>{c.name}</p>
                  <p style={{ fontSize: 12, color: "#6B7280", margin: 0 }}>{c.phone}</p>
                </div>
                <div style={{ textAlign: "right" }}>
                  <p style={{ fontSize: 13, fontWeight: 700, color: "#00C896", margin: 0 }}>{fmtGHS(totalSpent)}</p>
                  <p style={{ fontSize: 10, color: "#9CA3AF", margin: 0 }}>total spent</p>
                </div>
              </div>
              {pending > 0 && <p style={{ fontSize: 12, color: "#dc2626", margin: "0 0 8px" }}>Owes: {fmtGHS(pending)}</p>}
              {c.notes && <p style={{ fontSize: 12, color: "#6B7280", fontStyle: "italic", margin: "0 0 8px" }}>"{c.notes}"</p>}
              <div style={{ display: "flex", gap: 6 }}>
                <a href={`tel:${c.phone}`} style={{ flex: 1, background: "#F0F2F8", border: "none", borderRadius: 8, color: "#374151", fontSize: 12, fontWeight: 600, padding: "8px", cursor: "pointer", textDecoration: "none", display: "flex", alignItems: "center", justifyContent: "center", gap: 4 }}>
                  <i className="ti ti-phone" style={{ fontSize: 14 }} /> Call
                </a>
                <a href={`https://wa.me/${c.phone.replace(/^0/, "233")}`} target="_blank" rel="noreferrer" style={{ flex: 1, background: "#25D366", borderRadius: 8, color: "#fff", fontSize: 12, fontWeight: 600, padding: "8px", textDecoration: "none", display: "flex", alignItems: "center", justifyContent: "center", gap: 4 }}>
                  <i className="ti ti-brand-whatsapp" style={{ fontSize: 14 }} /> WhatsApp
                </a>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

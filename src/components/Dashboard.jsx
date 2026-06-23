import { fmtGHS, fmtDate } from "../utils/formatters";
import { Avatar } from "./ui/Avatar";
import { Badge } from "./ui/Badge";
import { Sparkline } from "./ui/Sparkline";

export function Dashboard({ todaySales, weeklySales, monthlySales, totalInventoryValue, lowStock, outOfStock, products, sales, sparkData, grossProfit, netProfit, monthlyExpenses, setTab, setModal }) {
  const card = (title, value, sub, color = "#1B1F3B", highlight = false) => (
    <div style={{ background: highlight ? "#1B1F3B" : "#fff", borderRadius: 16, padding: "16px", boxShadow: "0 1px 4px rgba(0,0,0,0.07)" }}>
      <p style={{ fontSize: 11, color: highlight ? "#9CA3AF" : "#6B7280", margin: "0 0 6px", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.07em" }}>{title}</p>
      <p style={{ fontSize: 22, fontWeight: 800, color: highlight ? "#fff" : color, margin: "0 0 2px", letterSpacing: "-0.03em" }}>{value}</p>
      {sub && <p style={{ fontSize: 12, color: highlight ? "#6EE7B7" : "#6B7280", margin: 0 }}>{sub}</p>}
    </div>
  );

  const recentSales = [...sales].sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 4);

  return (
    <div style={{ padding: "16px" }}>
      {/* Profit hero */}
      <div style={{ background: "linear-gradient(135deg, #1B1F3B 60%, #2d3468)", borderRadius: 20, padding: "20px", marginBottom: 16, position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", right: -10, top: -10, width: 120, height: 120, background: "#00C896", borderRadius: "50%", opacity: 0.08 }} />
        <p style={{ color: "#9CA3AF", fontSize: 12, fontWeight: 600, margin: "0 0 4px", textTransform: "uppercase", letterSpacing: "0.06em" }}>Monthly Net Profit</p>
        <p style={{ color: netProfit >= 0 ? "#00C896" : "#f87171", fontSize: 34, fontWeight: 800, margin: "0 0 8px", letterSpacing: "-0.04em" }}>{fmtGHS(netProfit)}</p>
        <div style={{ display: "flex", gap: 20 }}>
          <div>
            <p style={{ color: "#9CA3AF", fontSize: 11, margin: "0 0 2px" }}>Revenue</p>
            <p style={{ color: "#fff", fontSize: 14, fontWeight: 700, margin: 0 }}>{fmtGHS(monthlySales)}</p>
          </div>
          <div>
            <p style={{ color: "#9CA3AF", fontSize: 11, margin: "0 0 2px" }}>Expenses</p>
            <p style={{ color: "#F5A623", fontSize: 14, fontWeight: 700, margin: 0 }}>{fmtGHS(monthlyExpenses)}</p>
          </div>
          <div style={{ marginLeft: "auto", alignSelf: "flex-end" }}>
            <Sparkline data={sparkData} color="#00C896" />
          </div>
        </div>
      </div>

      {/* Stat grid */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 16 }}>
        {card("Today's Sales", fmtGHS(todaySales), "cash received")}
        {card("This Week", fmtGHS(weeklySales), "7 days")}
        {card("Inventory Value", fmtGHS(totalInventoryValue), `${products.length} products`, "#1B1F3B")}
        {card("Gross Profit", fmtGHS(grossProfit), "this month", "#00C896")}
      </div>

      {/* Alerts */}
      {(lowStock > 0 || outOfStock > 0) && (
        <div style={{ background: "#fff", borderRadius: 14, padding: "14px 16px", marginBottom: 16, border: "1.5px solid #FEF3C7" }}>
          <p style={{ fontSize: 13, fontWeight: 700, color: "#92400e", margin: "0 0 8px" }}>⚠️ Stock Alerts</p>
          {outOfStock > 0 && <p style={{ fontSize: 12, color: "#991b1b", margin: "0 0 4px" }}>🔴 {outOfStock} product{outOfStock > 1 ? "s" : ""} out of stock</p>}
          {lowStock > 0 && <p style={{ fontSize: 12, color: "#92400e", margin: 0 }}>🟡 {lowStock} product{lowStock > 1 ? "s" : ""} running low</p>}
          <button onClick={() => setTab("products")} style={{ marginTop: 10, background: "#FEF3C7", border: "none", borderRadius: 8, color: "#92400e", fontSize: 12, fontWeight: 600, padding: "6px 12px", cursor: "pointer" }}>View Products →</button>
        </div>
      )}

      {/* Recent transactions */}
      <div style={{ background: "#fff", borderRadius: 16, padding: "16px", boxShadow: "0 1px 4px rgba(0,0,0,0.06)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
          <p style={{ fontSize: 14, fontWeight: 700, color: "#1B1F3B", margin: 0 }}>Recent Sales</p>
          <button onClick={() => setTab("sales")} style={{ background: "none", border: "none", color: "#00C896", fontSize: 12, fontWeight: 600, cursor: "pointer" }}>View all →</button>
        </div>
        {recentSales.map(s => (
          <div key={s.id} style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 0", borderBottom: "1px solid #F3F4F6" }}>
            <Avatar name={s.customerName} size={34} />
            <div style={{ flex: 1 }}>
              <p style={{ fontSize: 13, fontWeight: 600, color: "#1B1F3B", margin: 0 }}>{s.customerName}</p>
              <p style={{ fontSize: 11, color: "#9CA3AF", margin: 0 }}>{fmtDate(s.date)} · {s.items.length} item{s.items.length > 1 ? "s" : ""}</p>
            </div>
            <div style={{ textAlign: "right" }}>
              <p style={{ fontSize: 13, fontWeight: 700, color: "#1B1F3B", margin: 0 }}>{fmtGHS(s.total)}</p>
              <Badge status={s.status} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

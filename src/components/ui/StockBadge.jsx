export const StockBadge = ({ qty, reorder }) => {
  if (qty === 0) {
    return (
      <span style={{ background: "#fee2e2", color: "#991b1b", fontSize: 11, fontWeight: 600, padding: "2px 8px", borderRadius: 20 }}>
        Out
      </span>
    );
  }
  if (qty <= reorder) {
    return (
      <span style={{ background: "#fef3c7", color: "#92400e", fontSize: 11, fontWeight: 600, padding: "2px 8px", borderRadius: 20 }}>
        Low
      </span>
    );
  }
  return (
    <span style={{ background: "#d1fae5", color: "#065f46", fontSize: 11, fontWeight: 600, padding: "2px 8px", borderRadius: 20 }}>
      In Stock
    </span>
  );
};

export const Badge = ({ status }) => {
  const map = { paid: ["#d1fae5", "#065f46"], partial: ["#fef3c7", "#92400e"], unpaid: ["#fee2e2", "#991b1b"] };
  const [bg, color] = map[status] || map.unpaid;
  return (
    <span style={{ background: bg, color, fontSize: 11, fontWeight: 600, padding: "2px 8px", borderRadius: 20, textTransform: "capitalize" }}>
      {status}
    </span>
  );
};

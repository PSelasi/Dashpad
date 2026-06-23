export const fmtGHS = (n) => `GHS ${Number(n).toLocaleString("en-GH", { minimumFractionDigits: 0, maximumFractionDigits: 2 })}`;

export const fmtDate = (d) => new Date(d).toLocaleDateString("en-GH", { day: "2-digit", month: "short" });

export const isToday = (d) => new Date(d).toDateString() === new Date().toDateString();

export const isThisWeek = (d) => {
  const now = new Date();
  const day = new Date(d);
  return now - day < 7 * 86400000;
};

export const isThisMonth = (d) => {
  const now = new Date();
  const day = new Date(d);
  return day.getMonth() === now.getMonth() && day.getFullYear() === now.getFullYear();
};

export const INITIAL_PRODUCTS = [
  { id: 1, name: "Shea Body Butter 250ml", category: "Beauty", costPrice: 18, sellingPrice: 35, quantity: 24, reorderLevel: 5, notes: "Best seller", image: null },
  { id: 2, name: "Coconut Hair Oil 150ml", category: "Beauty", costPrice: 12, sellingPrice: 25, quantity: 3, reorderLevel: 5, notes: "Low stock", image: null },
  { id: 3, name: "Ankara Tote Bag", category: "Fashion", costPrice: 45, sellingPrice: 90, quantity: 12, reorderLevel: 3, notes: "Handmade", image: null },
  { id: 4, name: "Phone Case iPhone 15", category: "Accessories", costPrice: 8, sellingPrice: 20, quantity: 0, reorderLevel: 10, notes: "", image: null },
  { id: 5, name: "Aloe Vera Gel 100ml", category: "Beauty", costPrice: 9, sellingPrice: 18, quantity: 18, reorderLevel: 5, notes: "", image: null },
  { id: 6, name: "Waist Beads Set", category: "Fashion", costPrice: 15, sellingPrice: 30, quantity: 8, reorderLevel: 4, notes: "Various colors", image: null },
];

export const INITIAL_SALES = [
  { id: 1, customerId: 1, customerName: "Akosua Mensah", phone: "0244123456", items: [{ productId: 1, name: "Shea Body Butter 250ml", qty: 2, price: 35 }], total: 70, paid: 70, status: "paid", date: new Date(Date.now() - 86400000 * 0).toISOString() },
  { id: 2, customerId: 2, customerName: "Efua Asante", phone: "0200987654", items: [{ productId: 3, name: "Ankara Tote Bag", qty: 1, price: 90 }, { productId: 6, name: "Waist Beads Set", qty: 2, price: 30 }], total: 150, paid: 100, status: "partial", date: new Date(Date.now() - 86400000 * 1).toISOString() },
  { id: 3, customerId: 3, customerName: "Yaa Boateng", phone: "0554321890", items: [{ productId: 5, name: "Aloe Vera Gel 100ml", qty: 3, price: 18 }], total: 54, paid: 54, status: "paid", date: new Date(Date.now() - 86400000 * 2).toISOString() },
  { id: 4, customerId: 1, customerName: "Akosua Mensah", phone: "0244123456", items: [{ productId: 2, name: "Coconut Hair Oil 150ml", qty: 1, price: 25 }], total: 25, paid: 0, status: "unpaid", date: new Date(Date.now() - 86400000 * 3).toISOString() },
  { id: 5, customerId: 4, customerName: "Kofi Darko", phone: "0271456789", items: [{ productId: 1, name: "Shea Body Butter 250ml", qty: 3, price: 35 }], total: 105, paid: 105, status: "paid", date: new Date(Date.now() - 86400000 * 5).toISOString() },
  { id: 6, customerId: 5, customerName: "Abena Osei", phone: "0261234567", items: [{ productId: 6, name: "Waist Beads Set", qty: 2, price: 30 }], total: 60, paid: 60, status: "paid", date: new Date(Date.now() - 86400000 * 7).toISOString() },
];

export const INITIAL_CUSTOMERS = [
  { id: 1, name: "Akosua Mensah", phone: "0244123456", notes: "Prefers delivery", totalSpent: 95 },
  { id: 2, name: "Efua Asante", phone: "0200987654", notes: "Instagram referral", totalSpent: 150 },
  { id: 3, name: "Yaa Boateng", phone: "0554321890", notes: "", totalSpent: 54 },
  { id: 4, name: "Kofi Darko", phone: "0271456789", notes: "Bulk buyer", totalSpent: 105 },
  { id: 5, name: "Abena Osei", phone: "0261234567", notes: "", totalSpent: 60 },
];

export const INITIAL_EXPENSES = [
  { id: 1, category: "Packaging", amount: 45, note: "Bubble wrap and boxes", date: new Date(Date.now() - 86400000 * 2).toISOString() },
  { id: 2, category: "Transportation", amount: 30, note: "Delivery to customers", date: new Date(Date.now() - 86400000 * 4).toISOString() },
  { id: 3, category: "Advertising", amount: 50, note: "Facebook ads", date: new Date(Date.now() - 86400000 * 6).toISOString() },
];

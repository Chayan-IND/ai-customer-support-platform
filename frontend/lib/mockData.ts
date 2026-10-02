export type Order = {
  id: string;
  product: string;
  date: string;
  total: string;
  status: "Processing" | "Shipped" | "Delivered" | "Cancelled";
};

export const dashboardStats = {
  activeOrders: 3,
  openTickets: 1,
  pendingReturns: 1,
  aiChats: 12,
};

export const recentOrders: Order[] = [
  { id: "#1024", product: "Wireless Headphones", date: "28 Sep 2026", total: "₹2,499", status: "Shipped" },
  { id: "#1019", product: "Running Shoes", date: "22 Sep 2026", total: "₹3,999", status: "Delivered" },
  { id: "#1015", product: "Smart Watch", date: "18 Sep 2026", total: "₹5,499", status: "Processing" },
  { id: "#1008", product: "Laptop Backpack", date: "10 Sep 2026", total: "₹1,799", status: "Cancelled" },
];
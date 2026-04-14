const NAMES = [
  { name: "Arjun Kumar", initials: "AK", color: "#1D9E75" },
  { name: "Priya Sharma", initials: "PS", color: "#3b82f6" },
  { name: "Rahul Mehta", initials: "RM", color: "#a855f7" },
  { name: "Sneha Patel", initials: "SP", color: "#f59e0b" },
  { name: "Vikram Singh", initials: "VS", color: "#ef4444" },
  { name: "Ananya Iyer", initials: "AI", color: "#06b6d4" },
  { name: "Karan Gupta", initials: "KG", color: "#8b5cf6" },
  { name: "Divya Nair", initials: "DN", color: "#ec4899" },
  { name: "Rohan Das", initials: "RD", color: "#10b981" },
  { name: "Meera Reddy", initials: "MR", color: "#f97316" },
  { name: "Aditya Joshi", initials: "AJ", color: "#14b8a6" },
  { name: "Pooja Verma", initials: "PV", color: "#6366f1" },
  { name: "Sanjay Rao", initials: "SR", color: "#0ea5e9" },
  { name: "Kavya Menon", initials: "KM", color: "#84cc16" },
  { name: "Nikhil Shah", initials: "NS", color: "#f43f5e" },
  { name: "Lakshmi Nair", initials: "LN", color: "#22d3ee" },
  { name: "Amit Pandey", initials: "AP", color: "#fb923c" },
  { name: "Riya Jain", initials: "RJ", color: "#c084fc" },
  { name: "Suresh Babu", initials: "SB", color: "#34d399" },
  { name: "Deepa Krishna", initials: "DK", color: "#60a5fa" },
];

export function getUserInfo(userId = "") {
  const num = parseInt(userId.replace(/\D/g, "") || "0");
  return NAMES[num % NAMES.length];
}

export function getUserName(userId) {
  return getUserInfo(userId).name;
}
export function getUserInitials(userId) {
  return getUserInfo(userId).initials;
}
export function getUserColor(userId) {
  return getUserInfo(userId).color;
}

export const stats = [
  { title: "Users", value: 120 },
  { title: "Listings", value: 80 },
  { title: "Swaps Completed", value: 45 },
];

export const users = [
  { id: 1, username: "Hussain", email: "h@gmail.com", isBanned: false },
  { id: 2, username: "John", email: "j@gmail.com", isBanned: true },
];

export const listings = [
  { id: 1, title: "Vintage Jacket", category: "Men" },
  { id: 2, title: "Sneakers", category: "Footwear" },
];
// /admin/data/analyticsData.js

const generateData = (days) => {
  return Array.from({ length: days }).map((_, i) => ({
    day: `Day ${i + 1}`,
    users: Math.floor(Math.random() * 20 + 50),
    listings: Math.floor(Math.random() * 15 + 30),
    swaps: Math.floor(Math.random() * 10 + 20),
  }));
};

export const analyticsData = {
  7: generateData(7),
  14: generateData(14),
  28: generateData(28),
};
export const disputes = [
  {
    id: 1,
    type: "DAMAGED_ITEM",
    reason: "Item was torn",
    status: "open"
  }
];
import React, { useMemo } from "react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";

const COLORS = [
  "var(--color-accent-500)",
  "var(--color-brand-500)",
  "var(--color-brand-400)",
  "var(--color-brand-300)",
];

const CustomTooltip = ({ active, payload }) => {
  if (!active || !payload?.length) return null;
  const p = payload[0]?.payload;

  return (
    <div className="rounded-xl border border-white/10 bg-brand-800/90 backdrop-blur-xl px-4 py-3 shadow-lg shadow-black/40">
      <p className="text-white font-semibold">{p.name}</p>
      <p className="text-brand-200 text-sm montserrat mt-1">{p.value}</p>
    </div>
  );
};

export default function ActivityDonutChart({ totals }) {
  const data = useMemo(() => {
    const safe = (v) => (typeof v === "number" ? v : 0);

    return [
      { name: "User Logins", value: safe(totals?.users) },
      { name: "Listing Uploads", value: safe(totals?.listings) },
      { name: "Swap Requests", value: safe(totals?.swaps) },
      { name: "Disputes", value: safe(totals?.disputes) },
    ];
  }, [totals]);

  const totalValue = data.reduce((acc, cur) => acc + (cur.value || 0), 0);

  return (
    <div className="bg-brand-800 p-6 rounded-xl border border-white/10 shadow-lg shadow-black/30">
      <div className="flex items-center justify-between gap-4 mb-4">
        <div>
          <h2 className="playfair text-xl text-white">Activity Distribution</h2>
          <p className="text-brand-200 text-sm montserrat mt-1">
            A quick breakdown of platform activity signals
          </p>
        </div>

        <div className="px-3 py-2 rounded-xl bg-accent-500/15 border border-accent-500/25">
          <p className="text-accent-500 text-sm font-semibold">Total</p>
          <p className="text-white font-semibold">{totalValue}</p>
        </div>
      </div>

      <div className="w-full h-72">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              innerRadius={70}
              outerRadius={100}
              paddingAngle={2}
              stroke="rgba(255,255,255,0.08)"
            >
              {data.map((_, idx) => (
                <Cell key={idx} fill={COLORS[idx % COLORS.length]} />
              ))}
            </Pie>

            <Tooltip content={<CustomTooltip />} />
            <Legend
              verticalAlign="bottom"
              wrapperStyle={{ color: "white", fontSize: 12 }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

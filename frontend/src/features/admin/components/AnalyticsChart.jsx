// /admin/components/AnalyticsChart.jsx

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

export default function AnalyticsChart({ data, dataKey, title }) {
  return (
    <div className="bg-brand-800 lg:p-5 p-0 rounded text-brand-500">
      <h2 className="playfair text-xl mb-4 text-white">{title}</h2>

      <ResponsiveContainer width="100%" height={250}>
        <LineChart
          data={data}
          margin={{ top: 5, right: 10, left: -20, bottom: 0 }}
        >
          <CartesianGrid
            strokeDasharray="4 4"
            stroke="var(--color-accent-500)"
          />

          <XAxis dataKey="date" stroke="var(--color-accent-500)" />
          <YAxis dataKey="count" stroke="var(--color-accent-500)" />

          <Tooltip />

          <Line
            type="monotone"
            dataKey="count"
            stroke="var(--color-accent-500)"
            strokeWidth={3}
            dot={{ r: 4, stroke: "#fff" }}
            activeDot={{ stroke: "var(--color-accent-500)" }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

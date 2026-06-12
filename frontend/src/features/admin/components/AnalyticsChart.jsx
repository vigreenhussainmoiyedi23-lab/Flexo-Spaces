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
  console.log(data);
  
  return (
    <div className="bg-text-primary  lg:p-5 p-0 rounded-xl   text-brand-500">
      <h2 className="playfair text-xl mb-4 text-white">{title}</h2>

      <ResponsiveContainer width="100%" height={250}>
        <LineChart
          data={data}
          margin={{ top: 5, right: 10, left: -20, bottom: 0 }}
        >
          <CartesianGrid strokeDasharray="4 4" stroke="white" />

          <XAxis dataKey="date" stroke="white" />
          <YAxis dataKey="count" stroke="white" />

          <Tooltip
            contentStyle={{
              backgroundColor: "var(--color-brand-200)",
              border: "none",
              borderRadius: "8px",
              color: "#000",
            }}
            labelStyle={{
              color: "#000",
              fontWeight: "bold",
            }}
            formatter={(value) => [`${value}`, dataKey]}
          />

          <Line
            type="monotone"
            dataKey="count"
            stroke="white"
            strokeWidth={3}
            dot={{ r: 4, stroke: "#fff" }}
            activeDot={{ stroke: "var(--color-brand-100)" }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

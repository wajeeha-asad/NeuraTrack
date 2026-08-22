import {
  LineChart,
  Line,
  ResponsiveContainer,
} from "recharts";

const data = [
  { v: 2 },
  { v: 3 },
  { v: 2.5 },
  { v: 4 },
  { v: 3.6 },
  { v: 5 },
];

export default function MiniTrend() {
  return (
    <div className="h-16 w-24">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <Line
            dataKey="v"
            stroke="#7C5CFC"
            strokeWidth={3}
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
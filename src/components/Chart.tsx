import { Card, CardContent } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";


export type ChartDataPoint = {
label: string;
value: number;
};


type ChartProps = {
title?: string;
data: ChartDataPoint[];
};


export default function Chart({ title, data }: ChartProps) {
return (
<Card className="w-full rounded-2xl shadow-sm">
<CardContent className="p-4">
{title && (
<h2 className="mb-4 text-lg font-semibold tracking-tight">{title}</h2>
)}
<div className="h-[300px] w-full">
<ResponsiveContainer width="100%" height="100%">
<LineChart data={data}>
<XAxis dataKey="label" />
<YAxis />
<Tooltip />
<Line
type="monotone"
dataKey="value"
strokeWidth={2}
dot={false}
/>
</LineChart>
</ResponsiveContainer>
</div>
</CardContent>
</Card>
);
}

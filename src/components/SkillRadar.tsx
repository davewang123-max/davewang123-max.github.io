import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ResponsiveContainer } from 'recharts';

interface Props {
  axes: Record<string, string>;
}

const axisOrder = [
  'python', 'ml', 'viz', 'business', 'communication', 'finance',
  'driving', 'cli', 'detail', 'adas',
];

const data = [
  { axis: 'python', value: 90 },
  { axis: 'ml', value: 85 },
  { axis: 'viz', value: 80 },
  { axis: 'business', value: 85 },
  { axis: 'communication', value: 90 },
  { axis: 'finance', value: 82 },
  { axis: 'driving', value: 90 },
  { axis: 'cli', value: 78 },
  { axis: 'detail', value: 88 },
  { axis: 'adas', value: 45 },
];

export default function SkillRadar({ axes }: Props) {
  const chartData = data.map((d) => ({
    ...d,
    name: axes[d.axis] || d.axis,
  }));

  return (
    <div className="h-80 -mt-4">
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart data={chartData} cx="50%" cy="50%" outerRadius="70%">
          <PolarGrid stroke="#e2e8f0" />
          <PolarAngleAxis
            dataKey="name"
            tick={{ fontSize: 9.5, fill: '#64748b', fontWeight: 500 }}
          />
          <PolarRadiusAxis
            angle={30}
            domain={[0, 100]}
            tick={false}
            axisLine={false}
          />
          <Radar
            name="Skills"
            dataKey="value"
            stroke="#2563eb"
            fill="#3b82f6"
            fillOpacity={0.15}
            strokeWidth={2}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
}

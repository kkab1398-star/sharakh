interface StatsCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  color?: 'blue' | 'green' | 'red' | 'purple' | 'amber';
  icon?: string;
}

const colorMap = {
  blue:   'border-blue-500 bg-blue-50',
  green:  'border-green-500 bg-green-50',
  red:    'border-red-500 bg-red-50',
  purple: 'border-purple-500 bg-purple-50',
  amber:  'border-amber-500 bg-amber-50',
};

const textMap = {
  blue:   'text-blue-700',
  green:  'text-green-700',
  red:    'text-red-700',
  purple: 'text-purple-700',
  amber:  'text-amber-700',
};

export default function StatsCard({ title, value, subtitle, color = 'blue', icon }: StatsCardProps) {
  return (
    <div className={`rounded-xl border-r-4 p-5 shadow-sm ${colorMap[color]}`}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-bold text-gray-500 uppercase tracking-wide">{title}</p>
          <p className={`text-2xl font-black mt-1 ${textMap[color]}`}>{value}</p>
          {subtitle && <p className="text-xs text-gray-400 mt-1">{subtitle}</p>}
        </div>
        {icon && <span className="text-2xl opacity-60">{icon}</span>}
      </div>
    </div>
  );
}

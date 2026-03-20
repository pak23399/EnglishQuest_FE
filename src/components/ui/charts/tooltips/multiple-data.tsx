import { ChartConfig } from '../../chart';

interface TooltipProps<T extends string | number | symbol> {
  active?: boolean;
  payload?: Array<{
    dataKey: string;
    value: number;
    color: string;
    payload: Record<T, number>;
    name: string;
  }>;
  label?: string;
  chartConfig: ChartConfig;
  includes?: T[];
}

const ChartLabel = ({ label, color }: { label: string; color?: string }) => {
  return (
    <div className="flex items-center gap-1.5">
      <div
        className="size-3.5 border-4 rounded-full bg-background"
        style={{ borderColor: color }}
      ></div>
      <span className="text-secondary-foreground">{label}</span>
    </div>
  );
};

export function ChartToolTipMultipleInfo<T extends string | number | symbol>({
  active,
  payload,
  label,
  includes,
  chartConfig,
}: TooltipProps<T>) {
  if (!active || !payload || payload.length === 0) {
    return null;
  }

  const color = chartConfig[payload[0].name as keyof typeof chartConfig].color;

  const chartPayload: Record<T, number> = {};

  for (const key of includes ?? []) {
    chartPayload[key] = payload[0].payload[key] ?? 0;
  }

  return (
    <div className="rounded-lg border bg-popover p-3 shadow-sm shadow-black/5 min-w-[180px] flex flex-col gap-y-3.5">
      <div
        className="text-xs font-semibold text-accent-foreground tracking-wide flex items-center justify-between"
        style={{
          color: color,
        }}
      >
        <span>
          {chartConfig[payload[0].name as keyof typeof chartConfig].label}
        </span>
        <span>{payload[0].value}</span>
      </div>
      <div className="space-y-2">
        {Object.entries(chartPayload).map(([key, value], index) => {
          const config = chartConfig[key as keyof typeof chartConfig];
          return (
            <div
              key={index}
              className="flex items-center gap-2 text-xs justify-between"
            >
              <ChartLabel label={config?.label + ':'} color={color} />
              <span className="font-semibold text-popover-foreground">
                {value}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

import type { LabelProps } from 'recharts';

interface Props {
  total: number;
  label: string;
}

// Recharts inspects its immediate children to find a <Label /> element.
// If you wrap <Label /> in another component, Recharts won't detect it and
// won't apply the necessary props/cloning. To allow reuse while keeping
// Label as a direct child, export a content factory that can be passed to
// a <Label content={...} /> invocation inside the chart.
export function pieChartLabelContent(
  total: number,
  label: string,
): NonNullable<LabelProps['content']> {
  const fn = ({
    viewBox,
  }: {
    viewBox?: { cx?: number; cy?: number } | undefined;
  }) => {
    if (viewBox && 'cx' in viewBox && 'cy' in viewBox) {
      return (
        <text
          x={viewBox.cx}
          y={viewBox.cy}
          textAnchor="middle"
          dominantBaseline="middle"
        >
          <tspan
            x={viewBox.cx}
            y={viewBox.cy}
            className="fill-foreground text-3xl font-bold"
          >
            {total.toLocaleString()}
          </tspan>
          <tspan
            x={viewBox.cx}
            y={(viewBox.cy || 0) + 24}
            className="fill-secondary-foreground"
          >
            {label}
          </tspan>
        </text>
      );
    }
    return null;
  };

  return fn as unknown as NonNullable<LabelProps['content']>;
}

const RADIAN = Math.PI / 180;

type RenderLabelProps = {
  cx?: number;
  cy?: number;
  midAngle?: number;
  innerRadius?: number;
  outerRadius?: number;
  percent?: number;
  value?: number;
};

export const renderCustomizedPieChartLabel = ({
  cx,
  cy,
  midAngle,
  innerRadius,
  outerRadius,
  percent,
  value,
}: RenderLabelProps) => {
  // Move the label slightly more inward so it doesn't overflow the donut.
  // Use a smaller multiplier (0.35) and center the text anchor so the
  // percentage is visually centered on each slice.
  const _cx = cx ?? 0;
  const _cy = cy ?? 0;
  const _inner = innerRadius ?? 0;
  const _outer = outerRadius ?? 0;

  const radius = _inner + (_outer - _inner) * 0.45;
  const x = _cx + radius * Math.cos(-(midAngle ?? 0) * RADIAN);
  const y = _cy + radius * Math.sin(-(midAngle ?? 0) * RADIAN);

  const displayValue = (value ?? 0).toLocaleString();
  const displayPercent = `(${Math.round((percent ?? 0) * 100)}%)`;

  if (percent === 0 || percent === 1) return null;

  // Vertically center the two-line label block by offsetting the first line
  // upward by half a line and pushing the second line down. Use the more
  // commonly supported 'middle' baseline to ensure consistent centering
  // across browsers.
  return (
    <text
      x={x}
      y={y}
      fill="white"
      textAnchor="middle"
      dominantBaseline="middle"
      className="text-sm pointer-events-none"
    >
      {/* move first line up half a line so the pair of lines is centered at y */}
      <tspan x={x} dy="-0.6em" className="font-medium">
        {displayValue}
      </tspan>
      {/* second line below the first */}
      <tspan x={x} dy="1.2em">
        {displayPercent}
      </tspan>
    </text>
  );
};

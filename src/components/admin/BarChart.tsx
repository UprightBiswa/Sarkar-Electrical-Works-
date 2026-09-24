/** Single-series daily bar chart with per-bar hover tooltip (no client JS needed). */
export default function BarChart({
  data,
  unit,
  color = "var(--color-volt-500)",
}: {
  data: { label: string; value: number }[];
  unit: string;
  color?: string;
}) {
  const max = Math.max(1, ...data.map((d) => d.value));
  const total = data.reduce((a, d) => a + d.value, 0);
  return (
    <div>
      <div className="relative flex h-44 items-end gap-[2px] border-b border-white/10">
        {data.map((d, i) => (
          <div key={i} className="group relative flex h-full flex-1 items-end justify-center">
            <div
              className="w-full max-w-7 rounded-t-[4px] transition-opacity group-hover:opacity-80"
              style={{ height: `${d.value ? Math.max(3, (d.value / max) * 100) : 0}%`, background: color }}
            />
            <div className="pointer-events-none absolute bottom-full z-10 mb-1 hidden rounded-lg border border-white/10 bg-ink-800 px-2.5 py-1.5 text-xs whitespace-nowrap text-white shadow-xl group-hover:block">
              <span className="text-slate-400">{d.label}</span>
              <br />
              <b>{d.value}</b> {unit}
            </div>
          </div>
        ))}
      </div>
      <div className="mt-2 flex justify-between text-[11px] text-slate-500">
        <span>{data[0]?.label}</span>
        <span>
          Total: <b className="text-slate-300">{total}</b> {unit}
        </span>
        <span>{data.at(-1)?.label}</span>
      </div>
      <details className="mt-2 text-xs text-slate-500">
        <summary className="cursor-pointer hover:text-slate-300">Table view</summary>
        <table className="mt-2 w-full">
          <tbody>
            {data.map((d, i) => (
              <tr key={i} className="border-t border-white/5">
                <td className="py-1">{d.label}</td>
                <td className="py-1 text-right text-slate-300">{d.value}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </details>
    </div>
  );
}

/* ------------------------------------------------------------------
   SECTION EYEBROW — the short rule followed by a label that heads most
   sections ("THE AASHITA MANIFESTO", "OUR ORIGIN", "OUR PHILOSOPHY",
   "EXPLORE OUR PRODUCTS", "FAQ").

   It was hand-rolled in seven files, and they had already drifted: bar
   widths of 22, 26 and 36, heights of 2 and 4, and three different type
   sizes for what the comp specifies once as 22px semibold at
   tracking -0.44. Those are the numbers here.

   Colour IS a real variable rather than drift — the label is teal on
   the dark sections and near-black on Our Origin, which sits on a light
   green field. So colour is a prop and geometry is not.
   ------------------------------------------------------------------ */

const Eyebrow = ({
  label,
  color = "#2dfbd9",
  barColor,
  barWidth = 22,
  /* The comp genuinely uses two gutters — 16px on the dark sections,
     20px alongside the wider 36px bar (Our Origin, FAQ, Locations) —
     so this is a real design variable rather than drift. */
  gap = 16,
  className = "",
}) => (
  <div className={`flex items-center ${className}`} style={{ gap }}>
    <span
      className="h-[4px] shrink-0"
      style={{ width: barWidth, backgroundColor: barColor ?? color }}
    />
    <p
      className="whitespace-nowrap text-[22px] font-semibold uppercase leading-[1.5] tracking-[-0.44px]"
      style={{ color }}
    >
      {label}
    </p>
  </div>
);

export default Eyebrow;

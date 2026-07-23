/**
 * Responsive audit: finds horizontal overflow and names the culprits.
 *
 *   node scripts/responsive.mjs            # every route, every width
 *   node scripts/responsive.mjs /blog      # one route
 *
 * A page passes when scrollWidth === clientWidth at every width. When
 * it does not, the offending elements are listed — an element counts as
 * a culprit only if it itself extends past the viewport AND no ancestor
 * already does, so the report names the actual cause rather than every
 * wrapper containing it.
 */
import { chromium } from "playwright";

const ROUTES = process.argv[2]
  ? [process.argv[2]]
  : ["/", "/about", "/products", "/blog", "/career", "/career/detail"];

const WIDTHS = [375, 414, 768, 1024, 1280, 1440, 1920];
const PORT = process.env.PORT ?? 3000;

const browser = await chromium.launch();
let failures = 0;

for (const route of ROUTES) {
  const rows = [];
  for (const width of WIDTHS) {
    const page = await browser.newPage({ viewport: { width, height: 900 } });
    await page.goto(`http://localhost:${PORT}${route}`, { waitUntil: "domcontentloaded" });
    await page.waitForTimeout(700);

    const res = await page.evaluate(() => {
      const docW = document.documentElement.clientWidth;
      const over = document.documentElement.scrollWidth - docW;
      const culprits = [];

      if (over > 0) {
        /* An element that extends past the viewport is only a CULPRIT if
           nothing above it clips. Decorative layers — background sweeps,
           blurred glows, oversized artwork — are routinely wider than
           the page on purpose and are contained by an ancestor's
           overflow-hidden. Reporting those buries the one element that
           actually widened the document. */
        const isClipped = (el) => {
          for (let p = el.parentElement; p; p = p.parentElement) {
            const cs = getComputedStyle(p);
            if (cs.overflowX !== "visible" || cs.overflow !== "visible") return true;
          }
          return false;
        };

        const bad = [];
        for (const el of document.querySelectorAll("*")) {
          const r = el.getBoundingClientRect();
          if (r.width === 0 && r.height === 0) continue;
          if (r.right > docW + 1 || r.left < -1) {
            if (!isClipped(el)) bad.push(el);
          }
        }
        // Keep only the outermost offenders — an overflowing child drags
        // its parents into the list and buries the real cause.
        for (const el of bad) {
          if (!bad.some((o) => o !== el && o.contains(el))) {
            const r = el.getBoundingClientRect();
            culprits.push(
              `${el.tagName.toLowerCase()}.${(el.className || "").toString().split(" ").filter(Boolean).slice(0, 2).join(".") || "(none)"} ` +
                `[${Math.round(r.left)}→${Math.round(r.right)}]`,
            );
          }
        }
      }
      return { over, culprits: [...new Set(culprits)].slice(0, 4) };
    });

    rows.push({ width, ...res });
    await page.close();
  }

  const failed = rows.filter((r) => r.over > 0);
  if (failed.length) failures += failed.length;
  console.log(`\n${route}  ${failed.length ? `${failed.length}/${rows.length} widths overflow` : "clean at every width"}`);
  for (const r of rows) {
    if (r.over > 0) {
      console.log(`  ${String(r.width).padStart(5)}  +${r.over}px`);
      for (const c of r.culprits) console.log(`         ${c}`);
    }
  }
}

console.log(failures ? `\n${failures} failing width(s)` : "\nAll routes clean.");
await browser.close();

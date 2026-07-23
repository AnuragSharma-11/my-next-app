/** Locate content columns that are not the canonical 1200px. */
import { chromium } from "playwright";

const route = process.argv[2] ?? "/";
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
await page.goto(`http://localhost:3000${route}`, { waitUntil: "networkidle" });

const bad = await page.evaluate(() => {
  const out = [];
  for (const el of document.querySelectorAll("div,section,article,header,footer")) {
    const cs = getComputedStyle(el);
    if (cs.maxWidth === "1440px" && cs.paddingLeft === "120px") {
      const r = el.getBoundingClientRect();
      const inner = Math.round(r.width - 240);
      if (inner !== 1200) {
        // walk up to name the owning section
        let p = el, owner = "?";
        while (p && p !== document.body) {
          if (p.tagName === "SECTION") { owner = (p.className || "").split(" ")[0] || "(unnamed)"; break; }
          p = p.parentElement;
        }
        out.push({ owner, inner, cls: (el.className || "").slice(0, 90), parentDisplay: getComputedStyle(el.parentElement).display, parentPos: getComputedStyle(el.parentElement).position });
      }
    }
  }
  return out;
});

console.log(bad.length ? bad : "  all columns are 1200px");
await browser.close();

import heroBackdrop from "../assets/hero/Carrier page.svg";

/* ------------------------------------------------------------------
   CAREERS PAGE BACKDROP

   Figma puts this on page-level frames (1:4085 Bg-Fill-Container,
   1:4093, 1:4094) that sit outside every section — so building the
   sections alone left the page rendering on bare white, with the nav
   and the headline's first line invisible against it.

   It is one component rather than a background per section because the
   artwork spans the hero while the gradient runs behind everything
   below it. Splitting it would put a visible join at every section
   boundary.

   THE HERO ART IS THE PROVIDED EXPORT, not a rebuild.
   `Carrier page.svg` is the designer's own 1440x1586 export of the whole
   hero backdrop — archway, figure and teal blooms already composited.
   The four ellipse exports and the separate photo this file once
   downloaded are gone: they were the same artwork reassembled from
   parts, and reassembling something that ships whole only creates a way
   for it to drift.

   ASPECT MUST TRACK THE FILE. The export sets
   preserveAspectRatio="none", which means it does not defend itself: it
   fills whatever box it is handed and shears if that box disagrees with
   its viewBox. Hand this 1924x1586 art a 1440/1586 box and it stretches
   ~33% vertically, which reads as the artwork sitting too low rather
   than as distortion — the failure is easy to misdiagnose.

   So this constant is not decoration. Re-export the SVG at a different
   size and this line has to change with it.
   ------------------------------------------------------------------ */

const HERO_ASPECT = "1924 / 1586";

/* Below the hero the page settles onto the site's standard ramp — the
   same stops the CTA, product grid and footer arrive on, so the join
   between this page and the shared sections is invisible. */
const GRADIENT =
  "linear-gradient(180deg, rgb(1,23,32) 0%, rgb(2,83,75) 49.971%, rgb(4,125,107) 74.981%, rgb(2,197,165) 100%)";

const CareerBackdrop = () => (
  /* z-0, NOT -z-10. A negative z-index puts this behind the wrapper's
     own background, and a `position: relative` parent with no z-index
     creates no stacking context for it to sit inside — so the artwork
     loads, paints, and is then covered by the very element meant to
     hold it. Backdrop at z-0, content at z-10, no background on the
     wrapper: that ordering cannot fail the same way. */
  /* The base colour lives HERE, on the backdrop, not on the page
     wrapper. Two reasons it cannot go on the wrapper: a background
     there paints over this whole layer (that bug hid the artwork
     entirely once already), and this export has a transparent band at
     the top — without a colour behind it, that transparency falls
     through to the white page default and takes the nav with it. */
  <div
    aria-hidden
    className="pointer-events-none absolute inset-0 z-0 flex flex-col overflow-hidden bg-[#012532]"
  >
    {/* NARROW SCREENS COVER RATHER THAN RESHAPE.
        The art box keeps its 1924/1586 aspect — that constant is still
        the only thing holding the export straight. But width/1.213 on a
        375 viewport is 309px of artwork under a hero that runs several
        thousand, which leaves the whole page on flat gradient. So below
        lg the BOX gets a viewport-height floor and the art covers it.
        The crop happens in object-fit, which sizes the object from the
        SVG's own intrinsic ratio before painting — so the rendered art
        is still 1924/1586 and preserveAspectRatio="none" never gets a
        disagreeing box to shear against. At lg the floor is 0 and the
        box collapses back onto the aspect exactly as authored. */}
    <div
      className="relative w-full shrink-0 min-h-[100svh] lg:min-h-0"
      style={{ aspectRatio: HERO_ASPECT }}
    >
      <img
        src={heroBackdrop.src}
        alt=""
        className="absolute inset-0 h-full w-full object-cover"
      />
    </div>

    <div className="w-full flex-1" style={{ height: 3188, backgroundImage: GRADIENT }} />
  </div>
);

export default CareerBackdrop;

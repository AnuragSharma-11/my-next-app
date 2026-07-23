/* ------------------------------------------------------------------
   THE CONTENT COLUMN

   Every Figma artboard in this project is a 1440 frame with a 120px
   gutter, so the content column is 1200px — verified across About
   (1:4781), Blog (1:4525), Products (1:3807) and the Carrier page.
   That single rule is what makes headings line up vertically down the
   whole site.

   The numbers themselves live in globals.css as --frame / --gutter /
   --column, NOT here. Change them there and the header, the home hero
   and every section follow together.

   Before this existed the same column was written five different ways:

     mx-auto flex w-[1200px] max-w-full ... px-[120px] xl:px-0
     mx-auto w-[1440px] max-w-full px-[120px] pb-[116px] pt-[90px]
     mx-auto flex w-full max-w-[1440px] ... px-[120px] py-[20px]
     ...

   All of them resolve to 1200px at exactly 1440 wide and then disagree
   below it — `w-[1200px] xl:px-0` drops its gutter entirely at 1280,
   while `max-w-[1440px] px-[120px]` keeps it. That is why sections
   drifted out of alignment with each other at anything but one width.
   ------------------------------------------------------------------ */

const Container = ({ as: Tag = "div", className = "", children, ...rest }) => (
  <Tag
    className={`mx-auto w-full max-w-[var(--frame)] px-[var(--gutter)] ${className}`}
    {...rest}
  >
    {children}
  </Tag>
);

export default Container;

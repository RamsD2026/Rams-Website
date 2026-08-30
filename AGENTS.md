<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Section header style

All new solution and platform pages follow the header pattern established by the
Rack Safety, Inventory Intelligence and Warehouse Execution pages:
eyebrow → two-line heading → subline, centred.

Read `docs/section-header.md` and use `<SectionHeader>` from
`@/components/sections/SectionHeader` rather than re-typing the classes.

# Typography

`docs/typography.md` is the font system: the three families (IBM Plex Sans /
Roboto / Roboto Mono), the font tokens, and the full type scale — every size,
weight, tracking and line-height used on the site. Check it before choosing a
font size; the site uses arbitrary px values, not Tailwind's named scale.

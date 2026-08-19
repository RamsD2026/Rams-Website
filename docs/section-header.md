# Section header guideline

Every section on a solution or platform page opens the same way:

```
EYEBROW                    ← mono caps, orange
Heading line one           ← bold, tight
heading line two.          ← dimmed / gradient
Supporting sentence.       ← one or two lines
```

The values below are taken from the Rack Safety Intelligence, Inventory
Intelligence and Warehouse Execution pages, which are the reference for all new
work. Use `<SectionHeader>` from `@/components/sections/SectionHeader` rather
than re-typing the classes.

```tsx
<SectionHeader
  eyebrow="Capabilities"
  top="From rack inspection"
  bottom="to rack intelligence."
  body="RAMS turns scattered inspection records into a structured intelligence layer."
/>
```

---

## The three parts

### Eyebrow

```
text-[11px] font-mono font-semibold tracking-[0.22em] uppercase
text-signal-orange mb-5
```

- Two or three words. `Capabilities`, `How it works`, `Built For`, `Proven Results`.
- Never a sentence, never punctuation.
- Always `signal-orange`, on light and dark alike. It is the only orange in the header.

### Heading

```
Default   text-[40px] sm:text-[60px] lg:text-[78px] leading-[1.0]
Compact   text-[36px] sm:text-[54px] lg:text-[68px] leading-[1.05]
Both      font-bold tracking-[-0.04em]
```

- **Two lines, split with `<br />`.** The first line carries the weight; the
  second completes the thought and is dimmed.
- Second line on light: `text-graphite/50`.
- Second line on dark: white→transparent gradient (see the component).
- Aim for **20–26 characters per line**. Longer wraps badly at 78px.
- Use `compact` when the section's visual is a wide dashboard, so the heading
  does not overpower it.

### Subline

```
mt-6 text-[14px] sm:text-[15px] leading-[1.55] max-w-[880px] mx-auto
Light  text-graphite/65
Dark   text-white/60
```

- One or two lines. If it needs three, the heading is doing too little.
- Optional. Several sections work with eyebrow + heading alone.

### Wrapper

```
Default  max-w-[900px] mx-auto text-center mb-20 sm:mb-24
Wide     max-w-[1180px] mx-auto text-center mb-16 sm:mb-20
```

`wide` pairs with a full-bleed visual directly beneath the header.

---

## Motion

Consistent across all three parts. `EASE = [0.22, 1, 0.36, 1]`.

| Part | initial | duration | delay | viewport amount |
|---|---|---|---|---|
| Eyebrow | `y: 8` | 0.5 | — | 0.5 |
| Heading | `y: 20` | 0.85 | — | 0.4 |
| Subline | `y: 12` | 0.65 | 0.1 | 0.4 |

All use `whileInView` with `viewport={{ once: true }}`. Headers animate once on
entry and never replay.

---

## Section rhythm around the header

```
Section padding   pt-28 sm:pt-36 lg:pt-44 pb-28 sm:pb-36 lg:pb-44
Container         rams-container
```

Backgrounds alternate so no two adjacent sections share a surface:

| Surface | Use |
|---|---|
| `bg-white` | Default light section |
| `bg-[#F5F5F7]` | Light section needing separation from a white neighbour |
| `rgba(247,242,232,0.3)` | Warm band, reserved for Proven Results |
| dark radial | Hero, feature panels, analytics, CTA |

Dark radial:

```
radial-gradient(80% 100% at 50% 0%, #1D1D1F 0%, #0E0E0F 55%, #08080A 100%)
```

Flip `at 50% 0%` to `at 50% 100%` when the section sits at the foot of the page.

---

## Page-level type

The page `h1` is **not** a section header — it is larger and animates on load
rather than on scroll:

```
text-[56px] sm:text-[84px] lg:text-[112px] font-bold
leading-[0.98] tracking-[-0.045em]
```

Use `animate` (not `whileInView`) in the hero, since it is above the fold.

---

## Cards beneath a header

For consistency with the reference pages:

```
borderRadius  12
border        1px solid #E8E8ED
boxShadow     0 1px 2px rgba(0,0,0,0.02), 0 8px 24px -12px rgba(0,0,0,0.06)
hover         -translate-y-1, plus the conic orange shine
```

The shine is the shared hover signature on light cards. Copy the `@property`
block from `WexCapabilities.tsx` and rename the variable per section so two
sections on one page cannot collide.

---

## Don't

- **Don't** put the heading and subline side by side. The reference pages centre
  the header; a split left/right header reads as a different system.
- **Don't** wrap a section's content in a card when the section already has its
  own background. One frame, not two.
- **Don't** introduce new accent colours. `signal-orange` is the only accent —
  the brand tokens define it as *"5% — CTAs, critical emphasis only"*. RAG
  colours are for risk state, never decoration.
- **Don't** let a heading run to three lines.
- **Don't** re-type these classes inline. Use the component, so a future change
  lands everywhere at once.

# Design System

Single source of truth for visual styling. All dashboard surfaces must follow these rules.

## Color tokens

| Token         | Hex        | Role                                                         |
| ------------- | ---------- | ------------------------------------------------------------ |
| Ink           | `#0A0A0A`  | Default text — headings, body, labels, numbers, icons        |
| Brand         | `#1F40CD`  | Brand accent — reserved for the few cases listed below       |
| Brand Hover   | `#1A36B0`  | Hover for solid Brand surfaces only                          |
| Surface       | `#ECEAE2`  | Page background, soft panel, status badge background         |
| Card          | `#FFFFFF`  | Cards, inputs, dialogs                                       |
| Border Soft   | `rgba(10,10,10,0.10)` → `0.16` | All standard borders                       |
| Border Strong | `#0A0A0A`  | Borders when emphasizing focus / outline buttons             |
| Border Brand  | `#1F40CD`  | Borders ONLY when conveying active selection                 |
| Muted text    | `text-muted-foreground` | Secondary labels, hints                         |

**No other colors.** No greens, reds, ambers, purples, named tailwind colors. Status meaning (active / draft / error) is conveyed by labels + shape, not hue.

## Brand color is RESERVED

`#1F40CD` is the only accent. It only appears in these places:

1. **One primary CTA per view** — solid `bg-[#1F40CD] text-white` (e.g. "New Campaign", "Save & Launch")
2. **Active sidebar nav item** — solid `bg-[#1F40CD] text-white`
3. **Active step / selected tab** — solid `bg-[#1F40CD] text-white`
4. **Inline links inside prose** — `text-[#1F40CD]` (sparingly)
5. **Active selection state on a tile/pill** — solid blue fill, or blue border (`border-[#1F40CD]`)
6. **Status badge accent text** — cream bg + `text-[#1F40CD]` (small, low-emphasis)

**Brand color does NOT appear in:**
- Headings, body text, table cell values, KPI numbers (use Ink)
- KPI tile backgrounds (use Card white)
- Status badges as solid fill (use cream + blue text)
- Chain / category / vertical pills (neutral white + dark text)
- Section dividers, table borders, hover backgrounds
- Icons that aren't part of an active control

## Hierarchy

A page must have exactly **one** primary blue CTA above the fold. If there are two competing actions, the secondary is an outline button (`border-[#0A0A0A]` text on white) or ghost (no border, dark text).

## Component patterns

### Page header
- Eyebrow (breadcrumb): `text-[10px] uppercase tracking-widest text-muted-foreground`
- Title: large serif/sans, `text-[#0A0A0A]`
- Subtitle: `text-muted-foreground`
- Right-aligned actions: at most one solid blue CTA

### KPI tile
- `bg-white border border-[rgba(10,10,10,0.10)] rounded-xl p-4`
- Label: `text-[10px] uppercase tracking-widest text-muted-foreground`
- Number: `text-2xl font-medium text-[#0A0A0A]`
- Optional delta: muted, never colored red/green
- Optional icon top-right: `text-[#0A0A0A]/40`

### Card
- `bg-white border border-[rgba(10,10,10,0.10)] rounded-xl`
- Default `Card` primitive already does this

### Status badge
- `inline-flex h-5 px-2 rounded-full text-[10px] font-semibold uppercase tracking-widest`
- Active states: `bg-[#ECEAE2] text-[#1F40CD]`
- Neutral states: `bg-[#ECEAE2] text-[#0A0A0A]`

### Chain / vertical / category pill
- `bg-white border border-[rgba(10,10,10,0.12)] text-[#0A0A0A] rounded-full px-2 h-6 text-[11px]`
- Never blue fill, never blue text

### Buttons
- Primary: `bg-[#1F40CD] text-white hover:bg-[#1A36B0] rounded-full`
- Outline: `border border-[#0A0A0A] text-[#0A0A0A] hover:bg-[#0A0A0A]/[0.04] rounded-full`
- Ghost: no border, `text-[#0A0A0A] hover:bg-[#0A0A0A]/[0.04]`

### Input
- `bg-white border border-[rgba(10,10,10,0.12)] rounded-md h-9 px-3`
- Focus: `border-[#0A0A0A]`

### Table
- Header row: `text-[10px] uppercase tracking-widest text-muted-foreground`
- Cells: `text-[12px] text-[#0A0A0A]`
- Row hover: `bg-[#0A0A0A]/[0.02]`
- Dividers: `border-b border-[rgba(10,10,10,0.06)]`

### Sidebar
- Background: `#ECEAE2` or white
- Item idle: `text-[#0A0A0A]` (or muted)
- Item hover: `bg-[#0A0A0A]/[0.04]`
- Item active: `bg-[#1F40CD] text-white`

## Radius

| Token        | Use                                                          |
| ------------ | ------------------------------------------------------------ |
| `rounded-full` | Pills, badges, status dots, toggles, CTA buttons           |
| `rounded-xl`   | Cards, panels, dialogs, big containers                     |
| `rounded-md`   | Inputs, step tabs, list rows, icon tiles, selection tiles  |
| `rounded-sm`   | Tiny indicators only (legend swatches)                     |

## Spacing & rhythm
- Page padding: `p-6` desktop, `p-3` compact pages
- Card padding: `p-4` standard
- Gap between cards: `gap-3` or `gap-4`
- Section heading bottom margin: `mb-3`

## Forbidden
- Solid blue card/tile backgrounds (only buttons + active nav + active step)
- Blue text on headings/body/numbers
- Status conveyed by hue (green = good, red = bad). Use labels.
- New hex codes outside the 5 tokens above. If a new role appears, extend this doc first.

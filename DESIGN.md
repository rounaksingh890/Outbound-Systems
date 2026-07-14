# Design System

## Direction

**Daylight Dispatch** — a bright client-facing operations walkthrough. The interface should feel like a precise dispatch wall in a well-lit office: outcome-first at a glance, richly inspectable when a buyer wants implementation depth.

## Color

Use OKLCH tokens in product CSS. Hex values below are reference equivalents for brand handoff.

| Role | OKLCH | Reference |
| --- | --- | --- |
| Canvas | `oklch(0.99 0.003 255)` | `#FCFCFD` |
| Pale cobalt surface | `oklch(0.97 0.018 255)` | `#EEF3FF` |
| Hairline | `oklch(0.89 0.025 255)` | `#D5DDEF` |
| Ink | `oklch(0.23 0.035 255)` | `#172034` |
| Muted ink | `oklch(0.43 0.035 255)` | `#4B5672` |
| Cobalt | `oklch(0.56 0.22 258)` | `#3157F6` |
| Deep cobalt | `oklch(0.40 0.18 258)` | `#1736A5` |
| Coral signal | `oklch(0.70 0.19 35)` | `#FF6B4A` |
| Success | `oklch(0.62 0.16 151)` | `#21A366` |

Cobalt is the route and information color. Coral is reserved for the primary action and moments requiring attention. Green always indicates a completed or healthy state and is paired with text or an icon. The page remains predominantly true white and pale cobalt; never use beige, paper grain, or a dark default theme.

## Typography

- Primary family: Archivo variable, preserving the repository’s existing identity.
- Display: 700–800 weight, fluid `clamp()`, maximum 5.25rem, minimum tracking `-0.035em`.
- Body: 400–500 weight, 1rem–1.125rem, line height 1.6, maximum measure 68ch.
- Interface labels: 0.8125rem–0.875rem, medium/semibold, sentence case by default.
- Data: tabular numerals. Monospace is not part of the brand layer; technical strings use the primary family at a smaller fixed scale.

## Layout

- Maximum content width: 78rem.
- Gutters: 1.25rem mobile, 2rem tablet, 4rem desktop.
- Section spacing: `clamp(5.5rem, 10vw, 9.5rem)` with deliberate dense/airy alternation.
- Hero: 5/7 split on desktop, stacked on smaller viewports.
- The six-stage route is the signature motif. Numbers appear only where order carries meaning.
- Use rows, bands, tables, and diagrams before reaching for repeated cards. Never nest cards.

## Components

### Navigation

White sticky bar with a compact identity, four in-page links, and one coral primary action. Mobile keeps the identity and primary action visible while secondary links collapse.

### Route control

Six accessible tab buttons connected by a cobalt route line. Active state uses a filled cobalt node, a plain-language status label, and `aria-selected`. Arrow keys, Home, and End move between stages.

### Journey panel

Shows the same fictional lead at every handoff. Executive mode explains business outcomes; Operator mode reveals tools, fields, rules, and automation details. All records and metrics are labeled as illustrative synthetic data.

### Disclosure rows

Native `details`/`summary` elements expose deliverability and FAQ depth. No accordion content is inaccessible without JavaScript.

### Decision brief

A weekly reporting surface ends with three statements: what changed, why it matters, and what to test next. Metrics support decisions rather than decorating the page.

### Calls to action

Coral filled button for the primary action, cobalt outline/text treatment for secondary actions. Minimum 44px target with a 3px cobalt `:focus-visible` ring.

## Motion

- Signature animation: the route activates once in sequence and when the visitor runs the demo.
- State transitions: 160–240ms with ease-out-quint.
- No full-page particle system, custom cursor, scroll hijacking, or identical fade-up treatment on every section.
- `prefers-reduced-motion` replaces travel/draw motion with immediate state changes or a simple crossfade.

## Responsive Behavior

- Below roughly 900px, the hero stacks and route becomes a compact horizontal scroller with clear snap points.
- Below roughly 680px, dense comparisons become labeled vertical rows; no core content is hidden.
- Technical strings may scroll inside their own panel only.
- Test at 320, 375, 768, 1024, and 1440px; support pointer, touch, and keyboard input.

## Accessibility

- WCAG 2.2 AA contrast targets.
- Skip link, semantic landmarks, heading order, visible focus, 44px touch targets.
- Status never depends on color alone.
- Charts include textual values and descriptions.
- Live journey updates announce through a polite `aria-live` region.

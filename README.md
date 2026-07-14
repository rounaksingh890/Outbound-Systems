# Outbound Systems

An interactive, client-facing walkthrough of an end-to-end outbound operating system—from defining the right market to turning replies into documented sales decisions.

**Live experience:** The production URL will be added here immediately after the first Sites release.

This repository is designed to show prospective clients what a thoughtful outbound implementation looks like without requiring them to understand the underlying technical stack. It leads with business outcomes, then lets curious buyers inspect the rules, handoffs, safeguards, and operating detail behind them.

> **An honest demo:** The company, people, records, and campaign figures in the experience are synthetic and illustrative. They demonstrate an operating model, not claimed client results or guaranteed performance.

## The system in one view

The walkthrough follows one fictional lead through six connected stages:

| Stage | What the system does | Why it matters |
| --- | --- | --- |
| **Target** | Defines account, role, region, exclusion, and buying-signal rules | Effort starts with the right market—not a larger list |
| **Enrich** | Adds the context needed to personalize and prioritize | The team understands who it is contacting and why now |
| **Verify** | Checks contact quality and launch readiness | Bad data is stopped before it can damage sender reputation |
| **Engage** | Coordinates message, sequence, timing, and suppression logic | Outreach stays relevant, controlled, and measurable |
| **Route** | Classifies replies and assigns owners and next actions | Positive, negative, and operational replies do not disappear |
| **Learn** | Reconciles campaign and CRM activity into a decision brief | Reporting changes what the team does next |

The interactive journey can be viewed in **Executive mode** for plain-language outcomes or **Operator mode** for the fields, rules, and automation logic behind each handoff.

## What the experience covers

- A coherent lead journey from target account to sales action
- Launch readiness, deliverability controls, and reputation safeguards
- Reply classification, ownership, service levels, and CRM context
- A single illustrative funnel from total market to booked meetings
- Decision-oriented reporting: what changed, why it matters, and what to test next
- Concrete implementation deliverables and a calm, staged build process
- Strong-fit and poor-fit guidance for a more useful client conversation
- Plain-language answers to the questions buyers should ask before an outbound build

## Safeguards are part of the product

Outbound quality depends on what the system prevents as much as what it sends. The showcase makes controls visible, including eligibility rules, verification gates, suppression handling, volume limits, reply ownership, and documented handover. These are presented as operating principles; any production implementation would be adapted to the client’s market, policies, tools, and legal obligations.

## Data provenance

All names, companies, lead records, funnel figures, reply examples, and operational states are fabricated for demonstration. The illustrative six-week cohort is intentionally consistent across the journey and reporting views so visitors can follow the same story without mistaking sample data for a case study.

No production customer data is stored in this repository, and the demo does not connect to a live sending platform or CRM.

## Run locally

### Prerequisites

- Node.js `>=22.13.0`
- npm

### Setup

```bash
git clone https://github.com/rounaksingh890/Outbound-Systems.git
cd Outbound-Systems
npm install
npm run dev
```

The development server prints the local URL when it is ready.

### Validate a production build

```bash
npm run build
npm test
```

`npm test` builds the site and verifies the rendered experience. `npm run lint` is also available for static checks.

## Technical foundation

- React 19 and TypeScript
- Next.js App Router conventions, compiled with [vinext](https://github.com/cloudflare/vinext)
- Cloudflare-compatible build and runtime
- Purpose-built responsive CSS and design tokens
- [Lucide](https://lucide.dev/) interface icons
- OpenAI Sites deployment configuration in `.openai/hosting.json`

The interface is intentionally dependency-light. Its most important interactions use semantic HTML and React state, while disclosure content remains available through native browser controls.

## Accessibility

The experience targets WCAG 2.2 AA and includes:

- Semantic landmarks and a logical heading structure
- A skip link and clearly visible keyboard focus
- Keyboard-operable journey tabs with Arrow, Home, and End navigation
- Live announcements for changing journey states
- Large touch targets and layouts that preserve the narrative on small screens
- Text and icons alongside color-coded status
- Reduced-motion behavior for visitors who request it

## Deployment

The production site is packaged and deployed through OpenAI Sites using the committed source and `.openai/hosting.json`. The same codebase can be built locally with `npm run build`; no database or object-storage binding is required for this showcase.

## Repository guide

```text
app/
  layout.tsx       Metadata, social sharing, fonts, and document shell
  page.tsx         Client story, interaction model, and structured content
  globals.css      Responsive design system and component styling
public/            Favicon and social sharing artwork
tests/             Rendered-output checks
archive/           Preserved original single-file concept
```

## About this project

Built by [Rounak Singh](https://github.com/rounaksingh890) as a transparent demonstration of how outbound strategy, infrastructure, workflow, and reporting can operate as one documented system.

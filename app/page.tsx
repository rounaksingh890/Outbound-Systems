"use client";

import {
  ArrowRight,
  BadgeCheck,
  BarChart3,
  Check,
  ChevronDown,
  CircleCheck,
  ClipboardCheck,
  Database,
  ExternalLink,
  FileCheck2,
  GitBranch,
  Inbox,
  LockKeyhole,
  MailCheck,
  Play,
  RefreshCcw,
  Send,
  ShieldCheck,
  Target,
  Workflow,
  X,
  type LucideIcon,
} from "lucide-react";
import {
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type KeyboardEvent,
} from "react";

type ViewMode = "executive" | "operator";

type JourneyStage = {
  name: string;
  short: string;
  icon: LucideIcon;
  status: string;
  outcome: string;
  clientView: string;
  systemView: string;
  artifact: string;
  checks: string[];
};

const journeyStages: JourneyStage[] = [
  {
    name: "Target",
    short: "Right account",
    icon: Target,
    status: "ICP match confirmed",
    outcome: "Northbound fits the market, size, region, and buying-signal rules.",
    clientView: "A focused account list that matches the offer instead of a large list that only matches a filter.",
    systemView: "Account rules combine firmographics, role fit, exclusions, and recent buying signals before a contact enters outreach.",
    artifact: "Account brief · Northbound",
    checks: ["B2B SaaS", "50–250 employees", "Growth hiring signal", "No active opportunity"],
  },
  {
    name: "Enrich",
    short: "Useful context",
    icon: Database,
    status: "Context assembled",
    outcome: "Maya’s role, company context, and reason-to-reach-out travel with the record.",
    clientView: "The message can reference something real without asking the sales team to research every account manually.",
    systemView: "Contact data, company signals, source, and research notes are normalized into one record with provenance.",
    artifact: "Lead record · Maya Chen",
    checks: ["Role and seniority", "Verified company domain", "Source retained", "Research note attached"],
  },
  {
    name: "Verify",
    short: "Safe to send",
    icon: BadgeCheck,
    status: "Risk checks passed",
    outcome: "The address is verified, duplicates are removed, and suppression rules are checked.",
    clientView: "Fewer preventable bounces and no accidental re-contact of someone who opted out.",
    systemView: "Email validation, CRM deduplication, global suppression, and domain health gates run before sequencing.",
    artifact: "Pre-send quality gate",
    checks: ["Email verified", "Not a duplicate", "Not suppressed", "Send domain healthy"],
  },
  {
    name: "Engage",
    short: "Relevant message",
    icon: Send,
    status: "Sequence running",
    outcome: "A short, persona-specific message sends in Maya’s local business hours.",
    clientView: "One clear reason for the conversation, a sensible cadence, and no message that feels mass-produced.",
    systemView: "Variant, timing, mailbox allocation, send ceiling, and reply-stop logic are recorded on every touch.",
    artifact: "Message 1 · growth leader",
    checks: ["Local-time send", "Plain-text format", "One clear ask", "Reply-stop enabled"],
  },
  {
    name: "Route",
    short: "Owned follow-up",
    icon: GitBranch,
    status: "Positive reply routed",
    outcome: "Maya’s reply stops the sequence and reaches an owner with context and a due date.",
    clientView: "No interested reply sits in a shared inbox waiting for someone to notice it.",
    systemView: "Sentiment, owner, last reply, source, sequence step, and next action are written to the CRM before the alert fires.",
    artifact: "CRM handoff · positive reply",
    checks: ["Sequence stopped", "Owner assigned", "Reply attached", "Next action due"],
  },
  {
    name: "Learn",
    short: "Better next week",
    icon: BarChart3,
    status: "Decision recorded",
    outcome: "The weekly brief shows what moved, why it matters, and what the next test should be.",
    clientView: "Leadership sees decisions and pipeline movement—not a wall of vanity metrics.",
    systemView: "Campaign, CRM, deliverability, and meeting data reconcile to one cohort before the report is published.",
    artifact: "Monday decision brief",
    checks: ["Cohort reconciled", "Replies categorized", "Meetings attributed", "Next test named"],
  },
];

const leaks = [
  {
    problem: "A large list, loosely matched",
    impact: "Sales time disappears into accounts that were never likely to buy.",
    response: "Define fit, exclusions, and buying signals before collecting contacts.",
  },
  {
    problem: "Sending before infrastructure is ready",
    impact: "Reputation falls quietly, so even good messages stop reaching the inbox.",
    response: "Gate launch on authentication, isolation, verification, and monitored volume.",
  },
  {
    problem: "Replies without ownership",
    impact: "The warmest moment in the journey becomes another item in a shared inbox.",
    response: "Stop the sequence, route context, assign an owner, and set the next action.",
  },
  {
    problem: "Reporting disconnected from the CRM",
    impact: "Teams optimize opens and clicks while meetings and real conversations go unexplained.",
    response: "Report one cohort from source through meeting, then end with a decision.",
  },
];

const safeguards = [
  {
    title: "Sender identity",
    state: "Aligned before launch",
    summary: "SPF, DKIM, and DMARC establish which systems may send and how receiving providers should treat failures.",
    detail: "A production setup starts in monitoring mode, verifies alignment for every legitimate sender, and tightens policy only after the data is clean. Exact policy and rollout depend on the client’s providers and risk tolerance.",
  },
  {
    title: "Domain isolation",
    state: "Business mail protected",
    summary: "Outbound mail and tracking live away from the company’s primary transactional identity.",
    detail: "Dedicated sending domains, named tracking hosts, and mailbox-level monitoring reduce the blast radius of a campaign issue. The system records which domain and inbox carried each contact.",
  },
  {
    title: "Pre-send quality gate",
    state: "Every record checked",
    summary: "Verification, deduplication, exclusions, and global suppression run before a sequence can send.",
    detail: "A contact that fails a gate stays out of the campaign with a visible reason. Nothing relies on a silent nightly cleanup to catch mistakes after a message has already left.",
  },
  {
    title: "Monitoring and recovery",
    state: "Thresholds are visible",
    summary: "Bounce, provider response, mailbox health, and reply handling are reviewed as operating signals.",
    detail: "Thresholds are configured for the provider and market. When a threshold is crossed, the relevant mailbox or segment pauses, the cause is investigated, and the restart is deliberate rather than automatic.",
  },
];

const replyRoutes = [
  ["Positive", "Stop outreach · assign owner · attach thread · due today"],
  ["Not now", "Capture reason · date the follow-up · enter a light nurture"],
  ["Out of office", "Pause · read return date · resume only when appropriate"],
  ["Opt-out", "Stop immediately · add to global suppression · retain evidence"],
  ["Bounce", "Quarantine the address · protect the mailbox · review the source"],
  ["Duplicate", "Merge context or skip · never create a second active journey"],
];

const snapshot = [
  ["Total market", "18,400", "100%", "A defined market, not a send list"],
  ["Verified contacts", "11,720", "63.7%", "Addresses that passed the quality gate"],
  ["Sequence eligible", "4,180", "22.7%", "Right role, timing, exclusions, and capacity"],
  ["Delivered", "2,914", "15.8%", "One six-week illustrative campaign cohort"],
  ["Replies", "90", "0.49%", "All reply types, categorized in the CRM"],
  ["Positive replies", "38", "0.21%", "A real conversation is possible"],
  ["Meetings", "11", "0.06%", "Attributed back to the same source cohort"],
];

const deliverableGroups = [
  {
    title: "Foundation",
    description: "The rules that determine who enters the system and whether it is safe to send.",
    items: ["ICP and exclusion rules", "Data-source and verification map", "Domain and mailbox architecture", "Launch-readiness checklist"],
  },
  {
    title: "Operating system",
    description: "The automations, fields, routing, and reporting that keep handoffs visible.",
    items: ["Campaign and sequence logic", "CRM fields and workflow rules", "Reply-routing decision tree", "Leadership decision brief"],
  },
  {
    title: "Handover",
    description: "Everything the team needs to own the system after implementation.",
    items: ["Automation map and SOP", "Credential-vault handoff", "QA evidence and exception log", "Recorded team walkthrough"],
  },
];

const faqs = [
  {
    q: "Is this a live client case study?",
    a: "No. This is an interactive portfolio demonstration of the operating model and implementation detail. The company, people, and campaign figures are synthetic and illustrative; they are not presented as client results.",
  },
  {
    q: "Do we need this exact tool stack?",
    a: "No. The operating model is tool-independent. Apollo, Clay, Smartlead, Instantly, HubSpot, Zoho, and similar tools can be exchanged when the data contract and handoffs remain clear.",
  },
  {
    q: "How do you protect our primary domain?",
    a: "A production design separates outbound identity, authenticates every legitimate sender, verifies records before launch, monitors mailbox health, and pauses deliberately when a risk threshold is crossed. Exact controls depend on your providers and policy.",
  },
  {
    q: "What happens when someone replies or opts out?",
    a: "Reply handling is part of the system, not an inbox afterthought. A reply stops the sequence. Positive intent routes with context and a due date; opt-outs enter a global suppression list immediately; other reply types follow an explicit decision path.",
  },
  {
    q: "Will our team be able to run it after handover?",
    a: "That is a core acceptance criterion. The build includes an automation map, operating procedure, ownership model, credential handoff, exception guide, and a recorded walkthrough so the next operator is not reverse-engineering the setup.",
  },
  {
    q: "Is outbound a substitute for product-market fit?",
    a: "No. A good system makes a clear offer easier to reach, operate, and learn from. It cannot manufacture demand for an unclear offer or guarantee meetings. Fit, message, market, and execution still matter.",
  },
];

function JourneyLab() {
  const [activeStep, setActiveStep] = useState(0);
  const [mode, setMode] = useState<ViewMode>("executive");
  const [isRunning, setIsRunning] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const tabRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const stage = journeyStages[activeStep];

  const stopDemo = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    setIsRunning(false);
  };

  useEffect(() => () => {
    if (timerRef.current) clearInterval(timerRef.current);
  }, []);

  const selectStep = (index: number) => {
    stopDemo();
    setActiveStep(index);
  };

  const runDemo = () => {
    stopDemo();
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduceMotion) {
      setActiveStep(journeyStages.length - 1);
      return;
    }
    setActiveStep(0);
    setIsRunning(true);
    let next = 0;
    timerRef.current = setInterval(() => {
      next += 1;
      if (next >= journeyStages.length) {
        stopDemo();
        return;
      }
      setActiveStep(next);
    }, 2600);
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLButtonElement>, index: number) => {
    let next = index;
    if (event.key === "ArrowRight" || event.key === "ArrowDown") next = (index + 1) % journeyStages.length;
    if (event.key === "ArrowLeft" || event.key === "ArrowUp") next = (index - 1 + journeyStages.length) % journeyStages.length;
    if (event.key === "Home") next = 0;
    if (event.key === "End") next = journeyStages.length - 1;
    if (next === index) return;
    event.preventDefault();
    selectStep(next);
    tabRefs.current[next]?.focus();
  };

  return (
    <div className="journey-lab">
      <div className="journey-toolbar">
        <div className="mode-switch" role="group" aria-label="Journey detail level">
          <button type="button" aria-pressed={mode === "executive"} onClick={() => setMode("executive")}>Executive view</button>
          <button type="button" aria-pressed={mode === "operator"} onClick={() => setMode("operator")}>Operator view</button>
        </div>
        <button className="run-button" type="button" onClick={isRunning ? stopDemo : runDemo} aria-label={isRunning ? "Stop the lead journey demo" : "Run the lead journey demo"}>
          {isRunning ? <X aria-hidden="true" /> : <Play aria-hidden="true" fill="currentColor" />}
          {isRunning ? "Stop demo" : "Run one lead"}
        </button>
      </div>

      <div className="journey-route" role="tablist" aria-label="Outbound system stages">
        <div className="journey-route__line" aria-hidden="true">
          <span style={{ "--progress": `${(activeStep / (journeyStages.length - 1)) * 100}%` } as CSSProperties} />
        </div>
        {journeyStages.map((item, index) => {
          const Icon = item.icon;
          const isActive = index === activeStep;
          const isComplete = index < activeStep;
          return (
            <button
              key={item.name}
              ref={(node) => { tabRefs.current[index] = node; }}
              type="button"
              className="journey-tab"
              role="tab"
              id={`journey-tab-${index}`}
              aria-controls="journey-panel"
              aria-selected={isActive}
              tabIndex={isActive ? 0 : -1}
              data-complete={isComplete || undefined}
              onClick={() => selectStep(index)}
              onKeyDown={(event) => handleKeyDown(event, index)}
            >
              <span className="journey-tab__node"><Icon aria-hidden="true" /></span>
              <span className="journey-tab__name">{item.name}</span>
              <span className="journey-tab__short">{item.short}</span>
            </button>
          );
        })}
      </div>

      <div className="journey-panel" id="journey-panel" role="tabpanel" aria-labelledby={`journey-tab-${activeStep}`}>
        <div className="lead-record">
          <div className="lead-record__topline">
            <span className="lead-avatar">MC</span>
            <div>
              <strong>Maya Chen</strong>
              <span>VP Growth · Northbound</span>
            </div>
            <span className="status-pill"><CircleCheck aria-hidden="true" /> {stage.status}</span>
          </div>
          <div className="lead-record__artifact">
            <span>Current artifact</span>
            <strong>{stage.artifact}</strong>
          </div>
          <ul className="check-list" aria-label={`${stage.name} checks`}>
            {stage.checks.map((check) => <li key={check}><Check aria-hidden="true" />{check}</li>)}
          </ul>
        </div>

        <p className="sr-only" role="status" aria-live="polite" aria-atomic="true">Stage {activeStep + 1} of {journeyStages.length}: {stage.name}. {stage.status}.</p>
        <div className="journey-story">
          <div className="journey-story__step">Stage {activeStep + 1} of {journeyStages.length} · {stage.name}</div>
          <h3>{stage.outcome}</h3>
          <div className="journey-story__copy">
            <span>{mode === "executive" ? "What the client sees" : "What the system handles"}</span>
            <p>{mode === "executive" ? stage.clientView : stage.systemView}</p>
          </div>
          <button className="next-step" type="button" onClick={() => selectStep((activeStep + 1) % journeyStages.length)}>
            {activeStep === journeyStages.length - 1 ? <RefreshCcw aria-hidden="true" /> : <ArrowRight aria-hidden="true" />}
            {activeStep === journeyStages.length - 1 ? "Run it again" : `Continue to ${journeyStages[activeStep + 1].name}`}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function Home() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    name: "Outbound Systems interactive implementation walkthrough",
    description: "An illustrative, client-friendly walkthrough of an end-to-end outbound operating model.",
    creator: { "@type": "Person", name: "Rounak Singh", url: "https://github.com/rounaksingh890" },
    isBasedOn: "https://github.com/rounaksingh890/Outbound-Systems",
  };

  return (
    <>
      <a className="skip-link" href="#main-content">Skip to main content</a>
      <header className="site-header">
        <div className="container header-inner">
          <a className="brand" href="#top" aria-label="Outbound Systems home">
            <span className="brand-mark" aria-hidden="true"><span /></span>
            <span>Outbound Systems</span>
          </a>
          <nav className="desktop-nav" aria-label="Primary navigation">
            <a href="#system">Interactive walkthrough</a>
            <a href="#safeguards">Safeguards</a>
            <a href="#deliverables">What ships</a>
            <a href="#faq">FAQ</a>
          </nav>
          <a className="header-cta" href="#contact">Explore the build <ArrowRight aria-hidden="true" /></a>
        </div>
      </header>

      <main id="main-content">
        <section className="hero" id="top">
          <div className="container hero-grid">
            <div className="hero-copy">
              <div className="demo-label"><span aria-hidden="true" /> Interactive portfolio demonstration</div>
              <h1>Outbound systems that make every reply count.</h1>
              <p>I connect targeting, inbox infrastructure, sequencing, CRM, and reporting into one documented system your team can actually run.</p>
              <div className="hero-actions">
                <a className="button button-primary" href="#system">Explore the interactive system <ArrowRight aria-hidden="true" /></a>
                <a className="button button-secondary" href="#deliverables">See what ships</a>
              </div>
              <p className="honesty-note"><ShieldCheck aria-hidden="true" /> Synthetic people and illustrative campaign data. This demonstrates the operating model—not client results.</p>
            </div>

            <div className="dispatch-preview" role="region" aria-label="Six-stage outbound system overview">
              <div className="dispatch-preview__header">
                <span>One connected route</span>
                <span className="live-state"><span /> Ready to inspect</span>
              </div>
              <div className="dispatch-lead">
                <span className="lead-avatar lead-avatar--hero">MC</span>
                <div><strong>Maya Chen</strong><span>VP Growth · Northbound</span></div>
                <span className="fit-badge">ICP fit</span>
              </div>
              <div className="dispatch-route">
                {journeyStages.map((stage, index) => (
                  <div className="dispatch-node" key={stage.name}>
                    <span>{index + 1}</span>
                    <strong>{stage.name}</strong>
                    <small>{stage.short}</small>
                  </div>
                ))}
              </div>
              <div className="dispatch-preview__footer">
                <span><CircleCheck aria-hidden="true" /> Every reply gets an owner</span>
                <span><FileCheck2 aria-hidden="true" /> Every decision gets documented</span>
              </div>
            </div>
          </div>

          <div className="container trust-ribbon" role="group" aria-label="System principles">
            <p><strong>One operating model</strong><span>Tools can change. The handoffs remain visible.</span></p>
            <p><strong>Every reply owned</strong><span>Context, owner, due date, and next action travel together.</span></p>
            <p><strong>Built for handover</strong><span>The team receives the map, SOP, QA evidence, and walkthrough.</span></p>
          </div>
        </section>

        <section className="section leaks-section" aria-labelledby="leaks-title">
          <div className="container">
            <div className="section-heading section-heading--split">
              <h2 id="leaks-title">The goal isn’t more email. It’s fewer leaks between a good account and a real conversation.</h2>
              <p>Most outbound problems happen in the handoffs: the contact that should never enter, the inbox that was not ready, the reply nobody owns, or the dashboard that cannot explain a meeting.</p>
            </div>
            <div className="leak-table" role="table" aria-label="Common outbound leaks and system responses">
              <div className="leak-table__head" role="row">
                <span role="columnheader">Where it leaks</span>
                <span role="columnheader">What the business feels</span>
                <span role="columnheader">How the system responds</span>
              </div>
              {leaks.map((leak) => (
                <div className="leak-row" role="row" key={leak.problem}>
                  <strong role="cell">{leak.problem}</strong>
                  <span role="cell">{leak.impact}</span>
                  <span role="cell"><ArrowRight aria-hidden="true" />{leak.response}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="section system-section" id="system" aria-labelledby="system-title">
          <div className="container">
            <div className="section-heading section-heading--system">
              <div>
                <span className="single-kicker">One lead. Every handoff.</span>
                <h2 id="system-title">Follow Maya from target account to a decision the team can act on.</h2>
              </div>
              <p>Start in Executive view for the business outcome. Switch to Operator view to inspect the data, fields, rules, and automation behind it.</p>
            </div>
            <JourneyLab />
          </div>
        </section>

        <section className="section safeguards-section" id="safeguards" aria-labelledby="safeguards-title">
          <div className="container safeguards-grid">
            <div className="sticky-story">
              <span className="section-signal"><ShieldCheck aria-hidden="true" /> Reputation safeguards</span>
              <h2 id="safeguards-title">The quiet work that protects the sender before a campaign begins.</h2>
              <p>Technical controls matter because the client outcome depends on them. The executive layer explains why; each disclosure keeps the implementation detail available for a technical reviewer.</p>
              <div className="health-summary" role="group" aria-label="Illustrative launch readiness">
                <span><CircleCheck aria-hidden="true" /> Identity aligned</span>
                <span><CircleCheck aria-hidden="true" /> Records quality-gated</span>
                <span><CircleCheck aria-hidden="true" /> Recovery path defined</span>
              </div>
            </div>
            <div className="disclosure-list">
              {safeguards.map((item, index) => (
                <details key={item.title} open={index === 0}>
                  <summary>
                    <span className="disclosure-index">{String(index + 1).padStart(2, "0")}</span>
                    <span><strong>{item.title}</strong><small>{item.summary}</small></span>
                    <span className="disclosure-state"><CircleCheck aria-hidden="true" />{item.state}</span>
                    <ChevronDown className="disclosure-chevron" aria-hidden="true" />
                  </summary>
                  <p>{item.detail}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        <section className="section routing-section" aria-labelledby="routing-title">
          <div className="container">
            <div className="section-heading section-heading--split">
              <h2 id="routing-title">When a reply lands, the system already knows what happens next.</h2>
              <p>Intent changes the route. Every branch stops accidental follow-up, preserves context, and leaves the team with a visible next action.</p>
            </div>
            <div className="routing-layout">
              <div className="reply-router" role="figure" aria-label="Reply routing decision tree">
                <div className="router-source"><Inbox aria-hidden="true" /><span>Incoming reply</span><strong>Classify once</strong></div>
                <div className="router-line" aria-hidden="true" />
                <div className="route-list">
                  {replyRoutes.map(([label, action]) => (
                    <div className="route-item" key={label}>
                      <span className="route-item__number" aria-hidden="true" />
                      <strong>{label}</strong>
                      <span>{action}</span>
                    </div>
                  ))}
                </div>
              </div>
              <aside className="crm-context">
                <div className="crm-context__header"><Workflow aria-hidden="true" /><div><span>CRM handoff</span><strong>Context arrives before the alert</strong></div></div>
                <dl>
                  <div><dt>Owner</dt><dd>Ava Patel · AE West</dd></div>
                  <div><dt>Reply intent</dt><dd><span className="positive-dot" /> Positive</dd></div>
                  <div><dt>Last touch</dt><dd>Sequence 02 · step 1</dd></div>
                  <div><dt>Source</dt><dd>Q3 SaaS · North America</dd></div>
                  <div><dt>Next action</dt><dd>Personal reply · due today</dd></div>
                  <div><dt>Thread</dt><dd>Full message attached</dd></div>
                </dl>
                <p><LockKeyhole aria-hidden="true" /> Access follows the client’s roles and systems. This demo stores no lead data.</p>
              </aside>
            </div>
          </div>
        </section>

        <section className="section reporting-section" aria-labelledby="reporting-title">
          <div className="container">
            <div className="section-heading section-heading--reporting">
              <div><span className="synthetic-chip">Illustrative 6-week cohort · synthetic records</span><h2 id="reporting-title">A Monday report that ends with a decision.</h2></div>
              <p>Every number below reconciles to one fictional campaign cohort. The purpose is to demonstrate reporting structure, not to imply historical client performance.</p>
            </div>
            <div className="reporting-layout">
              <div className="funnel" role="figure" aria-label="Illustrative campaign funnel">
                {snapshot.map(([label, value, width, note]) => (
                  <div className="funnel-row" key={label}>
                    <div><strong>{label}</strong><span>{note}</span></div>
                    <div className="funnel-track"><span style={{ "--funnel-width": width } as CSSProperties} /></div>
                    <b>{value}</b>
                  </div>
                ))}
              </div>
              <aside className="decision-brief">
                <div className="decision-brief__title"><ClipboardCheck aria-hidden="true" /><span>Weekly decision brief</span></div>
                <div><span>What we inspect</span><strong>Positive replies relative to the eligible audience and messages delivered.</strong></div>
                <div><span>Working hypothesis</span><strong>Message relevance may be the limiting variable; volume stays fixed until that is tested.</strong></div>
                <div><span>Illustrative next test</span><strong>Keep the segment fixed. Test the first-line signal for growth leaders.</strong></div>
                <p>Diagnostic rates stay available in the appendix; leadership gets the decision first.</p>
              </aside>
            </div>
          </div>
        </section>

        <section className="section deliverables-section" id="deliverables" aria-labelledby="deliverables-title">
          <div className="container">
            <div className="section-heading section-heading--split">
              <h2 id="deliverables-title">A system your team can see, operate, and inherit.</h2>
              <p>The engagement is finished when the handoffs are documented and the client team can explain what happens next—not when the automations merely turn on.</p>
            </div>
            <div className="deliverable-groups">
              {deliverableGroups.map((group, index) => (
                <article className="deliverable-group" key={group.title}>
                  <div className="deliverable-group__intro"><span>{String(index + 1).padStart(2, "0")}</span><div><h3>{group.title}</h3><p>{group.description}</p></div></div>
                  <ul>{group.items.map((item) => <li key={item}><Check aria-hidden="true" />{item}</li>)}</ul>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="section process-section" aria-labelledby="process-title">
          <div className="container process-grid">
            <div className="process-copy">
              <h2 id="process-title">A calm build, with visible decisions at every stage.</h2>
              <p>Scope and timing follow the client’s stack, access, and risk. The sequence stays the same: understand the current system, build against agreed rules, then prove the handover.</p>
            </div>
            <ol className="process-steps">
              <li><span>01</span><div><strong>Audit the route</strong><p>Map the offer, audience, domains, tools, CRM, reporting, access, and failure points. Finish with a prioritized implementation plan.</p></div></li>
              <li><span>02</span><div><strong>Build and prove it</strong><p>Configure the agreed system, test the handoffs, record exceptions, and validate with representative records before launch.</p></div></li>
              <li><span>03</span><div><strong>Launch and hand over</strong><p>Release deliberately, monitor the agreed signals, train the operator, and deliver the documentation and ownership map.</p></div></li>
            </ol>
          </div>
        </section>

        <section className="section fit-section" aria-labelledby="fit-title">
          <div className="container">
            <h2 id="fit-title">Good system fit starts with an honest brief.</h2>
            <div className="fit-grid">
              <div className="fit-column fit-column--yes">
                <span><CircleCheck aria-hidden="true" /> Strong fit</span>
                <h3>A defined offer, a reachable buyer, and a team ready to own follow-up.</h3>
                <ul><li>B2B service or software with a specific buying problem</li><li>A CRM or clear destination for sales context</li><li>Someone accountable for responding to interest</li><li>Willingness to protect quality over raw volume</li></ul>
              </div>
              <div className="fit-column fit-column--no">
                <span><X aria-hidden="true" /> Not the fix</span>
                <h3>An unclear offer, instant-volume expectations, or a promise of guaranteed meetings.</h3>
                <ul><li>No agreed customer or problem definition</li><li>No owner for replies after launch</li><li>Primary-domain risk accepted without controls</li><li>Success measured only by how many emails leave</li></ul>
              </div>
            </div>
          </div>
        </section>

        <section className="section faq-section" id="faq" aria-labelledby="faq-title">
          <div className="container faq-grid">
            <div><span className="section-signal"><MailCheck aria-hidden="true" /> Plain-language answers</span><h2 id="faq-title">Questions a client should ask before an outbound build.</h2></div>
            <div className="faq-list">
              {faqs.map((faq) => (
                <details key={faq.q}>
                  <summary><span>{faq.q}</span><ChevronDown aria-hidden="true" /></summary>
                  <p>{faq.a}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        <section className="contact-section" id="contact" aria-labelledby="contact-title">
          <div className="container contact-grid">
            <div>
              <span className="contact-label"><span /> Built for a real brief</span>
              <h2 id="contact-title">Inspect the source. Share the route. Make the next build conversation concrete.</h2>
              <p>This demonstration shows the depth of the operating model. A real engagement would map it to the client’s actual offer, tools, access, risk, and ownership.</p>
            </div>
            <div className="contact-actions">
              <a className="button button-primary" href="https://github.com/rounaksingh890" target="_blank" rel="noreferrer">Open Rounak’s GitHub <ExternalLink aria-hidden="true" /></a>
              <a className="button button-secondary" href="https://github.com/rounaksingh890/Outbound-Systems" target="_blank" rel="noreferrer">View this repository <ExternalLink aria-hidden="true" /></a>
              <p><FileCheck2 aria-hidden="true" /> Share this live walkthrough with a founder, sales lead, or technical reviewer.</p>
            </div>
          </div>
        </section>
      </main>

      <footer className="site-footer">
        <div className="container footer-inner"><span>Outbound Systems · interactive implementation walkthrough</span><span>Designed and built by Rounak Singh · 2026</span></div>
      </footer>

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
    </>
  );
}

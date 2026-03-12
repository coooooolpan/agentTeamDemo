"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowUp,
  Bot,
  Compass,
  FolderOpen,
  Home,
  Plus,
  Search,
  ShieldCheck,
  Sparkles,
  Video,
  WandSparkles,
  Play,
  CircleDashed,
  type LucideIcon,
} from "lucide-react";

type MenuKey = "home" | "agent-square" | "community" | "projects";

type MenuItem = {
  key: MenuKey;
  label: string;
  icon: LucideIcon;
};

type ToolChip = {
  label: string;
  icon: LucideIcon;
};

type AgentFilter = "all" | "research" | "creative" | "production" | "review";

type AgentStatus = "running" | "idle" | "finished";

type AgentSquareCard = {
  id: string;
  name: string;
  role: string;
  summary: string;
  category: Exclude<AgentFilter, "all">;
  status: AgentStatus;
  model: string;
  completion: string;
  specialties: string[];
  prompt: string;
  coverGradient: string;
  avatarGradient: string;
};

const menuItems: MenuItem[] = [
  { key: "home", label: "Home", icon: Home },
  { key: "agent-square", label: "Agent Square", icon: Compass },
  { key: "community", label: "Community", icon: Sparkles },
  { key: "projects", label: "My Projects", icon: FolderOpen },
];

const promptTools: ToolChip[] = [
  { label: "Design", icon: WandSparkles },
  { label: "Video", icon: Video },
  { label: "Brand", icon: ShieldCheck },
  { label: "Research", icon: Search },
];

const promptPresetMap = {
  "Multi-agent coordination":
    "Build a multi-agent workflow to coordinate market research, copywriting, visual design, and video production with clear handoff checkpoints.",
  "USP extraction":
    "Extract top product USPs from the provided product info, rank by conversion potential, and generate platform-specific messaging hooks.",
  "Poster generation":
    "Generate three Instagram poster concepts with distinct visual styles, each with headline, subcopy, and CTA variants.",
  "Video draft workflow":
    "Create a 15-second promo video draft workflow including storyboard, shot list, voiceover script, and subtitle pacing plan.",
} as const;

const quickActions = Object.keys(promptPresetMap) as Array<keyof typeof promptPresetMap>;

const outputCards = [
  {
    title: "Campaign Visual Sheet",
    subtitle: "3 directions generated",
    tone: "from-[#d9ebff] via-[#eaf7ff] to-[#e7f8f0]",
    chip: "Image",
  },
  {
    title: "Promo Storyboard",
    subtitle: "15s flow + shot list",
    tone: "from-[#ece7ff] via-[#e8eeff] to-[#e6f4ff]",
    chip: "Video",
  },
  {
    title: "Brand Hook Matrix",
    subtitle: "USP-ranked copy hooks",
    tone: "from-[#fff0e8] via-[#fff6ec] to-[#fff9df]",
    chip: "Copy",
  },
] as const;

const agentFilters: Array<{ key: AgentFilter; label: string }> = [
  { key: "all", label: "All Agents" },
  { key: "research", label: "Research" },
  { key: "creative", label: "Creative" },
  { key: "production", label: "Production" },
  { key: "review", label: "Review" },
];

const agentSquareCards: AgentSquareCard[] = [
  {
    id: "agent-research",
    name: "Market Scout",
    role: "Research Agent",
    summary: "Competitor trend scan, category mapping, and signal ranking.",
    category: "research",
    status: "running",
    model: "GPT-4.1 + Web Crawler",
    completion: "32 sources processed",
    specialties: ["Competitor Scan", "Trend Insights", "Opportunity Map"],
    prompt:
      "Research 15 direct competitors and summarize market white-space, pricing, and top messaging patterns.",
    coverGradient: "from-[#dff3ff] via-[#d9f4ff] to-[#dff7ef]",
    avatarGradient: "from-[#c4b5fd] to-[#93c5fd]",
  },
  {
    id: "agent-copy",
    name: "Brand Copywriter",
    role: "Creative Agent",
    summary: "Converts product data into conversion-focused hooks and narrative.",
    category: "creative",
    status: "finished",
    model: "GPT-4.1 Creative",
    completion: "12 hook variants ready",
    specialties: ["USP Hooks", "Offer Messaging", "CTA Library"],
    prompt:
      "Generate 12 ad copy hooks from the top USPs and rank them by conversion potential.",
    coverGradient: "from-[#e9f0ff] via-[#edf3ff] to-[#f7f8ff]",
    avatarGradient: "from-[#86efac] to-[#67e8f9]",
  },
  {
    id: "agent-designer",
    name: "Campaign Designer",
    role: "Visual Agent",
    summary: "Builds poster composition systems and style-consistent visual outputs.",
    category: "creative",
    status: "running",
    model: "Vision Model v3",
    completion: "3 visual concepts in progress",
    specialties: ["Poster System", "Color Language", "Layout Variants"],
    prompt:
      "Produce three poster concepts with distinct visual directions and reusable design tokens.",
    coverGradient: "from-[#ffece2] via-[#fff3e6] to-[#fff7de]",
    avatarGradient: "from-[#fca5a5] to-[#fdba74]",
  },
  {
    id: "agent-video",
    name: "Video Producer",
    role: "Production Agent",
    summary: "Turns concepts into short-form storyboard and beat-synced video drafts.",
    category: "production",
    status: "idle",
    model: "Motion Studio 2.3",
    completion: "Waiting for final art direction",
    specialties: ["Storyboard", "Shot List", "Subtitle Rhythm"],
    prompt:
      "Create a 15-second promo storyboard with shot list, pace notes, and subtitle timing.",
    coverGradient: "from-[#e7ebff] via-[#ecf0ff] to-[#eef7ff]",
    avatarGradient: "from-[#93c5fd] to-[#818cf8]",
  },
  {
    id: "agent-review",
    name: "Content Auditor",
    role: "Review Agent",
    summary: "Runs compliance, risk checks, and consistency guardrails.",
    category: "review",
    status: "finished",
    model: "Policy Guard XL",
    completion: "No critical risks found",
    specialties: ["Compliance", "Tone Consistency", "Risk Alerts"],
    prompt:
      "Review final assets for policy compliance and provide a pass/fail checklist with fixes.",
    coverGradient: "from-[#eafaf0] via-[#ecfcef] to-[#f4fef7]",
    avatarGradient: "from-[#a7f3d0] to-[#4ade80]",
  },
  {
    id: "agent-orchestrator",
    name: "Workflow Orchestrator",
    role: "Control Agent",
    summary: "Coordinates dependencies, tracks state, and dispatches next actions.",
    category: "production",
    status: "running",
    model: "Flow Engine 1.8",
    completion: "5 parallel tasks synced",
    specialties: ["Task Routing", "State Sync", "Execution Control"],
    prompt:
      "Orchestrate all active agents with clear dependencies and automated handoff checkpoints.",
    coverGradient: "from-[#e7f2ff] via-[#eaf7ff] to-[#f0fbff]",
    avatarGradient: "from-[#60a5fa] to-[#22d3ee]",
  },
];

const statusStyleMap: Record<
  AgentStatus,
  { label: string; className: string; dotClassName: string }
> = {
  running: {
    label: "Running",
    className: "bg-[#eaf2ff] text-[#335fcf]",
    dotClassName: "bg-[#3b82f6]",
  },
  idle: {
    label: "Idle",
    className: "bg-[#f1f4f8] text-[#6f7b91]",
    dotClassName: "bg-[#94a3b8]",
  },
  finished: {
    label: "Finished",
    className: "bg-[#e7f8ef] text-[#1f8a4e]",
    dotClassName: "bg-[#16a34a]",
  },
};

export default function HomePage() {
  const [activeMenu, setActiveMenu] = useState<MenuKey>("home");
  const [agentFilter, setAgentFilter] = useState<AgentFilter>("all");
  const [selectedAgentId, setSelectedAgentId] = useState<string>(agentSquareCards[0].id);

  const [composerTab, setComposerTab] = useState<"canvas" | "workflow">("canvas");
  const [promptText, setPromptText] = useState(
    "Help me extract the key selling points from product info, then generate an Instagram poster and a 15s promo video.",
  );
  const [activeQuickAction, setActiveQuickAction] =
    useState<keyof typeof promptPresetMap | null>(null);

  const router = useRouter();

  const filteredAgents = useMemo(() => {
    if (agentFilter === "all") {
      return agentSquareCards;
    }

    return agentSquareCards.filter((agent) => agent.category === agentFilter);
  }, [agentFilter]);

  const handleSend = () => {
    const normalizedPrompt = promptText.trim();

    if (!normalizedPrompt) {
      return;
    }

    router.push(`/?prompt=${encodeURIComponent(normalizedPrompt)}`);
  };

  const handleQuickActionClick = (action: keyof typeof promptPresetMap) => {
    setActiveQuickAction(action);
    setPromptText(promptPresetMap[action]);
  };

  const renderHomeWorkspace = () => (
    <>
      <header className="border-b border-[#dfe8f4]/90 bg-[linear-gradient(180deg,rgba(255,255,255,0.5),rgba(255,255,255,0.18))] px-5 py-8 sm:px-8 lg:px-12">
        <div className="mx-auto max-w-5xl text-center">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-[#d8e3f2] bg-white/85 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-[#6f7f97]">
            <Sparkles className="h-3.5 w-3.5 text-[#5b7dff]" />
            AI Empty State
          </span>
          <h1 className="mt-4 text-balance text-3xl font-semibold tracking-[-0.03em] text-[#111722] sm:text-5xl">
            What do you want to
            <span className="bg-[linear-gradient(120deg,#1f3f98,#3b82f6,#0ea5e9)] bg-clip-text text-transparent"> create </span>
            today?
          </h1>
          <p className="mx-auto mt-3 max-w-2xl text-sm text-[#6f7a8f] sm:text-base">
            Describe your goal once, then let the agent team orchestrate research, copy, design, and video output.
          </p>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto px-5 pb-10 pt-7 sm:px-8 lg:px-12">
        <div className="mx-auto max-w-5xl">
          <div className="inline-flex rounded-2xl border border-[#d8e3f2] bg-white/75 p-1 shadow-[0_8px_18px_rgba(15,23,42,0.06)]">
            <button
              type="button"
              onClick={() => setComposerTab("canvas")}
              className={`rounded-xl px-4 py-2 text-sm font-semibold transition ${
                composerTab === "canvas"
                  ? "bg-[linear-gradient(135deg,#ffffff,#f4f8ff)] text-[#151a24] shadow-[0_6px_14px_rgba(59,130,246,0.16)]"
                  : "text-[#8490a5] hover:text-[#5a667a]"
              }`}
            >
              Canvas
            </button>
            <button
              type="button"
              onClick={() => setComposerTab("workflow")}
              className={`rounded-xl px-4 py-2 text-sm font-semibold transition ${
                composerTab === "workflow"
                  ? "bg-[linear-gradient(135deg,#ffffff,#f4f8ff)] text-[#151a24] shadow-[0_6px_14px_rgba(59,130,246,0.16)]"
                  : "text-[#8490a5] hover:text-[#5a667a]"
              }`}
            >
              Workflow
            </button>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="mt-5 rounded-[30px] border border-[#d6e1f0] bg-[linear-gradient(145deg,rgba(255,255,255,0.94),rgba(245,249,255,0.8))] p-4 shadow-[0_22px_42px_rgba(15,23,42,0.12)] backdrop-blur-md sm:p-5"
          >
            <div className="mb-3 flex items-center justify-between text-[11px] font-semibold uppercase tracking-[0.11em] text-[#8290a6]">
              <span className="inline-flex items-center gap-1.5">
                <Bot className="h-3.5 w-3.5" />
                Prompt
              </span>
              <span>Press Enter to send</span>
            </div>

            <div className="flex items-start justify-between gap-4 rounded-2xl border border-[#e3e9f4] bg-white/82 px-3 py-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.85)]">
              <div className="flex-1">
                <textarea
                  value={promptText}
                  onChange={(event) => setPromptText(event.target.value)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter" && !event.shiftKey) {
                      event.preventDefault();
                      handleSend();
                    }
                  }}
                  rows={2}
                  className="w-full resize-none border-none bg-transparent text-[15px] font-medium leading-7 text-[#283142] outline-none placeholder:text-[#95a0b3]"
                  placeholder="Describe what you want to create..."
                  aria-label="Prompt input"
                />
              </div>
              <button
                type="button"
                onClick={handleSend}
                disabled={!promptText.trim()}
                className={`inline-flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full text-white transition ${
                  promptText.trim()
                    ? "bg-[linear-gradient(135deg,#0f172a,#334155)] shadow-[0_10px_22px_rgba(15,23,42,0.28)] hover:-translate-y-0.5"
                    : "cursor-not-allowed bg-[#94a3b8]"
                }`}
                aria-label="Submit task"
              >
                <ArrowUp className="h-4 w-4" />
              </button>
            </div>

            <div className="mt-4 flex flex-wrap items-center gap-2">
              <button
                type="button"
                className="inline-flex items-center gap-2 rounded-full border border-[#d7e4f6] bg-white px-3 py-1.5 text-xs font-semibold text-[#42506a] shadow-[0_6px_14px_rgba(15,23,42,0.06)]"
              >
                <Bot className="h-3.5 w-3.5" />
                Agent Teams
              </button>
              {promptTools.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.label}
                    type="button"
                    className="inline-flex items-center gap-1.5 rounded-full border border-[#e2e8f3] bg-white/90 px-3 py-1.5 text-xs font-medium text-[#5d6a81] transition hover:border-[#cad7ee] hover:bg-white"
                  >
                    <Icon className="h-3.5 w-3.5" />
                    {item.label}
                  </button>
                );
              })}
            </div>
          </motion.div>

          <div className="mt-7 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            {quickActions.map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => handleQuickActionClick(item)}
                className={`rounded-2xl border px-3.5 py-3 text-left text-sm font-medium transition ${
                  activeQuickAction === item
                    ? "border-[#bfd2f3] bg-[linear-gradient(135deg,#eef4ff,#f4f7ff)] text-[#264686] shadow-[0_10px_20px_rgba(59,130,246,0.16)]"
                    : "border-[#dfe8f4] bg-white/80 text-[#5e6a7f] hover:border-[#cfdced] hover:bg-white"
                }`}
              >
                {item}
              </button>
            ))}
          </div>

          <div className="mt-5 grid gap-3 md:grid-cols-3">
            {outputCards.map((card) => (
              <div
                key={card.title}
                className="group overflow-hidden rounded-[22px] border border-[#dde7f4] bg-white/88 shadow-[0_12px_22px_rgba(15,23,42,0.08)] transition hover:-translate-y-0.5 hover:shadow-[0_18px_30px_rgba(15,23,42,0.12)]"
              >
                <div className={`relative h-28 bg-gradient-to-br ${card.tone}`}>
                  <div className="absolute right-3 top-3 rounded-full border border-white/70 bg-white/70 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.1em] text-[#415066]">
                    {card.chip}
                  </div>
                </div>
                <div className="p-3.5">
                  <p className="text-sm font-semibold text-[#1e2532]">{card.title}</p>
                  <p className="mt-1 text-xs text-[#7b879a]">{card.subtitle}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );

  const renderAgentSquareWorkspace = () => (
    <>
      <header className="border-b border-[#dfe8f4]/90 bg-[linear-gradient(180deg,rgba(255,255,255,0.52),rgba(255,255,255,0.2))] px-5 py-8 sm:px-8 lg:px-12">
        <div className="mx-auto max-w-6xl">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-[#d7e2f4] bg-white/85 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-[#6f7f97]">
                <Compass className="h-3.5 w-3.5 text-[#5b7dff]" />
                Agent Directory
              </span>
              <h1 className="mt-4 text-3xl font-semibold tracking-[-0.03em] text-[#111722] sm:text-[44px]">
                Agent Square
              </h1>
              <p className="mt-2 max-w-2xl text-sm text-[#6f7a8f] sm:text-base">
                One place to browse all specialist agents, understand their strengths, and launch them directly into the infinite canvas workflow.
              </p>
            </div>
            <button
              type="button"
              onClick={() => {
                const selected = agentSquareCards.find((agent) => agent.id === selectedAgentId);
                if (selected) {
                  router.push(`/?prompt=${encodeURIComponent(selected.prompt)}`);
                }
              }}
              className="inline-flex h-11 items-center gap-2 rounded-2xl border border-[#d2ddf0] bg-white/88 px-4 text-sm font-semibold text-[#1e2a3f] shadow-[0_8px_18px_rgba(15,23,42,0.08)] transition hover:-translate-y-0.5 hover:shadow-[0_12px_24px_rgba(15,23,42,0.12)]"
            >
              <Play className="h-4 w-4 text-[#4f7fff]" />
              Launch Selected Agent
            </button>
          </div>

          <div className="mt-5 flex flex-wrap items-center gap-2">
            {agentFilters.map((filter) => (
              <button
                key={filter.key}
                type="button"
                onClick={() => setAgentFilter(filter.key)}
                className={`rounded-full border px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.08em] transition ${
                  agentFilter === filter.key
                    ? "border-[#bfd2f3] bg-[linear-gradient(135deg,#eef4ff,#f4f7ff)] text-[#2f4a8a]"
                    : "border-[#dfe8f4] bg-white/70 text-[#72809a] hover:bg-white"
                }`}
              >
                {filter.label}
              </button>
            ))}
          </div>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto px-5 pb-10 pt-7 sm:px-8 lg:px-12">
        <div className="mx-auto max-w-6xl">
          <div className="mb-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { label: "Total Agents", value: "6" },
              { label: "Running Now", value: "3" },
              { label: "Avg. Success", value: "96.2%" },
              { label: "Active Workflows", value: "12" },
            ].map((stat) => (
              <div
                key={stat.label}
                className="rounded-2xl border border-[#dce7f4] bg-white/84 p-3.5 shadow-[0_8px_16px_rgba(15,23,42,0.06)]"
              >
                <p className="text-xs font-semibold uppercase tracking-[0.09em] text-[#7f8ba0]">{stat.label}</p>
                <p className="mt-2 text-2xl font-semibold tracking-[-0.02em] text-[#152038]">{stat.value}</p>
              </div>
            ))}
          </div>

          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {filteredAgents.map((agent, index) => {
              const statusStyle = statusStyleMap[agent.status];
              const selected = selectedAgentId === agent.id;

              return (
                <motion.button
                  key={agent.id}
                  type="button"
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ type: "spring", stiffness: 240, damping: 24, delay: index * 0.03 }}
                  onClick={() => setSelectedAgentId(agent.id)}
                  className={`group rounded-[24px] border p-3 text-left transition ${
                    selected
                      ? "border-[#bfd4f6] bg-[linear-gradient(145deg,rgba(255,255,255,0.96),rgba(242,247,255,0.86))] shadow-[0_18px_34px_rgba(59,130,246,0.16)]"
                      : "border-[#dce7f4] bg-white/88 shadow-[0_12px_22px_rgba(15,23,42,0.08)] hover:-translate-y-0.5 hover:shadow-[0_18px_30px_rgba(15,23,42,0.12)]"
                  }`}
                >
                  <div
                    className={`relative h-36 overflow-hidden rounded-[18px] border border-white/75 bg-gradient-to-br ${agent.coverGradient}`}
                  >
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(255,255,255,0.65),transparent_32%),radial-gradient(circle_at_80%_80%,rgba(255,255,255,0.3),transparent_32%)]" />
                    <span
                      className={`absolute left-3 top-3 inline-flex items-center gap-1 rounded-full px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.08em] ${statusStyle.className}`}
                    >
                      <span className={`h-1.5 w-1.5 rounded-full ${statusStyle.dotClassName}`} />
                      {statusStyle.label}
                    </span>
                    <button
                      type="button"
                      onClick={(event) => {
                        event.stopPropagation();
                        router.push(`/?prompt=${encodeURIComponent(agent.prompt)}`);
                      }}
                      className="absolute right-3 top-3 inline-flex h-8 w-8 items-center justify-center rounded-full bg-[#0f172a] text-white shadow-[0_10px_18px_rgba(15,23,42,0.25)]"
                      aria-label={`Launch ${agent.name}`}
                    >
                      <ArrowUp className="h-3.5 w-3.5 -rotate-45" />
                    </button>
                  </div>

                  <div className="mt-3 flex items-center gap-2">
                    <span
                      className={`inline-flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br ${agent.avatarGradient} text-white shadow-[0_8px_16px_rgba(15,23,42,0.2)]`}
                    >
                      <Bot className="h-4 w-4" />
                    </span>
                    <div>
                      <p className="text-[15px] font-semibold text-[#141b29]">{agent.name}</p>
                      <p className="text-xs text-[#76839b]">{agent.role}</p>
                    </div>
                  </div>

                  <p className="mt-3 text-sm leading-6 text-[#55637a]">{agent.summary}</p>

                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {agent.specialties.map((skill) => (
                      <span
                        key={skill}
                        className="rounded-full border border-[#d8e3f2] bg-white/82 px-2 py-1 text-[11px] font-medium text-[#617088]"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>

                  <div className="mt-4 rounded-xl border border-[#e1e9f4] bg-white/82 p-2.5">
                    <div className="flex items-center justify-between gap-2 text-xs">
                      <span className="text-[#7a879d]">{agent.model}</span>
                      <span className="inline-flex items-center gap-1 font-semibold text-[#4a5e86]">
                        <CircleDashed className="h-3.5 w-3.5" />
                        {agent.completion}
                      </span>
                    </div>
                  </div>
                </motion.button>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );

  const renderPlaceholderWorkspace = (title: string, subtitle: string) => (
    <>
      <header className="border-b border-[#dfe8f4]/90 bg-[linear-gradient(180deg,rgba(255,255,255,0.5),rgba(255,255,255,0.18))] px-5 py-8 sm:px-8 lg:px-12">
        <div className="mx-auto max-w-5xl">
          <h1 className="text-3xl font-semibold tracking-[-0.02em] text-[#111722]">{title}</h1>
          <p className="mt-2 text-sm text-[#6f7a8f]">{subtitle}</p>
        </div>
      </header>

      <div className="flex flex-1 items-center justify-center px-5 py-10 sm:px-8 lg:px-12">
        <div className="w-full max-w-xl rounded-3xl border border-[#dce7f4] bg-white/84 p-8 text-center shadow-[0_16px_28px_rgba(15,23,42,0.08)]">
          <p className="text-sm font-semibold uppercase tracking-[0.1em] text-[#7f8ba1]">Coming Soon</p>
          <p className="mt-3 text-sm leading-7 text-[#5e6b83]">
            This section keeps the same product shell and will be expanded in the next iteration.
          </p>
        </div>
      </div>
    </>
  );

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#f3f6fb] text-[#0f172a]">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-[-12%] top-[-18%] h-[520px] w-[520px] rounded-full bg-[#dce7ff] opacity-70 blur-3xl" />
        <div className="absolute right-[-14%] top-[6%] h-[460px] w-[460px] rounded-full bg-[#ffe5ef] opacity-60 blur-3xl" />
        <div className="absolute bottom-[-20%] left-[16%] h-[420px] w-[420px] rounded-full bg-[#dcf7ee] opacity-65 blur-3xl" />
        <div className="absolute inset-0 bg-[radial-gradient(rgba(148,163,184,0.16)_1px,transparent_1px)] [background-size:22px_22px]" />
      </div>

      <div className="relative flex min-h-screen">
        <aside className="hidden w-[264px] shrink-0 flex-col border-r border-[#dce6f2] bg-[linear-gradient(180deg,rgba(255,255,255,0.86)_0%,rgba(246,249,255,0.68)_100%)] px-5 py-6 backdrop-blur-2xl lg:flex">
          <div className="flex items-center gap-2.5">
            <span className="relative inline-flex h-9 w-9 items-center justify-center rounded-full bg-[linear-gradient(135deg,#111827,#1f2937)] text-white shadow-[0_8px_20px_rgba(15,23,42,0.35)]">
              <Sparkles className="h-4 w-4" />
              <span className="absolute -right-0.5 -top-0.5 h-2.5 w-2.5 rounded-full border border-white/80 bg-[#34d399]" />
            </span>
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[#8b96ab]">Workspace</p>
              <span className="text-lg font-semibold text-[#161b25]">RoboNeo</span>
            </div>
          </div>

          <button
            type="button"
            className="group mt-6 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-[linear-gradient(135deg,#111827,#1f2937)] px-4 py-3 text-sm font-semibold text-white shadow-[0_12px_24px_rgba(15,23,42,0.28)] transition hover:-translate-y-0.5 hover:shadow-[0_16px_30px_rgba(15,23,42,0.34)]"
          >
            <Plus className="h-4 w-4 transition group-hover:rotate-90" />
            New Project
          </button>

          <div className="mt-6 space-y-2">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeMenu === item.key;

              return (
                <button
                  key={item.key}
                  type="button"
                  onClick={() => setActiveMenu(item.key)}
                  className={`flex w-full items-center justify-between rounded-2xl border px-3 py-3 text-sm font-medium transition ${
                    isActive
                      ? "border-[#d8e4f7] bg-white/90 text-[#111c2d] shadow-[0_8px_16px_rgba(15,23,42,0.08)]"
                      : "border-transparent text-[#6f7a8f] hover:border-[#e2e9f4] hover:bg-white/70"
                  }`}
                >
                  <span className="inline-flex items-center gap-2">
                    <Icon className="h-4 w-4" />
                    {item.label}
                  </span>
                  {isActive ? <span className="h-1.5 w-1.5 rounded-full bg-[#4f7fff]" /> : null}
                </button>
              );
            })}
          </div>

          <div className="mt-auto rounded-2xl border border-[#dfe8f5] bg-[linear-gradient(145deg,rgba(255,255,255,0.95),rgba(245,249,255,0.78))] p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.9)]">
            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#8d97aa]">AI Tools</p>
            <p className="mt-2 text-sm leading-6 text-[#5f6b80]">
              Poster generation, video editing, and brand copy automation in one workflow.
            </p>
          </div>
        </aside>

        <section className="flex min-w-0 flex-1 flex-col">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={activeMenu}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ type: "spring", stiffness: 260, damping: 24 }}
              className="flex h-full min-h-screen flex-col"
            >
              {activeMenu === "home" ? renderHomeWorkspace() : null}
              {activeMenu === "agent-square" ? renderAgentSquareWorkspace() : null}
              {activeMenu === "community"
                ? renderPlaceholderWorkspace(
                    "Community",
                    "Explore templates, shared workflows, and team playbooks.",
                  )
                : null}
              {activeMenu === "projects"
                ? renderPlaceholderWorkspace(
                    "My Projects",
                    "Manage all deliverables, folders, and active agent runs in one place.",
                  )
                : null}
            </motion.div>
          </AnimatePresence>
        </section>
      </div>
    </main>
  );
}

import type {
  WorkFile,
  WorkbenchNode,
  AgentTag,
  ChatAgentCard,
  NoteNodeData,
  DocumentNodeData,
  GeneratingDocumentNodeData,
  MediaNodeData,
  VideoGenerationNodeData,
  FolderNodeData,
} from "./types";

export const sideRailIcons = ["home", "sparkles", "square-plus", "layers", "history"] as const;

export const chatGalleryGradients = [
  "linear-gradient(135deg, #54C8FA, #4C7DFF)",
  "linear-gradient(135deg, #FCA5A5, #DC2626)",
  "linear-gradient(135deg, #86EFAC, #15803D)",
];

export const chatAgentCards: ChatAgentCard[] = [
  {
    id: "agent-research",
    name: "Research Agent",
    summary: "Competitor analysis and trend insights",
    color: "purple",
    level: "primary",
    status: "done",
    currentTask: "Completed benchmark scan across 32 pages.",
    tools: ["Web Crawler", "SERP Synthesizer", "Signal Ranker"],
    outputs: ["Market Landscape Report", "Campaign Channel Matrix"],
    recentLogs: [
      "Parsed Amazon/TikTok category signals.",
      "Ranked top-converting benefit claims.",
      "Delivered whitespace opportunity list.",
    ],
  },
  {
    id: "agent-marketing",
    name: "Marketing Agent",
    summary: "Social media creative strategy and copy hooks",
    color: "green",
    level: "primary",
    status: "running",
    currentTask: "Generating conversion-first message matrix for IG/TikTok.",
    tools: ["Copy Brain", "Tone Guard", "CTA Composer"],
    outputs: ["Brand Copy Guidelines", "Hook Variants Pack"],
    recentLogs: [
      "Drafted USP-based opening lines.",
      "Scored hooks with click intent model.",
      "Aligning copy tone with compliance policy.",
    ],
  },
  {
    id: "agent-hook-miner",
    name: "Hook Miner",
    summary: "Sub-agent for high-converting hook and CTA variants",
    color: "green",
    level: "sub",
    parentAgentId: "agent-marketing",
    status: "running",
    currentTask: "Expanding hook variants for short-video intros.",
    tools: ["Hook Scorer", "CTA Splitter", "Trend Replay"],
    outputs: ["Hook Variation Sheet", "CTA Priority Table"],
    recentLogs: [
      "Generated 18 hooks by audience intent.",
      "Ranked CTA lines by click-likelihood.",
      "Syncing top hooks back to Marketing Agent.",
    ],
  },
  {
    id: "agent-generation",
    name: "Generation Agent",
    summary: "Poster and product video asset production",
    color: "blue",
    level: "primary",
    status: "running",
    currentTask: "Rendering poster drafts and 15s storyboard frames.",
    tools: ["Visual Composer", "Frame Generator", "Motion Timeline"],
    outputs: ["Visual Concept Board", "Promo Video Storyboard"],
    recentLogs: [
      "Built 3 poster composition directions.",
      "Rendered opening sequence keyframes.",
      "Syncing subtitle pacing with beat markers.",
    ],
  },
  {
    id: "agent-visual-qa",
    name: "Visual QA",
    summary: "Sub-agent for frame quality and subtitle rhythm checks",
    color: "blue",
    level: "sub",
    parentAgentId: "agent-generation",
    status: "idle",
    currentTask: "Queued to check frame readability and subtitle pacing.",
    tools: ["Frame Inspector", "Subtitle Timing QA", "Contrast Checker"],
    outputs: ["Frame Quality Notes", "Subtitle Timing Fix List"],
    recentLogs: [
      "Prepared readability thresholds for mobile feeds.",
      "Loaded subtitle timing profile for 15s format.",
      "Waiting for latest storyboard render.",
    ],
  },
  {
    id: "agent-review",
    name: "Review Agent",
    summary: "Quality and compliance verification",
    color: "orange",
    level: "primary",
    status: "idle",
    currentTask: "Queued for final policy and brand consistency check.",
    tools: ["Policy Validator", "Brand QA", "Risk Scanner"],
    outputs: ["Content QA Checklist", "Risk Annotation Notes"],
    recentLogs: [
      "Prepared legal phrase detection rules.",
      "Loaded brand voice baseline profile.",
      "Waiting for latest creative iteration.",
    ],
  },
];

export const timelineEvents = [
  {
    id: "event-1",
    type: "thinking",
    text: "Thinking through the process to find board approval requirements.",
  },
  {
    id: "event-2",
    type: "search",
    text: "Searching for mentions of board approval.",
  },
  {
    id: "event-3",
    type: "result",
    text: "Analyzed 32 web pages and summarized key policy insights.",
  },
  {
    id: "event-4",
    type: "done",
    text: "Found details regarding board approval for the process of deal acquisition.",
  },
] as const;

const marketReport: WorkFile = {
  id: "file-market-report",
  title: "Market Landscape Report",
  kind: "doc",
  updatedAt: "2 min ago",
  note: "Top competitors, pricing benchmark, and market white space.",
};

const copyGuidelines: WorkFile = {
  id: "file-copy-guidelines",
  title: "Brand Copy Guidelines",
  kind: "markdown",
  updatedAt: "just now",
  note: "Tone, hooks, CTA structure, and compliance notes.",
};

const visualConcept: WorkFile = {
  id: "file-visual-concept",
  title: "Visual Concept Board",
  kind: "image",
  updatedAt: "1 min ago",
  note: "Poster key visual directions and composition references.",
};

const promoStoryboard: WorkFile = {
  id: "file-promo-storyboard",
  title: "Promo Video Storyboard",
  kind: "video",
  updatedAt: "3 min ago",
  note: "Shot list and rhythm plan for 15-second social clips.",
};

const campaignMatrix: WorkFile = {
  id: "file-campaign-matrix",
  title: "Campaign Channel Matrix",
  kind: "doc",
  updatedAt: "6 min ago",
  note: "Asset adaptation strategy by platform and audience.",
};

const qaChecklist: WorkFile = {
  id: "file-qa-checklist",
  title: "Content QA Checklist",
  kind: "markdown",
  updatedAt: "4 min ago",
  note: "Tone consistency, legal checks, and editorial rubric.",
};

const videoDraft: WorkFile = {
  id: "file-video-draft",
  title: "Product Reel v1",
  kind: "video",
  updatedAt: "8 min ago",
  note: "First cut with pacing notes and subtitle alignment.",
};

const posterDraft: WorkFile = {
  id: "file-poster-draft",
  title: "Poster Draft v1",
  kind: "image",
  updatedAt: "12 min ago",
  note: "Layered PSD export and print-safe variation.",
};

const realImagePreview = {
  characterA: "https://i.imgur.com/1bRN33S.jpeg",
  characterB: "https://i.imgur.com/xVsCMcR.jpeg",
};

const folderOneFiles: WorkFile[] = [
  marketReport,
  visualConcept,
  promoStoryboard,
  copyGuidelines,
  campaignMatrix,
  qaChecklist,
];

const folderTwoFiles: WorkFile[] = [
  campaignMatrix,
  posterDraft,
  videoDraft,
  qaChecklist,
];

const folderThreeFiles: WorkFile[] = [marketReport, posterDraft, promoStoryboard, copyGuidelines];

export interface GeneratedFileFolder {
  id: string;
  title: string;
  updatedAt: string;
  status: "thinking" | "finished";
  files: WorkFile[];
}

export const generatedFileFolders: GeneratedFileFolder[] = [
  {
    id: "generated-folder-1",
    title: "Poster Assets + Promo Video Generation",
    updatedAt: "Updated now",
    status: "thinking",
    files: folderOneFiles,
  },
  {
    id: "generated-folder-2",
    title: "Poster Assets + Promo Video (v2 Iteration)",
    updatedAt: "Updated 3 minutes ago",
    status: "finished",
    files: folderTwoFiles,
  },
  {
    id: "generated-folder-3",
    title: "Demo Product (v1 Draft)",
    updatedAt: "Updated 16 minutes ago",
    status: "finished",
    files: folderThreeFiles,
  },
];

function tag(label: string, color: AgentTag["color"], placement?: AgentTag["placement"]): AgentTag {
  return { label, color, placement };
}

export function buildCanvasNodes(
  onOpenPreview: (file: WorkFile) => void,
): WorkbenchNode[] {
  return [
    {
      id: "note-1",
      type: "note",
      position: { x: 120, y: 80 },
      data: {
        title: "Create a complete marketing asset pack",
        checklist: [
          "Scan 10-15 competitors (Amazon/IG/TikTok)",
          "Identify dominant visual patterns",
          "Extract + rank conversion-driving USPs",
          "Output: USP list, visual direction, copy hooks",
        ],
        tag: tag("Brand Copywriter", "green", "right"),
        entryDelay: 0.02,
      } satisfies NoteNodeData,
      draggable: true,
    },
    {
      id: "doc-1",
      type: "document",
      position: { x: 460, y: 80 },
      data: {
        title: "Steve Jobs' Philosophy",
        subtitle: "Products and Life",
        excerpt: [
          "Think Different. Live Deliberately.",
          "Research notes for positioning angle.",
          "Frame value around aspiration and craft.",
        ],
        tag: tag("Content Auditor", "orange", "bottom"),
        actorName: "Research Agent",
        versionTag: "V1.0",
        batchId: "story-details-v1",
        timelineOrder: 1,
        previewFile: marketReport,
        onOpenPreview,
        entryDelay: 0.08,
      } satisfies DocumentNodeData,
      draggable: true,
    },
    {
      id: "doc-2",
      type: "document",
      position: { x: 740, y: 80 },
      data: {
        title: "Product Research Brief",
        subtitle: "A Sample Research Document",
        excerpt: [
          "Audience profile and intent clusters.",
          "Messaging gaps and benchmark findings.",
          "Recommended offer architecture.",
        ],
        tag: tag("Market Scout", "purple", "right"),
        actorName: "Research Agent",
        versionTag: "V1.0",
        batchId: "story-details-v1",
        timelineOrder: 2,
        previewFile: campaignMatrix,
        onOpenPreview,
        entryDelay: 0.12,
      } satisfies DocumentNodeData,
      draggable: true,
    },
    {
      id: "doc-generating-1",
      type: "document-generating",
      position: { x: 1020, y: 80 },
      data: {
        title: "Product Research Brief",
        subtitle: "A Sample Research Document",
        excerpt: [
          "Audience profile and intent clusters.",
          "Messaging gaps and benchmark findings.",
          "Recommended offer architecture.",
        ],
        actorName: "Research Agent",
        versionTag: "V2.0",
        batchId: "story-details-v2",
        timelineOrder: 3,
        previewFile: campaignMatrix,
        onOpenPreview,
        progress: 63,
        eta: "ETA 00:18",
        entryDelay: 0.16,
      } satisfies GeneratingDocumentNodeData,
      draggable: true,
    },
    {
      id: "media-real-1",
      type: "media",
      position: { x: 80, y: 480 },
      data: {
        title: "Character Variant A",
        kindLabel: "Image Pack",
        gradient:
          "linear-gradient(135deg, #dce8f8 0%, #bcd1ee 48%, #e9f1fb 100%)",
        previewImageSrc: realImagePreview.characterA,
        previewImagePosition: "center center",
        tag: tag("Character Designer", "blue", "bottom"),
        actorName: "Character Designer",
        versionTag: "V1.0",
        batchId: "design-main-characters-real-v1",
        timelineOrder: 4,
        previewFile: visualConcept,
        onOpenPreview,
        entryDelay: 0.18,
      } satisfies MediaNodeData,
      draggable: true,
    },
    {
      id: "media-real-2",
      type: "media",
      position: { x: 530, y: 480 },
      data: {
        title: "Character Variant B",
        kindLabel: "Image Pack",
        gradient:
          "linear-gradient(135deg, #dce8f8 0%, #bcd1ee 48%, #e9f1fb 100%)",
        previewImageSrc: realImagePreview.characterB,
        previewImagePosition: "center center",
        tag: tag("Character Designer", "blue", "bottom"),
        actorName: "Character Designer",
        versionTag: "V1.0",
        batchId: "design-main-characters-real-v1",
        timelineOrder: 5,
        previewFile: posterDraft,
        onOpenPreview,
        entryDelay: 0.22,
      } satisfies MediaNodeData,
      draggable: true,
    },
    {
      id: "media-1",
      type: "media",
      position: { x: 80, y: 480 },
      data: {
        title: "Campaign Visual Sheet",
        kindLabel: "Image Pack",
        gradient:
          "linear-gradient(135deg, #bff4ff 0%, #93c5fd 32%, #34d399 68%, #f0fdf4 100%)",
        tag: tag("Campaign Designer", "blue", "bottom"),
        actorName: "Character Designer",
        versionTag: "V1.0",
        batchId: "design-main-characters-v1",
        timelineOrder: 6,
        previewFile: visualConcept,
        onOpenPreview,
        entryDelay: 0.26,
      } satisfies MediaNodeData,
      draggable: true,
    },
    {
      id: "media-2",
      type: "media",
      position: { x: 610, y: 480 },
      data: {
        title: "Function to Feeling Reel",
        kindLabel: "Video Draft",
        gradient:
          "linear-gradient(135deg, #18181b 2%, #4f46e5 35%, #60a5fa 60%, #f5d0fe 100%)",
        tag: tag("Video Producer", "red", "bottom"),
        actorName: "Storyboard Artist",
        versionTag: "V1.0",
        batchId: "storyboard-scenes-v1",
        timelineOrder: 7,
        previewFile: promoStoryboard,
        onOpenPreview,
        entryDelay: 0.3,
      } satisfies MediaNodeData,
      draggable: true,
    },
    {
      id: "video-generation-1",
      type: "video-generation",
      position: { x: 1160, y: 480 },
      data: {
        title: "Poster Assets + Promo Video Generation",
        subtitle: "5 agents are collaborating around this draft on the infinite canvas.",
        progress: 68,
        eta: "ETA 00:42",
        actorName: "Video Producer",
        versionTag: "V2.0",
        batchId: "storyboard-scenes-v2",
        timelineOrder: 8,
        previewFile: promoStoryboard,
        onOpenPreview,
        entryDelay: 0.34,
      } satisfies VideoGenerationNodeData,
      draggable: true,
    },
    {
      id: "folder-1",
      type: "folder",
      position: { x: 90, y: 870 },
      data: {
        title: "Poster Assets + Promo Video Generation",
        filesCount: 12,
        updatedAt: "Updated now",
        status: "thinking",
        files: folderOneFiles,
        onOpenPreview,
        entryDelay: 0.38,
      } satisfies FolderNodeData,
      draggable: true,
    },
    {
      id: "folder-2",
      type: "folder",
      position: { x: 560, y: 870 },
      data: {
        title: "Poster Assets + Promo Video (v2 Iteration)",
        filesCount: 12,
        updatedAt: "Updated 3 minutes ago",
        status: "finished",
        files: folderTwoFiles,
        onOpenPreview,
        entryDelay: 0.44,
      } satisfies FolderNodeData,
      draggable: true,
    },
    {
      id: "folder-3",
      type: "folder",
      position: { x: 1030, y: 870 },
      data: {
        title: "Demo Product (v1 Draft)",
        filesCount: 12,
        updatedAt: "Updated 16 minutes ago",
        status: "finished",
        files: folderThreeFiles,
        onOpenPreview,
        entryDelay: 0.5,
      } satisfies FolderNodeData,
      draggable: true,
    },
  ];
}

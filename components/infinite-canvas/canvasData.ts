import type { WorkflowSection } from "./types";

export const workflowSections: WorkflowSection[] = [
  {
    id: "section-story-outline",
    step: 1,
    label: "Design story details",
    x: 160,
    y: 96,
    groups: [
      {
        id: "outline-group",
        cards: [
          {
            id: "outline-a",
            kind: "text",
            size: "sm",
            title: "Story Outline",
            subtitle: "An ordinary transfer student arrives at a mysterious high school...",
            lines: [
              "Campus secrets, hidden circles and sudden incidents.",
              "Character list + tone references.",
              "Sunlit city, gentle blue contrast.",
            ],
          },
          {
            id: "outline-b",
            kind: "text",
            size: "sm",
            title: "Story Outline",
            subtitle: "A parallel narrative with variant character motivation.",
            lines: [
              "Environment moodboard + pacing options.",
              "Conflict timeline and reveal cadence.",
              "Notes for voice and visual rhythm.",
            ],
          },
        ],
      },
    ],
  },
  {
    id: "section-character-design",
    step: 2,
    label: "Design Main Characters",
    subtitle: "Animation Short Concept Design V1.0",
    groupLayout: "row",
    x: 160,
    y: 388,
    groups: [
      {
        id: "character-group-a",
        title: "Animation Short Concept Design V1.0",
        cards: [
          {
            id: "character-img-1",
            kind: "image",
            size: "md",
            title: "Lead Character",
          },
          {
            id: "character-ph-1",
            kind: "placeholder",
            size: "md",
          },
          {
            id: "character-ph-2",
            kind: "placeholder",
            size: "md",
          },
        ],
      },
      {
        id: "character-group-b",
        title: "Animation Short Concept Design V1.0",
        cards: [
          {
            id: "character-img-2",
            kind: "image",
            size: "md",
            title: "Secondary Character",
          },
          {
            id: "character-ph-3",
            kind: "placeholder",
            size: "md",
          },
          {
            id: "character-ph-4",
            kind: "placeholder",
            size: "md",
          },
        ],
      },
    ],
  },
  {
    id: "section-storyboard-scenes",
    step: 3,
    label: "Design Storyboard Scenes",
    subtitle: "Animation Short Concept Design V1.0",
    x: 160,
    y: 726,
    groups: [
      {
        id: "scene-group",
        title: "Animation Short Concept Design V1.0",
        cards: [
          { id: "scene-ph-1", kind: "placeholder", size: "md" },
          { id: "scene-ph-2", kind: "placeholder", size: "md" },
          { id: "scene-ph-3", kind: "placeholder", size: "md" },
          { id: "scene-ph-4", kind: "placeholder", size: "md" },
        ],
      },
    ],
  },
  {
    id: "section-video-generation",
    step: 4,
    label: "Generate Storyboard Videos",
    subtitle: "Animation Short Concept Design V1.0",
    x: 160,
    y: 1052,
    groups: [
      {
        id: "video-group",
        title: "Animation Short Concept Design V1.0",
        cards: [
          { id: "video-ph-1", kind: "placeholder", size: "md" },
          { id: "video-ph-2", kind: "placeholder", size: "md" },
          { id: "video-ph-3", kind: "placeholder", size: "md" },
          { id: "video-ph-4", kind: "placeholder", size: "md" },
        ],
      },
    ],
  },
  {
    id: "section-video-editing",
    step: 5,
    label: "Video Editing",
    x: 160,
    y: 1348,
    groups: [
      {
        id: "edit-group",
        cards: [{ id: "edit-ph-1", kind: "placeholder", size: "lg" }],
      },
    ],
  },
];

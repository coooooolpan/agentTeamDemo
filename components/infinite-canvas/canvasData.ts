import type { RoleMeta, TaskCanvas } from "./types";

const roles: Record<
  "research" | "copy" | "character" | "storyboard" | "editor",
  RoleMeta
> = {
  research: {
    id: "role-research",
    name: "Research Agent",
    color: "#f0943f",
    avatarGradient: "linear-gradient(135deg,#ffd7b4,#f29a44)",
  },
  copy: {
    id: "role-copy",
    name: "Screenwriter",
    color: "#7f83ff",
    avatarGradient: "linear-gradient(135deg,#d2ceff,#6f80ff)",
  },
  character: {
    id: "role-character",
    name: "Character Designer",
    color: "#4ea6ff",
    avatarGradient: "linear-gradient(135deg,#bfe4ff,#4a91ff)",
  },
  storyboard: {
    id: "role-storyboard",
    name: "Storyboard Artist",
    color: "#55b68e",
    avatarGradient: "linear-gradient(135deg,#d7f6e6,#56bf95)",
  },
  editor: {
    id: "role-editor",
    name: "Video Editor",
    color: "#a285ff",
    avatarGradient: "linear-gradient(135deg,#e6deff,#9580ff)",
  },
};

const img = {
  charA1: "https://i.imgur.com/1bRN33S.jpeg",
  charA2: "https://i.imgur.com/yd470Pf.jpeg",
  charA3: "https://i.imgur.com/7zPgAiD.jpeg",
  charB1: "https://i.imgur.com/xVsCMcR.jpeg",
  charB2: "https://i.imgur.com/5rsxv8d.jpeg",
  charB3: "https://i.imgur.com/8mOaQnf.jpeg",
  scene1: "https://i.imgur.com/GBbBIcj.jpeg",
  scene2: "https://i.imgur.com/XBeq2Jn.jpeg",
  scene3: "https://i.imgur.com/KKrGl9e.jpeg",
  vid1: "https://i.imgur.com/1bRN33S.jpeg",
  vid2: "https://i.imgur.com/yd470Pf.jpeg",
  vid3: "https://i.imgur.com/xVsCMcR.jpeg",
  vid4: "https://i.imgur.com/8mOaQnf.jpeg",
};

const taskA: TaskCanvas = {
  taskId: "task-animation-v1",
  taskTitle: "Animation Short Concept Design",
  grouped: true,
  showCanvasBoundary: true,
  x: 190,
  y: 86,
  stages: [
    {
      id: "stage-story-details",
      title: "Design story details",
      top: 28,
      rows: [
        {
          id: "story-row-v1",
          cards: [
            {
              id: "asset-section-story-outline-outline-group-outline-a",
              outputBatchId: "batch-story-a-v1",
              role: roles.copy,
              outputType: "doc",
              createdAt: "10:12",
              versionIndex: 1,
              title: "Story Outline",
              description: "Narrative seed + conflict setup + hook direction.",
              layout: "doc",
              assets: [{ id: "story-doc-a", kind: "doc" }],
            },
            {
              id: "asset-section-story-outline-outline-group-outline-b",
              outputBatchId: "batch-story-b-v1",
              role: roles.research,
              outputType: "doc",
              createdAt: "10:14",
              versionIndex: 1,
              title: "Story Outline",
              description: "Audience profile + pacing rhythm + setting notes.",
              layout: "doc",
              assets: [{ id: "story-doc-b", kind: "doc" }],
            },
            {
              id: "asset-task-a-story-outline-v2",
              outputBatchId: "batch-story-c-v2",
              role: roles.copy,
              outputType: "doc",
              createdAt: "10:19",
              versionIndex: 2,
              title: "Story Outline",
              description: "Variant script with sharper opening and tighter beats.",
              layout: "doc",
              assets: [{ id: "story-doc-c", kind: "doc" }],
            },
          ],
        },
      ],
    },
    {
      id: "stage-main-characters",
      title: "Design Main Characters",
      top: 338,
      rows: [
        {
          id: "characters-row-v1",
          cards: [
            {
              id: "asset-section-character-design-character-group-a-character-img-1",
              outputBatchId: "batch-character-a-v1",
              role: roles.character,
              outputType: "image",
              createdAt: "10:23",
              versionIndex: 1,
              title: "Character Draft Set A",
              layout: "triplet",
              width: 516,
              height: 222,
              assets: [
                { id: "char-a-1", kind: "image", src: img.charA1 },
                { id: "char-a-2", kind: "image", src: img.charA2 },
                { id: "char-a-3", kind: "image", src: img.charA3 },
              ],
            },
            {
              id: "asset-section-character-design-character-group-b-character-img-2",
              outputBatchId: "batch-character-b-v1",
              role: roles.character,
              outputType: "image",
              createdAt: "10:25",
              versionIndex: 1,
              title: "Character Draft Set B",
              layout: "triplet",
              width: 516,
              height: 222,
              assets: [
                { id: "char-b-1", kind: "image", src: img.charB1 },
                { id: "char-b-2", kind: "image", src: img.charB2 },
                { id: "char-b-3", kind: "image", src: img.charB3 },
              ],
            },
          ],
        },
      ],
    },
    {
      id: "stage-storyboard-scenes",
      title: "Design Storyboard Scenes",
      top: 650,
      rows: [
        {
          id: "scenes-row-v1",
          cards: [
            {
              id: "asset-task-a-scenes-v1",
              outputBatchId: "batch-scenes-a-v1",
              role: roles.storyboard,
              outputType: "image",
              createdAt: "10:32",
              versionIndex: 1,
              title: "Scene Pack",
              layout: "triplet",
              width: 516,
              height: 222,
              assets: [
                { id: "scene-a-1", kind: "image", src: img.scene1 },
                { id: "scene-a-2", kind: "image", src: img.scene2 },
                { id: "scene-a-3", kind: "image", src: img.scene3 },
              ],
            },
          ],
        },
      ],
    },
    {
      id: "stage-generate-videos",
      title: "Generate Storyboard Videos",
      top: 946,
      rows: [
        {
          id: "videos-row-v1",
          cards: [
            {
              id: "asset-task-a-video-v1",
              outputBatchId: "batch-video-a-v1",
              role: roles.editor,
              outputType: "video",
              createdAt: "10:41",
              versionIndex: 1,
              title: "Video Draft Sequence",
              layout: "strip",
              width: 516,
              height: 168,
              assets: [
                { id: "video-a-1", kind: "video", src: img.vid1, ratio: "landscape" },
                { id: "video-a-2", kind: "video", src: img.vid2, ratio: "portrait" },
                { id: "video-a-3", kind: "video", src: img.vid3, ratio: "landscape" },
                { id: "video-a-4", kind: "placeholder", ratio: "landscape" },
              ],
            },
          ],
        },
      ],
    },
    {
      id: "stage-video-editing",
      title: "Video Editing",
      top: 1218,
      rows: [
        {
          id: "video-edit-row-v1",
          cards: [
            {
              id: "asset-task-a-edit-v1",
              outputBatchId: "batch-edit-a-v1",
              role: roles.editor,
              outputType: "mixed",
              createdAt: "10:46",
              versionIndex: 1,
              title: "Final Cut Placeholder",
              description: "Assembly in progress",
              layout: "single",
              width: 248,
              height: 170,
              assets: [{ id: "edit-a-placeholder", kind: "placeholder", ratio: "landscape" }],
            },
          ],
        },
      ],
    },
  ],
};

const taskB: TaskCanvas = {
  taskId: "task-animation-v2",
  taskTitle: "Animation Short Concept Design",
  grouped: true,
  showCanvasBoundary: true,
  x: 1430,
  y: 86,
  stages: [
    {
      id: "stage-story-details",
      title: "Design story details",
      top: 28,
      rows: [
        {
          id: "story-row-v2",
          cards: [
            {
              id: "asset-task-b-story-outline-v1",
              outputBatchId: "batch-story-taskb-a-v1",
              role: roles.copy,
              outputType: "doc",
              createdAt: "11:03",
              versionIndex: 1,
              title: "Story Outline",
              description: "Parallel branch for emotion-driven pacing.",
              layout: "doc",
              assets: [{ id: "story-doc-b-a", kind: "doc" }],
            },
            {
              id: "asset-task-b-story-outline-v2",
              outputBatchId: "batch-story-taskb-b-v2",
              role: roles.research,
              outputType: "doc",
              createdAt: "11:07",
              versionIndex: 2,
              title: "Story Outline",
              description: "Refined audience context and campaign framing.",
              layout: "doc",
              assets: [{ id: "story-doc-b-b", kind: "doc" }],
            },
            {
              id: "asset-task-b-story-outline-v3",
              outputBatchId: "batch-story-taskb-c-v3",
              role: roles.copy,
              outputType: "doc",
              createdAt: "11:11",
              versionIndex: 3,
              title: "Story Outline",
              description: "Tighter CTA narrative and conversion hooks.",
              layout: "doc",
              assets: [{ id: "story-doc-b-c", kind: "doc" }],
            },
          ],
        },
      ],
    },
    {
      id: "stage-main-characters",
      title: "Design Main Characters",
      top: 338,
      rows: [
        {
          id: "characters-row-v2",
          cards: [
            {
              id: "asset-task-b-character-a-v1",
              outputBatchId: "batch-taskb-character-a-v1",
              role: roles.character,
              outputType: "image",
              createdAt: "11:17",
              versionIndex: 1,
              title: "Character Variant A",
              layout: "triplet",
              width: 516,
              height: 222,
              assets: [
                { id: "char-b2-1", kind: "image", src: img.charA1 },
                { id: "char-b2-2", kind: "image", src: img.charA2 },
                { id: "char-b2-3", kind: "image", src: img.charA3 },
              ],
            },
            {
              id: "asset-task-b-character-b-v1",
              outputBatchId: "batch-taskb-character-b-v1",
              role: roles.character,
              outputType: "image",
              createdAt: "11:20",
              versionIndex: 1,
              title: "Character Variant B",
              layout: "triplet",
              width: 516,
              height: 222,
              assets: [
                { id: "char-b3-1", kind: "image", src: img.charB1 },
                { id: "char-b3-2", kind: "image", src: img.charB2 },
                { id: "char-b3-3", kind: "image", src: img.charB3 },
              ],
            },
          ],
        },
      ],
    },
    {
      id: "stage-storyboard-scenes",
      title: "Design Storyboard Scenes",
      top: 650,
      rows: [
        {
          id: "scenes-row-v2",
          cards: [
            {
              id: "asset-task-b-scenes-v2",
              outputBatchId: "batch-scenes-b-v2",
              role: roles.storyboard,
              outputType: "image",
              createdAt: "11:29",
              versionIndex: 2,
              title: "Storyboard Scene Set",
              layout: "triplet",
              width: 516,
              height: 222,
              assets: [
                { id: "scene-b-1", kind: "image", src: img.scene1 },
                { id: "scene-b-2", kind: "image", src: img.scene2 },
                { id: "scene-b-3", kind: "image", src: img.scene3 },
              ],
            },
          ],
        },
      ],
    },
    {
      id: "stage-generate-videos",
      title: "Generate Storyboard Videos",
      top: 946,
      rows: [
        {
          id: "videos-row-v2",
          cards: [
            {
              id: "asset-task-b-video-v2",
              outputBatchId: "batch-video-b-v2",
              role: roles.editor,
              outputType: "video",
              createdAt: "11:36",
              versionIndex: 2,
              title: "Video Draft Sequence",
              layout: "strip",
              width: 516,
              height: 168,
              assets: [
                { id: "video-b-1", kind: "video", src: img.vid1, ratio: "landscape" },
                { id: "video-b-2", kind: "video", src: img.vid2, ratio: "portrait" },
                { id: "video-b-3", kind: "video", src: img.vid4, ratio: "landscape" },
                { id: "video-b-4", kind: "placeholder", ratio: "landscape" },
              ],
            },
          ],
        },
      ],
    },
    {
      id: "stage-video-editing",
      title: "Video Editing",
      top: 1218,
      rows: [
        {
          id: "video-edit-row-v2",
          cards: [
            {
              id: "asset-task-b-edit-v2",
              outputBatchId: "batch-edit-b-v2",
              role: roles.editor,
              outputType: "mixed",
              createdAt: "11:41",
              versionIndex: 2,
              title: "Final Cut Placeholder",
              description: "Merge pass pending",
              layout: "single",
              width: 248,
              height: 170,
              assets: [{ id: "edit-b-placeholder", kind: "placeholder", ratio: "landscape" }],
            },
          ],
        },
      ],
    },
  ],
};

export const taskCanvases: TaskCanvas[] = [taskA, taskB];

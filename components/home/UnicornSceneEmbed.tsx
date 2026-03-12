"use client";

import dynamic from "next/dynamic";

const UnicornScene = dynamic(() => import("unicornstudio-react"), {
  ssr: false,
});

export function UnicornSceneEmbed() {
  return (
    <div className="h-full w-full">
      <UnicornScene
        projectId="swSyGODH0hkp0MflLjqw"
        width="100%"
        height="100%"
        scale={1}
        dpi={1.5}
        sdkUrl="https://cdn.jsdelivr.net/gh/hiunicornstudio/unicornstudio.js@2.1.3/dist/unicornStudio.umd.js"
      />
    </div>
  );
}

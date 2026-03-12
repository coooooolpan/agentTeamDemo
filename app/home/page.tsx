const unicornSnippet = `// npm install unicornstudio-react
// or
// yarn add unicornstudio-react
// or
// pnpm add unicornstudio-react

// then import the component
import UnicornScene from "unicornstudio-react";

// documentation: https://www.npmjs.com/package/unicornstudio-react
export default function MyComponent() {
  return (
    <UnicornScene
      projectId="swSyGODH0hkp0MflLjqw"
      width="1440px"
      height="900px"
      scale={1}
      dpi={1.5}
      sdkUrl="https://cdn.jsdelivr.net/gh/hiunicornstudio/unicornstudio.js@2.1.3/dist/unicornStudio.umd.js"
    />
  );
}`;

export default function HomePage() {
  return (
    <main className="min-h-screen bg-[#eef1f5] p-8 md:p-12">
      <section className="mx-auto max-w-5xl rounded-3xl border border-[#e3e7ef] bg-white p-6 shadow-[0_18px_35px_rgba(15,23,42,0.12)] md:p-10">
        <h1 className="text-2xl font-bold text-[#141821] md:text-3xl">Home</h1>
        <p className="mt-2 text-sm text-[#7f8798] md:text-base">
          unicornstudio-react install and usage snippet
        </p>

        <pre className="mt-6 overflow-x-auto rounded-2xl border border-[#e7ebf2] bg-[#0f172a] p-5 text-xs leading-6 text-[#e5edf9] md:text-sm">
          <code>{unicornSnippet}</code>
        </pre>
      </section>
    </main>
  );
}

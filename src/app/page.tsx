export default function Home() {
  return (
    <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col justify-center gap-8 px-6 py-14 md:py-20">
      <section className="rounded-3xl border border-border/80 bg-card/85 p-8 shadow-lg shadow-primary/10 backdrop-blur">
        <p className="text-xs font-medium tracking-[0.22em] text-muted-foreground uppercase">
          TraveLens Architecture Foundation
        </p>
        <h1 className="mt-3 font-heading text-4xl leading-tight text-balance md:text-5xl">
          App Router + BFF + Services + shadcn/ui
        </h1>
        <p className="mt-4 max-w-3xl text-base text-muted-foreground md:text-lg">
          Role 1 is ready. The workspace now includes a server-side API boundary,
          service modules, feature-level component folders, and a premium travel
          Tailwind theme baseline.
        </p>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        <article className="rounded-2xl border border-border/70 bg-card/90 p-5">
          <h2 className="text-sm font-semibold tracking-wide uppercase">BFF</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Route Handlers under app/api proxy data and keep API keys server-side.
          </p>
        </article>
        <article className="rounded-2xl border border-border/70 bg-card/90 p-5">
          <h2 className="text-sm font-semibold tracking-wide uppercase">
            Services
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Unsplash and Gemini logic is isolated in src/services for clean reuse.
          </p>
        </article>
        <article className="rounded-2xl border border-border/70 bg-card/90 p-5">
          <h2 className="text-sm font-semibold tracking-wide uppercase">UI Layers</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            shadcn primitives live in components/ui and feature blocks in
            components/features.
          </p>
        </article>
      </section>
    </main>
  );
}

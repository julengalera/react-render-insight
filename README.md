# react-render-insight

Mini **embeddable** "React DevTools / why-did-you-render" for inspecting re-renders in real-time, with a pedagogical focus:
- What re-renders
- When it re-renders
- Why it re-renders (heuristic)

> Status: **PHASE 1 (Functional MVP)**. In development. Not intended for production use without careful consideration.

## Features (PHASE 1)

- ✅ Embeddable Provider: `<RenderInsightProvider config={...}>`
- ✅ UI Panel: `<RenderInsightPanel />`
- ✅ Per-component tracking: `useRenderTracker(meta, props)`
- ✅ `useTrackedState` to mark renders by `state-change`
- ✅ Shallow props diff: added/removed/changed
- ✅ Timeline + component tree + details panel
- ✅ Playground with examples

## Quick Start

```bash
pnpm install
pnpm dev
```

Open the app and interact with the playground buttons. The panel should start recording events immediately.

## Usage (Embedded in Your App)

```tsx
import { RenderInsightProvider, RenderInsightPanel } from 'react-render-insight';

export function Root() {
  return (
    <RenderInsightProvider config={{ enabled: true, diffMode: 'shallow', maxChanges: 100 }}>
      <App />
      <RenderInsightPanel />
    </RenderInsightProvider>
  );
}
```

## Instrumenting a Component

```tsx
import { useRenderTracker } from 'react-render-insight';

function UserCard({ user }) {
  useRenderTracker(
    { displayName: 'UserCard', path: 'App > UsersPage > UserCard', instanceId: user.id },
    { user }
  );
  return <div>{user.name}</div>;
}
```

## Marking State Changes Reliably

```tsx
import { useTrackedState, useRenderTracker } from 'react-render-insight';

function Counter() {
  const [count, setCount, consumeFlag] = useTrackedState(
    { displayName: 'Counter', path: 'App > Counter' },
    0
  );
  
  useRenderTracker(
    { displayName: 'Counter', path: 'App > Counter' },
    { count },
    undefined,
    consumeFlag
  );
  
  return <button onClick={() => setCount((c) => c + 1)}>{count}</button>;
}
```

## Important Notes

### StrictMode in Development

In development, React may perform extra renders (for example with StrictMode). This can inflate counters and timeline metrics. Interpret the metrics with this in mind.

### RenderReason is Heuristic

`props-change` and `state-change` can be reliable in many cases, but `parent-rerender` / `unknown` are approximations (PHASE 1).

## Documentation

- `docs/ARCHITECTURE.md` — Core / Adapter / UI / Playground separation
- `docs/CONCEPTS.md` — Render cycles, diff, data model
- `docs/ROADMAP.md` — MVP vs future phases

## Roadmap (High Level)

**PHASE 2:** Finer signals (context-change), "avoidable render" heuristics, optional deep diff

**PHASE 3:** UX + performance (graphical timeline, virtualization, session export)
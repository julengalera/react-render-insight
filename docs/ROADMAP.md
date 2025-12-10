# ROADMAP — react-render-insight

## Current phase: PHASE 1 — Design

This phase defines:

- Scope of the hard MVP.
- What gets postponed to later phases.
- Main technical risks.
- Work blocks for implementation.

---

## 1. HARD MVP (Phase 1–2)

### 1.1. Basic render tracking

- Logging every render of each instrumented component.
- Stable component identifier:
  - `displayName` + `path` (hierarchy string like `App > List > Item`).
- Render counter per component.
- Timestamps for each render event.

### 1.2. Render reason (initial level)

- `RenderReason` field with approximate values:
  - `props-change`
  - `state-change`
  - `context-change`
  - `parent-rerender`
  - `unknown`
- Useful but not perfectly precise heuristic:
  - Compare previous vs current props.
  - Mark `state-change` when the component calls `setState` (if detectable through the adapter).

### 1.3. Props diff (initial mode)

- Shallow props comparison:
  - Modified props (before / after).
  - Added props.
  - Removed props.
- Global configuration in `RenderInsightProvider`:
  - `diffMode: 'shallow' | 'none'`
  - Optional `maxDiffDepth` for future deep modes.

### 1.4. Centralized event store

- Internal store including:
  - Chronological event history.
  - Index by `componentId`.
  - Aggregated metrics:
    - Global `renderCount`.
    - Per-component `renderCount`.
- Read API through selectors:
  - Get simplified timeline.
  - Get component events.
  - Get global metrics.

### 1.5. Basic embeddable panel UI

- `<RenderInsightPanel />` featuring:
  - Component tree:
    - One node per component, containing:
      - Name.
      - Render counter.
      - Simple heat indicator (example: color levels based on render ranges).
  - Details panel:
    - Recent events for the selected component.
    - Props diff of the selected event.
  - Stats summary:
    - Top N components by render count.
    - Total number of recorded renders.

### 1.6. React adapter

- `<RenderInsightProvider config={...}>`:
  - Wraps the user's app.
  - Initializes the store.
  - Exposes context to the panel UI and advanced hooks.
- `useRenderTracker(meta, props)`:
  - Runs on every render of the instrumented component.
  - Tracks `prevProps` using `useRef`.
  - Calls the core (`trackRender`) and stores the event.
- `useRenderInsight()`:
  - Provides high-level access to state + selectors.

### 1.7. Minimal playground / demo

- SPA including:
  - Main page (`/`) with a simple example:
    - One or two components re-rendering from props/state changes.
  - Embedded panel showing the renders.

---

## 2. NICE TO HAVE (Later phases)

### 2.1. Configurable deep diff

- Support for:
  - `diffMode: 'deep'`.
  - `maxDiffDepth` to limit recursion depth.
- More detailed change detection in nested structures.

### 2.2. Advanced timeline

- Timeline-style UI:
  - X axis: time / event order.
  - Y axis: components.
- Filters:
  - By component.
  - By render reason (`props-change`, `state-change`, etc.).
- Zoom / event grouping.

### 2.3. “Avoidable render” heuristics

- Detect typical patterns:
  - Inline functions in props changing each render.
  - Inline objects/arrays without memoization.
- Suggestions:
  - “This component could benefit from `React.memo`.”
  - “This prop could be memoized with `useCallback` / `useMemo`.”

### 2.4. Multi-root or microfrontend integration

- Support for more than one component tree in a single app.
- Grouping by something like `rootId`.

### 2.5. Advanced per-component configuration

- Mark components as:
  - Ignored for tracking.
  - Using a different diff detail level.

---

## 3. Technical risks and Phase 1 decisions

### 3.1. Diff cost

**Risk:**  
Deep diffs on large objects may cause significant overhead.

**Phase 1 decisions:**

- Implement **shallow diff only** in the MVP.
- Make diff **opt-in** via configuration (`diffMode: 'shallow' | 'none'`).
- Document clearly that the tool is for debugging, not production use without caution.

### 3.2. Render reason accuracy

**Risk:**  
Achieving 100% precision on what caused a render (props/state/context) is difficult without deeper React internals integration.

**Phase 1 decisions:**

- Start with a **reasonable heuristic**:
  - If props differ → `props-change`.
  - If the component likely used `setState` → `state-change`.
  - If a subscribed context changed → `context-change`.
  - If nothing obvious changed → `parent-rerender` or `unknown`.
- Document that `RenderReason` is a **useful hint**, not a perfect truth.

### 3.3. Tracking overhead in real apps

**Risk:**  
Injecting tracking hooks in many components may affect performance, especially with large lists.

**Phase 1 decisions:**

- Design the tool for **development environments**, not production.
- Expose:
  - `enabled` flag in the provider config.
  - Ability to disable parts of tracking (like diffs).
- Skip render-time measurement in milliseconds for MVP; only count renders.

### 3.4. Compatibility with different React versions / rendering modes

**Risk:**  
StrictMode or concurrent rendering may trigger extra renders.

**Phase 1 decisions:**

- Document explicitly:
  - React may call some renders twice in development under `StrictMode`.
  - Panel metrics must be interpreted with this in mind.
- Do not optimize for advanced concurrent features yet; focus on typical modern app behavior.

---

## 4. Implementation work blocks (after Phase 1)

1. Implement core models and store.
2. Implement basic tracking (`trackRender` + shallow diffs).
3. Implement React adapter (`RenderInsightProvider`, `useRenderTracker`, `useRenderInsight`).
4. Implement minimal panel UI.
5. Complete playground with examples.
6. Refine documentation and prepare the first experimental release.

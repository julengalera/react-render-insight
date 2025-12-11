## Tracking Core

The **tracking core** is responsible for transforming a React render into a normalized `RenderEvent`.

Flow:

1. The React integration layer (`react-adapter`) calls `trackRender(input, options)` on every render of an instrumented component.
2. `trackRender`:
   - Decides whether it should compute a diff (`computeDiff`).
   - Chooses the diff strategy (`shallowDiff` or `deepDiff`).
   - Infers the approximate reason for the render (`inferRenderReason`).
   - Returns a `RenderEvent` ready to be persisted in the store.
3. The store (`core/store`) is responsible for:
   - Saving the event.
   - Updating indexes per component.
   - Recalculating global metrics.

Responsibilities:

- `trackRender` **does not know** any store details.
- The store **does not know** how the diff is computed.
- The UI consumes only:
  - `RenderEvent`
  - `RenderInsightState`
  - High-level selectors.

## Store and selectors

The **store** in React Render Insight is an independent layer that:

- Stores all `RenderEvent`.
- Maintains indexes by component.
- Computes and updates global metrics.

### RenderInsightStore

The store API is:

- `getState()`: returns the current state (`RenderInsightState`).
- `subscribe(listener)`: lets you react to changes (ideal for React integration).
- `addEvent(event)`: adds a new render event.
- `reset()`: clears the state.

The internal implementation may use Zustand or any other library, but the rest of the system only interacts with the `RenderInsightStore` interface.

### Normalized state

The state (`RenderInsightState`) is structured as:

- `eventsById`: map `eventId -> RenderEvent`.
- `eventsByComponentId`: map `componentKey -> eventIds[]`.
- `allEventIds`: global list of event IDs in chronological order.
- `componentStatsById`: metrics per component.
- `globalStats`: global metrics (total renders, total components, top by renders, etc.).

### Selectors

The UI and the adapter access the state through selectors:

- `selectAllEvents(state)`: all events in order.
- `selectTimeline(state)`: global timeline (`TimelinePoint[]`).
- `selectComponentEvents(state, componentId)`: events for a component.
- `selectComponentStats(state, componentId)`: metrics for a component.
- `selectGlobalStats(state)`: global metrics.
- `selectTopComponentsByRenders(state, limit)`: components with the most renders.

This way:

- The **core** can change its internal structure without breaking the UI.
- The **UI** only needs to know high-level types (events, timeline, stats).

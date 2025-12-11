# CONCEPTS — Data Model

## RenderEvent

The basic unit of information is a **RenderEvent**:

- Represents **a specific render** of a component.
- Includes:
  - `componentId`: who rendered.
  - `timestamp`: when.
  - `renderIndexForComponent`: which render number it is for that component.
  - `reason`: approximate reason (`props-change`, `state-change`, etc.).
  - `propsBefore` / `propsAfter`: snapshot of props before and after.
  - `diff`: changes detected between previous and current props.

### ComponentId

A component is identified by:

- `displayName`: the component’s name in React.
- `path`: logical path in the tree, for example `App > UserList > UserCard`.
- `instanceId` (optional): allows distinguishing different instances of the same component (e.g. list items).

## Props diff

The props diff is modeled as:

- `mode`: `'none' | 'shallow' | 'deep'`.
- `changed`: list of props whose value has changed.
- `added`: new props.
- `removed`: props that no longer exist.
- `truncated`: indicates whether the diff was truncated due to depth or size limits.

The tool isn’t intended to be a perfect diff of arbitrary structures, but **a visual aid** to understand what changed between renders.

## Internal state (RenderInsightState)

The tool’s state is a normalized store:

- `eventsById`: map of all events.
- `eventsByComponentId`: list of event IDs per component.
- `allEventIds`: global timeline.
- `componentStatsById`: metrics per component.
- `globalStats`: global metrics.

The UI never accesses the internal structures directly, but uses **selectors** that expose:

- Simplified timeline.
- A component’s history.
- Global and per-component metrics.
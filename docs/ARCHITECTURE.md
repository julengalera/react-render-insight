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

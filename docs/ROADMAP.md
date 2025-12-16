# Roadmap

## Overview

This roadmap outlines the planned development phases for `react-render-insight`, from the current MVP to a more mature debugging tool.

## PHASE 1: MVP (Current)

**Goal**: Deliver a functional, embeddable tool for basic render tracking with shallow diff and heuristic reason detection.

### Core Features
- Basic tracking system for capturing render events
- Shallow prop diff algorithm (detect added/removed/changed keys)
- Simple store for event persistence
- Selectors for querying data efficiently

### React Integration
- `RenderInsightProvider` with configuration options
- `useRenderTracker` hook for component instrumentation
- `useTrackedState` for reliable state-change detection

### UI Components
- Timeline view of render events
- Component tree hierarchy
- Details panel with prop diffs
- Basic filtering by component/reason

### Playground
- Demo scenarios showcasing different render patterns
- Example components with instrumentation

### Known Limitations
- Heuristic reasons (`parent-rerender`, `unknown`) are approximations
- No context-change detection
- No deep diff option
- StrictMode can inflate metrics
- Limited performance optimization for large datasets

## PHASE 2: Enhanced Signals & Heuristics

**Goal**: Improve accuracy of render reason detection and add more granular tracking capabilities.

### Enhanced Tracking
- **Context-change detection**: Track when renders are caused by context updates
- **Hook dependency tracking**: Better understanding of custom hook triggers
- **Memo/callback tracking**: Detect unnecessary re-creations

### Advanced Diff Options
- **Deep diff mode**: Optional recursive comparison for nested objects/arrays
- **Custom comparators**: Allow users to provide domain-specific equality checks
- **Ignored props**: Exclude specific props from diff calculations

### Heuristics Improvements
- "Avoidable render" detection (component rendered but could have been memoized)
- Better classification of `unknown` reasons
- Confidence scores for heuristic classifications

### Performance
- Diff caching to avoid redundant computations
- Configurable sampling (track every Nth render)

## PHASE 3: UX & Production Readiness

**Goal**: Polish the user experience and make the tool viable for production debugging scenarios.

### Visual Enhancements
- **Graphical timeline**: Visual representation of render patterns over time
- **Flame graph**: Show render cascades and component hierarchies
- **Heatmap**: Identify components with highest render frequency

### Performance Optimizations
- **Virtualized lists**: Handle thousands of events without performance degradation
- **Incremental loading**: Load events on-demand
- **Worker thread support**: Offload diff calculations

### Session Management
- **Export sessions**: Save tracking data as JSON for later analysis
- **Import sessions**: Load previous sessions for comparison
- **Session comparison**: Diff two sessions to identify regressions

### Production Features
- **Conditional enablement**: Enable tracking based on query params, feature flags, or user roles
- **Remote logging**: Send tracking data to analytics services
- **Redaction**: Strip sensitive prop values before logging

### Developer Experience
- **Browser extension**: Standalone devtool panel (alternative to embedded UI)
- **TypeScript improvements**: Stricter types, better inference
- **Framework adapters**: Potential support for Preact, Solid, etc.

## PHASE 4: Advanced Analysis (Future)

**Goal**: Provide AI-assisted analysis and automated optimization suggestions.

### Potential Features
- Automated detection of common anti-patterns
- Suggestions for memoization opportunities
- Performance regression detection across sessions
- Integration with profiling tools (React DevTools Profiler)
- Machine learning models for predicting problematic render patterns

## PHASE 1 Checklist (Status)

- [x] Core: tipos + tracking contract
- [x] Diff: shallow diff MVP
- [x] Store: persistencia de eventos + stats
- [x] Adapter: provider + useRenderTracker + useRenderInsight
- [x] Adapter: useTrackedState (state-change)
- [x] UI: panel con tree + timeline + details + filters
- [x] Playground: ejemplos básicos
- [ ] Tests: unitarios core (mínimos)
- [ ] DX: scripts + lint + tsconfig strict revisado
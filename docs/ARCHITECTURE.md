# Architecture

## Overview

This document describes the architectural design of `react-render-insight`, organized in layers that separate concerns and enable independent testing and evolution.

### High-Level Diagram

```
┌─────────────────────────────────────────────────────────┐
│                      Playground                          │
│  (Routes, demo components, example scenarios)            │
└────────────────────┬────────────────────────────────────┘
                     │
┌────────────────────▼────────────────────────────────────┐
│                         UI                               │
│  (RenderInsightPanel, Timeline, ComponentTree, Details)  │
└────────────────────┬────────────────────────────────────┘
                     │
┌────────────────────▼────────────────────────────────────┐
│                   React Adapter                          │
│  (Provider, useRenderTracker, useTrackedState)           │
└────────────────────┬────────────────────────────────────┘
                     │
┌────────────────────▼────────────────────────────────────┐
│                       Core                               │
│  (Tracking, Diff, Store, Selectors, Types)               │
└─────────────────────────────────────────────────────────┘
```

## Core

The **Core** layer is framework-agnostic and contains the business logic for tracking, diffing, and storing render events.

### Modules

- **Tracking**: Logic for capturing render events and metadata
- **Diff**: Algorithms for comparing props (shallow diff, detecting added/removed/changed keys)
- **Store**: Centralized state management for all render events and component data
- **Selectors**: Efficient queries for retrieving specific subsets of data (timeline, component tree, details)
- **Types**: TypeScript interfaces and types shared across the library

### Responsibilities

- Maintain an immutable log of render events
- Compute prop differences between renders
- Provide fast access to aggregated data (render counts, component hierarchy)
- No React dependencies at this layer

## React Adapter

The **React Adapter** layer bridges React components with the Core layer, providing hooks and context for tracking.

### Components

- **RenderInsightProvider**: Context provider that initializes the tracking system and makes it available to child components
- **Configuration**: Accepts config options (enabled, diffMode, maxChanges)

### Hooks

- **useRenderTracker**: Main hook for instrumenting components. Captures metadata, props, and optional state change flags
- **useTrackedState**: Wrapper around `useState` that marks renders as `state-change` reliably
- **useRenderInsightContext**: Internal hook for accessing the tracking system

### Responsibilities

- Integrate seamlessly with React component lifecycle
- Provide ergonomic APIs for developers to instrument their components
- Handle React-specific concerns (refs, effect timing, strict mode)

## UI

The **UI** layer provides visual components for inspecting render data in real-time.

### Components

- **RenderInsightPanel**: Main container that orchestrates the UI
- **Timeline**: Chronological list of render events with filtering
- **ComponentTree**: Hierarchical view of tracked components
- **Details**: Detailed view of a selected render event (props diff, metadata, reason)

### Features

- Interactive filtering by component, render reason, time range
- Real-time updates as new renders occur
- Expandable/collapsible sections for better navigation
- Clear visual indicators for different render reasons

### Responsibilities

- Consume data from Core via selectors
- Provide intuitive UX for exploring render patterns
- Stay performant even with hundreds of events

## Playground

The **Playground** layer contains demo applications and test scenarios for validating the library.

### Structure

- **Routes**: Different pages showcasing various use cases
- **Demo Components**: Example components instrumented with tracking hooks
- **Scenarios**: Specific patterns to test (rapid state changes, prop updates, context changes)

### Examples

- Counter with state changes
- User list with prop changes
- Nested component hierarchies
- Context consumers
- Parent/child re-render cascades

### Responsibilities

- Serve as living documentation
- Validate tracking accuracy across different patterns
- Help identify edge cases and performance issues

## Tradeoffs

### Diff Cost

- **Shallow diff**: Fast and sufficient for most cases, but won't detect deep object mutations
- **Deep diff**: More accurate but computationally expensive, can impact performance with large props
- **Current approach**: Phase 1 uses shallow diff by default; deep diff planned for Phase 2 as opt-in

### StrictMode

- **Issue**: In development, React's StrictMode intentionally double-invokes effects and renders
- **Impact**: Inflates render counts and can create duplicate events in timeline
- **Mitigation**: Documentation warns users to interpret metrics accordingly; future phases may add detection/deduplication

### Heuristic Render Reasons

- **props-change**: Reliable when props actually differ between renders
- **state-change**: Reliable when using `useTrackedState` or manual flags
- **parent-rerender**: Inferred when no props/state changed but component still rendered
- **unknown**: Fallback when we can't determine the reason
- **Limitation**: Phase 1 heuristics are approximations; context changes, custom hooks, and other triggers may be misclassified
- **Future**: Phase 2 will add more precise signals (context-change detection, hook dependency tracking)

### Memory and Performance

- **maxChanges limit**: Prevents unbounded memory growth by capping stored events
- **Selective tracking**: Only instrumented components are tracked (opt-in approach)
- **Production usage**: Not recommended without careful consideration; intended primarily for development and debugging
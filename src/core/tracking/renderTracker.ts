// renderTracker.ts: Convert “a render happened” into a RenderEvent
//
// This module sits between the React adapter and the store.
import type { ComponentId, DiffMode, DiffResult, RenderReason } from './eventTypes';
import type { RenderEvent } from '../store/types';
import { shallowDiff, type DiffConfig } from '../diff/shallowDiff';
import { deepDiff, type DeepDiffConfig } from '../diff/deepDiff';

// TrackingOptions
//
// Global configuration for render tracking.
export interface TrackingOptions {
    enabled: boolean;
    diffMode: DiffMode;
    maxChanges?: number;
    maxDiffDepth?: number;
}

// RenderTrackerInput
//
// Data provided by the React adapter on every render.
export interface RenderTrackerInput {
    componentId: ComponentId;
    prevProps?: Record<string, unknown>;
    nextProps: Record<string, unknown>;
    renderIndexForComponent: number;
    reasonHint?: RenderReason;
}

// TrackRenderResult
//
// Return value of the tracker.
export interface TrackRenderResult {
    event: RenderEvent;
    diff?: DiffResult;
}

// computeDiff()
//
// Strategy router for diff computation.
function computeDiff(
    prevProps: Record<string, unknown> | undefined,
    nextProps: Record<string, unknown>,
    options: TrackingOptions,
): DiffResult | undefined {
    if (!options.enabled) return undefined;
    if (options.diffMode === 'none') return undefined;

    const baseConfig: DiffConfig = {
        mode: options.diffMode,
        maxChanges: options.maxChanges,
    };

    if (options.diffMode === 'shallow') {
        return shallowDiff(prevProps, nextProps, baseConfig);
    }

    if (options.diffMode === 'deep') {
        const deepConfig: DeepDiffConfig = {
        ...baseConfig,
        maxDepth: options.maxDiffDepth ?? 3,
        };
        return deepDiff(prevProps, nextProps, deepConfig);
    }

    return undefined;     
}

// inferRenderReason()
//
// Attempts to infer why a render occurred.
function inferRenderReason(
    input: RenderTrackerInput,
    diff: DiffResult | undefined,
): RenderReason {
    if (input.reasonHint) return input.reasonHint;

    if (!input.prevProps && input.nextProps) {
        return 'unknown';
    }

    if (diff && diff.changed.length + diff.added.length + diff.removed.length > 0) {
        return 'props-change';
    }

    return 'unknown';
}

// trackRender()
//
// Public entry point used by the React adapter.
export function trackRender(
    input: RenderTrackerInput,
    options: TrackingOptions,
): TrackRenderResult {
    const timestamp = Date.now();

    const diff = computeDiff(input.prevProps, input.nextProps, options);
    const reason = inferRenderReason(input, diff);

    const event: RenderEvent = {
        id: `${timestamp}-${Math.random().toString(16).slice(2)}`,
        timestamp,
        componentId: input.componentId,
        renderIndexForComponent: input.renderIndexForComponent,
        reason,
        propsBefore: input.prevProps,
        propsAfter: input.nextProps,
        diff,
    };

    return {
        event,
        diff,
    };
}

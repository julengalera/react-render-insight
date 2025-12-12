// shallowDiff.ts: Shallow props diff (first-level keys only)
//
// Intended behavior:
// - Compare only the top-level keys of props.
// - If props.foo changes (primitive value or reference), mark it as changed.
// - Do not inspect nested objects (no deep traversal).
import type { DiffResult, DiffMode } from '../tracking/eventTypes';

export interface DiffConfig {
    mode: DiffMode;
    maxChanges?: number;
}

export function shallowDiff(
    prev: Record<string, unknown> | undefined,
    next: Record<string, unknown>,
    config: DiffConfig,
): DiffResult {
    //TODO: Implement shallow diff logic
    console.log('shallowDiff prev and next', prev, next);

    return {
        mode: config.mode,
        changed: [],
        added: [],
        removed: [],
        truncated: false,
    };
}

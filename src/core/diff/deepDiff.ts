// deepDiff.ts: Deep props diff (nested paths, with limits)
//
// Intended behavior:
// - Detect nested changes (e.g. props.user.name).
// - Traverse objects/arrays up to constraints:
//   - maxDepth: avoid infinite/expensive traversal
//   - maxChanges: stop once too many differences were collected
import type { DiffResult } from '../tracking/eventTypes';
import type { DiffConfig } from './shallowDiff';

export interface DeepDiffConfig extends DiffConfig {
    maxDepth: number;
}

export function deepDiff(
    prev: Record<string, unknown> | undefined,
    next: Record<string, unknown>,
    config: DeepDiffConfig,
): DiffResult {
    return {
        mode: config.mode,
        changed: [],
        added: [],
        removed: [],
        truncated: true,
    };
}

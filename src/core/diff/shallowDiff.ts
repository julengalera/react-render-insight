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
    return {
        mode: config.mode,
        changed: [],
        added: [],
        removed: [],
        truncated: false,
    };
}

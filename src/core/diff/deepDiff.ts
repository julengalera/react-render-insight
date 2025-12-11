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

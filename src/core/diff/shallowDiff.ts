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

function safeMaxChanges(maxChanges?: number): number {
    if (!maxChanges || maxChanges <= 0) return 100;
    return maxChanges;
}

export function shallowDiff(
    prev: Record<string, unknown> | undefined,
    next: Record<string, unknown>,
    config: DiffConfig,
): DiffResult {
    const max = safeMaxChanges(config.maxChanges);

    const result: DiffResult = {
        mode: config.mode,
        changed: [],
        added: [],
        removed: [],
        truncated: false,
    };

    const prevObj = prev ?? {};

    for (const key of Object.keys(next)) {
        const hasPrev = Object.prototype.hasOwnProperty.call(prevObj, key);

        if (!hasPrev) {
            result.added.push({ key, value: next[key] });
        } else {
            const before = prevObj[key];
            const after = next[key];

            if (!Object.is(before, after)) {
                result.changed.push({ key, before, after });
            }
        }

        if (result.added.length + result.changed.length + result.removed.length >= max) {
            result.truncated = true;
            return result;
        }
    }

    for (const key of Object.keys(prevObj)) {
        const hasNext = Object.prototype.hasOwnProperty.call(next, key);
        if (!hasNext) {
            result.removed.push({ key, value: prevObj[key] });

            if (result.added.length + result.changed.length + result.removed.length >= max) {
                result.truncated = true;
                return result;
            }
        }
    }

    return result;
}
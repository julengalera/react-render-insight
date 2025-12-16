import { describe, it, expect } from 'vitest';
import { shallowDiff } from './shallowDiff';

describe('shallowDiff', () => {
    it('detects added/removed/changed keys', () => {
        const prev = { a: 1, b: 2, c: 3 };
        const next = { a: 1, b: 20, d: 4 };

        const diff = shallowDiff(prev, next, { mode: 'shallow', maxChanges: 100 });

        expect(diff.added.map((x) => x.key)).toEqual(['d']);
        expect(diff.removed.map((x) => x.key)).toEqual(['c']);
        expect(diff.changed.map((x) => x.key)).toEqual(['b']);
    });

    it('truncates when maxChanges is exceeded', () => {
        const prev = { a: 1 };
        const next = { a: 2, b: 3, c: 4 };

        const diff = shallowDiff(prev, next, { mode: 'shallow', maxChanges: 1 });

        expect(diff.truncated).toBe(true);
        expect(diff.changed.length + diff.added.length + diff.removed.length).toBe(1);
    });
});
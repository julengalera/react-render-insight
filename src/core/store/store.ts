// store.ts: Minimal Zustand/Redux-lite style store (no middleware, no magic)
//
// Defines a small store interface
import type { RenderEvent, RenderInsightState, ComponentStats, GlobalStats, TimelinePoint } from './types';

export interface RenderInsightStore {
    getState(): RenderInsightState;
    subscribe(listener: (state: RenderInsightState) => void): () => void;
    addEvent(event: RenderEvent): void;
    reset(): void;
}

export interface RenderInsightStoreOptions {
    initialState?: RenderInsightState;
}

// createRenderInsightStore()
//
// Creates a store instance
export function createRenderInsightStore(
    options: RenderInsightStoreOptions = {},
): RenderInsightStore {
    let state: RenderInsightState =
        options.initialState ??
        ({
        eventsById: {},
        eventsByComponentId: {},
        allEventIds: [],
        componentStatsById: {},
        globalStats: {
            totalRenders: 0,
            totalComponents: 0,
            topComponentsByRenders: [],
        },
        } as RenderInsightState);

    const listeners = new Set<(s: RenderInsightState) => void>();

    const notify = () => {
        for (const listener of listeners) {
        listener(state);
        }
    };

    const store: RenderInsightStore = {
        getState() {
            return state;
        },
        subscribe(listener) {
            listeners.add(listener);
            listener(state);
            return () => {
                listeners.delete(listener);
            };
        },
        //TODO: Implement actual event addition logic
        addEvent(_event: RenderEvent) {
            notify();
        },
        reset() {
            state = {
                eventsById: {},
                eventsByComponentId: {},
                allEventIds: [],
                componentStatsById: {},
                globalStats: {
                totalRenders: 0,
                totalComponents: 0,
                topComponentsByRenders: [],
                },
            };
            notify();
        },
    };

    return store;
}

export type {
    RenderInsightState,
    RenderEvent,
    ComponentStats,
    GlobalStats,
    TimelinePoint,
};

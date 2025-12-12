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
        addEvent(event: RenderEvent) {
            const nextState: RenderInsightState = {
                ...state,
                eventsById: { ...state.eventsById },
                eventsByComponentId: { ...state.eventsByComponentId },
                allEventIds: [...state.allEventIds],
                componentStatsById: { ...state.componentStatsById },
                globalStats: { ...state.globalStats },
            };

            nextState.eventsById[event.id] = event;
            nextState.allEventIds.push(event.id);

            const cKey = componentKeyFromId(event.componentId);
            const list = nextState.eventsByComponentId[cKey]
                ? [...nextState.eventsByComponentId[cKey]]
                : [];
            list.push(event.id);
            nextState.eventsByComponentId[cKey] = list;

            const prevStats = nextState.componentStatsById[cKey];
            const ts = event.timestamp;

            if (!prevStats) {
                nextState.componentStatsById[cKey] = {
                componentId: event.componentId,
                totalRenders: 1,
                firstRenderAt: ts,
                lastRenderAt: ts,
                };
            } else {
                nextState.componentStatsById[cKey] = {
                ...prevStats,
                totalRenders: prevStats.totalRenders + 1,
                lastRenderAt: ts,
                };
            }

            nextState.globalStats = recomputeGlobalStats(nextState);

            state = nextState;
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

function componentKeyFromId(componentId: any): string {
    const base = componentId.displayName ?? 'Unknown';
    const path = componentId.path ?? '';
    const instance = componentId.instanceId ?? '';
    return [base, path, instance].filter(Boolean).join('::');
}

function recomputeGlobalStats(nextState: RenderInsightState): GlobalStats {
    const componentStats = Object.values(nextState.componentStatsById);
    const sorted = [...componentStats].sort((a, b) => b.totalRenders - a.totalRenders);

    return {
        totalRenders: nextState.allEventIds.length,
        totalComponents: componentStats.length,
        topComponentsByRenders: sorted.slice(0, 20),
    };
}

export type {
    RenderInsightState,
    RenderEvent,
    ComponentStats,
    GlobalStats,
    TimelinePoint,
};

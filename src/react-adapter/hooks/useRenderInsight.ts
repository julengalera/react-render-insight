// useRenderInsight.ts: UI-facing API hook
//
// Exposes the “UI API”
import { useEffect, useState } from 'react';
import {
    selectTimeline,
    selectComponentEvents,
    selectComponentStats,
    selectGlobalStats,
    selectTopComponentsByRenders,
    type RenderInsightState,
    type TimelinePoint,
    type RenderEvent,
    type ComponentStats,
    type GlobalStats,
} from '../../core';
import type { ComponentId } from '../../core';
import { useRenderInsightStore } from '../context/useRenderInsightStore';

export interface UseRenderInsightResult {
    state: RenderInsightState;
    selectors: {
        getTimeline: () => TimelinePoint[];
        getComponentEvents: (id: ComponentId) => RenderEvent[];
        getComponentStats: (id: ComponentId) => ComponentStats | undefined;
        getGlobalStats: () => GlobalStats;
        getTopComponentsByRenders: (limit?: number) => ComponentStats[];
    };
    actions: {
        reset: () => void;
    };
}

export function useRenderInsight(): UseRenderInsightResult {
    const store = useRenderInsightStore();
    const [state, setState] = useState<RenderInsightState>(() =>
        store.getState(),
    );

    useEffect(() => {
        const unsubscribe = store.subscribe((nextState) => {
            setState(nextState);
        });

        return unsubscribe;
    }, [store]);

    return {
        state,
        selectors: {
            getTimeline: () => selectTimeline(state),
            getComponentEvents: (id: ComponentId) => selectComponentEvents(state, id),
            getComponentStats: (id: ComponentId) => selectComponentStats(state, id),
            getGlobalStats: () => selectGlobalStats(state),
            getTopComponentsByRenders: (limit?: number) =>
                selectTopComponentsByRenders(state, limit),
        },
        actions: {
            reset: () => store.reset(),
        },
    };
}
import type { RenderInsightState, RenderEvent, ComponentStats, GlobalStats, TimelinePoint } from './types';
import type { ComponentId } from '../tracking/eventTypes';

export function getComponentKey(componentId: ComponentId): string {
    const base = componentId.displayName ?? 'Unknown';
    const path = componentId.path ?? '';
    const instance = componentId.instanceId ?? '';
    return [base, path, instance].filter(Boolean).join('::');
}

export function selectAllEvents(state: RenderInsightState): RenderEvent[] {
    return state.allEventIds.map((id) => state.eventsById[id]).filter(Boolean);
}

export function selectTimeline(state: RenderInsightState): TimelinePoint[] {
    return state.allEventIds.map((id) => {
        const event = state.eventsById[id];
        return {
            eventId: event.id,
            timestamp: event.timestamp,
            componentId: event.componentId,
            renderIndexForComponent: event.renderIndexForComponent,
        };
    });
}

export function selectComponentEvents(
    state: RenderInsightState,
    componentId: ComponentId,
): RenderEvent[] {
    const key = getComponentKey(componentId);
    const eventIds = state.eventsByComponentId[key] ?? [];
    return eventIds.map((id) => state.eventsById[id]).filter(Boolean);
}

export function selectComponentStats(
    state: RenderInsightState,
    componentId: ComponentId,
): ComponentStats | undefined {
    const key = getComponentKey(componentId);
    return state.componentStatsById[key];
}

export function selectGlobalStats(
    state: RenderInsightState,
): GlobalStats {
    return state.globalStats;
}

export function selectTopComponentsByRenders(
    state: RenderInsightState,
    limit = 5,
): ComponentStats[] {
    return state.globalStats.topComponentsByRenders.slice(0, limit);
}

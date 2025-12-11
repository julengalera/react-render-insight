import type { ComponentId, DiffResult, RenderReason } from '../tracking/eventTypes';

export interface RenderEvent {
    id: string;
    timestamp: number;
    componentId: ComponentId;
    renderIndexForComponent: number;
    reason: RenderReason;
    propsBefore?: Record<string, unknown>;
    propsAfter: Record<string, unknown>;
    diff?: DiffResult;
}

export interface ComponentStats {
    componentId: ComponentId;
    totalRenders: number;
    firstRenderAt: number;
    lastRenderAt: number;
}

export interface GlobalStats {
    totalRenders: number;
    totalComponents: number;
    topComponentsByRenders: ComponentStats[];
}

export interface TimelinePoint {
    eventId: string;
    timestamp: number;
    componentId: ComponentId;
    renderIndexForComponent: number;
}

export interface RenderInsightState {
    eventsById: Record<string, RenderEvent>;
    eventsByComponentId: Record<string, string[]>;
    allEventIds: string[];
    componentStatsById: Record<string, ComponentStats>;
    globalStats: GlobalStats;
}

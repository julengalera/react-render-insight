import { useMemo, useState } from 'react';
import { useRenderInsight } from '../../react-adapter';
import type { ComponentId, RenderEvent } from '../../core';

import { PanelLayout } from './layout/PanelLayout';
import { ComponentTree } from './tree/ComponentTree';
import { RenderDetailsPanel } from './details/RenderDetailsPanel';
import { Timeline } from './timeline/Timeline';
import { StatsSummary } from './StatsSummary';

function componentIdToKey(id: ComponentId): string {
    return [id.displayName, id.path ?? '', id.instanceId ?? '']
        .filter(Boolean)
        .join('::');
}

export function RenderInsightPanel() {
    const { state, selectors, actions } = useRenderInsight();

    const timeline = selectors.getTimeline();
    const globalStats = selectors.getGlobalStats();
    const top = selectors.getTopComponentsByRenders(8);

    const [selectedComponent, setSelectedComponent] = useState<ComponentId | null>(null);
    const [selectedEventId, setSelectedEventId] = useState<string | null>(null);

    const selectedEvents: RenderEvent[] = useMemo(() => {
        if (!selectedComponent) return [];
        return selectors.getComponentEvents(selectedComponent);
    }, [selectors, selectedComponent]);

    const selectedEvent = useMemo(() => {
        if (!selectedEventId) return undefined;
        return state.eventsById[selectedEventId];
    }, [state.eventsById, selectedEventId]);

    const treeNodes = useMemo(() => {
        return Object.values(state.componentStatsById).map((s) => ({
        id: s.componentId,
        key: componentIdToKey(s.componentId),
        label: s.componentId.displayName,
        path: s.componentId.path,
        renders: s.totalRenders,
        }));
    }, [state.componentStatsById]);

    return (
        <PanelLayout
            header={{
                title: 'Render Insight',
                subtitle: `Total renders: ${globalStats.totalRenders} · Components: ${globalStats.totalComponents}`,
                onReset: actions.reset,
            }}
            left={
                <ComponentTree
                    nodes={treeNodes}
                    selectedKey={selectedComponent ? componentIdToKey(selectedComponent) : undefined}
                    onSelect={(id) => {
                        setSelectedComponent(id);
                        setSelectedEventId(null);
                    }}
                />
            }
            center={
                <Timeline
                    points={timeline}
                    onSelectEvent={(eventId) => {
                        const e = state.eventsById[eventId];
                        if (e) {
                        setSelectedComponent(e.componentId);
                        setSelectedEventId(eventId);
                        }
                    }}
                />
            }
            right={
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                    <StatsSummary
                        totalRenders={globalStats.totalRenders}
                        totalComponents={globalStats.totalComponents}
                        topComponents={top}
                        onPickComponent={(id) => {
                        setSelectedComponent(id);
                        setSelectedEventId(null);
                        }}
                    />

                    <RenderDetailsPanel
                        componentId={selectedComponent ?? undefined}
                        events={selectedEvents}
                        selectedEventId={selectedEventId ?? undefined}
                        onSelectEvent={(id) => setSelectedEventId(id)}
                        selectedEvent={selectedEvent}
                    />
                </div>
            }
        />
    );
}
import { useMemo, useState } from 'react';
import { useRenderInsight } from '../../react-adapter';
import type { ComponentId, RenderEvent } from '../../core';
import { ControlsBar, type ControlsState } from './ControlsBar';

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

    const globalStats = selectors.getGlobalStats();
    const top = selectors.getTopComponentsByRenders(8);

    const [selectedComponent, setSelectedComponent] = useState<ComponentId | null>(null);
    const [selectedEventId, setSelectedEventId] = useState<string | null>(null);

    const [controls, setControls] = useState<ControlsState>({
        search: '',
        reason: 'all',
        timelineLimit: 200,
    });

    const selectedEvents: RenderEvent[] = useMemo(() => {
        if (!selectedComponent) return [];
        return selectors.getComponentEvents(selectedComponent);
    }, [selectors, selectedComponent]);

    const selectedEvent = useMemo(() => {
        if (!selectedEventId) return undefined;
        return state.eventsById[selectedEventId];
    }, [state.eventsById, selectedEventId]);

    const timelineRaw = selectors.getTimeline();

    const timeline = useMemo(() => {
        const sliced = timelineRaw.slice(-controls.timelineLimit);
        if (controls.reason === 'all') return sliced;

        return sliced.filter((p) => {
            const e = state.eventsById[p.eventId];
            return e?.reason === controls.reason;
        });
    }, [timelineRaw, controls.timelineLimit, controls.reason, state.eventsById]);

    const treeNodes = useMemo(() => {
        const q = controls.search.trim().toLowerCase();

        return Object.values(state.componentStatsById)
            .map((s) => ({
                id: s.componentId,
                key: componentIdToKey(s.componentId),
                label: s.componentId.displayName,
                path: s.componentId.path,
                renders: s.totalRenders,
            }))
            .filter((n) => {
                if (!q) return true;
                return (
                    n.label.toLowerCase().includes(q) ||
                    (n.path ?? '').toLowerCase().includes(q)
                );
            });
    }, [state.componentStatsById, controls.search]);

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
                    selectedKey={selectedComponent?.path ? `path::${selectedComponent.path}` : undefined}
                    onSelect={(id) => {
                        setSelectedComponent(id);
                        setSelectedEventId(null);
                    }}
                />
            }
            center={
                <Timeline
                    points={timeline}
                    getEventMeta={(id) => {
                        const e = state.eventsById[id];
                        const diff = e?.diff;
                        const diffCount = diff
                        ? diff.changed.length + diff.added.length + diff.removed.length
                        : undefined;
                        return { reason: e?.reason, diffCount };
                    }}
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
                    <div style={{ border: '1px solid #333', borderRadius: 8, padding: 10 }}>
                        <ControlsBar value={controls} onChange={setControls} />
                        <div style={{ marginTop: 10, display: 'flex', gap: 8 }}>
                            <button
                                onClick={() => {
                                    setSelectedComponent(null);
                                    setSelectedEventId(null);
                                }}
                                style={{ padding: '6px 10px', borderRadius: 6 }}
                            >
                                Clear selection
                            </button>
                        </div>
                    </div>
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
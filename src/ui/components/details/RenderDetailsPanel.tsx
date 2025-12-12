import React from 'react';
import type { ComponentId, RenderEvent } from '../../../core';

export interface RenderDetailsPanelProps {
    componentId?: ComponentId;
    events: RenderEvent[];
    selectedEventId?: string;
    onSelectEvent?: (eventId: string) => void;
    selectedEvent?: RenderEvent;
}

export function RenderDetailsPanel({
    componentId,
    events,
    selectedEventId,
    onSelectEvent,
    selectedEvent,
}: RenderDetailsPanelProps) {
    if (!componentId) {
        return (
            <div>
                <div style={{ fontWeight: 700, marginBottom: 8 }}>Details</div>
                <div style={{ opacity: 0.8, fontSize: 12 }}>Select a component from the panel.</div>
            </div>
        );
    }

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <div>
                <div style={{ fontWeight: 700 }}>Details</div>
                <div style={{ fontFamily: 'monospace', fontSize: 12, opacity: 0.8 }}>
                    {componentId.displayName} · {componentId.path ?? 'no-path'}
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                <div style={{ border: '1px solid #333', borderRadius: 8, padding: 10, overflow: 'auto', maxHeight: 320 }}>
                    <div style={{ fontWeight: 700, marginBottom: 8 }}>Renders</div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                        {events.slice(-100).map((e) => (
                        <button
                            key={e.id}
                            onClick={() => onSelectEvent?.(e.id)}
                            style={{
                            textAlign: 'left',
                            width: '100%',
                            padding: 8,
                            borderRadius: 8,
                            border: selectedEventId === e.id ? '2px solid #777' : '1px solid #333',
                            background: 'transparent',
                            cursor: 'pointer',
                            }}
                        >
                            <div style={{ display: 'flex', justifyContent: 'space-between', gap: 10 }}>
                                <div style={{ fontFamily: 'monospace', fontSize: 12 }}>
                                    #{e.renderIndexForComponent}
                                </div>
                                <div style={{ fontSize: 12, opacity: 0.8 }}>
                                    {new Date(e.timestamp).toLocaleTimeString()}
                                </div>
                            </div>
                            <div style={{ fontSize: 12, opacity: 0.85, marginTop: 4 }}>
                            reason: <span style={{ fontFamily: 'monospace' }}>{e.reason}</span>
                            </div>
                        </button>
                        ))}
                    </div>
                </div>

                <div style={{ border: '1px solid #333', borderRadius: 8, padding: 10, overflow: 'auto', maxHeight: 320 }}>
                    <div style={{ fontWeight: 700, marginBottom: 8 }}>Props diff</div>
                    {!selectedEvent ? (
                        <div style={{ fontSize: 12, opacity: 0.8 }}>Select a render to view the diff.</div>
                    ) : (
                        <DiffView event={selectedEvent} />
                    )}
                </div>
            </div>
        </div>
    );
}

function DiffView({ event }: { event: RenderEvent }) {
    const diff = event.diff;

    if (!diff) {
        return <div style={{ fontSize: 12, opacity: 0.8 }}>Diff disabled or unavailable.</div>;
    }

    const total = diff.changed.length + diff.added.length + diff.removed.length;

    return (
        <div style={{ fontFamily: 'monospace', fontSize: 12 }}>
            <div style={{ marginBottom: 8, opacity: 0.85 }}>
                mode: {diff.mode} · changes: {total} {diff.truncated ? '· truncated' : ''}
            </div>

            {diff.added.length > 0 ? (
                <Section title="added">
                {diff.added.map((a) => (
                    <Line key={`a-${a.key}`} k={a.key} before={undefined} after={a.value} />
                ))}
                </Section>
            ) : null}

            {diff.removed.length > 0 ? (
                <Section title="removed">
                {diff.removed.map((r) => (
                    <Line key={`r-${r.key}`} k={r.key} before={r.value} after={undefined} />
                ))}
                </Section>
            ) : null}

            {diff.changed.length > 0 ? (
                <Section title="changed">
                {diff.changed.map((c) => (
                    <Line key={`c-${c.key}`} k={c.key} before={c.before} after={c.after} />
                ))}
                </Section>
            ) : null}

            {total === 0 ? <div style={{ opacity: 0.8 }}>No changes detected.</div> : null}
        </div>
    );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
    return (
        <div style={{ marginBottom: 10 }}>
            <div style={{ fontWeight: 700, marginBottom: 6 }}>{title}</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>{children}</div>
        </div>
    );
}

function Line({ k, before, after }: { k: string; before: unknown; after: unknown }) {
    return (
        <div style={{ border: '1px solid #333', borderRadius: 8, padding: 8 }}>
            <div style={{ fontWeight: 700 }}>{k}</div>
            <div style={{ opacity: 0.85, marginTop: 4 }}>
                before: <Value v={before} />
            </div>
            <div style={{ opacity: 0.85, marginTop: 4 }}>
                after: <Value v={after} />
            </div>
        </div>
    );
}

function Value({ v }: { v: unknown }) {
    if (v === undefined) return <span style={{ opacity: 0.7 }}>undefined</span>;
    try {
        return <span>{JSON.stringify(v)}</span>;
    } catch {
        return <span>[unserializable]</span>;
    }
}

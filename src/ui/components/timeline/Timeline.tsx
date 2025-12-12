import type { TimelinePoint } from '../../../core';

export interface TimelineProps {
    points: TimelinePoint[];
    onSelectEvent?: (eventId: string) => void;
}

export function Timeline({ points, onSelectEvent }: TimelineProps) {
    return (
        <div>
            <div style={{ fontWeight: 700, marginBottom: 8 }}>Timeline</div>
            <div style={{ fontSize: 12, opacity: 0.8, marginBottom: 10 }}>
                (MVP: chronological list. Later we’ll build a graphical view.)
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                {points.slice(-200).map((p) => (
                <button
                    key={p.eventId}
                    onClick={() => onSelectEvent?.(p.eventId)}
                    style={{
                    textAlign: 'left',
                    width: '100%',
                    padding: 8,
                    borderRadius: 8,
                    border: '1px solid #333',
                    background: 'transparent',
                    cursor: 'pointer',
                    fontFamily: 'monospace',
                    fontSize: 12,
                    }}
                >
                    <div>
                        <strong>{p.componentId.displayName}</strong> #{p.renderIndexForComponent}
                    </div>
                    <div style={{ opacity: 0.75 }}>
                        {new Date(p.timestamp).toLocaleTimeString()} · {p.componentId.path ?? 'no-path'}
                    </div>
                </button>
                ))}
            </div>
        </div>
    );
}
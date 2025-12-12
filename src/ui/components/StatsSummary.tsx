import type { ComponentId, ComponentStats } from '../../core';

export interface StatsSummaryProps {
    totalRenders: number;
    totalComponents: number;
    topComponents: ComponentStats[];
    onPickComponent?: (id: ComponentId) => void;
}

export function StatsSummary({
    totalRenders,
    totalComponents,
    topComponents,
    onPickComponent,
}: StatsSummaryProps) {
    return (
        <div style={{ border: '1px solid #333', borderRadius: 8, padding: 10 }}>
            <div style={{ fontWeight: 700, marginBottom: 8 }}>Stats</div>

            <div style={{ display: 'flex', gap: 10, fontSize: 12, opacity: 0.85, marginBottom: 10 }}>
                <div>Total renders: <strong>{totalRenders}</strong></div>
                <div>Components: <strong>{totalComponents}</strong></div>
            </div>

            <div style={{ fontWeight: 700, marginBottom: 6, fontSize: 12 }}>Top components by renders</div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                {topComponents.map((c) => (
                <button
                    key={[c.componentId.displayName, c.componentId.path ?? '', c.componentId.instanceId ?? ''].join('::')}
                    onClick={() => onPickComponent?.(c.componentId)}
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
                    <div style={{ display: 'flex', justifyContent: 'space-between', gap: 10 }}>
                        <div>{c.componentId.displayName}</div>
                        <div style={{ opacity: 0.85 }}>{c.totalRenders}</div>
                    </div>
                    {c.componentId.path ? <div style={{ opacity: 0.7 }}>{c.componentId.path}</div> : null}
                </button>
                ))}
                {topComponents.length === 0 ? <div style={{ fontSize: 12, opacity: 0.8 }}>No data yet.</div> : null}
            </div>
        </div>
    );
}

import type { RenderReason } from '../../core';

export interface ControlsState {
    search: string;
    reason: RenderReason | 'all';
    timelineLimit: number;
}

export interface ControlsBarProps {
    value: ControlsState;
    onChange: (next: ControlsState) => void;
}

export function ControlsBar({ value, onChange }: ControlsBarProps) {
    return (
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'center' }}>
            <label style={{ display: 'flex', flexDirection: 'column', gap: 4, fontSize: 12, opacity: 0.9 }}>
                Search
                <input
                    value={value.search}
                    onChange={(e) => onChange({ ...value, search: e.target.value })}
                    placeholder="Component name / path..."
                    style={{ padding: '6px 8px', borderRadius: 6, border: '1px solid #333', minWidth: 220 }}
                />
            </label>

            <label style={{ display: 'flex', flexDirection: 'column', gap: 4, fontSize: 12, opacity: 0.9 }}>
                Reason
                <select
                    value={value.reason}
                    onChange={(e) => onChange({ ...value, reason: e.target.value as any })}
                    style={{ padding: '6px 8px', borderRadius: 6, border: '1px solid #333', minWidth: 180 }}
                >
                <option value="all">all</option>
                <option value="props-change">props-change</option>
                <option value="state-change">state-change</option>
                <option value="context-change">context-change</option>
                <option value="parent-rerender">parent-rerender</option>
                <option value="unknown">unknown</option>
                </select>
            </label>

            <label style={{ display: 'flex', flexDirection: 'column', gap: 4, fontSize: 12, opacity: 0.9 }}>
                Timeline limit
                <input
                    type="number"
                    min={10}
                    max={5000}
                    value={value.timelineLimit}
                    onChange={(e) => onChange({ ...value, timelineLimit: Number(e.target.value || 200) })}
                    style={{ padding: '6px 8px', borderRadius: 6, border: '1px solid #333', width: 140 }}
                />
            </label>
        </div>
    );
}

export interface TreeNodeProps {
    label: string;
    subtitle?: string;
    renders: number;
    heat: number; // 0..4
    selected?: boolean;
    onClick: () => void;
}

function heatDot(heat: number): string {
    return '•'.repeat(Math.max(1, heat + 1));
}

export function TreeNode({ label, subtitle, renders, heat, selected, onClick }: TreeNodeProps) {
    return (
        <button
            onClick={onClick}
            style={{
                textAlign: 'left',
                width: '100%',
                padding: 10,
                borderRadius: 8,
                border: selected ? '2px solid #777' : '1px solid #333',
                background: 'transparent',
                cursor: 'pointer',
            }}
            >
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: 10 }}>
                <div style={{ fontWeight: 700 }}>{label}</div>
                <div style={{ fontFamily: 'monospace', fontSize: 12, opacity: 0.9 }}>
                    {heatDot(heat)} {renders}
                </div>
            </div>
            {subtitle ? <div style={{ fontSize: 12, opacity: 0.7, marginTop: 4 }}>{subtitle}</div> : null}
        </button>
    );
}
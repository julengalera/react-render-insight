import { useMemo } from 'react';
import type { ComponentId } from '../../../core';
import { TreeNode } from './TreeNode';

export interface ComponentTreeNodeVM {
    id: ComponentId;
    key: string;
    label: string;
    path?: string;
    renders: number;
}

export interface ComponentTreeProps {
    nodes: ComponentTreeNodeVM[];
    selectedKey?: string;
    onSelect: (id: ComponentId) => void;
}

function heatLevel(renders: number): number {
    if (renders >= 50) return 4;
    if (renders >= 20) return 3;
    if (renders >= 10) return 2;
    if (renders >= 3) return 1;
    return 0;
}

export function ComponentTree({ nodes, selectedKey, onSelect }: ComponentTreeProps) {
    const sorted = useMemo(() => {
        return [...nodes].sort((a, b) => b.renders - a.renders);
    }, [nodes]);

    return (
        <div>
            <div style={{ fontWeight: 700, marginBottom: 8 }}>Components</div>
            <div style={{ fontSize: 12, opacity: 0.8, marginBottom: 10 }}>
                (MVP: list ordered by renders. The real tree will come when build path → tree.)
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                {sorted.map((n) => (
                <TreeNode
                    key={n.key}
                    label={n.label}
                    subtitle={n.path}
                    renders={n.renders}
                    heat={heatLevel(n.renders)}
                    selected={selectedKey === n.key}
                    onClick={() => onSelect(n.id)}
                />
                ))}
            </div>
        </div>
    );
}

import { useMemo, useState } from 'react';
import type { ComponentId } from '../../../core';
import { TreeNode } from './TreeNode';
import type { FlatComponentNode, TreeNodeVM } from './buildTree';
import { buildComponentTree } from './buildTree';

export interface ComponentTreeProps {
    nodes: FlatComponentNode[];
    selectedKey?: string;
    onSelect: (id: ComponentId) => void;
}

function heatLevel(renders: number): number {
    if (renders >= 200) return 4;
    if (renders >= 80) return 3;
    if (renders >= 20) return 2;
    if (renders >= 5) return 1;
    return 0;
}

export function ComponentTree({ nodes, selectedKey, onSelect }: ComponentTreeProps) {
    const tree = useMemo(() => buildComponentTree(nodes), [nodes]);

    const [collapsed, setCollapsed] = useState<Record<string, boolean>>({});

    const toggle = (key: string) => {
        setCollapsed((prev) => ({ ...prev, [key]: !prev[key] }));
    };

    const renderNode = (n: TreeNodeVM, depth: number) => {
        const isCollapsed = !!collapsed[n.key];
        const hasChildren = n.children.length > 0;

        return (
            <div key={n.key}>
                <TreeNode
                    label={n.label}
                    subtitle={n.componentId?.path}
                    renders={n.renders}
                    heat={heatLevel(n.renders)}
                    selected={selectedKey === n.key}
                    depth={depth}
                    collapsible={hasChildren}
                    collapsed={isCollapsed}
                    onToggle={() => toggle(n.key)}
                    onClick={() => {
                        if (n.componentId) onSelect(n.componentId);
                        else toggle(n.key);
                    }}
                />
                {!isCollapsed && hasChildren ? (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                        {n.children.map((c) => renderNode(c, depth + 1))}
                    </div>
                ) : null}
            </div>
        );
    };

    return (
        <div>
            <div style={{ fontWeight: 700, marginBottom: 8 }}>Component Tree</div>
            <div style={{ fontSize: 12, opacity: 0.8, marginBottom: 10 }}>
                (Tree derived from <code>path</code>. Click on intermediate nodes to collapse/expand.)
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                {tree.length === 0 ? (
                    <div style={{ fontSize: 12, opacity: 0.8 }}>No data yet.</div>
                ) : (
                    tree.map((n) => renderNode(n, 0))
                )}
            </div>
        </div>
    );
}
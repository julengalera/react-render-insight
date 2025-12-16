import type { ComponentId } from '../../../core';

export interface FlatComponentNode {
    id: ComponentId;
    key: string;
    label: string;
    path?: string;
    renders: number;
}

export interface TreeNodeVM {
    key: string;
    label: string;
    renders: number;
    children: TreeNodeVM[];
    componentId?: ComponentId;
}

function normalizePath(path?: string): string[] {
    if (!path) return [];
    return path
        .split('>')
        .map((s) => s.trim())
        .filter(Boolean);
}

/** 
function mergeRenders(parent: TreeNodeVM, child: TreeNodeVM) {
    parent.renders += child.renders;
}
*/

export function buildComponentTree(nodes: FlatComponentNode[]): TreeNodeVM[] {
    const root: Record<string, TreeNodeVM> = {};

    /*
    const getOrCreate = (
        map: Record<string, TreeNodeVM>,
        key: string,
        label: string,
    ): TreeNodeVM => {
        if (!map[key]) {
            map[key] = { key, label, renders: 0, children: [] };
        }
        return map[key];
    }; */

    const index = new Map<string, TreeNodeVM>();

    const attachChild = (parent: TreeNodeVM, child: TreeNodeVM) => {
        const exists = parent.children.some((c) => c.key === child.key);
        if (!exists) parent.children.push(child);
    };

    for (const n of nodes) {
        const parts = normalizePath(n.path);
        const effectiveParts = parts.length ? parts : ['(no-path)'];

        let currentParent: TreeNodeVM | null = null;
        let currentKeyPrefix = '';

        for (let i = 0; i < effectiveParts.length; i++) {
            const part = effectiveParts[i];
            currentKeyPrefix = currentKeyPrefix ? `${currentKeyPrefix} > ${part}` : part;
            const nodeKey = `path::${currentKeyPrefix}`;

            let current = index.get(nodeKey);
            if (!current) {
                current = { key: nodeKey, label: part, renders: 0, children: [] };
                index.set(nodeKey, current);

                if (i === 0) {
                    root[nodeKey] = current;
                } else if (currentParent) {
                    attachChild(currentParent, current);
                }
            }

            currentParent = current;
        }

        const leafKey = `path::${currentKeyPrefix}`;
        const leaf = index.get(leafKey);

        if (leaf) {
            leaf.componentId = n.id;
            leaf.renders = Math.max(leaf.renders, n.renders);
        }
    }

    const post = (node: TreeNodeVM): number => {
        let total = node.renders;
        for (const child of node.children) {
            total += post(child);
        }
        node.renders = total;
        node.children.sort((a, b) => b.renders - a.renders);
        return total;
    };

    const roots = Object.values(root);
    for (const r of roots) post(r);
    roots.sort((a, b) => b.renders - a.renders);

    return roots;
}
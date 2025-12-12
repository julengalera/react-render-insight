// RenderInsightProvider.tsx: System “plug”
//
// This file wires everything together:
// - creates a stable store instance
// - normalizes config (defaults + user overrides)
// - provides both via contexts
import React, { useMemo, useRef } from 'react';
import { createRenderInsightStore, type RenderInsightStore } from '../../core';
import { RenderInsightStoreContext, RenderInsightConfigContext, type RenderInsightConfig } from '../context/RenderInsightContext';

export interface RenderInsightProviderProps {
    config?: RenderInsightConfig;
    children: React.ReactNode;
}

const defaultConfig: RenderInsightConfig = {
    enabled: true,
    diffMode: 'shallow',
    maxChanges: 100,
    maxDiffDepth: 3,
};

export function RenderInsightProvider({
    config,
    children,
}: RenderInsightProviderProps) {
    const storeRef = useRef<RenderInsightStore | null>(null);

    if (!storeRef.current) {
        storeRef.current = createRenderInsightStore();
    }

    const valueConfig = useMemo<RenderInsightConfig>(() => {
        return {
        ...defaultConfig,
        ...config,
        };
    }, [config]);

    return (
        <RenderInsightStoreContext.Provider value={storeRef.current}>
            <RenderInsightConfigContext.Provider value={valueConfig}>
                {children}
            </RenderInsightConfigContext.Provider>
        </RenderInsightStoreContext.Provider>
    );
}
import React from 'react';
import type { RenderInsightStore } from '../../core';
import type { DiffMode } from '../../core';

export interface RenderInsightConfig {
    enabled?: boolean;
    diffMode?: DiffMode;
    maxChanges?: number;
    maxDiffDepth?: number;
}

// RenderInsightStoreContext
//
// Holds the live store instance.
export const RenderInsightStoreContext =
    React.createContext<RenderInsightStore | null>(null);

// RenderInsightConfigContext
//
// Holds the (mostly static) tracking configuration.
export const RenderInsightConfigContext =
    React.createContext<RenderInsightConfig | undefined>(undefined);

// Why two contexts (the real reason)
//
// The store updates frequently (every tracked render can notify).
// The config should change rarely (ideally never).
//
// If you put { store, config } into one context value,
// every store update would trigger re-renders in *all* config consumers,
// even if they only care about config.
// Splitting contexts avoids unnecessary re-renders.
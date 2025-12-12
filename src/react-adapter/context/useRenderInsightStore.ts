// useRenderInsightStore.ts: Store accessor hook
//
// Provides a hook that reads the store from context and throws
// error when used outside the Provider
import { useContext } from 'react';
import { RenderInsightStoreContext } from './RenderInsightContext';
import type { RenderInsightStore } from '../../core';

export function useRenderInsightStore(): RenderInsightStore {
    const store = useContext(RenderInsightStoreContext);

    if (!store) {
        throw new Error(
        '[react-render-insight] useRenderInsightStore must be used within a <RenderInsightProvider>',
        );
    }

    return store;
}

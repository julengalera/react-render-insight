// useRenderTracker.ts: Component instrumentation hook
//
// This hook is the core adapter piece used inside instrumented components.
import { useContext, useEffect, useRef } from 'react';
import { trackRender, type ComponentId, type RenderReason, type TrackingOptions, type RenderTrackerInput } from '../../core';
import { RenderInsightConfigContext } from '../context/RenderInsightContext';
import { useRenderInsightStore } from '../context/useRenderInsightStore';

export interface ComponentMeta extends ComponentId {}

export function useRenderTracker(
    meta: ComponentMeta,
    props: Record<string, unknown>,
    reasonHint?: RenderReason,
    consumeStateChangeFlag?: () => boolean,
): void {
    const store = useRenderInsightStore();
    const config = useContext(RenderInsightConfigContext);

    const prevPropsRef = useRef<Record<string, unknown> | undefined>(undefined);
    const renderIndexRef = useRef(0);

    useEffect(() => {
        const hasStateChange = consumeStateChangeFlag?.() ?? false;

        const effectiveReasonHint: RenderReason | undefined =
            hasStateChange ? 'state-change' : reasonHint;

        const effectiveConfig = config ?? { enabled: true, diffMode: 'shallow' as const };

        if (effectiveConfig.enabled === false) {
            prevPropsRef.current = props;
            return;
        }

        renderIndexRef.current += 1;

        const input: RenderTrackerInput = {
            componentId: {
                displayName: meta.displayName,
                path: meta.path,
                instanceId: meta.instanceId,
            },
            prevProps: prevPropsRef.current,
            nextProps: props,
            renderIndexForComponent: renderIndexRef.current,
            reasonHint: effectiveReasonHint
        };

        const options: TrackingOptions = {
            enabled: effectiveConfig.enabled ?? true,
            diffMode: effectiveConfig.diffMode ?? 'shallow',
            maxChanges: effectiveConfig.maxChanges,
            maxDiffDepth: effectiveConfig.maxDiffDepth,
        };

        const { event } = trackRender(input, options);

        store.addEvent(event);

        prevPropsRef.current = props;
    }, [config, meta.displayName, meta.path, meta.instanceId, props, reasonHint, store]);
}
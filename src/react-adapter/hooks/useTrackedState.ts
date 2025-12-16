// useTrackedState.ts: Component instrumentation hook
//
// This hook is a state hook variant that works with useRenderTracker to track state changes as render reasons.
import { useCallback, useRef, useState } from 'react';
import type { ComponentMeta } from './useRenderTracker';

type SetStateAction<S> = S | ((prev: S) => S);

export function useTrackedState<S>(
    _meta: ComponentMeta,
    initial: S | (() => S),
): [S, (action: SetStateAction<S>) => void, () => boolean] {
    const [state, setState] = useState<S>(initial as any);

    const pendingStateChangeRef = useRef(false);

    const setTrackedState = useCallback((action: SetStateAction<S>) => {
        pendingStateChangeRef.current = true;
        setState(action as any);
    }, []);

    const consumeStateChangeFlag = useCallback(() => {
        const v = pendingStateChangeRef.current;
        pendingStateChangeRef.current = false;
        return v;
    }, []);

    return [state, setTrackedState, consumeStateChangeFlag];
}
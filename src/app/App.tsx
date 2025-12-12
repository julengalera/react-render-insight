import { useMemo, useState } from 'react';
import { RenderInsightProvider, RenderInsightPanel, useRenderTracker } from '../index';

function CounterCard() {
    const [count, setCount] = useState(0);

    useRenderTracker(
        { displayName: 'CounterCard', path: 'Playground > CounterCard' },
        { count }
    );

    return (
        <div style={{ border: '1px solid #333', borderRadius: 8, padding: 12 }}>
            <div style={{ fontWeight: 700 }}>CounterCard</div>
            <div style={{ marginTop: 8 }}>count: {count}</div>
            <button style={{ marginTop: 10 }} onClick={() => setCount((c) => c + 1)}>
                increment
            </button>
        </div>
    );
}

function PropsNoise({ n }: { n: number }) {
    const inlineFn = () => n + 1;

    useRenderTracker(
        { displayName: 'PropsNoise', path: 'Playground > PropsNoise' },
        { n, inlineFn }
    );

    return (
        <div style={{ border: '1px solid #333', borderRadius: 8, padding: 12 }}>
            <div style={{ fontWeight: 700 }}>PropsNoise</div>
            <div style={{ marginTop: 8 }}>n: {n}</div>
        </div>
    );
}

export default function App() {
    const [n, setN] = useState(0);

    const stableObj = useMemo(() => ({ tag: 'stable' }), []);

    return (
        <RenderInsightProvider config={{ enabled: true, diffMode: 'shallow', maxChanges: 50 }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 520px', gap: 12, padding: 12, height: '100vh' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                    <div style={{ border: '1px solid #333', borderRadius: 8, padding: 12 }}>
                        <div style={{ fontWeight: 700 }}>Playground</div>
                        <div style={{ marginTop: 8, opacity: 0.85 }}>
                            Press buttons and watch events appear in the panel.
                        </div>

                        <button style={{ marginTop: 10 }} onClick={() => setN((x) => x + 1)}>
                            bump n
                        </button>
                    </div>

                    <CounterCard />
                    <PropsNoise n={n} />

                    <div style={{ border: '1px solid #333', borderRadius: 8, padding: 12 }}>
                        <div style={{ fontWeight: 700 }}>Stable props demo</div>
                        <StablePropsBox obj={stableObj} />
                    </div>
                </div>

                <RenderInsightPanel />
            </div>
        </RenderInsightProvider>
    );
}

function StablePropsBox({ obj }: { obj: { tag: string } }) {
    useRenderTracker(
        { displayName: 'StablePropsBox', path: 'Playground > StablePropsBox' },
        { obj }
    );

    return (
        <div style={{ marginTop: 8, fontFamily: 'monospace', fontSize: 12 }}>
            obj.tag: {obj.tag}
        </div>
    );
}
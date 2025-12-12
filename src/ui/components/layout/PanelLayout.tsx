import React from 'react';

export interface PanelLayoutHeader {
    title: string;
    subtitle?: string;
    onReset?: () => void;
}

export interface PanelLayoutProps {
    header: PanelLayoutHeader;
    left: React.ReactNode;
    center: React.ReactNode;
    right: React.ReactNode;
}

export function PanelLayout({ header, left, center, right }: PanelLayoutProps) {
    return (
        <div style={{ display: 'flex', flexDirection: 'column', height: '100%', border: '1px solid #333', borderRadius: 8 }}>
            <div style={{ padding: 12, borderBottom: '1px solid #333', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
                <div>
                    <div style={{ fontWeight: 700 }}>{header.title}</div>
                    {header.subtitle ? <div style={{ opacity: 0.8, fontSize: 12 }}>{header.subtitle}</div> : null}
                </div>
                {header.onReset ? (
                <button onClick={header.onReset} style={{ padding: '6px 10px', borderRadius: 6 }}>
                    Reset
                </button>
                ) : null}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '320px 1fr 420px', gap: 12, padding: 12, height: '100%', overflow: 'hidden' }}>
                <div style={{ overflow: 'auto', border: '1px solid #333', borderRadius: 8, padding: 10 }}>
                    {left}
                </div>
                <div style={{ overflow: 'auto', border: '1px solid #333', borderRadius: 8, padding: 10 }}>
                    {center}
                </div>
                <div style={{ overflow: 'auto', border: '1px solid #333', borderRadius: 8, padding: 10 }}>
                    {right}
                </div>
            </div>
        </div>
    );
}
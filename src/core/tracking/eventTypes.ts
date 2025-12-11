export type RenderReason = 'props-change' | 'state-change' | 'context-change' | 'parent-rerender' | 'unknown';

export type DiffMode = 'none' | 'shallow' | 'deep';

export type ComponentPath = string; 

export interface ComponentId {
  displayName: string;
  path?: ComponentPath;
  instanceId?: string;
}

export interface PropChange {
  key: string;
  before: unknown;
  after: unknown;
}

export interface PropAdded {
  key: string;
  value: unknown;
}

export interface PropRemoved {
  key: string;
  value: unknown;
}

export interface DiffResult {
  mode: DiffMode;
  changed: PropChange[];
  added: PropAdded[];
  removed: PropRemoved[];
  truncated?: boolean;
}

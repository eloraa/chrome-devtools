type Listener<T extends unknown[]> = (...args: T) => void;

interface EventMap {
  [event: string]: unknown[];
}

export class EventEmitter<T extends EventMap> {
  private readonly events: { [K in keyof T]?: Listener<T[K]>[] } = {};
  private wildcardEvents: string[] = [];

  private recalcWildcardEvents(): void {
    this.wildcardEvents = Object.keys(this.events).filter(event => event.endsWith('*') && this.events[event as keyof T] !== undefined && this.events[event as keyof T]!.length > 0);
  }

  public on<K extends keyof T>(event: K, listener: Listener<T[K]>): () => void {
    if (!this.events[event]) {
      this.events[event] = [];
    }

    this.events[event]!.push(listener);
    this.recalcWildcardEvents();
    return () => this.removeListener(event, listener);
  }

  public removeListener<K extends keyof T>(event: K, listener: Listener<T[K]>): void {
    if (!this.events[event]) {
      return;
    }

    const idx: number = this.events[event]!.indexOf(listener);
    if (idx > -1) {
      this.events[event]!.splice(idx, 1);
    }
    this.recalcWildcardEvents();
  }

  public removeAllListeners(): void {
    Object.keys(this.events).forEach(event => {
      if (this.events[event as keyof T]) {
        this.events[event as keyof T]!.length = 0;
      }
    });
    this.recalcWildcardEvents();
  }

  public emit<K extends keyof T>(event: K, ...args: T[K]): void {
    if (this.events[event]) {
      [...this.events[event]!].forEach(listener => listener(...args));
    }

    if (event !== ('*' as K)) {
      this.emit('*' as K, ...(args as T[K]));
    }

    for (const wcEvent of this.wildcardEvents) {
      const wcPrefix = wcEvent.endsWith('.*') ? wcEvent.slice(0, -2) : wcEvent.slice(0, -1);
      if (typeof event === 'string' && !event.endsWith('*') && event !== wcPrefix && event.startsWith(wcPrefix)) {
        this.emit(wcEvent as K, ...([event, ...args] as unknown[] as T[K]));
      }
    }
  }

  public once<K extends keyof T>(event: K, listener: Listener<T[K]>): () => void {
    const remove: () => void = this.on(event, (...args: T[K]) => {
      remove();
      listener(...args);
      this.recalcWildcardEvents();
    });

    return remove;
  }
}

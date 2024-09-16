export type LogType = 'log' | 'error' | 'warn' | 'info' | 'debug' | 'trace';

export interface StackTrace {
  callFrames: {
    functionName: string;
    lineNumber: number;
    columnNumber?: number;
    url?: string;
  }[];
}

export interface ConsoleLogParams {
  type: LogType;
  args: LogArgument[];
  stackTrace?: StackTrace;
  timestamp: number;
}

export interface LogArgument {
  type: string;
  subtype?: string;
  description?: string;
  className?: string;
  value?: unknown;
}

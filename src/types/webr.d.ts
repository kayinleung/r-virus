declare module '@r-wasm/webr' {
  // TODO: JFisher - adjust 'unknown' once you know the type
  export class WebR {
    constructor({ baseUrl }: { baseUrl: string });
    init(): Promise<void>;
    evalR(code: string): Promise<unknown>;
    captureR(
      code: string,
      callback: (event: {
        type: 'stdout' | 'stderr' | 'result';
        data: unknown; // 'any' for result, string for stdout/stderr
      }) => void
    ): void;
    close(): void;
  }
}
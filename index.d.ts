declare namespace WinterMode {
  interface WinterModeOptions {
    /** Falling flakes on a 1440x900 screen, scaled to the viewport. Default 140. */
    flakes?: number;
    /** Fall speed multiplier. Default 1. */
    speed?: number;
    /** Base horizontal drift; negative blows left. Default 0.25. */
    wind?: number;
    /** Smallest flake radius in px. Default 0.8. */
    minSize?: number;
    /** Largest flake radius in px. Default 4. */
    maxSize?: number;
    /** Draw some big flakes as six-armed crystals. Default true. */
    crystals?: boolean;
    /** Let snow pile up on text and surfaces. Default true. */
    stick?: boolean;
    /** How quickly snow builds up on text. Default 1. */
    stickSpeed?: number;
    /** Max height in px of the snow on big headlines; smaller text gets less. Default 10. */
    maxPile?: number;
    /** CSS selector of non-text elements snow settles on. */
    surfaces?: string;
    /** Snow drift along the bottom of the screen. Default true. */
    ground?: boolean;
    /** Max height in px of the ground drift. Default 22. */
    groundMax?: number;
    /** Icy glow on the page text. Default true. */
    frost?: boolean;
    /** Frosty vignette around the edges of the screen. Default true. */
    tint?: boolean;
    /** Hovering a snowy word knocks the snow off. Default true. */
    shake?: boolean;
    /** z-index of the snow layer. */
    zIndex?: number;
    /** Cap on words tracked at once. Default 1500. */
    maxWords?: number;
    /** What to do when the visitor prefers reduced motion. Default 'reduce'. */
    reducedMotion?: 'reduce' | 'ignore' | 'off';
  }

  interface WinterModeApi {
    readonly version: string;
    readonly defaults: Required<WinterModeOptions>;
    start(options?: WinterModeOptions): WinterModeApi;
    stop(): WinterModeApi;
    toggle(options?: WinterModeOptions): WinterModeApi;
    /** Removes all the snow that has settled on the page. */
    clear(): WinterModeApi;
    isRunning(): boolean;
    autoStart(dataset?: Record<string, string | undefined>): WinterModeApi;
  }
}

declare const WinterMode: WinterMode.WinterModeApi & { default: WinterMode.WinterModeApi };
export = WinterMode;

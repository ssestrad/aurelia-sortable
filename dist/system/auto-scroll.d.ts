import { ScrollData } from './utils';
export declare class AutoScroll {
    private rAFId;
    private active;
    activate({scrollElement, scrollDirection, scrollFrames, scrollSpeed}: ScrollData): void;
    deactivate(): void;
}

import * as tslib_1 from "tslib";
import { transient } from 'aurelia-dependency-injection';
let AutoScroll = class AutoScroll {
    constructor() {
        this.rAFId = -1;
        this.active = false;
    }
    activate({ scrollElement, scrollDirection, scrollFrames, scrollSpeed }) {
        if (this.active) {
            if (scrollDirection.x === 0 && scrollDirection.y === 0) {
                window.cancelAnimationFrame(this.rAFId);
                this.active = false;
            }
            return;
        }
        if (scrollDirection.x === 0 && scrollDirection.y === 0) {
            return;
        }
        if (scrollFrames.x === 0 && scrollFrames.y === 0) {
            return;
        }
        const scrollDeltaX = scrollDirection.x * scrollSpeed;
        const scrollDeltaY = scrollDirection.y * scrollSpeed;
        const autoScroll = () => {
            if (!this.active) {
                return;
            }
            if (Math.abs(scrollFrames.x) > 0) {
                scrollElement.scrollLeft += scrollDeltaX;
            }
            if (Math.abs(scrollFrames.y) > 0) {
                scrollElement.scrollTop += scrollDeltaY;
            }
            --scrollFrames.x;
            --scrollFrames.y;
            if (scrollFrames.x <= 0 && scrollFrames.y <= 0) {
                this.active = false;
                return;
            }
            this.rAFId = window.requestAnimationFrame(autoScroll);
        };
        this.active = true;
        autoScroll();
    }
    deactivate() {
        window.cancelAnimationFrame(this.rAFId);
        this.active = false;
    }
};
AutoScroll = tslib_1.__decorate([
    transient()
], AutoScroll);
export { AutoScroll };
//# sourceMappingURL=auto-scroll.js.map
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var aurelia_dependency_injection_1 = require("aurelia-dependency-injection");
var AutoScroll = (function () {
    function AutoScroll() {
        this.rAFId = -1;
        this.active = false;
    }
    AutoScroll.prototype.activate = function (_a) {
        var _this = this;
        var scrollElement = _a.scrollElement, scrollDirection = _a.scrollDirection, scrollFrames = _a.scrollFrames, scrollSpeed = _a.scrollSpeed;
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
        var scrollDeltaX = scrollDirection.x * scrollSpeed;
        var scrollDeltaY = scrollDirection.y * scrollSpeed;
        var autoScroll = function () {
            if (!_this.active) {
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
                _this.active = false;
                return;
            }
            _this.rAFId = window.requestAnimationFrame(autoScroll);
        };
        this.active = true;
        autoScroll();
    };
    AutoScroll.prototype.deactivate = function () {
        window.cancelAnimationFrame(this.rAFId);
        this.active = false;
    };
    return AutoScroll;
}());
AutoScroll = tslib_1.__decorate([
    aurelia_dependency_injection_1.transient()
], AutoScroll);
exports.AutoScroll = AutoScroll;
//# sourceMappingURL=auto-scroll.js.map
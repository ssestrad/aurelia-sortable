"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var aurelia_dependency_injection_1 = require("aurelia-dependency-injection");
var OptionalParent = OptionalParent_1 = (function () {
    function OptionalParent(key) {
        this.key = key;
    }
    OptionalParent.prototype.get = function (container) {
        if (container.parent && container.parent.hasResolver(this.key, true)) {
            return container.parent.get(this.key);
        }
        return null;
    };
    OptionalParent.of = function (key) {
        return new OptionalParent_1(key);
    };
    return OptionalParent;
}());
OptionalParent = OptionalParent_1 = tslib_1.__decorate([
    aurelia_dependency_injection_1.resolver()
], OptionalParent);
exports.OptionalParent = OptionalParent;
var OptionalParent_1;
//# sourceMappingURL=optional-parent.js.map
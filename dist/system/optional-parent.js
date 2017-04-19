System.register(["tslib", "aurelia-dependency-injection"], function (exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var tslib_1, aurelia_dependency_injection_1, OptionalParent, OptionalParent_1;
    return {
        setters: [
            function (tslib_1_1) {
                tslib_1 = tslib_1_1;
            },
            function (aurelia_dependency_injection_1_1) {
                aurelia_dependency_injection_1 = aurelia_dependency_injection_1_1;
            }
        ],
        execute: function () {
            OptionalParent = OptionalParent_1 = (function () {
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
            exports_1("OptionalParent", OptionalParent);
        }
    };
});
//# sourceMappingURL=optional-parent.js.map
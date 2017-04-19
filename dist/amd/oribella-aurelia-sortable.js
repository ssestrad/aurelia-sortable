define(["require", "exports", "aurelia-pal", "oribella", "./auto-scroll", "./optional-parent", "./sortable", "./utils"], function (require, exports, aurelia_pal_1, OA, AS, OP, S, U) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.OA = OA;
    exports.AS = AS;
    exports.OP = OP;
    exports.S = S;
    exports.U = U;
    function configure(config) {
        config.globalResources(aurelia_pal_1.PLATFORM.moduleName('./sortable'));
    }
    exports.configure = configure;
});
//# sourceMappingURL=oribella-aurelia-sortable.js.map
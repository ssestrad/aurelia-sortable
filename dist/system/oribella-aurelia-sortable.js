System.register(["aurelia-pal", "oribella", "./auto-scroll", "./optional-parent", "./sortable", "./utils"], function (exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    function configure(config) {
        config.globalResources(aurelia_pal_1.PLATFORM.moduleName('./sortable'));
    }
    exports_1("configure", configure);
    var aurelia_pal_1, OA, AS, OP, S, U;
    return {
        setters: [
            function (aurelia_pal_1_1) {
                aurelia_pal_1 = aurelia_pal_1_1;
            },
            function (OA_1) {
                OA = OA_1;
            },
            function (AS_1) {
                AS = AS_1;
            },
            function (OP_1) {
                OP = OP_1;
            },
            function (S_1) {
                S = S_1;
            },
            function (U_1) {
                U = U_1;
            }
        ],
        execute: function () {
            exports_1("OA", OA);
            exports_1("AS", AS);
            exports_1("OP", OP);
            exports_1("S", S);
            exports_1("U", U);
        }
    };
});
//# sourceMappingURL=oribella-aurelia-sortable.js.map
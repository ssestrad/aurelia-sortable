"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var aurelia_pal_1 = require("aurelia-pal");
var OA = require("oribella");
exports.OA = OA;
var AS = require("./auto-scroll");
exports.AS = AS;
var OP = require("./optional-parent");
exports.OP = OP;
var S = require("./sortable");
exports.S = S;
var U = require("./utils");
exports.U = U;
function configure(config) {
    config.globalResources(aurelia_pal_1.PLATFORM.moduleName('./sortable'));
}
exports.configure = configure;
//# sourceMappingURL=oribella-aurelia-sortable.js.map
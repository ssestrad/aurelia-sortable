import * as tslib_1 from "tslib";
import { resolver } from 'aurelia-dependency-injection';
let OptionalParent = OptionalParent_1 = class OptionalParent {
    constructor(key) {
        this.key = key;
    }
    get(container) {
        if (container.parent && container.parent.hasResolver(this.key, true)) {
            return container.parent.get(this.key);
        }
        return null;
    }
    static of(key) {
        return new OptionalParent_1(key);
    }
};
OptionalParent = OptionalParent_1 = tslib_1.__decorate([
    resolver()
], OptionalParent);
export { OptionalParent };
var OptionalParent_1;
//# sourceMappingURL=optional-parent.js.map
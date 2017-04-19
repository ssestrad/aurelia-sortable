define(["require", "exports", "tslib", "aurelia-pal", "aurelia-templating", "aurelia-templating-resources", "aurelia-dependency-injection", "oribella", "./optional-parent", "./utils", "./auto-scroll"], function (require, exports, tslib_1, aurelia_pal_1, aurelia_templating_1, aurelia_templating_resources_1, aurelia_dependency_injection_1, oribella_1, optional_parent_1, utils_1, auto_scroll_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.SORTABLE = 'oa-sortable';
    exports.SORTABLE_ATTR = "[" + exports.SORTABLE + "]";
    exports.SORTABLE_ITEM = 'oa-sortable-item';
    exports.SORTABLE_ITEM_ATTR = "[" + exports.SORTABLE_ITEM + "]";
    var Sortable = Sortable_1 = (function () {
        function Sortable(element, parentSortable, autoScroll) {
            var _this = this;
            this.element = element;
            this.parentSortable = parentSortable;
            this.autoScroll = autoScroll;
            this.items = [];
            this.scroll = 'document';
            this.scrollSpeed = 10;
            this.scrollSensitivity = 10;
            this.axis = utils_1.AxisFlag.XY;
            this.onStop = function () { };
            this.sortingClass = 'oa-sorting';
            this.dragClass = 'oa-drag';
            this.dragZIndex = 1;
            this.disallowedDragSelectors = ['INPUT', 'SELECT', 'TEXTAREA'];
            this.allowedDragSelector = '';
            this.allowedDragSelectors = [];
            this.allowDrag = function (_a) {
                var evt = _a.evt;
                var target = evt.target;
                if (_this.allowedDragSelector &&
                    !oribella_1.matchesSelector(target, _this.allowedDragSelector)) {
                    return false;
                }
                if (_this.allowedDragSelectors.length &&
                    _this.allowedDragSelectors.filter(function (selector) { return oribella_1.matchesSelector(target, selector); }).length === 0) {
                    return false;
                }
                if (_this.disallowedDragSelectors.filter(function (selector) { return oribella_1.matchesSelector(target, selector); }).length !== 0) {
                    return false;
                }
                if (target.isContentEditable) {
                    return false;
                }
                return true;
            };
            this.typeFlag = 1;
            this.dragClone = {
                parent: window.document.body,
                viewModel: null,
                element: null,
                offset: new oribella_1.Point(0, 0),
                position: new oribella_1.Point(0, 0),
                width: 0,
                height: 0,
                display: null
            };
            this.sortableDepth = -1;
            this.isDisabled = false;
            this.selector = exports.SORTABLE_ITEM_ATTR;
            this.downClientPoint = new oribella_1.Point(0, 0);
            this.currentClientPoint = new oribella_1.Point(0, 0);
            this.childSortables = [];
            this.sortableDepth = utils_1.utils.getSortableDepth(this);
        }
        Sortable.prototype.activate = function () {
            this.removeListener = oribella_1.oribella.on(oribella_1.Swipe, this.element, this);
            var _a = utils_1.utils.ensureScroll(this.scroll, this.element), scrollElement = _a.scrollElement, scrollListener = _a.scrollListener;
            this.scroll = scrollElement;
            this.scrollListener = scrollListener;
            this.scrollListener.addEventListener('scroll', this, false);
        };
        Sortable.prototype.deactivate = function () {
            this.removeListener();
            this.scrollListener.removeEventListener('scroll', this, false);
        };
        Sortable.prototype.handleEvent = function () {
            utils_1.utils.updateDragClone(this.dragClone, this.currentClientPoint, window, this.axis);
            this.tryMove(this.currentClientPoint, window);
        };
        Sortable.prototype.attached = function () {
            this.activate();
        };
        Sortable.prototype.detached = function () {
            this.deactivate();
        };
        Sortable.prototype.tryScroll = function (client) {
            var scrollElement = this.scroll;
            var scrollLeft = scrollElement.scrollLeft, scrollTop = scrollElement.scrollTop, scrollWidth = scrollElement.scrollWidth, scrollHeight = scrollElement.scrollHeight;
            var scrollSpeed = this.scrollSpeed;
            var scrollMaxPos = utils_1.utils.getScrollMaxPos(this.element, this.rootSortableRect, scrollElement, { scrollLeft: scrollLeft, scrollTop: scrollTop, scrollWidth: scrollWidth, scrollHeight: scrollHeight }, this.scrollRect, window);
            var scrollDirection = utils_1.utils.getScrollDirection(this.axis, this.scrollSensitivity, client, this.scrollRect);
            scrollMaxPos.x = scrollDirection.x === -1 ? 0 : scrollMaxPos.x;
            scrollMaxPos.y = scrollDirection.y === -1 ? 0 : scrollMaxPos.y;
            var scrollFrames = utils_1.utils.getScrollFrames(scrollDirection, scrollMaxPos, { scrollLeft: scrollLeft, scrollTop: scrollTop }, scrollSpeed);
            this.autoScroll.activate({ scrollElement: scrollElement, scrollDirection: scrollDirection, scrollFrames: scrollFrames, scrollSpeed: scrollSpeed });
        };
        Sortable.prototype.tryMove = function (point, scrollOffset) {
            if (utils_1.utils.canThrottle(this.lastElementFromPointRect, point, scrollOffset)) {
                return;
            }
            var element = utils_1.utils.elementFromPoint(point, this.selector, this.element, this.dragClone, this.axis);
            if (!element) {
                return;
            }
            var vm = utils_1.utils.getViewModel(element);
            var moveFlag = utils_1.utils.move(this.dragClone, vm);
            if (moveFlag === utils_1.MoveFlag.Valid) {
                this.lastElementFromPointRect = element.getBoundingClientRect();
            }
            if (moveFlag === utils_1.MoveFlag.ValidNewList) {
                this.lastElementFromPointRect = { left: 0, top: 0, right: 0, bottom: 0, width: 0, height: 0 };
            }
        };
        Sortable.prototype.trySort = function (point, scrollOffset) {
            utils_1.utils.hideDragClone(this.dragClone);
            this.tryMove(point, scrollOffset);
            utils_1.utils.showDragClone(this.dragClone);
        };
        Sortable.prototype.isLockedFrom = function (fromVM) {
            return typeof fromVM.lockedFlag === 'number' && (fromVM.lockedFlag & utils_1.LockedFlag.From) !== 0;
        };
        Sortable.prototype.isClosestSortable = function (target) {
            var closest = utils_1.utils.closest(target, exports.SORTABLE_ATTR, window.document);
            return closest === this.element;
        };
        Sortable.prototype.initDragState = function (client, element, fromVM) {
            var _this = this;
            this.downClientPoint = client;
            this.scrollRect = this.scroll.getBoundingClientRect();
            this.rootSortable = utils_1.utils.getRootSortable(this);
            this.rootSortableRect = this.rootSortable.element.getBoundingClientRect();
            this.childSortables = utils_1.utils.getChildSortables(this.rootSortable);
            this.childSortables.forEach(function (s) { return s.isDisabled = (_this.sortableDepth !== s.sortableDepth || (fromVM.typeFlag & s.typeFlag) === 0); });
            this.boundaryRect = utils_1.utils.getBoundaryRect(this.rootSortableRect, window);
            this.lastElementFromPointRect = element.getBoundingClientRect();
        };
        Sortable.prototype.down = function (_a) {
            var evt = _a.evt, client = _a.data.pointers[0].client, target = _a.target;
            if (!this.isClosestSortable(evt.target)) {
                return oribella_1.RETURN_FLAG.REMOVE;
            }
            var fromVM = utils_1.utils.getViewModel(target);
            var item = fromVM.item;
            if (!this.isLockedFrom(fromVM) && this.allowDrag({ evt: evt, item: item })) {
                evt.preventDefault();
                this.target = target;
                this.initDragState(client, target, fromVM);
                return oribella_1.RETURN_FLAG.IDLE;
            }
            return oribella_1.RETURN_FLAG.REMOVE;
        };
        Sortable.prototype.start = function (_a) {
            var client = _a.data.pointers[0].client, target = _a.target;
            utils_1.utils.addDragClone(this.dragClone, this.element, this.scroll, target, this.downClientPoint, this.dragZIndex, this.dragClass, window);
            this.target.classList.add(this.sortingClass);
            this.tryScroll(client);
        };
        Sortable.prototype.update = function (_a) {
            var client = _a.data.pointers[0].client;
            this.currentClientPoint = client;
            utils_1.utils.updateDragClone(this.dragClone, client, window, this.axis);
            this.trySort(client, window);
            this.tryScroll(client);
        };
        Sortable.prototype.stop = function () {
            this.target.classList.remove(this.sortingClass);
            utils_1.utils.removeDragClone(this.dragClone);
            this.autoScroll.deactivate();
            this.childSortables.forEach(function (s) { return s.isDisabled = false; });
            this.onStop();
        };
        return Sortable;
    }());
    tslib_1.__decorate([
        aurelia_templating_1.bindable
    ], Sortable.prototype, "items", void 0);
    tslib_1.__decorate([
        aurelia_templating_1.bindable
    ], Sortable.prototype, "scroll", void 0);
    tslib_1.__decorate([
        aurelia_templating_1.bindable
    ], Sortable.prototype, "scrollSpeed", void 0);
    tslib_1.__decorate([
        aurelia_templating_1.bindable
    ], Sortable.prototype, "scrollSensitivity", void 0);
    tslib_1.__decorate([
        aurelia_templating_1.bindable
    ], Sortable.prototype, "axis", void 0);
    tslib_1.__decorate([
        aurelia_templating_1.bindable
    ], Sortable.prototype, "onStop", void 0);
    tslib_1.__decorate([
        aurelia_templating_1.bindable
    ], Sortable.prototype, "sortingClass", void 0);
    tslib_1.__decorate([
        aurelia_templating_1.bindable
    ], Sortable.prototype, "dragClass", void 0);
    tslib_1.__decorate([
        aurelia_templating_1.bindable
    ], Sortable.prototype, "dragZIndex", void 0);
    tslib_1.__decorate([
        aurelia_templating_1.bindable
    ], Sortable.prototype, "disallowedDragSelectors", void 0);
    tslib_1.__decorate([
        aurelia_templating_1.bindable
    ], Sortable.prototype, "allowedDragSelector", void 0);
    tslib_1.__decorate([
        aurelia_templating_1.bindable
    ], Sortable.prototype, "allowedDragSelectors", void 0);
    tslib_1.__decorate([
        aurelia_templating_1.bindable
    ], Sortable.prototype, "allowDrag", void 0);
    tslib_1.__decorate([
        aurelia_templating_1.bindable
    ], Sortable.prototype, "typeFlag", void 0);
    Sortable = Sortable_1 = tslib_1.__decorate([
        aurelia_templating_1.customAttribute(exports.SORTABLE),
        aurelia_dependency_injection_1.inject(aurelia_pal_1.DOM.Element, optional_parent_1.OptionalParent.of(Sortable_1), auto_scroll_1.AutoScroll)
    ], Sortable);
    exports.Sortable = Sortable;
    var SortableItem = (function () {
        function SortableItem(element, repeat) {
            this.element = element;
            this.item = null;
            this.typeFlag = 1;
            this.lockedFlag = 0;
            if (!repeat.viewFactory.isCaching) {
                repeat.viewFactory.setCacheSize('*', true);
            }
        }
        SortableItem.prototype.getParentSortable = function () {
            var parent = utils_1.utils.closest(this.element.parentNode, exports.SORTABLE_ATTR, window.document);
            return parent && parent.au[exports.SORTABLE].viewModel;
        };
        SortableItem.prototype.getChildSortable = function () {
            var child = this.element.querySelector(exports.SORTABLE_ATTR);
            return child && child.au[exports.SORTABLE].viewModel;
        };
        SortableItem.prototype.attached = function () {
            this.parentSortable = this.getParentSortable();
            this.childSortable = this.getChildSortable();
        };
        Object.defineProperty(SortableItem.prototype, "lockedFrom", {
            get: function () {
                return (this.lockedFlag & utils_1.LockedFlag.From) !== 0;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(SortableItem.prototype, "lockedTo", {
            get: function () {
                return (this.lockedFlag & utils_1.LockedFlag.To) !== 0;
            },
            enumerable: true,
            configurable: true
        });
        return SortableItem;
    }());
    tslib_1.__decorate([
        aurelia_templating_1.bindable
    ], SortableItem.prototype, "item", void 0);
    tslib_1.__decorate([
        aurelia_templating_1.bindable
    ], SortableItem.prototype, "typeFlag", void 0);
    tslib_1.__decorate([
        aurelia_templating_1.bindable
    ], SortableItem.prototype, "lockedFlag", void 0);
    SortableItem = tslib_1.__decorate([
        aurelia_templating_1.customAttribute(exports.SORTABLE_ITEM),
        aurelia_dependency_injection_1.inject(aurelia_pal_1.DOM.Element, aurelia_templating_resources_1.Repeat)
    ], SortableItem);
    exports.SortableItem = SortableItem;
    var Sortable_1;
});
//# sourceMappingURL=sortable.js.map
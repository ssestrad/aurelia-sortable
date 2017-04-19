import * as tslib_1 from "tslib";
import { DOM } from 'aurelia-pal';
import { customAttribute, bindable } from 'aurelia-templating';
import { Repeat } from 'aurelia-templating-resources';
import { inject } from 'aurelia-dependency-injection';
import { oribella, Swipe, matchesSelector, RETURN_FLAG, Point } from 'oribella';
import { OptionalParent } from './optional-parent';
import { utils, AxisFlag, LockedFlag, MoveFlag } from './utils';
import { AutoScroll } from './auto-scroll';
export const SORTABLE = 'oa-sortable';
export const SORTABLE_ATTR = `[${SORTABLE}]`;
export const SORTABLE_ITEM = 'oa-sortable-item';
export const SORTABLE_ITEM_ATTR = `[${SORTABLE_ITEM}]`;
let Sortable = Sortable_1 = class Sortable {
    constructor(element, parentSortable, autoScroll) {
        this.element = element;
        this.parentSortable = parentSortable;
        this.autoScroll = autoScroll;
        this.items = [];
        this.scroll = 'document';
        this.scrollSpeed = 10;
        this.scrollSensitivity = 10;
        this.axis = AxisFlag.XY;
        this.onStop = () => { };
        this.sortingClass = 'oa-sorting';
        this.dragClass = 'oa-drag';
        this.dragZIndex = 1;
        this.disallowedDragSelectors = ['INPUT', 'SELECT', 'TEXTAREA'];
        this.allowedDragSelector = '';
        this.allowedDragSelectors = [];
        this.allowDrag = ({ evt }) => {
            const target = evt.target;
            if (this.allowedDragSelector &&
                !matchesSelector(target, this.allowedDragSelector)) {
                return false;
            }
            if (this.allowedDragSelectors.length &&
                this.allowedDragSelectors.filter((selector) => matchesSelector(target, selector)).length === 0) {
                return false;
            }
            if (this.disallowedDragSelectors.filter((selector) => matchesSelector(target, selector)).length !== 0) {
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
            offset: new Point(0, 0),
            position: new Point(0, 0),
            width: 0,
            height: 0,
            display: null
        };
        this.sortableDepth = -1;
        this.isDisabled = false;
        this.selector = SORTABLE_ITEM_ATTR;
        this.downClientPoint = new Point(0, 0);
        this.currentClientPoint = new Point(0, 0);
        this.childSortables = [];
        this.sortableDepth = utils.getSortableDepth(this);
    }
    activate() {
        this.removeListener = oribella.on(Swipe, this.element, this);
        const { scrollElement, scrollListener } = utils.ensureScroll(this.scroll, this.element);
        this.scroll = scrollElement;
        this.scrollListener = scrollListener;
        this.scrollListener.addEventListener('scroll', this, false);
    }
    deactivate() {
        this.removeListener();
        this.scrollListener.removeEventListener('scroll', this, false);
    }
    handleEvent() {
        utils.updateDragClone(this.dragClone, this.currentClientPoint, window, this.axis);
        this.tryMove(this.currentClientPoint, window);
    }
    attached() {
        this.activate();
    }
    detached() {
        this.deactivate();
    }
    tryScroll(client) {
        const scrollElement = this.scroll;
        const { scrollLeft, scrollTop, scrollWidth, scrollHeight } = scrollElement;
        const scrollSpeed = this.scrollSpeed;
        const scrollMaxPos = utils.getScrollMaxPos(this.element, this.rootSortableRect, scrollElement, { scrollLeft, scrollTop, scrollWidth, scrollHeight }, this.scrollRect, window);
        const scrollDirection = utils.getScrollDirection(this.axis, this.scrollSensitivity, client, this.scrollRect);
        scrollMaxPos.x = scrollDirection.x === -1 ? 0 : scrollMaxPos.x;
        scrollMaxPos.y = scrollDirection.y === -1 ? 0 : scrollMaxPos.y;
        const scrollFrames = utils.getScrollFrames(scrollDirection, scrollMaxPos, { scrollLeft, scrollTop }, scrollSpeed);
        this.autoScroll.activate({ scrollElement, scrollDirection, scrollFrames, scrollSpeed });
    }
    tryMove(point, scrollOffset) {
        if (utils.canThrottle(this.lastElementFromPointRect, point, scrollOffset)) {
            return;
        }
        const element = utils.elementFromPoint(point, this.selector, this.element, this.dragClone, this.axis);
        if (!element) {
            return;
        }
        const vm = utils.getViewModel(element);
        const moveFlag = utils.move(this.dragClone, vm);
        if (moveFlag === MoveFlag.Valid) {
            this.lastElementFromPointRect = element.getBoundingClientRect();
        }
        if (moveFlag === MoveFlag.ValidNewList) {
            this.lastElementFromPointRect = { left: 0, top: 0, right: 0, bottom: 0, width: 0, height: 0 };
        }
    }
    trySort(point, scrollOffset) {
        utils.hideDragClone(this.dragClone);
        this.tryMove(point, scrollOffset);
        utils.showDragClone(this.dragClone);
    }
    isLockedFrom(fromVM) {
        return typeof fromVM.lockedFlag === 'number' && (fromVM.lockedFlag & LockedFlag.From) !== 0;
    }
    isClosestSortable(target) {
        const closest = utils.closest(target, SORTABLE_ATTR, window.document);
        return closest === this.element;
    }
    initDragState(client, element, fromVM) {
        this.downClientPoint = client;
        this.scrollRect = this.scroll.getBoundingClientRect();
        this.rootSortable = utils.getRootSortable(this);
        this.rootSortableRect = this.rootSortable.element.getBoundingClientRect();
        this.childSortables = utils.getChildSortables(this.rootSortable);
        this.childSortables.forEach((s) => s.isDisabled = (this.sortableDepth !== s.sortableDepth || (fromVM.typeFlag & s.typeFlag) === 0));
        this.boundaryRect = utils.getBoundaryRect(this.rootSortableRect, window);
        this.lastElementFromPointRect = element.getBoundingClientRect();
    }
    down({ evt, data: { pointers: [{ client }] }, target }) {
        if (!this.isClosestSortable(evt.target)) {
            return RETURN_FLAG.REMOVE;
        }
        const fromVM = utils.getViewModel(target);
        const item = fromVM.item;
        if (!this.isLockedFrom(fromVM) && this.allowDrag({ evt, item })) {
            evt.preventDefault();
            this.target = target;
            this.initDragState(client, target, fromVM);
            return RETURN_FLAG.IDLE;
        }
        return RETURN_FLAG.REMOVE;
    }
    start({ data: { pointers: [{ client }] }, target }) {
        utils.addDragClone(this.dragClone, this.element, this.scroll, target, this.downClientPoint, this.dragZIndex, this.dragClass, window);
        this.target.classList.add(this.sortingClass);
        this.tryScroll(client);
    }
    update({ data: { pointers: [{ client }] } }) {
        this.currentClientPoint = client;
        utils.updateDragClone(this.dragClone, client, window, this.axis);
        this.trySort(client, window);
        this.tryScroll(client);
    }
    stop() {
        this.target.classList.remove(this.sortingClass);
        utils.removeDragClone(this.dragClone);
        this.autoScroll.deactivate();
        this.childSortables.forEach((s) => s.isDisabled = false);
        this.onStop();
    }
};
tslib_1.__decorate([
    bindable
], Sortable.prototype, "items", void 0);
tslib_1.__decorate([
    bindable
], Sortable.prototype, "scroll", void 0);
tslib_1.__decorate([
    bindable
], Sortable.prototype, "scrollSpeed", void 0);
tslib_1.__decorate([
    bindable
], Sortable.prototype, "scrollSensitivity", void 0);
tslib_1.__decorate([
    bindable
], Sortable.prototype, "axis", void 0);
tslib_1.__decorate([
    bindable
], Sortable.prototype, "onStop", void 0);
tslib_1.__decorate([
    bindable
], Sortable.prototype, "sortingClass", void 0);
tslib_1.__decorate([
    bindable
], Sortable.prototype, "dragClass", void 0);
tslib_1.__decorate([
    bindable
], Sortable.prototype, "dragZIndex", void 0);
tslib_1.__decorate([
    bindable
], Sortable.prototype, "disallowedDragSelectors", void 0);
tslib_1.__decorate([
    bindable
], Sortable.prototype, "allowedDragSelector", void 0);
tslib_1.__decorate([
    bindable
], Sortable.prototype, "allowedDragSelectors", void 0);
tslib_1.__decorate([
    bindable
], Sortable.prototype, "allowDrag", void 0);
tslib_1.__decorate([
    bindable
], Sortable.prototype, "typeFlag", void 0);
Sortable = Sortable_1 = tslib_1.__decorate([
    customAttribute(SORTABLE),
    inject(DOM.Element, OptionalParent.of(Sortable_1), AutoScroll)
], Sortable);
export { Sortable };
let SortableItem = class SortableItem {
    constructor(element, repeat) {
        this.element = element;
        this.item = null;
        this.typeFlag = 1;
        this.lockedFlag = 0;
        if (!repeat.viewFactory.isCaching) {
            repeat.viewFactory.setCacheSize('*', true);
        }
    }
    getParentSortable() {
        const parent = utils.closest(this.element.parentNode, SORTABLE_ATTR, window.document);
        return parent && parent.au[SORTABLE].viewModel;
    }
    getChildSortable() {
        const child = this.element.querySelector(SORTABLE_ATTR);
        return child && child.au[SORTABLE].viewModel;
    }
    attached() {
        this.parentSortable = this.getParentSortable();
        this.childSortable = this.getChildSortable();
    }
    get lockedFrom() {
        return (this.lockedFlag & LockedFlag.From) !== 0;
    }
    get lockedTo() {
        return (this.lockedFlag & LockedFlag.To) !== 0;
    }
};
tslib_1.__decorate([
    bindable
], SortableItem.prototype, "item", void 0);
tslib_1.__decorate([
    bindable
], SortableItem.prototype, "typeFlag", void 0);
tslib_1.__decorate([
    bindable
], SortableItem.prototype, "lockedFlag", void 0);
SortableItem = tslib_1.__decorate([
    customAttribute(SORTABLE_ITEM),
    inject(DOM.Element, Repeat)
], SortableItem);
export { SortableItem };
var Sortable_1;
//# sourceMappingURL=sortable.js.map
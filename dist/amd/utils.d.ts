import { Point } from 'oribella-framework';
import { Sortable, SortableItem } from './sortable';
export declare type SortableItemElement = HTMLElement & {
    au: {
        [index: string]: {
            viewModel: SortableItem;
        };
    };
};
export declare type SortableElement = HTMLElement & {
    au: {
        [index: string]: {
            viewModel: Sortable;
        };
    };
};
export interface AxisFlag {
}
export declare const AxisFlag: {
    X: "x";
    Y: "y";
    XY: "";
};
export declare enum LockedFlag {
    From = 1,
    To = 2,
    FromTo = 3,
}
export declare enum MoveFlag {
    Invalid = 0,
    Valid = 1,
    ValidNewList = 2,
}
export interface WindowDimension {
    innerWidth: number;
    innerHeight: number;
}
export interface Rect {
    left: number;
    top: number;
    right: number;
    bottom: number;
    width: number;
    height: number;
}
export interface PageScrollOffset {
    pageXOffset: number;
    pageYOffset: number;
}
export interface ScrollOffset {
    scrollLeft: number;
    scrollTop: number;
}
export interface ScrollRect {
    scrollLeft: number;
    scrollTop: number;
    scrollWidth: number;
    scrollHeight: number;
}
export interface ScrollDirection {
    x: number;
    y: number;
}
export interface ScrollDimension {
    scrollWidth: number;
    scrollHeight: number;
}
export interface ScrollFrames {
    x: number;
    y: number;
}
export interface ScrollData {
    scrollElement: Element;
    scrollDirection: ScrollDirection;
    scrollFrames: ScrollFrames;
    scrollSpeed: number;
}
export interface DragClone {
    parent: HTMLElement;
    viewModel: SortableItem | null;
    element: HTMLElement | null;
    offset: Point;
    position: Point;
    width: number;
    height: number;
    display: string | null;
}
export declare const utils: {
    hideDragClone(dragClone: DragClone): void;
    showDragClone(dragClone: DragClone): void;
    closest(node: Node | null, selector: string, rootNode: Node): Node | null;
    getViewModel(element: SortableItemElement): SortableItem;
    move(dragClone: DragClone, toVM: SortableItem): number;
    pointInside({top, right, bottom, left}: Rect, {x, y}: Point): boolean;
    elementFromPoint({x, y}: Point, selector: string, sortableElement: Element, dragClone: DragClone, axisFlag: AxisFlag): Element | null;
    canThrottle(lastElementFromPointRect: Rect, {x, y}: Point, {pageXOffset, pageYOffset}: PageScrollOffset): boolean;
    addDragClone(dragClone: DragClone, sortableElement: HTMLElement, scrollElement: Element, target: HTMLElement, client: Point, dragZIndex: number, dragClass: string, {pageXOffset, pageYOffset}: PageScrollOffset): void;
    updateDragClone(dragClone: DragClone, currentClientPoint: Point, {pageXOffset, pageYOffset}: PageScrollOffset, axisFlag: string): void;
    removeDragClone(dragClone: DragClone): void;
    ensureScroll(scroll: string | Element, sortableElement: Element): {
        scrollElement: Element;
        scrollListener: Element | Document;
    };
    getBoundaryRect({left, top, right, bottom}: Rect, {innerWidth, innerHeight}: WindowDimension): Rect;
    getScrollDirection(axisFlag: string, scrollSensitivity: number, {x, y}: Point, {left, top, right, bottom}: Rect): ScrollDirection;
    getScrollMaxPos(sortableElement: Element, sortableRect: Rect, scrollElement: Element, {scrollLeft, scrollTop, scrollWidth, scrollHeight}: ScrollRect, scrollRect: Rect, {innerWidth, innerHeight}: WindowDimension): Point;
    getScrollFrames(direction: ScrollDirection, maxPos: Point, {scrollLeft, scrollTop}: ScrollOffset, scrollSpeed: number): ScrollFrames;
    getSortableDepth(sortable: Sortable): number;
    getRootSortable(sortable: Sortable): Sortable;
    getChildSortables(rootSortable: Sortable): Sortable[];
};

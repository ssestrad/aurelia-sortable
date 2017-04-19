import { Repeat } from 'aurelia-templating-resources';
import { DefaultListenerArgs } from 'oribella';
import { DragClone } from './utils';
import { AutoScroll } from './auto-scroll';
export declare const SORTABLE = "oa-sortable";
export declare const SORTABLE_ATTR: string;
export declare const SORTABLE_ITEM = "oa-sortable-item";
export declare const SORTABLE_ITEM_ATTR: string;
declare module 'aurelia-templating-resources' {
    interface Repeat {
        viewFactory: {
            isCaching: boolean;
            setCacheSize: (first: number | string, second: boolean) => void;
        };
    }
}
export declare class Sortable {
    element: Element;
    parentSortable: Sortable;
    private autoScroll;
    items: any;
    scroll: string | Element;
    scrollSpeed: number;
    scrollSensitivity: number;
    axis: string;
    onStop: () => void;
    sortingClass: string;
    dragClass: string;
    dragZIndex: number;
    disallowedDragSelectors: string[];
    allowedDragSelector: string;
    allowedDragSelectors: string[];
    allowDrag: ({evt}: {
        evt: Event;
        item: SortableItem;
    }) => boolean;
    typeFlag: number;
    dragClone: DragClone;
    sortableDepth: number;
    isDisabled: boolean;
    selector: string;
    private scrollListener;
    private removeListener;
    private downClientPoint;
    private currentClientPoint;
    private boundaryRect;
    private scrollRect;
    private rootSortable;
    private rootSortableRect;
    private childSortables;
    private lastElementFromPointRect;
    private target;
    constructor(element: Element, parentSortable: Sortable, autoScroll: AutoScroll);
    activate(): void;
    deactivate(): void;
    handleEvent(): void;
    attached(): void;
    detached(): void;
    private tryScroll(client);
    private tryMove(point, scrollOffset);
    private trySort(point, scrollOffset);
    private isLockedFrom(fromVM);
    private isClosestSortable(target);
    private initDragState(client, element, fromVM);
    down({evt, data: {pointers: [{client}]}, target}: DefaultListenerArgs): number;
    start({data: {pointers: [{client}]}, target}: DefaultListenerArgs): void;
    update({data: {pointers: [{client}]}}: DefaultListenerArgs): void;
    stop(): void;
}
export declare class SortableItem {
    element: Element;
    item: any;
    typeFlag: number;
    lockedFlag: number;
    parentSortable: Sortable | null;
    childSortable: Sortable | null;
    constructor(element: Element, repeat: Repeat);
    private getParentSortable();
    private getChildSortable();
    attached(): void;
    readonly lockedFrom: boolean;
    readonly lockedTo: boolean;
}

System.register(["oribella-framework", "./sortable"], function (exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var oribella_framework_1, sortable_1, AxisFlag, LockedFlag, MoveFlag, utils;
    return {
        setters: [
            function (oribella_framework_1_1) {
                oribella_framework_1 = oribella_framework_1_1;
            },
            function (sortable_1_1) {
                sortable_1 = sortable_1_1;
            }
        ],
        execute: function () {
            exports_1("AxisFlag", AxisFlag = {
                X: 'x',
                Y: 'y',
                XY: ''
            });
            (function (LockedFlag) {
                LockedFlag[LockedFlag["From"] = 1] = "From";
                LockedFlag[LockedFlag["To"] = 2] = "To";
                LockedFlag[LockedFlag["FromTo"] = 3] = "FromTo";
            })(LockedFlag || (LockedFlag = {}));
            exports_1("LockedFlag", LockedFlag);
            (function (MoveFlag) {
                MoveFlag[MoveFlag["Invalid"] = 0] = "Invalid";
                MoveFlag[MoveFlag["Valid"] = 1] = "Valid";
                MoveFlag[MoveFlag["ValidNewList"] = 2] = "ValidNewList";
            })(MoveFlag || (MoveFlag = {}));
            exports_1("MoveFlag", MoveFlag);
            ;
            exports_1("utils", utils = {
                hideDragClone: function (dragClone) {
                    var element = dragClone.element;
                    dragClone.display = element.style.display;
                    element.style.display = 'none';
                },
                showDragClone: function (dragClone) {
                    var element = dragClone.element;
                    element.style.display = dragClone.display;
                },
                closest: function (node, selector, rootNode) {
                    while (node && node !== rootNode && node !== document) {
                        if (oribella_framework_1.matchesSelector(node, selector)) {
                            return node;
                        }
                        node = node.parentNode;
                    }
                    return null;
                },
                getViewModel: function (element) {
                    return element.au[sortable_1.SORTABLE_ITEM].viewModel;
                },
                move: function (dragClone, toVM) {
                    var changedToSortable = false;
                    var fromVM = dragClone.viewModel;
                    if (!fromVM) {
                        return MoveFlag.Invalid;
                    }
                    if (typeof toVM.lockedFlag === 'number' && (toVM.lockedFlag & LockedFlag.To) !== 0) {
                        return MoveFlag.Invalid;
                    }
                    var fromSortable = fromVM.parentSortable;
                    if (!fromSortable) {
                        return MoveFlag.Invalid;
                    }
                    var toSortable = toVM.parentSortable;
                    if (!toSortable) {
                        return MoveFlag.Invalid;
                    }
                    var fromItem = fromVM.item;
                    var toItem = toVM.item;
                    if (toVM.childSortable && fromSortable.sortableDepth !== toSortable.sortableDepth) {
                        if (fromSortable.sortableDepth !== toVM.childSortable.sortableDepth) {
                            return MoveFlag.Invalid;
                        }
                        toSortable = toVM.childSortable;
                        changedToSortable = true;
                    }
                    if (fromVM.parentSortable !== toSortable && (fromVM.typeFlag & toSortable.typeFlag) === 0) {
                        return MoveFlag.Invalid;
                    }
                    if (fromSortable.sortableDepth !== toSortable.sortableDepth) {
                        return MoveFlag.Invalid;
                    }
                    var fromItems = fromSortable.items;
                    var fromIx = fromItems.indexOf(fromItem);
                    var toItems = toSortable.items;
                    var toIx = toItems.indexOf(toItem);
                    if (toIx === -1) {
                        toIx = 0;
                    }
                    var removedFromItem = fromItems.splice(fromIx, 1)[0];
                    toItems.splice(toIx, 0, removedFromItem);
                    if (changedToSortable) {
                        fromVM.parentSortable = toSortable;
                        return MoveFlag.ValidNewList;
                    }
                    return MoveFlag.Valid;
                },
                pointInside: function (_a, _b) {
                    var top = _a.top, right = _a.right, bottom = _a.bottom, left = _a.left;
                    var x = _b.x, y = _b.y;
                    return x >= left &&
                        x <= right &&
                        y >= top &&
                        y <= bottom;
                },
                elementFromPoint: function (_a, selector, sortableElement, dragClone, axisFlag) {
                    var x = _a.x, y = _a.y;
                    if (axisFlag === AxisFlag.X) {
                        y = dragClone.position.y + dragClone.height / 2;
                    }
                    if (axisFlag === AxisFlag.Y) {
                        x = dragClone.position.x + dragClone.width / 2;
                    }
                    var element = document.elementFromPoint(x, y);
                    if (!element) {
                        return null;
                    }
                    element = utils.closest(element, selector, sortableElement);
                    if (!element) {
                        return null;
                    }
                    return element;
                },
                canThrottle: function (lastElementFromPointRect, _a, _b) {
                    var x = _a.x, y = _a.y;
                    var pageXOffset = _b.pageXOffset, pageYOffset = _b.pageYOffset;
                    return lastElementFromPointRect &&
                        utils.pointInside(lastElementFromPointRect, { x: x + pageXOffset, y: y + pageYOffset });
                },
                addDragClone: function (dragClone, sortableElement, scrollElement, target, client, dragZIndex, dragClass, _a) {
                    var pageXOffset = _a.pageXOffset, pageYOffset = _a.pageYOffset;
                    var targetRect = target.getBoundingClientRect();
                    var offset = { left: 0, top: 0 };
                    if (sortableElement.contains(scrollElement)) {
                        while (sortableElement.offsetParent) {
                            var offsetParentRect = sortableElement.offsetParent.getBoundingClientRect();
                            offset.left += offsetParentRect.left;
                            offset.top += offsetParentRect.top;
                            sortableElement = sortableElement.offsetParent;
                        }
                    }
                    dragClone.width = targetRect.width;
                    dragClone.height = targetRect.height;
                    dragClone.viewModel = utils.getViewModel(target);
                    dragClone.element = target.cloneNode(true);
                    dragClone.element.style.position = 'absolute';
                    dragClone.element.style.width = targetRect.width + 'px';
                    dragClone.element.style.height = targetRect.height + 'px';
                    dragClone.element.style.pointerEvents = 'none';
                    dragClone.element.style.margin = 0 + '';
                    dragClone.element.style.zIndex = dragZIndex + '';
                    dragClone.element.classList.add(dragClass);
                    dragClone.position.x = targetRect.left + pageXOffset - offset.left;
                    dragClone.position.y = targetRect.top + pageYOffset - offset.top;
                    dragClone.offset.x = dragClone.position.x - client.x - pageXOffset;
                    dragClone.offset.y = dragClone.position.y - client.y - pageYOffset;
                    dragClone.element.style.left = dragClone.position.x + 'px';
                    dragClone.element.style.top = dragClone.position.y + 'px';
                    dragClone.parent.appendChild(dragClone.element);
                },
                updateDragClone: function (dragClone, currentClientPoint, _a, axisFlag) {
                    var pageXOffset = _a.pageXOffset, pageYOffset = _a.pageYOffset;
                    if (!dragClone.element) {
                        return;
                    }
                    if (axisFlag === AxisFlag.X || axisFlag === AxisFlag.XY) {
                        dragClone.position.x = currentClientPoint.x + dragClone.offset.x + pageXOffset;
                    }
                    if (axisFlag === AxisFlag.Y || axisFlag === AxisFlag.XY) {
                        dragClone.position.y = currentClientPoint.y + dragClone.offset.y + pageYOffset;
                    }
                    dragClone.element.style.left = dragClone.position.x + 'px';
                    dragClone.element.style.top = dragClone.position.y + 'px';
                },
                removeDragClone: function (dragClone) {
                    if (!dragClone.element) {
                        return;
                    }
                    dragClone.parent.removeChild(dragClone.element);
                    dragClone.element = null;
                    dragClone.viewModel = null;
                },
                ensureScroll: function (scroll, sortableElement) {
                    var scrollElement = sortableElement;
                    var scrollListener = sortableElement;
                    if (typeof scroll === 'string') {
                        if (scroll === 'document') {
                            scrollElement = document.scrollingElement || document.documentElement || document.body;
                            scrollListener = document;
                        }
                        else {
                            scrollElement = utils.closest(sortableElement, scroll, window.document);
                            scrollListener = scrollElement;
                        }
                    }
                    return { scrollElement: scrollElement, scrollListener: scrollListener };
                },
                getBoundaryRect: function (_a, _b) {
                    var left = _a.left, top = _a.top, right = _a.right, bottom = _a.bottom;
                    var innerWidth = _b.innerWidth, innerHeight = _b.innerHeight;
                    return {
                        left: Math.max(0, left),
                        top: Math.max(0, top),
                        right: Math.min(innerWidth, right),
                        bottom: Math.min(innerHeight, bottom),
                        get width() {
                            return this.right - this.left;
                        },
                        get height() {
                            return this.bottom - this.top;
                        }
                    };
                },
                getScrollDirection: function (axisFlag, scrollSensitivity, _a, _b) {
                    var x = _a.x, y = _a.y;
                    var left = _b.left, top = _b.top, right = _b.right, bottom = _b.bottom;
                    var direction = { x: 0, y: 0 };
                    if (x >= right - scrollSensitivity) {
                        direction.x = 1;
                    }
                    else if (x <= left - scrollSensitivity) {
                        direction.x = -1;
                    }
                    if (y >= bottom - scrollSensitivity) {
                        direction.y = 1;
                    }
                    else if (y <= top - scrollSensitivity) {
                        direction.y = -1;
                    }
                    if (axisFlag === AxisFlag.X) {
                        direction.y = 0;
                    }
                    if (axisFlag === AxisFlag.Y) {
                        direction.x = 0;
                    }
                    return direction;
                },
                getScrollMaxPos: function (sortableElement, sortableRect, scrollElement, _a, scrollRect, _b) {
                    var scrollLeft = _a.scrollLeft, scrollTop = _a.scrollTop, scrollWidth = _a.scrollWidth, scrollHeight = _a.scrollHeight;
                    var innerWidth = _b.innerWidth, innerHeight = _b.innerHeight;
                    if (sortableElement.contains(scrollElement)) {
                        return new oribella_framework_1.Point(scrollWidth - scrollRect.width, scrollHeight - scrollRect.height);
                    }
                    else {
                        return new oribella_framework_1.Point(sortableRect.right + scrollLeft - innerWidth, sortableRect.bottom + scrollTop - innerHeight);
                    }
                },
                getScrollFrames: function (direction, maxPos, _a, scrollSpeed) {
                    var scrollLeft = _a.scrollLeft, scrollTop = _a.scrollTop;
                    var x = Math.max(0, Math.ceil(Math.abs(maxPos.x - scrollLeft) / scrollSpeed));
                    var y = Math.max(0, Math.ceil(Math.abs(maxPos.y - scrollTop) / scrollSpeed));
                    if (direction.x === 1 && scrollLeft >= maxPos.x ||
                        direction.x === -1 && scrollLeft === 0) {
                        x = 0;
                    }
                    if (direction.y === 1 && scrollTop >= maxPos.y ||
                        direction.y === -1 && scrollTop === 0) {
                        y = 0;
                    }
                    return new oribella_framework_1.Point(x, y);
                },
                getSortableDepth: function (sortable) {
                    var depth = 0;
                    while (sortable.parentSortable) {
                        ++depth;
                        sortable = sortable.parentSortable;
                    }
                    return depth;
                },
                getRootSortable: function (sortable) {
                    while (sortable.parentSortable) {
                        sortable = sortable.parentSortable;
                    }
                    return sortable;
                },
                getChildSortables: function (rootSortable) {
                    var elements = rootSortable.element.querySelectorAll("" + sortable_1.SORTABLE_ATTR);
                    return Array.from(elements).map(function (e) { return e.au[sortable_1.SORTABLE].viewModel; });
                }
            });
        }
    };
});
//# sourceMappingURL=utils.js.map
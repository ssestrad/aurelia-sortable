"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _dec, _dec2, _dec3, _class, _dec4, _class2;

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.SortableItem = exports.Sortable = exports.PLACEHOLDER = undefined;

var _aureliaPal = require("aurelia-pal");

var _aureliaTemplating = require("aurelia-templating");

var _aureliaDependencyInjection = require("aurelia-dependency-injection");

var _oribellaDefaultGestures = require("oribella-default-gestures");

var _drag = require("./drag");

var _autoScroll = require("./auto-scroll");

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var PLACEHOLDER = exports.PLACEHOLDER = "__placeholder__";

var Sortable = exports.Sortable = (_dec = (0, _aureliaTemplating.customAttribute)("sortable"), _dec2 = (0, _aureliaDependencyInjection.inject)(_aureliaPal.DOM.Element, _drag.Drag, _autoScroll.AutoScroll), _dec3 = (0, _aureliaDependencyInjection.transient)(), _dec(_class = _dec2(_class = _dec3(_class = (function () {
  //{ left, top, right, bottom }

  function Sortable(element, drag, autoScroll) {
    _classCallCheck(this, Sortable);

    this.selector = "[sortable-item]";
    this.fromIx = -1;
    this.toIx = -1;
    this.pageX = 0;
    this.pageY = 0;
    this.scrollRect = { left: 0, top: 0, width: 0, height: 0 };
    this.lastElementFromPointRect = null;

    this.element = element;
    this.drag = drag;
    this.autoScroll = autoScroll;
    this.options = {
      strategy: _oribellaDefaultGestures.STRATEGY_FLAG.REMOVE_IF_POINTERS_GT
    };
  }

  _createClass(Sortable, [{
    key: "activate",
    value: function activate() {
      this.removeListener = _oribellaDefaultGestures.oribella.on(this.element, "swipe", this);
      if (typeof this.scroll === "string") {
        this.scroll = this.closest(this.element, this.scroll);
      }
      if (!(this.scroll instanceof _aureliaPal.DOM.Element)) {
        this.scroll = this.element;
      }
      this.removeScroll = this.bindScroll(this.scroll, this.onScroll.bind(this));
    }
  }, {
    key: "deactivate",
    value: function deactivate() {
      if (typeof this.removeListener === "function") {
        this.removeListener();
      }
      if (typeof this.removeScroll === "function") {
        this.removeScroll();
      }
    }
  }, {
    key: "attached",
    value: function attached() {
      this.activate();
    }
  }, {
    key: "detached",
    value: function detached() {
      this.deactivate();
    }
  }, {
    key: "bindScroll",
    value: function bindScroll(scroll, fn) {
      scroll.addEventListener("scroll", fn, false);
      return function () {
        scroll.removeEventListener("scroll", fn, false);
      };
    }
  }, {
    key: "onScroll",
    value: function onScroll() {
      if (!this.drag.element) {
        return;
      }
      var scrollLeft = this.scroll.scrollLeft;
      var scrollTop = this.scroll.scrollTop;
      this.drag.update(this.pageX, this.pageY, scrollLeft, scrollTop, this.axis);

      var _getPoint = this.getPoint(this.pageX, this.pageY);

      var x = _getPoint.x;
      var y = _getPoint.y;

      this.tryMove(x, y, scrollLeft, scrollTop);
    }
  }, {
    key: "hide",
    value: function hide(element) {
      var display = element.style.display;
      element.style.display = "none";
      return function () {
        element.style.display = display;
      };
    }
  }, {
    key: "closest",
    value: function closest(element, selector) {
      var rootElement = arguments.length <= 2 || arguments[2] === undefined ? document : arguments[2];

      var valid = false;
      while (!valid && element !== null && element !== rootElement && element !== document) {
        valid = (0, _oribellaDefaultGestures.matchesSelector)(element, selector);
        if (valid) {
          break;
        }
        element = element.parentNode;
      }
      return valid ? element : null;
    }
  }, {
    key: "getItemViewModel",
    value: function getItemViewModel(element) {
      return element.au["sortable-item"].viewModel;
    }
  }, {
    key: "addPlaceholder",
    value: function addPlaceholder(toIx, item) {
      var placeholder = Object.create(item, { placeholderClass: { value: this.placeholderClass, writable: true } });

      if (!placeholder.style) {
        placeholder.style = {};
      }
      placeholder.style.width = this.drag.rect.width;
      placeholder.style.height = this.drag.rect.height;

      this[PLACEHOLDER] = placeholder;
      this.items.splice(toIx, 0, placeholder);
    }
  }, {
    key: "removePlaceholder",
    value: function removePlaceholder() {
      var ix = this.items.indexOf(this[PLACEHOLDER]);
      if (ix !== -1) {
        this.items.splice(ix, 1);
      }
    }
  }, {
    key: "movePlaceholder",
    value: function movePlaceholder(toIx) {
      var fromIx = this.items.indexOf(this[PLACEHOLDER]);
      this.move(fromIx, toIx);
    }
  }, {
    key: "move",
    value: function move(fromIx, toIx) {
      if (fromIx !== -1 && toIx !== -1 && fromIx !== toIx) {
        this.items.splice(toIx, 0, this.items.splice(fromIx, 1)[0]);
      }
    }
  }, {
    key: "tryUpdate",
    value: function tryUpdate(pageX, pageY, offsetX, offsetY) {
      var showFn = this.hide(this.drag.element);
      this.tryMove(pageX, pageY, offsetX, offsetY);
      showFn();
    }
  }, {
    key: "pointInside",
    value: function pointInside(x, y, rect) {
      return x >= rect.left && x <= rect.right && y >= rect.top && y <= rect.bottom;
    }
  }, {
    key: "elementFromPoint",
    value: function elementFromPoint(x, y) {
      var element = document.elementFromPoint(x, y);
      if (!element) {
        return null;
      }
      element = this.closest(element, this.selector, this.element);
      if (!element) {
        return null;
      }
      return element;
    }
  }, {
    key: "canThrottle",
    value: function canThrottle(x, y, offsetX, offsetY) {
      return this.lastElementFromPointRect && this.pointInside(x + offsetX, y + offsetY, this.lastElementFromPointRect);
    }
  }, {
    key: "tryMove",
    value: function tryMove(x, y, offsetX, offsetY) {
      if (this.canThrottle(x, y, offsetX, offsetY)) {
        return;
      }
      var element = this.elementFromPoint(x, y);
      if (!element) {
        return;
      }
      var model = this.getItemViewModel(element);
      this.lastElementFromPointRect = element.getBoundingClientRect();
      if (!this.allowMove({ item: model.item })) {
        return;
      }
      var ix = model.ctx.$index;
      this.movePlaceholder(ix);
    }
  }, {
    key: "getPoint",
    value: function getPoint(pageX, pageY) {
      switch (this.axis) {
        case "x":
          pageY = this.drag.getCenterY();
          break;
        case "y":
          pageX = this.drag.getCenterX();
          break;
        default:
          break;
      }
      return {
        x: Math.max(this.boundingRect.left, Math.min(this.boundingRect.right, pageX)),
        y: Math.max(this.boundingRect.top, Math.min(this.boundingRect.bottom, pageY))
      };
    }
  }, {
    key: "down",
    value: function down(e, data, element) {
      if (this.allowDrag({ event: e, item: this.getItemViewModel(element).item })) {
        e.preventDefault();
        return undefined;
      }
      return false;
    }
  }, {
    key: "start",
    value: function start(e, data, element) {
      this.pageX = data.pagePoints[0].x;
      this.pageY = data.pagePoints[0].y;
      this.scrollRect = this.scroll.getBoundingClientRect();
      this.scrollWidth = this.scroll.scrollWidth;
      this.scrollHeight = this.scroll.scrollHeight;
      this.boundingRect = this.boundingRect || { left: this.scrollRect.left + 5, top: this.scrollRect.top + 5, right: this.scrollRect.right - 5, bottom: this.scrollRect.bottom - 5 };
      this.drag.start(element, this.pageX, this.pageY, this.scroll.scrollLeft, this.scroll.scrollTop, this.dragZIndex);
      this.autoScroll.start(this.axis, this.scrollSpeed, this.scrollSensitivity);
      var viewModel = this.getItemViewModel(element);
      this.fromIx = viewModel.ctx.$index;
      this.toIx = -1;
      this.addPlaceholder(this.fromIx, viewModel.item);
      this.lastElementFromPointRect = this.drag.rect;
    }
  }, {
    key: "update",
    value: function update(e, data) {
      var p = data.pagePoints[0];
      var pageX = this.pageX = p.x;
      var pageY = this.pageY = p.y;
      var scrollLeft = this.scroll.scrollLeft;
      var scrollTop = this.scroll.scrollTop;

      this.drag.update(pageX, pageY, scrollLeft, scrollTop, this.axis);

      var _getPoint2 = this.getPoint(pageX, pageY);

      var x = _getPoint2.x;
      var y = _getPoint2.y;

      var scrollX = this.autoScroll.active ? scrollLeft : 0;
      var scrollY = this.autoScroll.active ? scrollTop : 0;
      this.tryUpdate(x, y, scrollX, scrollY);
      this.autoScroll.update(this.scroll, x, y, this.scrollWidth, this.scrollHeight, this.scrollRect);
    }
  }, {
    key: "end",
    value: function end() {
      this.toIx = this.items.indexOf(this[PLACEHOLDER]);
      if (this.toIx === -1) {
        return; //cancelled
      }
      this.move(this.toIx < this.fromIx ? this.fromIx + 1 : this.fromIx, this.toIx);
      this.drag.end();
      this.autoScroll.end();
      this.removePlaceholder();

      if (this.fromIx < this.toIx) {
        --this.toIx;
      }
      if (this.fromIx !== this.toIx) {
        this.moved({ fromIx: this.fromIx, toIx: this.toIx });
      }
    }
  }, {
    key: "cancel",
    value: function cancel() {
      this.drag.end();
      this.autoScroll.end();
      this.removePlaceholder();
    }
  }]);

  return Sortable;
})()) || _class) || _class) || _class);
var SortableItem = exports.SortableItem = (_dec4 = (0, _aureliaTemplating.customAttribute)("sortable-item"), _dec4(_class2 = (function () {
  function SortableItem() {
    _classCallCheck(this, SortableItem);
  }

  _createClass(SortableItem, [{
    key: "bind",
    value: function bind(ctx, overrideCtx) {
      this.ctx = overrideCtx; //Need a reference to the item's $index
    }
  }]);

  return SortableItem;
})()) || _class2);
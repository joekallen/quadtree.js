(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["Quadtree"] = factory();
	else
		root["Quadtree"] = factory();
})(this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var Bounds_1 = __webpack_require__(1);
	var util_1 = __webpack_require__(2);
	var DEFAULT_MAX_ITEMS = 4;
	function createQuad(bounds) {
	    return {
	        _bounds: bounds,
	        _nodes: [],
	        _quads: [],
	        id: ''
	    };
	}
	function createQuadFromRect(x, y, width, height) {
	    var bounds = new Bounds_1.default(x, y, width, height);
	    return createQuad(bounds);
	}
	function createNode(bounds, value) {
	    return {
	        _bounds: bounds,
	        _value: value
	    };
	}
	function getQuadIndex(quad, node) {
	    var index = -1, yOffset = 0, xOffset = 0;
	    var nodeBounds = quad._bounds, valueBounds = node._bounds;
	    var leftX = valueBounds.leftX, rightX = valueBounds.rightX, topY = valueBounds.topY, bottomY = valueBounds.bottomY, middleX = nodeBounds.middleX, middleY = nodeBounds.middleY;
	    if (nodeBounds.leftX > valueBounds.leftX || nodeBounds.rightX < rightX) {
	        return index;
	    }
	    if (nodeBounds.topY > valueBounds.topY || nodeBounds.bottomY < bottomY) {
	        return index;
	    }
	    if (rightX > middleX) {
	        if (leftX < middleX) {
	            return index;
	        }
	        xOffset = 1;
	    }
	    if (bottomY > middleY) {
	        if (topY < middleY) {
	            return index;
	        }
	        yOffset = 2;
	    }
	    return xOffset + yOffset;
	}
	function splitQuad(quad, maxItems) {
	    var bounds = quad._bounds, quads = quad._quads, nodes = quad._nodes;
	    var depthAdded = 0, childQuad, node, index, insertIndex;
	    var x = bounds.leftX, y = bounds.topY, middleX = bounds.middleX, middleY = bounds.middleY, width = bounds.width / 2, height = bounds.height / 2;
	    quads[0] = createQuadFromRect(x, y, width, height);
	    quads[0].id = quad.id + '0';
	    quads[1] = createQuadFromRect(middleX, y, width, height);
	    quads[1].id = quad.id + '1';
	    quads[2] = createQuadFromRect(x, middleY, width, height);
	    quads[2].id = quad.id + '2';
	    quads[3] = createQuadFromRect(middleX, middleY, width, height);
	    quads[3].id = quad.id + '3';
	    index = nodes.length - 1;
	    while (index >= 0) {
	        node = nodes[index];
	        insertIndex = getQuadIndex(quad, node);
	        if (insertIndex !== -1) {
	            nodes.splice(index, 1);
	            childQuad = quads[insertIndex];
	            depthAdded += insertNodeIntoQuad(node, childQuad, maxItems);
	        }
	        --index;
	    }
	    return depthAdded;
	}
	function insertNodeIntoQuad(node, quad, maxItems) {
	    var quads = quad._quads, hasNodes = quads.length > 0;
	    var depthAdded = 0, nodes, index;
	    if (hasNodes) {
	        index = getQuadIndex(quad, node);
	        while (index !== -1) {
	            quad = quad._quads[index];
	            if (quad._quads.length > 0) {
	                index = getQuadIndex(quad, node);
	            }
	            else {
	                index = -1;
	            }
	        }
	    }
	    nodes = quad._nodes;
	    nodes.push(node);
	    if (quad._quads.length === 0 && nodes.length > maxItems) {
	        depthAdded += splitQuad(quad, maxItems);
	    }
	    return depthAdded;
	}
	function validateMaxItems(maxItems) {
	    if (maxItems === undefined) {
	        return DEFAULT_MAX_ITEMS;
	    }
	    var parsedMaxItems = parseInt(maxItems);
	    if (parsedMaxItems !== maxItems || maxItems <= 0) {
	        throw new TypeError('maxItems must be a positive integer.');
	    }
	    return parsedMaxItems;
	}
	function intersectsBoundingBox(bounded, boundingBox) {
	    var nodeBounds = bounded._bounds;
	    if (nodeBounds.leftX > boundingBox.rightX || boundingBox.leftX > nodeBounds.rightX) {
	        return false;
	    }
	    return !(nodeBounds.topY > boundingBox.bottomY || boundingBox.topY > nodeBounds.bottomY);
	}
	function intersectsPoint(bounded, point) {
	    var nodeBounds = bounded._bounds, x = point.x, y = point.y;
	    if (x < nodeBounds.leftX || x > nodeBounds.rightX) {
	        return false;
	    }
	    return !(y < nodeBounds.topY || y > nodeBounds.bottomY);
	}
	function createBounds(bounds) {
	    if (bounds === null || typeof bounds === 'undefined') {
	        throw new TypeError('bounds parameter must be defined');
	    }
	    else if (!(bounds instanceof Bounds_1.default)) {
	        return new Bounds_1.default(bounds.x, bounds.y, bounds.width, bounds.height);
	    }
	    return bounds;
	}
	function createPoint(point) {
	    if (point === null || typeof point === 'undefined') {
	        throw new TypeError('point parameter must be defined');
	    }
	    return {
	        x: util_1.validateNumber(point.x, 'x'),
	        y: util_1.validateNumber(point.y, 'y')
	    };
	}
	function findIntersectingNodes(quad, testArea, nodeIntersectionTest, results) {
	    // this quad intersects, check child nodes
	    var nodes = quad._nodes, nodeIndex = nodes.length - 1, node;
	    while (nodeIndex >= 0) {
	        node = nodes[nodeIndex];
	        if (nodeIntersectionTest(node, testArea)) {
	            results.push(node._value);
	        }
	        --nodeIndex;
	    }
	}
	function queryIntersection(quadtree, testArea, nodeIntersectionTest) {
	    var results = [], queue = [quadtree];
	    var queueIndex = 0, intersects, quad, quads, childQuadIndex;
	    while (queueIndex >= 0) {
	        quad = queue[queueIndex];
	        --queueIndex;
	        intersects = nodeIntersectionTest(quad, testArea);
	        if (intersects) {
	            // this node intersects, check children
	            findIntersectingNodes(quad, testArea, nodeIntersectionTest, results);
	            quads = quad._quads;
	            childQuadIndex = quads.length - 1;
	            while (childQuadIndex >= 0) {
	                queue[++queueIndex] = quads[childQuadIndex];
	                --childQuadIndex;
	            }
	        }
	    }
	    return results;
	}
	var Quadtree = (function () {
	    function Quadtree(bounds, maxItems) {
	        this._depth = 1;
	        this._size = 0;
	        this._maxItems = DEFAULT_MAX_ITEMS;
	        this._nodes = [];
	        this._quads = [];
	        this.id = '';
	        var parsedBounds = createBounds(bounds);
	        if (!(this instanceof Quadtree)) {
	            return new Quadtree(parsedBounds, maxItems);
	        }
	        this._maxItems = validateMaxItems(maxItems);
	        this._bounds = parsedBounds;
	    }
	    Quadtree.prototype.clear = function () {
	        this._depth = 0;
	        this._size = 0;
	        this._quads = [];
	        this._nodes = [];
	    };
	    Quadtree.prototype.isEmpty = function () {
	        return this._size === 0;
	    };
	    Quadtree.prototype.getMaxItems = function () {
	        return this._maxItems;
	    };
	    Quadtree.prototype.getDepth = function () {
	        return this._depth;
	    };
	    Quadtree.prototype.getSize = function () {
	        return this._size;
	    };
	    Quadtree.prototype.queryWithBoundingBox = function (bounds) {
	        var boundingBox = createBounds(bounds);
	        return queryIntersection(this, boundingBox, intersectsBoundingBox);
	    };
	    Quadtree.prototype.queryWithPoint = function (point) {
	        var parsedPoint = createPoint(point);
	        return queryIntersection(this, parsedPoint, intersectsPoint);
	    };
	    Quadtree.prototype.insert = function (bounds, value) {
	        var parsedBounds = createBounds(bounds), node = createNode(parsedBounds, value);
	        var depthAdded = insertNodeIntoQuad(node, this, this._maxItems);
	        this._depth += depthAdded;
	        ++this._size;
	    };
	    return Quadtree;
	}());
	exports.Quadtree = Quadtree;


/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var util_1 = __webpack_require__(2);
	var Bounds = (function () {
	    function Bounds(x, y, width, height) {
	        // TODO: Make this an interface
	        if (!(this instanceof Bounds)) {
	            return new Bounds(x, y, width, height);
	        }
	        if (width < 0) {
	            throw new RangeError('width must be >= 0');
	        }
	        if (height < 0) {
	            throw new RangeError('height must be >= 0');
	        }
	        this.leftX = util_1.validateNumber(x, 'x');
	        this.topY = util_1.validateNumber(y, 'y');
	        this.width = util_1.validateNumber(width, 'width');
	        this.height = util_1.validateNumber(height, 'height');
	        this.rightX = x + width;
	        this.bottomY = y + height;
	        this.middleX = this.rightX - width / 2;
	        this.middleY = this.bottomY - height / 2;
	    }
	    return Bounds;
	}());
	;
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.default = Bounds;


/***/ },
/* 2 */
/***/ function(module, exports) {

	"use strict";
	function validateNumber(value, propertyName) {
	    if (!isFinite(value)) {
	        throw new TypeError(propertyName + ' must be a finite number');
	    }
	    return Number(value);
	}
	exports.validateNumber = validateNumber;
	;


/***/ }
/******/ ])
});
;
//# sourceMappingURL=Quadtree.js.map
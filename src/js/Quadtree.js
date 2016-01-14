var Quadtree;
(function (Quadtree_1) {
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
        var bounds = new Quadtree_1.Bounds(x, y, width, height);
        return createQuad(bounds);
    }
    function createNode(bounds, value) {
        return {
            _bounds: bounds,
            _value: value
        };
    }
    function getQuadIndex(quad, node) {
        var index = -1, yOffset = 0, xOffset = 0, nodeBounds = quad._bounds, valueBounds = node._bounds, leftX, rightX, topY, bottomY, middleX, middleY;
        leftX = valueBounds.leftX;
        rightX = valueBounds.rightX;
        topY = valueBounds.topY;
        bottomY = valueBounds.bottomY;
        middleX = nodeBounds.middleX;
        middleY = nodeBounds.middleY;
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
        var bounds = quad._bounds, quads = quad._quads, nodes = quad._nodes, depthAdded = 0, childQuad, node, x, y, width, height, middleX, middleY, index, insertIndex;
        x = bounds.leftX;
        y = bounds.topY;
        middleX = bounds.middleX;
        middleY = bounds.middleY;
        width = bounds.width / 2;
        height = bounds.height / 2;
        quads[0] = createQuadFromRect(x, y, width, height);
        quads[0].id = quad.id + '0';
        quads[1] = createQuadFromRect(middleX, x, width, height);
        quads[1].id = quad.id + '1';
        quads[2] = createQuadFromRect(y, middleY, width, height);
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
        var quads = quad._quads, depthAdded = 0, nodes, hasNodes, index;
        hasNodes = quads.length > 0;
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
        var parsedMaxItems;
        if (maxItems === undefined) {
            return DEFAULT_MAX_ITEMS;
        }
        parsedMaxItems = parseInt(maxItems);
        if (parsedMaxItems !== maxItems && maxItems <= 0) {
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
        else if (!(bounds instanceof Quadtree_1.Bounds)) {
            return new Quadtree_1.Bounds(bounds.x, bounds.y, bounds.width, bounds.height);
        }
        return bounds;
    }
    function createPoint(point) {
        if (point === null || typeof point === 'undefined') {
            throw new TypeError('point parameter must be defined');
        }
        return {
            x: Quadtree_1.validateNumber(point.x, 'x'),
            y: Quadtree_1.validateNumber(point.y, 'y')
        };
    }
    function findIntersectingNodes(quad, testArea, nodeIntersectionTest, results) {
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
        var results = [], path = [], done = false, intersects, index = 0, quads = [quadtree], quad, pathIndex, shouldPop, pathObj, x = {
            quads: [this],
            index: 0
        };
        while (!done) {
            quad = quads[index];
            intersects = nodeIntersectionTest(quad, testArea);
            if (intersects) {
                if (quad._quads.length) {
                    path.push({
                        index: index,
                        quad: quad
                    });
                    quads = quad._quads;
                    index = 0;
                    continue;
                }
                findIntersectingNodes(quad, testArea, nodeIntersectionTest, results);
            }
            pathIndex = path.length - 1;
            shouldPop = pathIndex >= 0;
            while (shouldPop && pathIndex >= 0) {
                pathObj = path[pathIndex];
                index = ++pathObj.index;
                quad = pathObj.quad;
                if (index < 4) {
                    shouldPop = false;
                }
                else {
                    path.pop();
                    --pathIndex;
                }
                quads = quad._quads;
            }
            done = path.length === 0;
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
            var parsedBounds = createBounds(bounds), node = createNode(parsedBounds, value), depthAdded;
            depthAdded = insertNodeIntoQuad(node, this, this._maxItems);
            this._depth += depthAdded;
            ++this._size;
        };
        return Quadtree;
    })();
    Quadtree_1.Quadtree = Quadtree;
})(Quadtree || (Quadtree = {}));
//# sourceMappingURL=Quadtree.js.map
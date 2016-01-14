module Quadtree {
  var DEFAULT_MAX_ITEMS:number = 4;
  interface Bounded {
    _bounds:Bounds
  }

  interface Node extends Bounded {
    _value:Object
  }

  interface Point {
    x:number,
    y:number
  }

  interface Quad extends Bounded {
    _nodes : Array<Node>,
    _quads : Array<Quad>
    id: String
  }

  interface IntersectionTest {
    (bounded:Bounded, toTest:any):boolean;
  }

  function createQuad(bounds:Bounds):Quad {
    return {
      _bounds: bounds,
      _nodes: [],
      _quads: [],
      id: ''
    };
  }

  function createQuadFromRect(x:number, y:number, width:number, height:number) {
    var bounds:Bounds = new Bounds(x, y, width, height);
    return createQuad(bounds);
  }

  function createNode(bounds:Bounds, value:Object):Node {
    return {
      _bounds: bounds,
      _value: value
    };
  }

  function getQuadIndex(quad:Quad, node:Node):number {
    var index:number = -1,
      yOffset:number = 0,
      xOffset:number = 0,
      nodeBounds:Bounds = quad._bounds,
      valueBounds:Bounds = node._bounds,
      leftX:number, rightX:number,
      topY:number, bottomY:number,
      middleX:number, middleY:number;

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

  function splitQuad(quad:Quad, maxItems:number):number {
    var bounds:Bounds = quad._bounds,
      quads:Array<Quad> = quad._quads,
      nodes:Array<Node> = quad._nodes,
      depthAdded:number = 0,
      childQuad:Quad,
      node:Node,
      x:number, y:number,
      width:number, height:number,
      middleX:number, middleY:number,
      index:number,
      insertIndex:number;


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
        childQuad = quads[insertIndex]
        depthAdded += insertNodeIntoQuad(node, childQuad, maxItems);
      }

      --index;
    }

    return depthAdded;
  }

  function insertNodeIntoQuad(node:Node, quad:Quad, maxItems:number):number {
    var quads:Array<Quad> = quad._quads,
      depthAdded:number = 0,
      nodes:Array<Node>,
      hasNodes:boolean,
      index:number;

    hasNodes = quads.length > 0;

    if (hasNodes) {
      index = getQuadIndex(quad, node);

      while (index !== -1) {
        quad = quad._quads[index];
        if (quad._quads.length > 0) {
          index = getQuadIndex(quad, node);
        } else {
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

  function validateMaxItems(maxItems:any) {
    var parsedMaxItems:number;

    if (maxItems === undefined) {
      return DEFAULT_MAX_ITEMS;
    }

    parsedMaxItems = parseInt(maxItems);
    if (parsedMaxItems !== maxItems && maxItems <= 0) {
      throw new TypeError('maxItems must be a positive integer.')
    }

    return parsedMaxItems;
  }

  function intersectsBoundingBox(bounded:Bounded, boundingBox:Bounds) {
    var nodeBounds:Bounds = bounded._bounds;

    if (nodeBounds.leftX > boundingBox.rightX || boundingBox.leftX > nodeBounds.rightX) {
      return false;
    }

    return !(nodeBounds.topY > boundingBox.bottomY || boundingBox.topY > nodeBounds.bottomY);
  }

  function intersectsPoint(bounded:Bounded, point:Point) {
    var nodeBounds:Bounds = bounded._bounds,
      x:number = point.x,
      y:number = point.y;

    if (x < nodeBounds.leftX || x > nodeBounds.rightX) {
      return false;
    }

    return !(y < nodeBounds.topY || y > nodeBounds.bottomY);
  }

  function createBounds(bounds:any) {
    if (bounds === null || typeof bounds === 'undefined') {
      throw new TypeError('bounds parameter must be defined');
    } else if (!(bounds instanceof Bounds)) {
      return new Bounds(bounds.x, bounds.y, bounds.width, bounds.height);
    }

    return bounds;
  }

  function createPoint(point:any) {
    if (point === null || typeof point === 'undefined') {
      throw new TypeError('point parameter must be defined');
    }

    return {
      x: validateNumber(point.x, 'x'),
      y: validateNumber(point.y, 'y')
    }
  }

  function findIntersectingNodes(quad:Quad, testArea:any, nodeIntersectionTest:IntersectionTest, results:any[]):void {
    // this quad intersects, check child nodes
    var nodes:Node[] = quad._nodes,
      nodeIndex:number = nodes.length - 1,
      node:Node;

    while (nodeIndex >= 0) {
      node = nodes[nodeIndex];
      if (nodeIntersectionTest(node, testArea)) {
        results.push(node._value);
      }
      --nodeIndex;
    }
  }

  function queryIntersection(quadtree:Quadtree, testArea:any, nodeIntersectionTest:IntersectionTest):any[] {
    var results:any[] = [],
      path:any[] = [],
      done:boolean = false,
      intersects:boolean,
      index:number = 0,
      quads:Quad[] = [quadtree],
      quad:Quad,
      pathIndex:number,
      shouldPop:boolean,
      pathObj:any,
      x:any = {
        quads: [this],
        index: 0
      };

    while (!done) {
      quad = quads[index];
      intersects = nodeIntersectionTest(quad, testArea);

      if (intersects) {

        // check if there are child quads
        if (quad._quads.length) {
          path.push({
            index: index,
            quad: quad
          });
          quads = quad._quads;
          index = 0;
          continue;
        }

        // this node intersects, check children
        findIntersectingNodes(quad, testArea, nodeIntersectionTest, results);
      }

      // pop up to handle next node
      pathIndex = path.length - 1;
      shouldPop = pathIndex >= 0;
      while (shouldPop && pathIndex >= 0) {
        pathObj = path[pathIndex];
        index = ++pathObj.index;
        quad = pathObj.quad;

        if (index < 4) {
          shouldPop = false;
        } else {
          path.pop();
          --pathIndex;
        }

        quads = quad._quads;
      }

      done = path.length === 0;
    }

    return results;
  }

  export class Quadtree implements Quad {
    private _depth:number = 1;
    private _size:number = 0;
    private _maxItems:number = DEFAULT_MAX_ITEMS;
    _nodes:Array<Node> = [];
    _quads:Array<Quad> = [];
    _bounds:Bounds;
    id:String = '';


    constructor(bounds:Bounds, maxItems:number) {
      var parsedBounds:Bounds = createBounds(bounds);

      if (!(this instanceof Quadtree)) {
        return new Quadtree(parsedBounds, maxItems);
      }

      this._maxItems = validateMaxItems(maxItems);
      this._bounds = parsedBounds;
    }

    clear():void {
      this._depth = 0;
      this._size = 0;
      this._quads = [];
      this._nodes = [];
    }

    isEmpty():boolean {
      return this._size === 0;
    }

    getMaxItems():number {
      return this._maxItems;
    }

    getDepth():number {
      return this._depth;
    }

    getSize():number {
      return this._size;
    }

    queryWithBoundingBox(bounds:any):any[] {
      var boundingBox:Bounds = createBounds(bounds);
      return queryIntersection(this, boundingBox, intersectsBoundingBox);
    }

    queryWithPoint(point:Point):any[] {
      var parsedPoint = createPoint(point);
      return queryIntersection(this, parsedPoint, intersectsPoint);
    }

    insert(bounds:any, value:Object):void {
      var parsedBounds:Bounds = createBounds(bounds),
        node = createNode(parsedBounds, value),
        depthAdded:number;
      depthAdded = insertNodeIntoQuad(node, this, this._maxItems);
      this._depth += depthAdded;
      ++this._size;
    }
  }
}
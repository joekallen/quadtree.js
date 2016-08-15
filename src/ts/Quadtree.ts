import {Bounds} from './Bounds';
import {validateNumber} from './util';

const DEFAULT_MAX_ITEMS:number = 4;

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
  const bounds:Bounds = new Bounds(x, y, width, height);
  return createQuad(bounds);
}

function createNode(bounds:Bounds, value:Object):Node {
  return {
    _bounds: bounds,
    _value: value
  };
}

function getQuadIndex(quad:Quad, node:Node):number {
  let index:number = -1,
    yOffset:number = 0,
    xOffset:number = 0;

  const quadBounds:Bounds = quad._bounds,
    nodeBounds:Bounds = node._bounds;

  const leftX:number = nodeBounds.leftX,
    rightX:number = nodeBounds.rightX,
    topY:number = nodeBounds.topY,
    bottomY:number = nodeBounds.bottomY,
    middleX:number = quadBounds.middleX,
    middleY:number = quadBounds.middleY;

  if (quadBounds.leftX > nodeBounds.leftX || quadBounds.rightX < rightX) {
    return index;
  }

  if (quadBounds.topY > nodeBounds.topY || quadBounds.bottomY < bottomY) {
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

function splitQuad(quad:Quad, maxItems:number):void {
  const bounds:Bounds = quad._bounds,
    quads:Array<Quad> = quad._quads,
    nodes:Array<Node> = quad._nodes;

  let childQuad:Quad,
    node:Node,
    index:number,
    insertIndex:number;


  const x:number = bounds.leftX,
    y:number = bounds.topY,
    middleX:number = bounds.middleX,
    middleY:number = bounds.middleY,
    width:number = bounds.width / 2,
    height:number = bounds.height / 2;

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
      insertNodeIntoQuad(node, childQuad, maxItems);
    }

    --index;
  }
}

function insertNodeIntoQuad(node:Node, quad:Quad, maxItems:number):void {
  const quads:Array<Quad> = quad._quads,
    hasNodes = quads.length > 0;

  let nodes:Array<Node>,
    index:number;

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
    splitQuad(quad, maxItems);
  }
}

function validateMaxItems(maxItems:any) {
  if (maxItems === undefined) {
    return DEFAULT_MAX_ITEMS;
  }

  const parsedMaxItems:number = parseInt(maxItems);
  if (parsedMaxItems !== maxItems || maxItems <= 0) {
    throw new TypeError('maxItems must be a positive integer.')
  }

  return parsedMaxItems;
}

function intersectsBoundingBox(bounded:Bounded, boundingBox:Bounds) {
  const nodeBounds:Bounds = bounded._bounds;

  if (nodeBounds.leftX > boundingBox.rightX || boundingBox.leftX > nodeBounds.rightX) {
    return false;
  }

  return !(nodeBounds.topY > boundingBox.bottomY || boundingBox.topY > nodeBounds.bottomY);
}

function intersectsPoint(bounded:Bounded, point:Point) {
  const nodeBounds:Bounds = bounded._bounds,
    x:number = point.x,
    y:number = point.y;

  if (x < nodeBounds.leftX || x > nodeBounds.rightX) {
    return false;
  }

  return !(y < nodeBounds.topY || y > nodeBounds.bottomY);
}

function createBounds(bounds:any):Bounds {
  if (bounds === null || typeof bounds === 'undefined') {
    throw new TypeError('bounds parameter must be defined');
  }

  return new Bounds(bounds.x, bounds.y, bounds.width, bounds.height);
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
  let nodes:Node[] = quad._nodes,
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
  const results:any[] = [],
    queue:Quad[] = [quadtree];

  let  queueIndex:number = 0,
    intersects:boolean,
    quad:Quad,
    quads:Quad[],
    childQuadIndex:number;


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

export class Quadtree implements Quad {
  private _size:number = 0;
  private _maxItems:number = DEFAULT_MAX_ITEMS;
  _nodes:Array<Node> = [];
  _quads:Array<Quad> = [];
  _bounds:Bounds;
  id:String = '';


  constructor(bounds:Bounds, maxItems:number) {
    let parsedBounds:Bounds = createBounds(bounds);

    this._maxItems = validateMaxItems(maxItems);
    this._bounds = parsedBounds;
  }

  clear():void {
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

  getSize():number {
    return this._size;
  }

  queryWithBoundingBox(bounds:any):any[] {
    const boundingBox:Bounds = createBounds(bounds);
    return queryIntersection(this, boundingBox, intersectsBoundingBox);
  }

  queryWithPoint(point:Point):any[] {
    const parsedPoint = createPoint(point);
    return queryIntersection(this, parsedPoint, intersectsPoint);
  }

  insert(bounds:any, value:Object):void {
    const parsedBounds:Bounds = createBounds(bounds),
      node = createNode(parsedBounds, value);

    insertNodeIntoQuad(node, this, this._maxItems);
    ++this._size;
  }
}

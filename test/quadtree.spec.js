'use strict';

describe('quadtree', function () {
  var quadtree, bounds;
  var createQuadtree = function createQuadtree(bounds, maxItems) {
    return new Quadtree.Quadtree(bounds, maxItems);
  };

  beforeEach(function () {
    bounds = new Quadtree.Bounds(0, 0, 100, 100);
    var maxItems = 1;
    quadtree = createQuadtree(bounds, maxItems);
  });

  it( 'should default to 4 items per node', function(){
    quadtree = createQuadtree(bounds);
    var maxItems = quadtree.getMaxItems();
    expect(maxItems).to.equal(4);
  });

  it( 'should set the maxItems when defined', function(){
    quadtree = createQuadtree(bounds, '2');
    var maxItems = quadtree.getMaxItems();
    expect(maxItems).to.equal(2);
  });

  it( 'should throw an error when an invalid max items is used', function(){
    expect(function(){
      quadtree = createQuadtree(bounds, '');
    }).to.throw(TypeError);
  });

  it('should throw an exception when constructed without bounds', function () {
    expect(createQuadtree).to.throw(TypeError);
  });

  it('should return 0 for size when empty', function () {
    expect(quadtree.getSize()).to.equal(0);
  });

  it('should return 1 for depth when empty', function () {
    expect(quadtree.getDepth()).to.equal(1);
  });

  it('should return 1 for depth and size with 1 item', function () {
    bounds = new Quadtree.Bounds(0, 0, 10, 10);
    quadtree.insert(bounds);
    expect(quadtree.getSize()).to.equal(1);
    expect(quadtree.getDepth()).to.equal(1);
  });

  it('should return size with 1 item', function () {
    bounds = new Quadtree.Bounds(0, 0, 10, 10);
    quadtree.insert(bounds);
    expect(quadtree.getSize()).to.equal(1);
  });

  it('should return depth 2 when nodes exceed default', function () {
    bounds = new Quadtree.Bounds(0, 0, 100, 100);
    quadtree = createQuadtree(bounds, 1);
    quadtree.insert(new Quadtree.Bounds(0, 0, 5, 5));
    quadtree.insert(new Quadtree.Bounds(30, 30, 5, 5));
    expect(quadtree.getDepth()).to.equal(1);
  });

});

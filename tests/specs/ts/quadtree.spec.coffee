Quadtree = require('../../../src/ts/Quadtree').Quadtree;

describe 'Quadtree', ->
  bounds = null
  Given -> @bounds = {x: 0, y: 0, width: 100, height: 100}

  describe '#constructor', ->
    When -> @createQuadtree = => new Quadtree(@bounds, @maxItems)

    describe 'should default to 4 items per node', ->
      Given -> @maxItems = undefined
      Then -> @createQuadtree().getMaxItems().should.equal(4)

    describe 'should return 0 for size when empty', ->
      Given -> @maxItems = undefined
      Then -> @createQuadtree().getSize().should.equal(0)

    describe 'should set maxItems when defined', ->
      Given -> @maxItems = 10
      Then -> @createQuadtree().getMaxItems().should.equal(10)

    describe 'should throw an error when an invalid maxItems is used', ->
      Given -> @maxItems = ''
      Then -> @createQuadtree.should.throw(TypeError)

    describe 'should throw an error when constructed without bounds', ->
      Given -> @bounds = null
      Then -> @createQuadtree.should.throw(TypeError)

    describe 'should return depth 2 when nodes exceed default', ->
      Given -> @maxItems = 1
      When ->
        @quadtree = @createQuadtree()
        @quadtree.insert({x: 0, y: 0, width: 5, height: 5})
        @quadtree.insert({x: 30, y: 30, width: 5, height: 5})
      Then ->
        @quadtree.getSize().should.equal(2)

  describe '#isEmpty', ->
    Given -> @quadtree = new Quadtree(@bounds, @maxItems)
    When -> @isEmpty = @quadtree.isEmpty()

    describe 'empty', ->
      Then -> @isEmpty.should.be.true

    describe 'not empty', ->
      Given -> @quadtree.insert({x: 0, y: 0, width: 0, height: 0})
      Then -> @isEmpty.should.be.false

  describe '#clear', ->
    Given -> @quadtree = new Quadtree(@bounds, @maxItems)
    Given -> @quadtree.insert({x: 0, y: 0, width: 0, height: 0})
    When -> @quadtree.clear()
    Then -> @quadtree.getSize().should.equal(0)

  describe 'filled quadtree', ->
    Given ->
      @quadtree = new Quadtree(@bounds, 1)
      @quadtree.insert({x: 24, y: 25, width: 1, height: 1}, 'quad: 0')
      @quadtree.insert({x: 75, y: 25, width: 1, height: 1}, 'quad: 1')
      @quadtree.insert({x: 25, y: 75, width: 1, height: 1}, 'quad: 2')
      @quadtree.insert({x: 75, y: 75, width: 1, height: 1}, 'quad: 3')

    describe '#queryWithPoint', ->
      describe 'valid point', ->
        When -> @results = @quadtree.queryWithPoint(@queryPoint)

        describe 'no item intersecting', ->
          Given -> @queryPoint = {x: 10, y: 10}
          Then -> @results.should.eql([])

        describe 'item intersecting', ->
          Given -> @queryPoint = {x: 25, y: 25}
          Then -> @results.should.eql(['quad: 0'])

      describe 'invalid point', ->
        Given -> @query = => @quadtree.queryWithPoint()
        Then -> @query.should.throw(TypeError)

    describe '#queryWithBoundingBox', ->
      describe 'valid bounding box', ->
        When -> @results = @quadtree.queryWithBoundingBox(@queryBounds)

        describe 'no items intersecting', ->
          Given -> @queryBounds = {x: 0, y: 0, width: 5, height: 5}
          Then -> @results.should.eql([])

        describe 'all items intersecting', ->
          Given -> @queryBounds = @bounds
          Then -> @results.should.include.all.members(['quad: 0', 'quad: 1', 'quad: 2', 'quad: 3'])

        describe 'item crosses x bounds', ->
          Given -> @quadtree.insert({x: 20, y: 20, width: 30, height: 10}, 'quad: 0-1')
          Given -> @queryBounds = {x: 25, y: 25, width: 1, height: 1}
          Then -> @results.should.include.all.members(['quad: 0', 'quad: 0-1'])

        describe 'item crosses y bounds', ->
          Given -> @quadtree.insert({x: 20, y: 20, width: 2, height: 30}, 'quad: 0-3')
          Given -> @queryBounds = {x: 18, y: 18, width: 4, height: 4}
          Then -> @results.should.include.all.members(['quad: 0-3'])

        describe 'can search sibling quads', ->
          Given ->
            @queryBounds = {x: 0, y: 0, height: 26, width: 26}
            @quadtree.insert({x: 6, y: 6, width: 1, height: 1}, 'quad: 000');
            @quadtree.insert({x: 18, y: 18, width: 1, height: 1}, 'quad: 001');
          Then -> @results.should.include.all.members(['quad: 0', 'quad: 000', 'quad: 001'])

      describe 'invalid bounding box', ->
        Given -> @query = => @quadtree.queryWithBoundingBox()
        Then -> @query.should.throw(TypeError)


    describe 'inserting items that cross the quadtree space', ->
      When -> @results = @quadtree.queryWithPoint(@queryPoint)

      describe 'crosses left', ->
        Given -> @queryPoint = {x: 0, y: 0}
        Given -> @quadtree.insert({x:-1, y:0, width:2, height:2}, 'crosses left')
        Then -> @results.should.eql(['crosses left'])

      describe 'crosses right', ->
        Given -> @queryPoint = {x: 100, y: 0}
        Given -> @quadtree.insert({x:99, y:0, width:2, height:2}, 'crosses right')
        Then -> @results.should.eql(['crosses right'])

      describe 'crosses top', ->
        Given -> @queryPoint = {x: 0, y: 0}
        Given -> @quadtree.insert({x:0, y:-1, width:2, height:2}, 'crosses top')
        Then -> @results.should.eql(['crosses top'])

      describe 'crosses bottom', ->
        Given -> @queryPoint = {x: 0, y: 100}
        Given -> @quadtree.insert({x:0, y:99, width:2, height:2}, 'crosses bottom')
        Then -> @results.should.eql(['crosses bottom'])
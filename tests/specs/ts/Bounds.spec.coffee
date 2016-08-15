Bounds = require('../../../src/ts/Bounds').Bounds;

describe 'Bounds', ->
  Given ->
    @x = 0
    @y = 0
    @width = 100
    @height = 100

  describe '#constructor', ->
    describe 'throws expcetion', ->
      When -> @createBounds = => new Bounds(@x, @y, @width, @height)

      describe 'width must be positive', ->
        Given -> @width = -10
        Then -> @createBounds.should.throw(RangeError)

      describe 'height must be positive', ->
        Given -> @height = -10
        Then -> @createBounds.should.throw(RangeError)
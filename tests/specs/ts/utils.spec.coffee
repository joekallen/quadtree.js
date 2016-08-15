validateNumber = require('../../../src/ts/util').validateNumber;

describe 'validateNumber', ->
  Given -> @name = 'some prop'
  When -> @validate = => validateNumber(@value, @name)

  describe 'is not finite', ->
    Given -> @value = {}
    Then -> @validate.should.throw(TypeError)

  describe 'is a string', ->
    Given -> @value = '10'
    Then -> @validate().should.equal(10)

  describe 'is a number', ->
    Given -> @value = 10.0
    Then -> @validate().should.equal(10)
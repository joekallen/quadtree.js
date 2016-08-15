beforeEach ->
  window.sandbox = window.sinon.sandbox.create()

afterEach ->
  window.sandbox.restore()
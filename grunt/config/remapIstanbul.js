module.exports = {
  build: {
    src: 'coverage/coverage.json',
    options: {
      reports: {
        'html': 'coverage/report'
      },
      exclude: 'node_modules,tests,karma-test-shim.js'
    }
  }
};
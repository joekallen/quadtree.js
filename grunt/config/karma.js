module.exports = {
  dev: {
    singleRun: false,
      autoWatch: true,
      configFile: './config/karma.conf'
  },
  ci:{
    configFile: './config/karma.ci.conf.js'
  },
  coverage: {
    configFile: './config/karma.coverage.conf.js'
  }
};
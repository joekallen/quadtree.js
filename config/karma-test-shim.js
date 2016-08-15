Error.stackTraceLimit = Infinity;

const loadFiles = function loadFiles(context){
  context.keys().forEach(context);
};

const testFiles = require.context('../tests/specs/', true, /\.spec\.coffee$/);
loadFiles(testFiles);



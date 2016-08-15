req = function (path) {
  console.log(__dirname + '/../../' + path);
  return require(__dirname + '/../../' + path);
};
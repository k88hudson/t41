var express = require('express');
var Habitat = require('habitat');
var lessMiddleware = require('less-middleware');
var jade = require('jade');
var path = require('path');
var routes = require('./routes')();

Habitat.load();

var app = express();
var env = new Habitat();
var optimize = env.get('OPTIMIZE');

var tmpDir = path.join(require('os').tmpDir(), 't41');

app.locals({
  OPTIMIZE: env.get('OPTIMIZE')
});

app.use(express.logger());
app.use(express.compress());
app.set('view engine', 'jade');

app.use(lessMiddleware({
  once: optimize,
  dest: tmpDir,
  src: __dirname + '/public',
  paths: __dirname,
  compress: optimize,
  yuicompress: optimize,
  optimization: optimize ? 0 : 2
}));

app.use(express.static(tmpDir, {
  maxAge: '31556952000' // one year
}));

app.use(express.static(__dirname + '/public', {
  maxAge: '31556952000' // one year
}));

app.use('/bower_components', express.static(__dirname + '/bower_components', {
  maxAge: '31556952000' // one year
}));

app.use('/views', express.static(__dirname + '/views', {
  maxAge: '31556952000' // one year
}));

app.use(app.router);

app.get('/', routes.index);

app.listen(env.get('PORT'), function () {
  console.log('Now listening on http://localhost:%d', env.get('PORT'));
});

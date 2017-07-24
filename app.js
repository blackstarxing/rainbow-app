var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var nunjucks = require('nunjucks');
var routerConfig = require('./server/middleware/router');
var webpack = require('webpack'),
    webpackDevMiddleware = require('webpack-dev-middleware'),
    webpackHotMiddleware = require('webpack-hot-middleware'),
    webpackDevConfig = require('./webpack.config.js');
var compiler = webpack(webpackDevConfig);
var NODE_ENV = process.env.NODE_ENV || 'production';
var isDev = NODE_ENV === 'development';
var index = require('./server/routes/index');
var users = require('./server/routes/users');

var proxy = require('express-http-proxy');

var app = express();

// var proxyaddress = 'http://172.16.10.134:80';
// var webproxyaddress = 'http://172.16.10.134:8080';
var proxyaddress = 'http://118.190.21.195:28888';
// var webproxyaddress = 'http://118.190.21.195:39999';
// var webproxyaddress = 'http://qa.rainbowweb.yuerlive.cn/api';
// var proxyaddress = 'http://www.caihonglive.tv:28888';
// var webproxyaddress = 'http://www.caihonglive.tv:30000';

app.use('/api', proxy(proxyaddress, {
  forwardPath: function(req, res) {
    return require('url').parse(req.url).path;
  }
}));

app.use('/webapi', proxy(webproxyaddress, {
  forwardPath: function(req, res) {
    return require('url').parse(req.url).path;
  }
}));

nunjucks.configure('server/views', {
    autoescape: true,
    express: app
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'html');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
// app.use(express.static(path.join(__dirname, 'public')));

if (isDev) {
    app.use(webpackDevMiddleware(compiler, {
        publicPath: webpackDevConfig.output.publicPath,
        noInfo: true,
        stats: {
            colors: true
        }
    }));
    app.use(webpackHotMiddleware(compiler));
    app.use(express.static(path.join(__dirname, 'public')));
    
    routerConfig(app, {
        dirPath: __dirname + '/server/routes/'
    });
} else {
    app.use(express.static(path.join(__dirname, 'public')));
    routerConfig(app, {
        dirPath: __dirname + '/server/routes/'
    });
}

app.use('/', index);
app.use('/users', users);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
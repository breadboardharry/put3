var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

// require socket.io
const io = require('socket.io')();
require('./socket')(io)


module.exports = { app, io };

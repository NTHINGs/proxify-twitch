var express = require('express');
var morgan = require('morgan');
var twitchStream = require('twitch-get-stream')('afzhp0rofl3vcedb5lt1si7cdv9m50');
var path = require('path');
var hls = require('hls-buffer');
var buffer;
var app = express();

var port = process.env.PORT || 3000;
app.use(morgan('dev'));
app.set('views', path.join(__dirname, '/'));
app.set('view engine', 'ejs');

app.listen(port, function() {
    console.log('Running on localhost:'+port);
});

app.get('/:channel', function (req, res) {
    twitchStream.get(req.params.channel).then(function(streams) {
        console.log(streams);
        res.render('player', { streams, channel: req.params.channel});
    })
    .catch(function(error){
        console.log(error);
    });
});

app.get('watch/:url', function (req, res) {
    buffer = hls(req.params.url);
    buffer.playlist(function (err, pl) {
        res.setHeader('Content-Type', 'application/vnd.apple.mpegurl');
        res.end(pl);
    });
});

app.get('/', function (req, res) {
    var stream = buffer.segment(req.url);
    res.setHeader('Content-Type', 'video/mp2s');
    stream.pipe(res);
});
var express = require('express');
var app = express();
var request = require('request')

var Heroku = require('heroku.node');
var client = new Heroku({
    email: process.env.EMAIL, 
    api_key: process.env.API_KEY
});

var CronJob = require('cron').CronJob;
var cronTime_1sec =  "* * * * * *";
var cronTime_30sec = "*/30 * * * * *";
var cronTime_1min =  "*/1 * * * *";

var URL = {
    self : process.env.URL + "/api/v1/null"
}

var job0 = new CronJob(createCronOption(cronTime_30sec, URL.self));

function createCronOption(cronTime, URL) {
    return {
        cronTime : cronTime, 
        onTick : _ontick(URL),
        start : true
    }
}

function _ontick(URL) {
    return function() {
        request.get(URL, function(err, res, body) {
            console.log(URL, body);
        });
    }
}

app.get('/api/v1/null', function(req, res) {
    res.send({
        message : "I can't sleep."
    });
});

app.use(function(req, res, next) {
    var err = new Error('404 Not Found');
    err.status = 404;
    next(err);
});

app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.send({
        status : err.status,
        message : err.message,
        error : {}
    });
});

app.set('port', process.env.PORT || 3000);

var server = app.listen(app.get('port'), function() {
    console.log('Insomnia - port:' + server.address().port);
});


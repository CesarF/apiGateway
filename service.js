var express = require('express');
var app = express(),
    bodyParser = require("body-parser"),
    methodOverride = require("method-override"),
    requestify = require("requestify"),
    Datastore = require('nedb'),
    db = new Datastore({filename: 'db/apps.db', autoload: true});
var allowCrossDomain = function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    next();
};
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(methodOverride());
app.use(allowCrossDomain);

app.all("/service/:serviceName*", function (req, res) {
    db.find({"appName": req.params.serviceName}, function (err, doc) {
        if (doc.length == 0) {
            res.status(404).send({
                status: 404,
                message: "Bad Request"
            });
        } else {
            // Is the Method allowed
            if(doc[0].method.toUpperCase().trim() == req.originalMethod.toUpperCase().trim()){
                var url = "http://"+doc[0].hostName+(doc[0].port?":"+doc[0].port:"")+doc[0].service+req.params[0];
                requestify.request(url, {
                    method: req.originalMethod,
                    body: req.body,
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }).then(function (response) {
                    res.send(response.getBody());
                });
            }else{
                res.status(404).send({
                    status: 404,
                    message: "Bad Request"
                });
            }
        }
    });
});

// Register a service
app.post('/apps', function (req, res) {
    var body = req.body;
    if (!body.appName || !body.hostName || !body.service || !body.method) {
        res.status(400).send({
            status: 400,
            message: "Bad Request"
        });
    } else {
        db.insert({
            "appName": body.appName,
            "hostName": body.hostName,
            "port": body.port,
            "service": body.service,
            "method": body.method
        });
        res.status(200).send({
            status: 200,
            message: "App Registered Successfully"
        });
    }
});

// Get all registered services
app.get('/apps', function (req, res) {
    db.find({}, function (err, docs) {
        res.send({
            status: 200,
            docs: docs
        });
    });
});

//Delete a service
app.delete('/apps/:appname', function (req, res) {
    db.remove({appName: req.params.appname}, function (err, numRemoved) {
        if (err) {
            res.status(401).send({
                status: 401,
                message: "Bad Request"
            });
        } else {
            res.status(204).send({
                status: 204
            });
        }
    });
});

// Start server
app.listen(3002, function () {
    console.log('Api Gateway is up on port 3002!');
});
'use strict'

const http = require('http');
const fs = require('fs');

var ground_host = '0.0.0.0';

var web_server = function (host) {
    this.path = './';
    this.http_port = 1276;
    this.host = host;
    this.server = null;
    this.file2mime = {
        ".html" : { t:'text/html',                e:'utf8'   },
        ".js"   : { t:'application/javascript',   e:'utf8'   },
        ".wasm" : { t:'application/wasm',         e:'binary' },
        ".ico"  : { t:'image/x-icon',             e:'binary' },
        ".css"  : { t:'text/css',                 e:'utf8'   },
        ".map"  : { t:'application/json',         e:'utf8'   },
    };


    this.init = function () {
        console.log('init webserver');
        this.server = http.createServer(function (req, res) {
            console.log("got here");
            this._http_res(req, res);
        }.bind(this));

        this.server.listen(this.http_port, this.host, function() {
            console.log(this.server.address());
        }.bind(this));
    };


    this._http_res = function (req, res) {
        var url = req.url.split("/"); url.shift(); url = (url.join("/")).replace(new RegExp("\\.\\.",'g'),"");
        console.log(url);
        if (url=='') url="index.html";
        url = this.path+url;
        var type = url.split(".");
        type="."+type.pop();
        console.log("HTTPREQ:", req.url, "as", url, "type", type);
        type = (typeof this.file2mime[type] !== undefined)?this.file2mime[type]:'text/html';
        fs.readFile(url, { encoding: type ? type.e : null }, function (type, res, err, data) {
            if (err) {
                console.log("HTTP404:", err);
                // res.writeHead(404, {'Content-Type': 'text/html'});
                // res.end("404 Not Found");
            } else {
                console.log("HTTP200:", type);
                res.writeHead(200, {'Content-Type': type.t});
                res.end(data, type.e);
            }
        }.bind(this, type, res));
    }
};

var servi = new web_server(ground_host);
servi.init();


// server.listen(ground_port, ground_host, function() {
//     console.log(server.address());
// });

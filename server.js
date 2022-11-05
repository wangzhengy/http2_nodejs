var http = require("http")
var path = require("path")
const {response} = require("express");
var fs = require("node:fs")
var url = require("url")
var http2 = require("node:http2")
var express = require("express")
var app = express()

// app.use(express.static('img'))

var k = 0;

var imgPath = __dirname + "/img/photo.jpg"


const server = http2.createSecureServer(
    {
        key: fs.readFileSync('localhost-privkey.pem'),
        cert: fs.readFileSync('localhost-cert.pem')
    },
    function (req, res) {
        console.log(req.url);
        if (req.url === "/favicon.ico") {
            res.stream.respond({ ":status": 200 });
            res.stream.end();
            return;
        }
        if(req.url==='/') {

            const fileName = __dirname + '/index.html';
            sendFile(res.stream, fileName);

        }
        else{
            res.writeHead(200, {'Content-Type': 'image/jpeg;charset=utf-8'});

            console.log("获取"+req.url)

            var params = url.parse(req.url, true).query;

            if(params.firstname==='汪'&&params.lastname==='正毅') {
                res.end(fs.readFileSync(imgPath));
            }
            else {
                res.end()
            }
        }

    });

server.listen(8443)

// read and send file content in the stream
const sendFile = (stream, fileName) => {
    const fd = fs.openSync(fileName, "r");
    const stat = fs.fstatSync(fd);
    const headers = {
        "content-length": stat.size,
        "last-modified": stat.mtime.toUTCString(),
        // "content-type": mime.getType(fileName)
    };
    stream.respondWithFD(fd, headers);
    stream.on("close", () => {
        console.log("closing file", fileName);
        fs.closeSync(fd);
    });
    stream.end();
};

const pushFile = (stream, path, fileName) => {
    stream.pushStream({ ":path": path }, (err, pushStream) => {
        if (err) {
            throw err;
        }
        sendFile(pushStream, fileName);
    });
};






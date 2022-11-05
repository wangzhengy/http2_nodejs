// var http = require('http');
// var querystring = require('querystring');
//
// var postHTML =
//     '<html><head><meta charset="utf-8"><title>菜鸟教程 Node.js 实例</title></head>' +
//     '<body>' +
//     '<form method="post">' +
//     '网站名： <input name="name"><br>' +
//     '网站 URL： <input name="url"><br>' +
//     '<input type="submit">' +
//     '</form>' +
//     '</body></html>';
//
// http.createServer(function (req, res) {
//     var body = "";
//     req.on('data', function (chunk) {
//         body += chunk;
//     });
//     req.on('end', function () {
//         // 解析参数
//         body = querystring.parse(body);
//         // 设置响应头部信息及编码
//         res.writeHead(200, {'Content-Type': 'text/html; charset=utf8'});
//
//         if(body.name && body.url) { // 输出提交的数据
//             res.write("网站名：" + body.name);
//             res.write("<br>");
//             res.write("网站 URL：" + body.url);
//         } else {  // 输出表单
//             res.write(postHTML);
//         }
//         res.end();
//     });
// }).listen(3000);

var http = require('http');
var path = require('path');
var fs = require('fs');
var url = require('url');

var routes = {
    '/get':function(req,res){
        var name = req.query.name;
        var age = req.query.age;
        res.setHeader("Content-Type","text/plain; charset=utf-8");
        res.end('名字是：'+ name + ' 年龄是：'+age);
    },
    '/post':function(req,res){
        var obj = {};
        req.msg.split('&').forEach(function(item,i){
            obj[item.split('=')[0]] = item.split('=')[1];
        });
        res.setHeader("Content-Type","text/plain; charset=utf-8");
        res.end('名字是:' + obj.name + ' , 年龄是:' + obj.age);
    }
}

var server01 = http.createServer(function(req, res){

    var pathObj = url.parse(req.url, true);
    //新添处理路由的代码
    var handleFn = routes[pathObj.pathname];
    if(handleFn){
        req.query = pathObj.query;    //获取post提交方式数据

        var msg = '';
        req.on('data',function(chunk){
            msg += chunk;		      //获取post提交方式数据
        }).on('end',function(){
            req.msg = msg;
            handleFn(req, res);
        });
    }else{
        var staticPath = path.join(__dirname,'act');
        var filePath = path.join(staticPath,pathObj.pathname);
        fs.readFile(filePath,'binary',function(err,fileContent){
            if(err){
                res.writeHead(404,"Not Found");
                res.end('<h1>404 Not Found!</h1>')
            }else{
                res.writeHead(200,'ok');
                res.write(fileContent,'binary');
                res.end();
            }
        });
    }
});

server01.listen(8080);
console.log('服务器已打开, 可以运行 http://localhost:8080');

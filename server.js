    var express = require('express'), //引入express模块
    app = express(),
    server = require('http').createServer(app);
    io = require('socket.io').listen(server); //引入socket.io模块并绑定到服务器

    app.use('/', express.static(__dirname + '/static')); //指定静态HTML文件的位置
    server.listen(80);
    console.log('server started');
    //socket部分
    io.on('connection', function(socket) {
        //接收并处理客户端发送的foo事件
        socket.on('message', function(data) {
            //将消息输出到控制台
            console.log(data);
            socket.broadcast.emit("message", data, 'left');
            socket.emit("message", data, 'right');
        })
    });
       
    
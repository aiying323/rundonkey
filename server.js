    var express = require('express'), //引入express模块
    app = express(),
    server = require('http').createServer(app);
    io = require('socket.io').listen(server); //引入socket.io模块并绑定到服务器

    app.use('/', express.static(__dirname + '/static')); //指定静态HTML文件的位置
    server.listen(80);

    var mongodb =require('mongodb');
    var server = new mongodb.Server('localhost', 27017, {auto_reconnect:true});
    var db = new mongodb.Db('test', server, {safe:true});
    console.log('server started');
    var messages=[];
    //socket部分
    io.on('connection', function(socket) {
        //接收并处理客户端发送的foo事件
        socket.on('message', function(data) {
            //将消息输出到控制台
            console.log(data);
            var message={"name":"jetty","message":data};
            db.open(function(err, db){
                if(!err){
                    db.createCollection('message', {safe:true}, function(err, collection){
                        if(err){
                            console.log(err);
                        }else{
                            collection.insert(message,{safe:true},function(err,result){
                                console.log(result);
                            });
                            collection.find().toArray(function(err,docs){
                               console.log('find');
                               console.log(docs);
                               messages=docs;
                               db.close();
                            }); 

                        }
                    });

                }else{
                    console.log(err);
                }
            });
           // db.close();
            socket.broadcast.emit("message", data, 'left');
            socket.emit("message", data, 'right');
        })
    });
     db.on("close", function (err,db) {//关闭数据库
     if(err) throw err;
     else console.log("成功关闭数据库.");
 });
   
    
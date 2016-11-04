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
        socket.on('messages', function(data) {
            if(messages.length<=0){
                db.open(function(err, db){
                    if(!err){
                        db.createCollection('message', {safe:true}, function(err, collection){
                            if(err){
                                console.log(err);
                            }else{
                                collection.find({"ip":{$ne:null}}).sort({"time":-1}).toArray(function(err,docs){
                                  // console.log('find');
                                   //console.log(docs);
                                   docs.forEach( function(element, index) {
                                       messages.push(element);
                                   });
                                   db.close();
                                }); 

                            }
                        });

                    }else{
                        console.log(err);
                    }
                });
            }
            socket.emit("messages", messages,socket.handshake.address);
        });
        //接收并处理客户端发送的foo事件
        socket.on('message', function(data) {
            //将消息输出到控制台
            //console.log(data);
            var today=new Date();
            var time=today.getFullYear()+"-"+today.getMonth()+"-"+today.getDate()+" "+today.getHours()+":"+today.getMinutes()+":"+today.getSeconds();
            var message={"ip":socket.handshake.address,"message":data,"time":time};
            messages.push(message);
            db.open(function(err, db){
                if(!err){
                    db.createCollection('message', {safe:true}, function(err, collection){
                        if(err){
                            console.log(err);
                        }else{
                            collection.insert(message,{safe:true},function(err,result){
                               // console.log(result);
                                db.close();
                            });

                        }
                    });

                }else{
                    console.log(err);
                }
            });
           // db.close();
            socket.broadcast.emit("message", message, 'left');
            socket.emit("message", message, 'right');
        })
    });
    db.on("close", function (err,db) {//关闭数据库
        if(err) throw err;
        else console.log("成功关闭数据库.");
    });
   
    
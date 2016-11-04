    var express = require('express'), //����expressģ��
    app = express(),
    server = require('http').createServer(app);
    io = require('socket.io').listen(server); //����socket.ioģ�鲢�󶨵�������

    app.use('/', express.static(__dirname + '/static')); //ָ����̬HTML�ļ���λ��
    server.listen(80);
    console.log('server started');
    //socket����
    io.on('connection', function(socket) {
        //���ղ�����ͻ��˷��͵�foo�¼�
        socket.on('message', function(data) {
            //����Ϣ���������̨
            console.log(data);
            socket.broadcast.emit("message", data, 'left');
            socket.emit("message", data, 'right');
        })
    });
       
    
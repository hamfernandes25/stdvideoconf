/**
 * Server module.
 *
 *
 */
 
'use strict';
 
var nodestatic = require('node-static');
var express = require('express');
var open = require('open');
var path = require('path');
 var user = require('./routes/user')
  var roomuser = require('./routes/index')
 var http = require('http')
var routes = require('./routes')
var serverPort = process.env.OPENSHIFT_NODEJS_PORT || 1337
var serverIpAddress = process.env.OPENSHIFT_NODEJS_IP || 'localhost'
var socketIoServer = '127.0.0.1';
var userid;
var prof;
var check;
var roomsess;
var request;
////////////////////////////////////////////////
// SETUP SERVER
////////////////////////////////////////////////
 var session = require('express-session');   
var app = express();
//require('./router')(app, socketIoServer);
var mysql      = require('mysql');
var bodyParser=require("body-parser");
var connection = mysql.createConnection({
              host     :'sql2.freesqldatabase.com',
              user     : 'sql2230230',
              password : 'rF6!hR6%',
              database : 'sql2230230'
            });

 
connection.connect();
 
global.db = connection;

 
// Static content (css, js, .png, etc) is placed in /public
app.use(express.static(__dirname + '/public'));

// Location of our views
app.set('views',__dirname + '/views');

// Use ejs as our rendering engine
app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(session({
              secret: 'keyboard cat',
              resave: false,
              saveUninitialized: true,
              cookie: { maxAge: 3600000 }
            }))
// Tell Server that we are actually rendering HTML files through EJS.
app.engine('html', require('ejs').renderFile);
//app.get('/room', roomuser.room);
app.get('/', routes.index);//call for main index page
app.get('/user/signup', user.signup);//call for signup page
app.post('/user/signup', user.signup);//call for signup post 
app.get('/user/login', routes.index);//call for login page
app.post('/user/login', user.login);//call for login post
app.get('/user/home/dashboard', user.dashboard);//call for dashboard page after login
app.get('/user/home/logout', user.logout);//call for logout
app.get('/user/home/profile',user.profile);
app.post('/user/getname/:id',user.getname);
//app.post('/user/getprofession/:id',user.getprofession);
//Middleware

  app.get('/:path',function(req,res){
        var path = req.params.path;
        console.log(path);
        request=req;
		console.log("Requested room "+path);
                userid = req.session.userId;
                var uname = req.session.username;
                prof = req.session.prof;
               if(userid!=null)
               {
                    var sql="SELECT * FROM `roomdata` WHERE `r_name`='"+path+"'";                           
      db.query(sql, function(err, results){      
         if(results.length){
           
            var roomid = results[0].r_id;
            var roomname = results[0].r_name;
            req.session.rname=roomname;
            console.log("room name"+roomname);
             
            res.render('room', {"hostAddress":socketIoServer,"userId":userid,"check":prof,"name":uname});  
          
               }else{
              res.render('landing.ejs',{message:"Room "+path+" not created by your professor/lecturer"});
            console.log("Room doesn't exists");
         }
      });
                 
                
                 
       // res.render('room', {"hostAddress":socketIoServer,"userId":userid,"check":prof});  
                
               
  }
  else{
    res.render('index', {"message":"Please login"});  
  }
    });



var server=app.listen(serverPort, serverIpAddress, function(){
    console.log("Express is running on port "+serverPort);
});

var io = require('socket.io').listen(server);

////////////////////////////////////////////////
// EVENT HANDLERS
////////////////////////////////////////////////
var delroom;
io.sockets.on('connection', function (socket){
    
	function log(){
        var array = [">>> Message from server: "];
        for (var i = 0; i < arguments.length; i++) {
	  	    array.push(arguments[i]);
        }
	    socket.emit('log', array);
	}

	socket.on('message', function (message) {
            console.log(message);
         
		log('Got message: ', message);
        socket.broadcast.to(socket.room).emit('message', message);
       // console.log(io.sockets.clients("room"));
	});
    
	socket.on('create or join', function (message) {
        var room = message.room;
        var userr=message.prof;
        delroom=socket.room = room;
        var participantID = message.from;
        configNameSpaceChannel(participantID);
        
		var numClients = io.sockets.clients(room).length;

		log('Room ' + room + ' has ' + numClients + ' client(s)');
		log('Request to create or join room', room);

		if (numClients == 0 && userr=="professor"){
			socket.join(room);
			socket.emit('created', room);
		} else {
			io.sockets.in(room).emit('join',room);
			socket.join(room);
			socket.emit('joined', room);
		}
	});
    
    // Setup a communication channel (namespace) to communicate with a given participant (participantID)
    function configNameSpaceChannel(participantID) {
        var socketNamespace = io.of('/'+participantID);
        
        socketNamespace.on('connection', function (socket){
            socket.on('message', function (message) {
                // Send message to everyone BUT sender
                socket.broadcast.emit('message', message);
            });
        });
    }

});


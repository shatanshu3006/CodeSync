//express server makes thing easier than a  nodejs one
//yarn add express socket.io socket.io-client
// yarn add -D nodemon

const express=require('express')
const app=express();
const http=require('http')      //already inbuilt in node
const server=http.createServer(app);
const {Server}=require('socket.io')
const cors = require('cors');
const ACTIONS = require('./src/Actions');
const path = require('path');
const { dirname } = require('path');
app.use(cors({ origin: 'http://localhost:3000' }));  // If your frontend is on port 3000


//now creating instance of the server class that we have imported

const io=new Server(server);        //now server is ready and we have to listen it on some port


//-------------------------------DEPLOYMENT AREA-------------------------------------------//

//final deployment command for the server that is on port 5001
app.use(express.static('build')); //so we are automatically picking the index.js file in the build folder that is made when we run the command : "yarn build"
// now if we check the localhost:5001 we can see the deployed part
// but this breaks once we refresh the page to solve this:

//we make a global middleware for this 
//and we serve the same index.html page for every kind of request we are getting
app.use((req,res,next)=>{
    res.sendFile(path.join(__dirname,'build','index.html'));
});

//-------------------------------DEPLOYMENT AREA-------------------------------------------//




const userSocketMap={};

function getAllConnectedClients(roomId){
    //map is the ds used here
    return Array.from(io.sockets.adapter.rooms.get(roomId) || []).map(
        (socketId)=>{
        return {
            socketId,
            userName:userSocketMap[socketId],
        };
    }
    );
    //this function gets the roomId from all the adapters of the socket
    //or return an empty array if not present 
}

io.on('connection',(socket)=>{                          //this event gets triggered once the socket gets connected
    console.log('socket connected',socket.id);
    socket.on(ACTIONS.JOIN,({roomId,userName})=>{

        //now we have to store the mapping of user and socketid on server
        //we should know which socketid is for which username
        //if the server restarts then this data will get deleted
        //so for a productions level app, we have to consider using redis or any in memory database
        // or maybe use a file for that storage

        userSocketMap[socket.id]=userName;      //{key:value} pairs
        socket.join(roomId);

        //for notifying all the other clients that a new client has joined, we have to use a list
        const clients=getAllConnectedClients(roomId);

        //now we wan to send a message to every client 
        clients.forEach(({socketId})=>{
            io.to(socketId).emit(ACTIONS.JOINED,{
                clients,
                userName,
                socketId:socket.id,
            });
        })
        //console.log(clients);
    })

    socket.on(ACTIONS.CODE_CHANGE,({roomId,code})=>{
        //this code chage even is actually sending the code changes to all the clients (including itself)
        //this re-renders what we have already written and hence the edditor misbehaves on both sides

        //so instead of io.to we do socket.in

        //io.to(roomId).emit(ACTIONS.CODE_CHANGE,{code});
        socket.in(roomId).emit(ACTIONS.CODE_CHANGE,{code});

        //so this does not update my own editor but updates all the other clients out there
    })

    socket.on(ACTIONS.SYNC_CODE,({socketId,code})=>{
        io.to(socketId).emit(ACTIONS.CODE_CHANGE,{code});
    });

    socket.on('disconnecting',()=>{     //this even is there before complete disconnection of the socket
        const rooms=[...socket.rooms];      //take all the available rooms 
        //now we tell all the rooms that a disconeections is going to be made
        //this tells them to update their UI's accordingly
        rooms.forEach((roomId) => {
            socket.in(roomId).emit(ACTIONS.DISCONNECTED,{
                socketId:socket.id,
                userName:userSocketMap[socket.id],
            })
        });
        delete userSocketMap[socket.id];
        socket.leave();
    })      
});       



const PORT=process.env.PORT || 5001;        //if there is no port available it'll give 5000 as a port
server.listen(PORT,()=>console.log(`Listening on port ${PORT}`));
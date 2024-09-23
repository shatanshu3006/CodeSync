import React, { useState,useRef, useEffect } from 'react'
import ACTIONS from '../Actions';
import Client from '../components/Client';
import Editor from '../components/Editor';
import { initSocket } from '../socket';
import { useLocation , useNavigate ,Navigate} from 'react-router-dom';
import toast from 'react-hot-toast';


//we are using roomId in this page in socketRef.emit() function but that has to be recieved in some form
//either we use React props and pass it into const EditorPage= ({roomId})
//or we an use it fromthe url using hook called useParams

import { useParams } from 'react-router-dom';



const EditorPage = () => {

  const socketRef=useRef(null);
  const location=useLocation();
  const codeRef=useRef(null);
  const {roomId}=useParams();
  // console.log(params);
  const reactNavigator=useNavigate();

   //hardcoding for cheking the display of client list
   const[clients,setClients]=useState([]);
  //  {socketId:1,userName:'rakesh'},
  //   {socketId:2,userName:'john doe'},
  //   {socketId:3,userName:'jane doe'},

    

  

  useEffect(()=>{
    const init=async()=>{
      //async functions return a promise and for getting that promise we can use await 
      socketRef.current=await initSocket();

      //ERROR HANDLING
      socketRef.current.on('connect_error',(err)=>handleErrors(err));
      socketRef.current.on('connect_failed',(err)=>handleErrors(err));

      function handleErrors(e){
        console.log('socket error',e);
        toast.error('Socket connection failed, try again later.');
        reactNavigator('/');    //REDIRECTS THE CLIENT TO HOMEPAGE
      }
      //after calling the initSocket(), the client immediately connects to the server
      // now send a message that we want to join after the initialisations (we use .emit for that)

      socketRef.current.emit(ACTIONS.JOIN,{
        roomId,
        userName:location.state?.userName,
      });     //encapsulating the ACTIONS in Actions.js file and using them with the key words as maps for reduced spelling mistakes and a better code
    

        // listening for joined event  (notification for all that a new user has just joined the room)
        socketRef.current.on(
          ACTIONS.JOINED,
          ({clients,userName,socketId})=>{

          //we dont want to notify ourselves as we are also in the same room when we join
          if(userName!== location.state?.userName){
            toast.success(`${userName} joined the room.`);
            console.log(`${userName} joined`);      //for debug purpose
          }
          setClients(clients);
          socketRef.current.emit(ACTIONS.SYNC_CODE,{
            code:codeRef.current,
            socketId,
          });
          }
        );


        //listening for disconnected
        socketRef.current.on(ACTIONS.DISCONNECTED,({socketId,userName})=>{
          toast.success(`${userName} left the room!`);
          //now we have notifies the UI using toast
          //now remove the leaving client formthe clients list
          //so we change the setClients state
          setClients((prev)=>{
            return prev.filter(client=>client.socketId!==socketId)
          });
        })
    };
    init();

    //we should never forget to clean up the listeners, if not cleaned then there may be a memory leak

    //cleaning function
    return ()=>{
      socketRef.current.disconnect();
      socketRef.current.off(ACTIONS.JOINED);
      socketRef.current.off(ACTIONS.DISCONNECTED);
    }
  },[]);

  async function copyRoomId(){
    try{
      await navigator.clipboard.writeText(roomId);
      toast.success("Copied ROOM ID to clipboard");
    }catch(err){
      toast.error("Could not copy ROOM ID");
      console.log(err);
    }
  }

  function leaveRoom(){
    reactNavigator('/')
  }

 

  if(!location.state){
    return <Navigate to="/"/>
  }
  

  return (
    <div className='mainwrap'>
      <div className='aside'>
        <div className='asideInner'>
          <div className='logo'>
            <img src="/code-sync.png" alt="logo" className='logoimage'></img>
          </div>
          <h3>Connected</h3>
          <div className='clientsList'>
            {
              clients.map((client)=>(
                <Client key={client.socketId} userName={client.userName}/>
              ))
            }
          </div>
        </div>
        <button className='btn copybtn' onClick={copyRoomId}>Copy ROOM ID</button>
        <button className='btn leavebtn' onClick={leaveRoom}>Leave</button>
      </div>
      <div className='editorwrap'>
        <Editor socketRef={socketRef} roomId={roomId} onCodeChange={(code)=>{
          codeRef.current=code;
          }}
        />
      </div>
    </div>
  )
}

export default EditorPage;
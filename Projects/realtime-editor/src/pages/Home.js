import React from 'react'
import {v4 as uuidv4} from 'uuid';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const Home = () => {

  const navigate=useNavigate();
  //ceating state for id
  const [roomId,setRoomId]=useState('');
  const [userName,setUserName]=useState('');
  
  

  const createNewRoom=(e)=>{
    e.preventDefault();
    const id=uuidv4();
    //console.log(id);

    //now setting the generated id into the state
    setRoomId(id);

    toast.success("New Room created successfully!");
  };

  const joinRoom=()=>{
    if(!roomId || !userName){
      toast.error("ROOM ID & USERNAME required!")
      return;
    }
    //redirect if both are there 
    //we use useNavigate hook in reactRouterDom

    //we pass the url for editor along with the roomId and also pass an object
    //so in react router, we can pass data from one route to another for which we have to give state option 
    //if this was not there then we'd have to use redux or local storage and other such options 
    //but this is inbuilt in react router


    navigate(`/editor/${roomId}`,{
      state:{
        userName,
      },
    });

  };

  const handleInputEnter=(e)=>{
    console.log('event',e.code);
    if(e.code==='Enter'){
      joinRoom();
    }
  };

  return (
    <div className='homePageWrapper'>
      <div className='formWrapper'>
        <img src="/code-sync.png" alt="code-sync-logo" className='imgDimensions'/>
        <h4 className='mainLabel'>Paste Invitation ROOM ID :</h4>
        <div className='inputGroup'>
          {/* e.target.value will ensure that not only clicking the "new room" but also manually entering the val will let us type there */}
          <input type='text' className='inputBox' placeholder='ROOM ID' onChange={(e)=>setRoomId(e.target.value)} value={roomId} onKeyUp={handleInputEnter}></input>
          <input type='text' className='inputBox' placeholder='USERNAME' onChange={(e)=>setUserName(e.target.value)} value={userName} onKeyUp={handleInputEnter}></input>
          <button className='btn joinBtn' onClick={joinRoom}>Join</button>
          <span className='createInfo'>
            If you don't have an invite then create&nbsp;
            <a href="" className='createNewBtn' onClick={createNewRoom}>new room</a>
          </span>
        </div>
      </div>
      <footer>
        <h4>Built with 💚 by <a href="https://github.com/shatanshu3006">Shatanshu Bodkhe</a></h4>
      </footer>

    </div>
  )
}

export default Home
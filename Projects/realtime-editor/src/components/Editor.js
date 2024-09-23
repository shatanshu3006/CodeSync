import React, { useEffect,useRef } from 'react'
import Codemirror from 'codemirror';
/*{for enabling the json mode as true}*/
import 'codemirror/mode/javascript/javascript'
import 'codemirror/theme/dracula.css'
import 'codemirror/addon/edit/closetag'
import 'codemirror/addon/edit/closebrackets'
import 'codemirror/addon/edit/matchbrackets'
import 'codemirror/lib/codemirror.css'
import ACTIONS from '../Actions';

const Editor = ({socketRef,roomId,onCodeChange}) => {

    const editorRef=useRef(null);
    //we need editorRef hook for taking all the changes made by a user and then transporting them to the other user's UI (socket)
    useEffect(()=>{
        async function init(){
            editorRef.current=Codemirror.fromTextArea(
                document.getElementById('realtimeEditor'),{

                    mode:{name:'javascript',json:true},
                    theme:'dracula',
                    autoCloseTags:true,
                    autoCloseBrackets:true,
                    autoMatchBrackets:true,
                    lineNumbers:true,
            });

            

            editorRef.current.on('change',(instance,changes)=>{
                //using the "changes" property it is all reflected what is done on the editor
                // "cut" , "paste" , "+input" and so on, so we can decide what all changes have to be reflected back
                //console.log('changes',changes);
                const {origin}=changes;
                const code=instance.getValue()              //getter for content
                onCodeChange(code);
                if(origin!=='setValue'){
                    socketRef.current.emit(ACTIONS.CODE_CHANGE,{
                        roomId,
                        code,

                    })
                }
                //console.log(code);
            });

            
            

        }
        init();
    },[]);

    //handling the 'on' problem 
    useEffect(()=>{
        if(socketRef.current){
            socketRef.current.on(ACTIONS.CODE_CHANGE,({code})=>{
                if(code!==null){
                    editorRef.current.setValue(code);           //this is used to dynamically write something onthe editor directly without using the editor to write
                }
            });
        }

        //unsubscribing everything to prevent memory leak
        return()=>{
            socketRef.current.off(ACTIONS.CODE_CHANGE);
        }
        
    },[socketRef.current])
  return <textarea id='realtimeEditor'></textarea>
}

export default Editor
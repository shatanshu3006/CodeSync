import React from 'react'
import Avatar from 'react-avatar'
import EditorPage from '../pages/EditorPage'

//whatever props we recieve, we have to destructure that first hence, {userName} is passed to Client and not userName
const Client = ({userName}) => {
  return (
    <div className='client'>
        <Avatar name={userName} size={50} round="14px"/>
        <span className='userName'>{userName}</span>
    </div>
  )
}

export default Client
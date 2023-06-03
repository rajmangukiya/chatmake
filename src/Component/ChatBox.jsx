import React, { useEffect, useRef, useState } from 'react'
import axios from 'axios';
import queryString from 'query-string';
import { io } from "socket.io-client";
import { API } from '../config/API/api.config';
import { authenticated, getHttpOptions } from '../utils/AuthHelpers';
import { leftArrowIcon } from '../Component/Icons';
import { sliceText } from '../utils/designHelper';
import { useLocation, useNavigate } from 'react-router-dom';
import { BsCameraVideo } from 'react-icons/bs';
import { FiPhoneCall } from 'react-icons/fi';
import { AiOutlineSend } from 'react-icons/ai';

let socket;
const roomJoined = new Map([]); 

const ChatBox = ({ chatUser }) => {

  const [input, setInput] = useState("");
  const [user, setUser] = useState();
  const [roomName, setRoomName] = useState("");
  const [members, setMembers] = useState([]);
  const [messages, setMessages] = useState([]);
  const chatBoxRef = useRef(null);
  const navigate = useNavigate();
  const defaultAvatar = 'data:image/png;base64,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';

  const handleSubmit = async (e) => {
    try {
      e.preventDefault();
      if (input) {
        socket.emit('sendMessage', { id: user.id, username: user.first_name, room: chatUser.roomId, message: input });
        await axios.post(`${API.endpoint}/message/add-message`, {
          room: chatUser.roomId,
          id: user.id,
          message: input
        }, getHttpOptions())
        setInput("");
      } 
    } catch (error) {
      console.log(error);
    }
  }

  const setCurrentUser = async () => {
    try {
      const data = await authenticated()
      setUser(data);
    } catch (error) {
      console.log(error);
    }
  }

  const toDashboard = () => {
    navigate.push(`/dashboard?id=${chatUser.id}`)
  }

  const personalMember = () => {
    return (<>
      <img className="rounded-circle me-2" src={members[0]?.avatar ?? defaultAvatar} style={{ width: '3rem' }}></img>
      <div className="fs-5 d-none d-sm-flex text-light-dark fw-bold">{members[0]?.first_name} {members[0]?.last_name}</div>
      <div className="flex-grow-1"></div>
    </>)
  }

  const groupMember = () => {
    return (members?.map((member, index) => (<div className="flex-grow-1">
      <img key={index} className="rounded-circle me-2" src={member?.avatar ?? defaultAvatar} style={{ width: '3rem' }}></img>
    </div>))).slice(0, 5);
  }

  const getMessages = async () => {
    try {
      const { data: { data } } = await axios.get(`${API.endpoint}/message/get-message/${chatUser.roomId}`, getHttpOptions());
      setMessages(data);
    } catch (error) {
      console.log(error);
    }
  }

  const getMembers = async () => {
    try {
      const { data: { room }} = await axios.post(`${API.endpoint}/user/get-room-users`, {
        room_id: chatUser.roomId,
        personal: chatUser.prs === '1' ? true : false,
        user_id: user.id
      }, getHttpOptions());
      setMembers(room?.members);
      setRoomName(room?.name)
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(async () => {
    try {
      socket = io(API.hostUrl);
      if (!(roomJoined.get(user.id)?.includes(chatUser.roomId))) {
        if(!(roomJoined.has(user.id))) roomJoined.set(user.id, [])
        roomJoined.set(user.id, [...roomJoined.get(user.id), chatUser.roomId])
        socket.emit('join', { room: chatUser.roomId });
      }
      getMessages();
      getMembers();
    } catch (error) {
      console.log(error);
    }
    return () => {
      roomJoined.delete(user.id)
    }
  }, [chatUser])

  useEffect(async () => {
    try {
      socket.on('message', async (res) => {
        setMessages((messages) => [...messages, res]);
      })
    } catch (error) {
      console.log(error);
    }
  }, [chatUser])

  useEffect(() => {
    setCurrentUser();
  }, [])

  useEffect(() => {
    chatBoxRef?.current?.scrollTo({ top: chatBoxRef.current.scrollHeight });
  }, [messages])

  return (
    <div style={{width: '70%'}} className='flex-grow-1 d-flex flex-column align-items-center'>
      {
        chatUser 
        ? <>
            <div className='d-flex w-100 align-items-center justify-content-between px-4 border-bottom border-1 p-3'>
              <div>
                <div className='fs-5 fw-bold opacity-75'>{members[0]?.first_name} {members[0]?.last_name}</div>
                <div className='d-flex align-items-center'>
                  <div style={{width: '10px', height: '10px'}} className='bg-success rounded-circle me-2'></div>
                  <div>Active now</div>
                </div>
              </div>
              <div className='d-flex'>
                <div style={{cursor: 'no-drop'}} className='bg-light p-3 rounded-circle me-4'>
                  <BsCameraVideo className='fs-4' />
                </div>
                <div style={{cursor: 'no-drop'}} className='bg-light p-3 rounded-circle'>
                  <FiPhoneCall className='fs-4' />
                </div>
              </div>
            </div>
            <div className="w-100 rounded-3 d-flex flex-column justify-content-end" style={{ height: '87%' }}>
              <div ref={chatBoxRef} className="w-100 d-flex flex-column mt-2" style={{ overflowY: 'scroll' }}>
                {
                  messages?.map((x, index) => {
                    return x.id === user?.id ? (
                      <div key={index} className='align-self-end text-primary d-flex align-items-center' style={{ maxWidth: "80%" }}>
                        <div className="bg-primary py-2 px-3 text-light me-2 mb-2 w-100 flex-wrap text-break" style={{ borderRadius: '20px' }}>{x.message}</div>
                      </div>
                    ) : (
                      <div key={index} className='align-self-start text-primary d-flex align-items-center' style={{ maxWidth: "80%"}}>
                        <div className="bg-dark bg-opacity-10 py-2 px-3 text-dark ms-2 mb-2 w-100 flex-wrap" style={{ borderRadius: '20px' }} >{x.message}</div>
                        {/* {!parseInt(isPersonal) ? <div className="">{x.username}</div> : ''} */}
                      </div>
                    );
                  })
                }
              </div>
              <div className='border-bottom border-1 my-3'></div>
              <form onSubmit={(e) => handleSubmit(e)} className="d-flex p-3 align-items-center">
                <input
                  className="text-dark bg-dark bg-opacity-10 rounded-pill flex-grow-1 px-3 py-2"
                  type="text"
                  value={input}
                  placeholder='Type'
                  onChange={(e) => setInput(e.target.value)}
                  size="1"
                />
                <AiOutlineSend className='fs-1 bg-primary rounded-circle p-2 text-light ms-3' onClick={(e) => handleSubmit(e)} type='submit' />
                <input type="submit" value="" className="d-none" />
              </form>
            </div>
          </> 
        : 
        <div className='d-flex flex-column w-100 h-100 justify-content-center align-items-center'>
          <h1 className='text-primary opacity-50' >Start Chat</h1>
          <img src={'https://img.freepik.com/free-vector/messaging-concept-illustration_114360-1121.jpg?size=626&ext=jpg&ga=GA1.1.900366228.1682620286&semt=ais'} />
        </div>
      }
      
    </div>
  )
}

export default ChatBox
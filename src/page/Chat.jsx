import React, { useEffect, useRef, useState } from 'react'
import { useHistory, useLocation } from 'react-router';
import axios from 'axios';
import queryString from 'query-string';
import { io } from "socket.io-client";
import { API } from '../config/API/api.config';
import { authenticated, getHttpOptions } from '../utils/AuthHelpers';
import { leftArrowIcon } from '../Component/Icons';
import { sliceText } from '../utils/designHelper';

let socket;

const Chat = () => {

  const [input, setInput] = useState("");
  const { id, room, prs: isPersonal } = queryString.parse(useLocation().search);
  const [user, setUser] = useState();
  const [roomName, setRoomName] = useState("");
  const [members, setMembers] = useState([]);
  const [messages, setMessages] = useState([]);
  const chatBoxRef = useRef(null);
  const history = useHistory();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (input) {
      socket.emit('sendMessage', { id, username: user.first_name, room, message: input });
      await axios.post(`${API.endpoint}/message/add-message`, {
        room,
        id: id,
        message: input
      }, getHttpOptions())
      setInput("");
    }
  }

  const setCurrentUser = async () => {
    const data = await authenticated()
    setUser(data);
  }

  const toDashboard = () => {
    history.push(`/dashboard?id=${id}`)
  }

  const personalMember = () => {
    return (<>
      <img className="rounded-circle me-2" src={members[0]?.avatar} style={{ width: '3rem' }}></img>
      <div className="fs-5 d-none d-sm-flex text-light-dark fw-bold">{members[0]?.first_name} {members[0]?.last_name}</div>
      <div className="flex-grow-1"></div>
    </>)
  }

  const groupMember = () => {
    return (members?.map((member) => (<div className="flex-grow-1">
      <img className="rounded-circle me-2" src={member?.avatar} style={{ width: '3rem' }}></img>
    </div>))).slice(0, 5);
  }

  const getMessages = async () => {
    const { data: { data } } = await axios.get(`${API.endpoint}/message/get-message/${room}`, getHttpOptions());
    setMessages(data);
  }

  const getMembers = async () => {
    const { data: { room: roomData }} = await axios.post(`${API.endpoint}/user/get-room-users`, {
      room_id: room,
      personal: isPersonal === '1' ? true : false,
      user_id: id
    }, getHttpOptions());
    setMembers(roomData?.members);
    setRoomName(roomData?.name)
  }

  useEffect(async () => {
    socket = io(API.hostUrl);
    socket.emit('join', { id, room });

    getMessages();
    setCurrentUser();
    getMembers();
  }, [])

  useEffect(() => {
    socket.on('message', async (res) => {
      setMessages((messages) => [...messages, res]);
    })
  }, [])

  useEffect(() => {
    chatBoxRef.current.scrollTo({ top: chatBoxRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages])

  return (
    <div className="bg-black w-100 vh-100 d-flex flex-column justify-content-center align-items-center">
      <div className="chat-container">
        <div className="fs-3 text-light-dark fw-bold mb-2">{roomName != 'personal' ? sliceText(roomName, 40) : ""}</div>
        <div className="w-100 mb-4 d-flex align-items-center justify-content-between">
          <div onClick={toDashboard} className="me-3" style={{ cursor: 'pointer' }}>
            {leftArrowIcon(30, 30, 'white')}
          </div>
          {parseInt(isPersonal) ? personalMember() : groupMember()}
          <img className="rounded-circle me-2" src={user?.avatar} style={{ width: '3rem' }}></img>
        </div>
        <div className="w-100 bg-dark rounded-3 d-flex flex-column justify-content-end" style={{ height: '80%' }}>
          <div ref={chatBoxRef} className="chat-box d-flex flex-column mt-2" style={{ overflowY: 'scroll' }}>
            {
              messages?.map((x) => {
                return x.id === id ? (
                  <div className='align-self-end text-primary d-flex align-items-center' style={{ maxWidth: "80%" }}>
                    <div className="bg-heavy-dark py-2 px-3 text-light me-2 mb-2" style={{ borderRadius: '15px 15px 0px 15px' }}>{x.message}</div>
                  </div>
                ) : (
                  <div className='align-self-start text-primary d-flex align-items-center'>
                    <div className="bg-light-dark py-2 px-3 text-light ms-2 mb-2" style={{ borderRadius: '15px 15px 15px 0px' }} >{x.message}</div>
                    {!parseInt(isPersonal) ? <div className="">{x.username}</div> : ''}
                  </div>
                );
              })
            }
          </div>
          <form onSubmit={(e) => handleSubmit(e)} className="d-flex mx-2 mb-2" style={{minHeight: '10px'}}>
            <input
              className="bg-light-dark text-light rounded-pill flex-grow-1 px-3 py-2"
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              size="1"
            />
            <input type="submit" value="send" className="bg-heavy-dark text-light rounded-pill px-4 ms-2"></input>
          </form>
        </div>
      </div>
    </div>
  )
}

export default Chat

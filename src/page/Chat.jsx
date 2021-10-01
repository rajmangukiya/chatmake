import React, { useEffect, useRef, useState } from 'react'
import { useLocation } from 'react-router';
import queryString from 'query-string';
import { io } from "socket.io-client";
import { API } from '../config/API/api.config';

let socket;

const Chat = () => {

  const [input, setInput] = useState("");
  const { username, room } = queryString.parse(useLocation().search);
  const [messages, setMessages] = useState([]);
  const chatBoxRef = useRef(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    if(input) {
      socket.emit('sendMessage', { username, room, message: input });
      setInput("");
    }
  }

  useEffect(() => {
    socket = io(API.hostUrl);
    socket.emit('join', { username, room });

    const storedMessages = JSON.parse(localStorage.getItem(room));

    if(storedMessages) {
      setMessages(storedMessages);
      return;
    }
  }, [])

  useEffect(() => {
    socket.on('message', (res) => {
      setMessages((messages) => [...messages, res]);
    })
  }, [])

  useEffect(() => {
    localStorage.setItem(room, JSON.stringify(messages));
    chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
  }, [messages])

  return (
    <div className="bg-primary w-100 vh-100 d-flex justify-content-center align-items-center">
      <div className="bg-light rounded-3 d-flex flex-column justify-content-end" style={{ height: '80%', width: '60%' }}>
        <div ref={chatBoxRef} className="chat-box d-flex flex-column mt-2" style={{ overflowY: 'scroll'}}>
          {
            messages?.map((x) => {
              return x.username === username ? (
                <div className='align-self-end text-primary d-flex align-items-center'>
                  {/* <div className="">{x.username}</div> */}
                  <div className="bg-primary py-2 px-3 rounded-pill text-light m-2" >{x.message}</div>
                </div>
              ) : (
                <div className='align-self-start text-primary d-flex align-items-center'>
                  <div className="bg-primary py-2 px-3 rounded-pill text-light m-2" >{x.message}</div>
                  <div className="">{x.username}</div>
                </div>
              );
            })
          }
        </div>
        <form onSubmit={(e) => handleSubmit(e)} className="d-flex m-2">
          <input
            className="border border-1 rounded-pill flex-grow-1 px-3 py-2"
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          <input type="submit" value="send" className="bg-primary text-light rounded-pill px-4 ms-2"></input>
        </form>
      </div>
    </div>
  )
}

export default Chat
